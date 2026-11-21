import { create } from 'zustand';
import type { BuyAmount, GameState, LogEntry, Snapshot } from './types';
import { computeModifiers, type Modifiers } from './engine/modifiers';
import { computeSnapshot } from './engine/snapshot';
import { tick } from './engine/tick';
import * as A from './engine/actions';
import { newGame } from './engine/state';
import { simulateOffline, type OfflineReport } from './engine/offline';
import { GALAXY_STARS } from './data/galaxy';
import { clearStorage, encodeTransfer, loadFromStorage, saveToStorage } from './engine/save';
import { markDirty } from './sync/meta';

export interface Toast {
  id: number;
  msg: string;
  kind: LogEntry['kind'];
}

interface Store {
  state: GameState;
  snap: Snapshot;
  mods: Modifiers;
  offline: OfflineReport | null;
  toasts: Toast[];
  floaters: { id: number; text: string; x: number; y: number }[];
  /** Ère tout juste atteinte par un déménagement (affiche l'écran de transition). */
  eraTransition: number | null;
  /** La galaxie vient d'être entièrement colonisée (écran de fin). */
  victory: boolean;

  advance: (dt: number) => void;
  catchUp: (seconds: number) => void;
  click: (x?: number, y?: number) => void;
  buy: (id: string) => void;
  buyUpgrade: (id: string) => void;
  buyAllUpgrades: () => void;
  buyResearch: (id: string) => void;
  moveEra: () => void;
  fixEvent: (uid: number) => void;
  repairNow: () => void;
  prestige: () => void;
  buyPrestige: (id: string) => void;
  setBuyAmount: (a: BuyAmount) => void;
  toggleAutoUpgrades: () => void;
  /** Active ou désactive le tutoriel. */
  setTutorial: (on: boolean) => void;
  /** Marque une étape du tutoriel comme vue (« intro », « era-3 »…). */
  markTuto: (id: string) => void;
  dismissOffline: () => void;
  dismissToast: (id: number) => void;
  dismissEraTransition: () => void;
  dismissVictory: () => void;
  save: () => void;
  /** Code de transfert compact de la partie en cours. */
  exportSave: () => Promise<string>;
  /** Remplace la partie en cours (après confirmation côté interface). */
  loadState: (s: GameState) => void;
  /** Reprend la partie d'un autre appareil (synchronisation), avec la progression hors-ligne depuis. */
  adoptState: (s: GameState) => void;
  hardReset: () => void;
}

let toastId = 1;
let floaterId = 1;

function derive(state: GameState) {
  const mods = computeModifiers(state);
  const snap = computeSnapshot(state, mods);
  return { mods, snap };
}

/** Action du joueur : comme `mutate`, et signale à la synchronisation que la partie a été jouée ici. */
function act(get: () => Store, set: (p: Partial<Store>) => void, fn: (s: GameState) => unknown) {
  markDirty();
  mutate(get, set, fn);
}

/** Applique une mutation sur une copie de l'état et republie. */
function mutate(get: () => Store, set: (p: Partial<Store>) => void, fn: (s: GameState) => unknown) {
  const s = structuredClone(get().state);
  const before = s.log[0];
  fn(s);
  const fresh = newLogEntries(s, before);
  set({ state: s, ...derive(s), toasts: pushToasts(get().toasts, fresh) });
}

function newLogEntries(s: GameState, before: LogEntry | undefined): LogEntry[] {
  const out: LogEntry[] = [];
  for (const e of s.log) {
    if (before && e.t === before.t && e.msg === before.msg) break;
    out.push(e);
  }
  return out;
}

function pushToasts(prev: Toast[], entries: LogEntry[]): Toast[] {
  if (!entries.length) return prev;
  const add = entries
    .filter((e) => e.kind !== 'info')
    .map((e) => ({ id: toastId++, msg: e.msg, kind: e.kind }));
  return [...add, ...prev].slice(0, 3);
}

function initialState(): { state: GameState; offline: OfflineReport | null } {
  const loaded = loadFromStorage();
  if (!loaded) return { state: newGame(), offline: null };
  const away = (Date.now() - loaded.lastSaved) / 1000;
  if (away > 60) {
    const report = simulateOffline(loaded, away);
    return { state: loaded, offline: report };
  }
  return { state: loaded, offline: null };
}

