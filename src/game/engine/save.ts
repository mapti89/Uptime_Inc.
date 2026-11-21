import type { GameState } from '../types';
import { SAVE_VERSION, newGame } from './state';
import { ACHIEVEMENT_BY_ID } from '../data/achievements';
import { legacyTierCost } from '../data/upgrades';
import { BUILDINGS, scaledKey } from '../data/buildings';
import { buildingCap, bulkCost } from './formulas';
import { addLog } from './state';

export const SAVE_KEY = 'uptime-inc-save';

type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

/** migrations[v] transforme une sauvegarde de version v en version v+1. */
const MIGRATIONS: Record<number, Migration> = {
  // v1 → v2 : refonte électricité / refroidissement / espace.
  1: (raw) => {
    // Succès « 50 / 100 × » d'infrastructure supprimés.
    const ach = { ...((raw.achievements as Record<string, number>) ?? {}) };
    for (const id of Object.keys(ach)) if (!ACHIEVEMENT_BY_ID[id]) delete ach[id];
    // Paliers par quantité de l'électricité et du refroidissement supprimés :
    // remboursés au coût d'origine.
    const upgrades = { ...((raw.upgrades as Record<string, boolean>) ?? {}) };
    let refund = 0;
    for (const id of Object.keys(upgrades)) {
      const cost = legacyTierCost(id);
      if (cost === null) continue;
      refund += cost;
      delete upgrades[id];
    }
    const money = typeof raw.money === 'number' ? raw.money : 0;
    return { ...raw, achievements: ach, upgrades, money: money + refund };
  },
  // v3 → v4 : plafonds par ère et production recalibrée des équipements d'appui. Ceux-ci
  // (stockage, réseau, électricité, refroidissement, espace, emport, nettoyage) sont montés
  // au maximum de l'ère, pour que l'infrastructure existante reste viable ; le reste est
  // ramené au plafond au chargement (clampToCaps).
  3: (raw) => {
    const era = typeof raw.era === 'number' ? raw.era : 1;
    const owned = { ...((raw.owned as Record<string, number>) ?? {}) };
    let refund = 0;
    for (const b of BUILDINGS) {
      const key = scaledKey(b);
      if (!key || key === 'traffic' || b.era > era) continue;
      const cap = buildingCap(b, era);
      const n = owned[b.id] ?? 0;
      if (n > cap) refund += bulkCost(b, cap, n - cap);
      owned[b.id] = cap;
    }
    const money = typeof raw.money === 'number' ? raw.money : 0;
    // Tutoriel (nouveau) : une partie déjà commencée ne le revoit pas, il reste accessible dans l'aide.
    const settings = { ...((raw.settings as Record<string, unknown>) ?? {}) };
    const tutoSeen: Record<string, true> = { intro: true };
    for (let e = 2; e <= era; e++) tutoSeen[`era-${e}`] = true;
    settings.tutoSeen = tutoSeen;
    return { ...raw, owned, money: money + refund, settings, rebalanced: true };
  },
  // v4 → v5 : électricité et refroidissement changent de puissance unitaire, avec des plafonds
  // bien plus bas. Ils avaient été offerts au maximum par la migration v4 : ils sont remis au
  // nouveau maximum de l'ère, sans remboursement du surplus.
  4: (raw) => {
    const era = typeof raw.era === 'number' ? raw.era : 1;
    const owned = { ...((raw.owned as Record<string, number>) ?? {}) };
    for (const b of BUILDINGS) {
      if ((b.cat !== 'power' && b.cat !== 'cooling') || b.era > era) continue;
      owned[b.id] = buildingCap(b, era);
    }
    return { ...raw, owned };
  },
};

