// ---------------------------------------------------------------------------
// Traduction du parc de machines en éléments à dessiner dans la scène.
// Fonctions pures (testées dans tests/scene.test.ts).
// ---------------------------------------------------------------------------
import type { BuildingDef } from '../../game/types';

export type UnitKind = 'server' | 'gpu' | 'storage' | 'network' | 'power';

const GPU_IDS = new Set(['gpunode', 'aipod', 'superpod', 'quantum']);

export function unitKind(b: BuildingDef): UnitKind | null {
  if (b.slots <= 0) return null;
  if (b.cat === 'servers') return GPU_IDS.has(b.id) ? 'gpu' : 'server';
  if (b.cat === 'storage') return 'storage';
  if (b.cat === 'network') return 'network';
  if (b.cat === 'power') return 'power';
  return null;
}

/** Répartit `total` proportionnellement aux poids (méthode du plus fort reste). */
export function apportion(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, w) => a + w, 0);
  if (sum <= 0 || total <= 0) return weights.map(() => 0);
  const exact = weights.map((w) => (w / sum) * total);
  const out = exact.map(Math.floor);
  let left = total - out.reduce((a, n) => a + n, 0);
  const order = exact.map((e, i) => [e - Math.floor(e), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    out[i]++;
    left--;
  }
  return out;
}

// --- Ère 1 : appareils posés sur l'établi -----------------------------------

export interface Device {
  id: string;
  kind: UnitKind;
}

/** Appareils visibles sur l'établi (au plus `max`, proportionnellement au parc). */
export function benchDevices(buildings: BuildingDef[], owned: Record<string, number>, max = 14): Device[] {
  const list = buildings
    .map((b) => ({ b, kind: unitKind(b), n: owned[b.id] ?? 0 }))
    .filter((x): x is { b: BuildingDef; kind: UnitKind; n: number } => x.kind !== null && x.n > 0);
  const total = list.reduce((a, x) => a + x.n, 0);
  const counts = total <= max ? list.map((x) => x.n) : apportion(list.map((x) => x.n), max);
  // Chaque type possédé reste visible au moins une fois.
  if (total > max) {
    for (let i = 0; i < counts.length; i++) {
      if (counts[i] > 0) continue;
      const j = counts.indexOf(Math.max(...counts));
      if (counts[j] > 1) {
        counts[j]--;
        counts[i]++;
      }
    }
  }
  const out: Device[] = [];
  list.forEach((x, i) => {
    for (let k = 0; k < counts[i]; k++) out.push({ id: x.b.id, kind: x.kind });
  });
  return out;
}

// --- Ères 2+ : unités montées en baie --------------------------------------

export interface PlacedUnit {
  rack: number;
  /** Position depuis le bas de la baie, en unités visuelles. */
  start: number;
  size: number;
  kind: UnitKind;
}

const KIND_ORDER: UnitKind[] = ['server', 'gpu', 'storage', 'network', 'power'];

/**
 * Remplit `racks` baies de `perRack` unités visuelles. La part remplie suit le
 * taux d'occupation réel de l'espace (slotsUsed / slotsCap), et la répartition
 * entre types suit les U réellement occupés par chacun.
 */
export function rackUnits(
  buildings: BuildingDef[],
  owned: Record<string, number>,
  slotsUsed: number,
  slotsCap: number,
  racks: number,
  perRack: number,
): PlacedUnit[] {
  const totalU = racks * perRack;
  if (slotsUsed <= 0 || totalU <= 0) return [];
  // Racine carrée : une salle peu remplie reste lisible (l'ère suivante démarre
  // avec beaucoup d'espace), et une salle pleine reste pleine.
  const fill = Math.sqrt(Math.min(1, slotsCap > 0 ? slotsUsed / slotsCap : 1));
  const filled = Math.max(1, Math.min(totalU, Math.round(fill * totalU)));

  const list = buildings
    .map((b) => ({ b, kind: unitKind(b), w: (owned[b.id] ?? 0) * b.slots }))
    .filter((x): x is { b: BuildingDef; kind: UnitKind; w: number } => x.kind !== null && x.w > 0)
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
  const shares = apportion(
    list.map((x) => x.w),
    filled,
  );

  // Découpe en unités (un 2U reste un 2U, les gros châssis plafonnent à 3U visuels).
  const chunks: { kind: UnitKind; size: number }[] = [];
  list.forEach((x, i) => {
    let left = shares[i];
    const step = Math.max(1, Math.min(3, x.b.slots));
    while (left > 0) {
      const size = Math.min(step, left);
      chunks.push({ kind: x.kind, size });
      left -= size;
    }
  });

  // Placement de bas en haut, baie après baie.
  const out: PlacedUnit[] = [];
  let rack = 0;
  let pos = 0;
  for (const c of chunks) {
    let size = c.size;
    while (size > 0 && rack < racks) {
      const room = perRack - pos;
      const take = Math.min(room, size);
      out.push({ rack, start: pos, size: take, kind: c.kind });
      pos += take;
      size -= take;
      if (pos >= perRack) {
        rack++;
        pos = 0;
      }
    }
  }
  return out;
}