const init = initialState();

export const useGame = create<Store>((set, get) => ({
  state: init.state,
  ...derive(init.state),
  offline: init.offline,
  toasts: [],
  floaters: [],
  eraTransition: null,
  victory: false,

  advance: (dt) => {
    const before = get().state.stars;
    mutate(get, set, (s) => {
      tick(s, dt);
    });
    if (before < GALAXY_STARS && get().state.stars >= GALAXY_STARS) set({ victory: true });
  },

  catchUp: (seconds) => {
    const s = structuredClone(get().state);
    const report = simulateOffline(s, seconds);
    set({ state: s, ...derive(s), offline: report.simulated > 30 ? report : get().offline });
  },

  click: (x, y) => {
    let gained = 0;
    act(get, set, (s) => {
      gained = A.click(s);
    });
    if (x !== undefined && y !== undefined) {
      const f = { id: floaterId++, text: `+${formatShort(gained)} $`, x, y };
      set({ floaters: [...get().floaters.slice(-12), f] });
      setTimeout(() => set({ floaters: get().floaters.filter((o) => o.id !== f.id) }), 900);
    }
  },
  buy: (id) => act(get, set, (s) => A.buyBuilding(s, id, s.settings.buyAmount)),
  buyUpgrade: (id) => act(get, set, (s) => A.buyUpgrade(s, id)),
  buyAllUpgrades: () => act(get, set, (s) => A.buyAllUpgrades(s)),
  buyResearch: (id) => act(get, set, (s) => A.buyResearch(s, id)),
  moveEra: () => {
    let moved = false;
    act(get, set, (s) => {
      moved = A.moveEra(s);
    });
    if (moved) set({ eraTransition: get().state.era });
  },
  fixEvent: (uid) => act(get, set, (s) => A.fixEvent(s, uid)),
  repairNow: () => act(get, set, (s) => A.repairNow(s)),
  prestige: () => {
    const ns = A.doPrestige(structuredClone(get().state));
    if (!ns) return;
    markDirty();
    saveToStorage(ns);
    set({ state: ns, ...derive(ns), toasts: [] });
  },
  buyPrestige: (id) => act(get, set, (s) => A.buyPrestigeShop(s, id)),
  setBuyAmount: (a) => mutate(get, set, (s) => (s.settings.buyAmount = a)),
  toggleAutoUpgrades: () => act(get, set, (s) => (s.settings.autoUpgrades = !s.settings.autoUpgrades)),
  setTutorial: (on) => mutate(get, set, (s) => (s.settings.tutorial = on)),
  markTuto: (id) => mutate(get, set, (s) => (s.settings.tutoSeen = { ...s.settings.tutoSeen, [id]: true })),
  dismissOffline: () => set({ offline: null }),
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  dismissEraTransition: () => set({ eraTransition: null }),
  dismissVictory: () => set({ victory: false }),
  save: () => {
    const s = structuredClone(get().state);
    saveToStorage(s);
    set({ state: s });
  },
  exportSave: () => encodeTransfer(get().state),
  loadState: (s) => {
    markDirty();
    saveToStorage(s);
    set({ state: s, ...derive(s), toasts: [], offline: null });
  },
  adoptState: (s) => {
    const away = (Date.now() - s.lastSaved) / 1000;
    const offline = away > 60 ? simulateOffline(s, away) : null;
    saveToStorage(s);
    set({ state: s, ...derive(s), toasts: [], offline });
  },
  hardReset: () => {
    markDirty();
    clearStorage();
    const s = newGame();
    saveToStorage(s);
    set({ state: s, ...derive(s), toasts: [], offline: null });
  },
}));

function formatShort(n: number): string {
  if (n < 1000) return n < 10 ? n.toFixed(1).replace('.', ',') : Math.floor(n).toString();
  const units = ['', 'K', 'M', 'Md', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const e = Math.min(units.length - 1, Math.floor(Math.log10(n) / 3));
  return (n / Math.pow(1000, e)).toFixed(1).replace('.', ',') + ' ' + units[e];
}
