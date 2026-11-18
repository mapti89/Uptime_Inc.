import type { GameState } from '../types';
import { SAVE_VERSION, newGame } from './state';

export const SAVE_KEY = 'uptime-inc-save';

type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

/** migrations[v] transforme une sauvegarde de version v en version v+1. */
const MIGRATIONS: Record<number, Migration> = {};

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
