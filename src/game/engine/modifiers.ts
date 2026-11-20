import type { BuildingDef, Category, Effect, Flag, GameState, Provides, Res, Stat } from '../types';
import { UPGRADE_BY_ID } from '../data/upgrades';
import { RESEARCH_BY_ID } from '../data/research';
import { ACHIEVEMENT_BONUS } from '../data/achievements';
import { shareBonus } from '../data/prestige';
import { BUILDINGS } from '../data/buildings';
import { ERAS } from '../data/eras';

/** Agrégat de tous les effets actifs (upgrades, recherche, prestige, succès). */
export interface Modifiers {
  building: Record<string, number>;
  /** Production ajoutée par exemplaire, par bâtiment (effets `buildingAdd`). */
  buildingAdd: Record<string, Partial<Record<Res, number>>>;
  cat: Partial<Record<Category, number>>;
  stat: Record<Stat, number>;
  price: number;
  priceByType: Record<string, number>;
  demand: number;
  demandByType: Record<string, number>;
  need: Record<Res, number>;
  watts: number;
  pue: number;
  elecPrice: number;
  click: number;
  clickIncome: number;
  efficiency: number;
  failure: number;
  repair: number;
  eventDuration: number;
  flags: Set<Flag>;
  sla: number;
  cost: number;
  costByCat: Partial<Record<Category, number>>;
  rdFromRequests: number;
  revenue: number;
  mass: number;
  latencyBridge: number;
}

export function emptyModifiers(): Modifiers {
  return {
    building: {},
    buildingAdd: {},
    cat: {},
    stat: { cpu: 1, ram: 1, storage: 1, gpu: 1, bw: 1, power: 1, cooling: 1, space: 1, traffic: 1, rd: 1, autoClick: 1, lift: 1, cleanup: 1, replication: 1 },
    price: 1,
    priceByType: {},
    demand: 1,
    demandByType: {},
    need: { cpu: 1, ram: 1, storage: 1, gpu: 1, bw: 1 },
    watts: 1,
    pue: 1,
    elecPrice: 1,
    click: 1,
    clickIncome: 0,
    efficiency: 0,
    failure: 1,
    repair: 1,
    eventDuration: 1,
    flags: new Set(),
    sla: 0,
    cost: 1,
    costByCat: {},
    rdFromRequests: 0,
    revenue: 1,
    mass: 1,
    latencyBridge: 0,
  };
}

export function applyEffect(m: Modifiers, e: Effect): void {
  switch (e.kind) {
    case 'buildingMult':
      m.building[e.id] = (m.building[e.id] ?? 1) * e.mult;
      break;
    case 'buildingAdd': {
      const add = (m.buildingAdd[e.id] ??= {});
      add[e.res] = (add[e.res] ?? 0) + e.add;
      break;
    }
    case 'catMult':
      m.cat[e.cat] = (m.cat[e.cat] ?? 1) * e.mult;
      break;
    case 'statMult':
      m.stat[e.stat] *= e.mult;
      break;
    case 'priceMult':
      if (e.reqType) m.priceByType[e.reqType] = (m.priceByType[e.reqType] ?? 1) * e.mult;
      else m.price *= e.mult;
      break;
    case 'demandMult':
      if (e.reqType) m.demandByType[e.reqType] = (m.demandByType[e.reqType] ?? 1) * e.mult;
      else m.demand *= e.mult;
      break;
    case 'needMult':
      m.need[e.res] *= e.mult;
      break;
    case 'wattsMult':
      m.watts *= e.mult;
      break;
    case 'pueMult':
      m.pue *= e.mult;
      break;
    case 'elecPriceMult':
      m.elecPrice *= e.mult;
      break;
    case 'clickMult':
      m.click *= e.mult;
      break;
    case 'clickIncome':
      m.clickIncome += e.add;
      break;
    case 'efficiency':
      m.efficiency += e.add;
      break;
    case 'failureMult':
      m.failure *= e.mult;
      break;
    case 'repairMult':
      m.repair *= e.mult;
      break;
    case 'eventDurationMult':
      m.eventDuration *= e.mult;
      break;
    case 'flag':
      m.flags.add(e.flag);
      break;
    case 'sla':
      m.sla = Math.max(m.sla, e.level);
      break;
    case 'costMult':
      if (e.cat) m.costByCat[e.cat] = (m.costByCat[e.cat] ?? 1) * e.mult;
      else m.cost *= e.mult;
      break;
    case 'rdFromRequests':
      m.rdFromRequests += e.add;
      break;
    case 'revenueMult':
      m.revenue *= e.mult;
      break;
    case 'massMult':
      m.mass *= e.mult;
      break;
    case 'latencyBridge':
      m.latencyBridge = Math.min(1, m.latencyBridge + e.add);
      break;
  }
}

/** Production unitaire d'un bâtiment, bonus `buildingAdd` compris (hors multiplicateurs). */
export function effectiveProvides(b: BuildingDef, m: Modifiers): Provides {
  const add = m.buildingAdd[b.id];
  if (!add) return b.provides;
  const p: Provides = { ...b.provides };
  for (const [r, v] of Object.entries(add) as [Res, number][]) p[r] = (p[r] ?? 0) + v;
  return p;
}

export function computeModifiers(s: GameState): Modifiers {
  const m = emptyModifiers();
  // Pont de latence de base : acquis à l'arrivée dans l'ère qui le définit, et conservé ensuite.
  for (const e of ERAS) if (e.id <= s.era) m.latencyBridge = Math.max(m.latencyBridge, e.latencyBridge ?? 0);
  for (const id in s.upgrades) {
    const u = UPGRADE_BY_ID[id];
    if (u) for (const e of u.effects) applyEffect(m, e);
  }
  for (const id in s.research) {
    const r = RESEARCH_BY_ID[id];
    if (r) for (const e of r.effects) applyEffect(m, e);
  }
  // Drapeaux venant des bâtiments possédés
  for (const b of BUILDINGS) {
    if (b.flags && (s.owned[b.id] ?? 0) > 0) for (const f of b.flags) m.flags.add(f);
  }
  // Prestige
  const shop = s.prestige.shop;
  const achCount = Object.keys(s.achievements).length;
  m.revenue *= 1 + shareBonus(s.prestige.shares);
  m.revenue *= 1 + achCount * ACHIEVEMENT_BONUS;
  m.revenue *= 1 + 0.25 * (shop.veteran ?? 0);
  m.click *= Math.pow(3, shop.clicker ?? 0);
  m.cost *= Math.pow(0.95, shop.cheaper ?? 0);
  m.stat.lift *= Math.pow(1.5, shop.logistics ?? 0);
  m.stat.cleanup *= Math.pow(1.5, shop.cleanOrbit ?? 0);
  m.stat.replication *= Math.pow(1.25, shop.probes ?? 0);
  return m;
}
