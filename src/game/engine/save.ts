import type { GameState } from '../types';
import { SAVE_VERSION, newGame } from './state';
import { ACHIEVEMENT_BY_ID } from '../data/achievements';
import { legacyTierCost } from '../data/upgrades';

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
  return s;
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