/** Fusionne profondément une sauvegarde avec un état neuf (tolère les champs manquants). */
function mergeDefaults<T>(base: T, data: unknown): T {
  if (data === null || data === undefined) return base;
  if (typeof base !== 'object' || base === null || Array.isArray(base)) {
    return (typeof data !== 'object' || Array.isArray(data) === Array.isArray(base) ? data : base) as T;
  }
  if (typeof data !== 'object' || Array.isArray(data)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[k];
    if (b !== undefined && b !== null && typeof b === 'object' && !Array.isArray(b)) {
      out[k] = mergeDefaults(b, v);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

export function deserialize(json: string): GameState {
  let raw = JSON.parse(json) as Record<string, unknown>;
  let v = typeof raw.version === 'number' ? raw.version : 0;
  while (v < SAVE_VERSION) {
    const mig = MIGRATIONS[v];
    if (mig) raw = mig(raw);
    v++;
  }
  raw.version = SAVE_VERSION;
  const base = newGame();
  base.owned = {};
  const s = mergeDefaults(base, raw);
  // Sanitize les nombres
  if (!isFinite(s.money) || s.money < 0) s.money = 0;
  if (!Array.isArray(s.events)) s.events = [];
  if (!Array.isArray(s.log)) s.log = [];
  clampToCaps(s);
  if ((s as GameState & { rebalanced?: boolean }).rebalanced) {
    delete (s as GameState & { rebalanced?: boolean }).rebalanced;
    addLog(s, '⚖️ Rééquilibrage : électricité, refroidissement, espace, stockage, réseau et spatial montés au maximum de l’ère.', 'good');
  }
  return s;
}

/**
 * Ramène chaque bâtiment au plafond de l'ère (parties antérieures aux plafonds, ou après
 * un rééquilibrage) : l'excédent est revendu au prix payé pour ces exemplaires.
 */
export function clampToCaps(s: GameState): number {
  if (!Array.isArray(s.transit)) s.transit = [];
  let refund = 0;
  let removed = 0;
  for (const b of BUILDINGS) {
    const cap = buildingCap(b, s.era);
    if (!isFinite(cap)) continue;
    const owned = s.owned[b.id] ?? 0;
    const moving = s.transit.filter((t) => t.id === b.id).reduce((n, t) => n + t.count, 0);
    let excess = owned + moving - cap;
    if (excess <= 0) continue;
    refund += bulkCost(b, cap, excess);
    removed += excess;
    const fromOwned = Math.min(owned, excess);
    s.owned[b.id] = owned - fromOwned;
    excess -= fromOwned;
    for (const t of s.transit) {
      if (excess <= 0) break;
      if (t.id !== b.id) continue;
      const k = Math.min(t.count, excess);
      t.count -= k;
      excess -= k;
    }
  }
  s.transit = s.transit.filter((t) => t.count > 0);
  if (removed > 0) {
    s.money += refund;
    addLog(s, `⚖️ Nouveaux plafonds par ère : ${removed} équipements en trop revendus au prix payé.`, 'info');
  }
  return refund;
}

export function serialize(s: GameState): string {
  return JSON.stringify(s);
}

export function encodeExport(s: GameState): string {
  const bytes = new TextEncoder().encode(serialize(s));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

export function decodeImport(text: string): GameState {
  const bin = atob(text.trim());
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return deserialize(new TextDecoder().decode(bytes));
}

// ---------------------------------------------------------------------------
// Code de transfert compact : « UPT1. » + base64url(deflate-raw(JSON)).
// ~7× plus court que l'ancien export, et sûr dans une URL. Le journal
// d'événements (purement cosmétique) n'est pas transféré.
// ---------------------------------------------------------------------------

const COMPACT_PREFIX = 'UPT1.';

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, transform: GenericTransformStream): Promise<Uint8Array> {
  const stream = new Blob([bytes]).stream().pipeThrough(transform as unknown as TransformStream<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Code de transfert compact (repli sur l'ancien format si le navigateur ne sait pas compresser). */
export async function encodeTransfer(s: GameState): Promise<string> {
  if (typeof CompressionStream === 'undefined') return encodeExport(s);
  const json = serialize({ ...s, log: [] });
  const packed = await pipe(new TextEncoder().encode(json), new CompressionStream('deflate-raw'));
  return COMPACT_PREFIX + toBase64Url(packed);
}

/**
 * Lit un code de transfert, quel que soit son format : code compact, ancien export base64,
 * ou lien de transfert complet (…#import=CODE). Tolère espaces et retours à la ligne.
 */
export async function decodeTransfer(text: string): Promise<GameState> {
  let t = text.trim();
  const hash = t.indexOf('#import=');
  if (hash >= 0) t = decodeURIComponent(t.slice(hash + '#import='.length));
  t = t.replace(/\s+/g, '');
  if (!t.startsWith(COMPACT_PREFIX)) return decodeImport(t);
  const json = await pipe(fromBase64Url(t.slice(COMPACT_PREFIX.length)), new DecompressionStream('deflate-raw'));
  return deserialize(new TextDecoder().decode(json));
}

/** Lien qui ouvre le jeu et propose de charger la partie. */
export function transferLink(code: string, base = `${location.origin}${location.pathname}`): string {
  return `${base}#import=${code}`;
}

export function saveToStorage(s: GameState): void {
  try {
    s.lastSaved = Date.now();
    localStorage.setItem(SAVE_KEY, serialize(s));
  } catch {
    /* stockage indisponible */
  }
}

export function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return deserialize(raw);
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}
