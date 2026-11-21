import type { BuildingDef, GameState } from '../types';
import type { Modifiers } from './modifiers';

/** Multiplicateur de coût applicable à un bâtiment. */
export function costFactor(b: BuildingDef, m: Modifiers): number {
  return m.cost * (m.costByCat[b.cat] ?? 1);
}

/** Coût total pour acheter `k` unités quand on en possède déjà `owned`. */
export function bulkCost(b: BuildingDef, owned: number, k: number, factor = 1): number {
  if (k <= 0) return 0;
  const g = b.growth;
  return (b.baseCost * factor * Math.pow(g, owned) * (Math.pow(g, k) - 1)) / (g - 1);
}

/** Nombre max d'unités achetables avec `money`. */
export function maxAffordable(b: BuildingDef, owned: number, money: number, factor = 1): number {
  const g = b.growth;
  const first = b.baseCost * factor * Math.pow(g, owned);
  if (money < first) return 0;
  const k = Math.floor(Math.log((money * (g - 1)) / first + 1) / Math.log(g));
  // Corrige d'éventuelles erreurs d'arrondi
  let n = Math.max(0, k);
  while (n > 0 && bulkCost(b, owned, n, factor) > money) n--;
  return n;
}

/** Emplacements libres. */
export function freeSlots(slotsCap: number, slotsUsed: number): number {
  return Math.max(0, Math.floor(slotsCap - slotsUsed + 1e-9));
}

/**
 * Plafond d'exemplaires d'un bâtiment dans l'ère `era` (Infinity s'il n'en a pas).
 * Il augmente d'ère en ère : tout monter au max donne une infrastructure juste
 * suffisante pour l'ère (voir scripts/solveCaps.ts).
 */
export function buildingCap(b: BuildingDef, era: number): number {
  let cap = b.max ?? Infinity;
  const t = b.maxByEra;
  if (t?.length) {
    const i = era - b.era;
    cap = Math.min(cap, i < 0 ? 0 : t[Math.min(i, t.length - 1)]);
  }
  return cap;
}

/**
 * Combien d'unités on peut physiquement installer (contrainte d'espace / plafond).
 * `owned` : exemplaires possédés et en route.
 */
export function placeable(b: BuildingDef, s: GameState, free: number, owned = s.owned[b.id] ?? 0): number {
  let n = Infinity;
  if (b.slots > 0) n = Math.floor(free / b.slots);
  n = Math.min(n, buildingCap(b, s.era) - owned);
  return Math.max(0, n);
}
