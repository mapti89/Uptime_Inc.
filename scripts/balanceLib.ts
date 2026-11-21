/**
 * Outils d'équilibrage : état « tout au max » d'une ère et mesures associées.
 * Utilisé par scripts/solveCaps.ts. Les plafonds lus sont ceux des bâtiments
 * (`BUILDINGS[i].maxByEra`), que le solveur modifie en mémoire.
 */
import { BUILDINGS } from '../src/game/data/buildings';
import { RESEARCH } from '../src/game/data/research';
import { UPGRADES } from '../src/game/data/upgrades';
import { REQUEST_TYPES } from '../src/game/data/requestTypes';
import { upgradeAvailable } from '../src/game/engine/actions';
import { computeModifiers, type Modifiers } from '../src/game/engine/modifiers';
import { computeSnapshot } from '../src/game/engine/snapshot';
import { newGame } from '../src/game/engine/state';
import { buildingCap, bulkCost, costFactor } from '../src/game/engine/formulas';
import { starCap } from '../src/game/data/galaxy';
import { RESOURCES, type GameState, type Res, type Snapshot } from '../src/game/types';

const capAt = (b: (typeof BUILDINGS)[number], era: number) => {
  const c = buildingCap(b, era);
  return isFinite(c) ? c : 0;
};

/**
 * État d'une partie au bout de l'ère `era` : tous les bâtiments des ères ≤ `ownedEra`
 * au plafond, toute la recherche et toutes les améliorations des ères ≤ `techEra`.
 */
export function maxState(era: number, opts: { ownedEra?: number; techEra?: number } = {}): GameState {
  const ownedEra = opts.ownedEra ?? era;
  const techEra = opts.techEra ?? era;
  const s = newGame();
  s.era = techEra;
  s.reputation = 100;
  s.uptime = 1;
  s.owned = {};
  for (const b of BUILDINGS) if (b.era <= ownedEra) s.owned[b.id] = capAt(b, ownedEra);
  for (const r of RESEARCH) if (r.era <= techEra) s.research[r.id] = true;
  // Améliorations : on répète tant qu'il s'en débloque (records de consommation compris).
  s.stats.runPeakPower = Infinity;
  s.stats.runPeakHeat = Infinity;
  for (let pass = 0; pass < 4; pass++) {
    let added = 0;
    for (const u of UPGRADES) {
      if (upgradeAvailable(s, u.id)) {
        s.upgrades[u.id] = true;
        added++;
      }
    }
    if (!added) break;
  }
  s.era = era;
  s.stars = starCap(era);
  return s;
}

export interface Measure {
  snap: Snapshot;
  mods: Modifiers;
  /** Capacité / besoin, par ressource de calcul. */
  ratio: Record<Res, number>;
  quality: number;
  /** Part servie du type de requête le moins bien servi. */
  worstType: number;
  /** Idem pendant un buzz viral (demande ×3). */
  worstTypeViral: number;
  power: number;
  cooling: number;
  slotsFree: number;
  lift: number;
  debris: number;
}

function worst(snap: Snapshot): number {
  let w = 1;
  for (const rt of REQUEST_TYPES) {
    const d = snap.demand[rt.id];
    if (d > 0) w = Math.min(w, snap.served[rt.id] / d);
  }
  return w;
}

export function measure(s: GameState, demandPeak = 3): Measure {
  const mods = computeModifiers(s);
  const snap = computeSnapshot(s, mods);
  const ratio = {} as Record<Res, number>;
  for (const r of RESOURCES) ratio[r] = snap.need[r] > 0 ? snap.supply[r] / snap.need[r] : Infinity;
  // Pic de demande : on applique le multiplicateur via la demande globale.
  const peak = { ...mods, demand: mods.demand * demandPeak };
  const sv = computeSnapshot(s, peak);
  return {
    snap,
    mods,
    ratio,
    quality: snap.totalDemand > 0 ? snap.totalServed / snap.totalDemand : 1,
    worstType: worst(snap),
    worstTypeViral: worst(sv),
    power: snap.totalWatts > 0 ? snap.powerCap / snap.totalWatts : Infinity,
    cooling: snap.heat > 0 ? snap.coolCap / snap.heat : Infinity,
    slotsFree: snap.slotsCap - snap.slotsUsed,
    lift: snap.massUsed > 0 ? snap.liftCap / snap.massUsed : Infinity,
    debris: snap.debris > 0 ? snap.cleanupCap / snap.debris : Infinity,
  };
}

/** Coût pour passer du max de l'ère précédente au max de l'ère `era`. */
export function eraCost(era: number, mods: Modifiers): number {
  let c = 0;
  for (const b of BUILDINGS) {
    if (b.era > era) continue;
    const from = b.era < era ? capAt(b, era - 1) : 0;
    c += bulkCost(b, from, Math.max(0, capAt(b, era) - from), costFactor(b, mods));
  }
  return c;
}

export const fmtN = (n: number) => {
  if (!isFinite(n)) return '∞';
  if (Math.abs(n) < 1000) return n.toFixed(n < 10 ? 2 : 0);
  return n.toExponential(2);
};
