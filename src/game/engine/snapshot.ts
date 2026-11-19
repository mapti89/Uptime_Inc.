import type { EventEffects, GameState, Res, Snapshot } from '../types';
import { RESOURCES } from '../types';
import { BUILDINGS } from '../data/buildings';
import { eraDef } from '../data/eras';
import { REQUEST_TYPES } from '../data/requestTypes';
import { effectiveProvides, type Modifiers } from './modifiers';

export const BASE_CLICK = 0.5;
const BASE_OVERHEAD = 0.5; // surcoût de refroidissement « ambiant » de l'ère
const REF_PUE = 1.5;

function zeroRes(): Record<Res, number> {
  return { cpu: 0, ram: 0, storage: 0, gpu: 0, bw: 0 };
}

export function eventEffects(s: GameState, m: Modifiers): EventEffects {
  const fx: EventEffects = { demandMult: 1, coolingMult: 1, powerOutage: false, bwMult: 1, elecPriceMult: 1 };
  for (const ev of s.events) {
    switch (ev.defId) {
      case 'outage':
        fx.powerOutage = true;
        break;
      case 'heatwave':
        fx.coolingMult *= 0.65;
        break;
      case 'viral':
        fx.demandMult *= 3;
        break;
      case 'blackfriday':
        fx.demandMult *= 2.5;
        break;
      case 'ddos':
        if (!m.flags.has('antiddos')) fx.bwMult *= 0.3;
        break;
      case 'fiber_cut':
        fx.bwMult *= 0.5;
        break;
      case 'acleak':
        fx.coolingMult *= 0.8;
        break;
      case 'elecspike':
        fx.elecPriceMult *= 3;
        break;
    }
  }
  return fx;
}

export function slaMultiplier(level: number, uptime: number): number {
  let mult = 1;
  if (level >= 1) {
    if (uptime >= 0.999) mult = 1.2;
    else if (uptime >= 0.99) mult = 1.1;
  }
  if (level >= 2 && uptime >= 0.9999) mult = 1.5;
  if (level >= 3 && uptime >= 0.99999) mult = 2;
  return mult;
}

export function computeSnapshot(s: GameState, m: Modifiers): Snapshot {
  const era = eraDef(s.era);
  const fx = eventEffects(s, m);

  const raw = zeroRes();
  let powerCap = era.base.power;
  let coolCap = era.base.cooling;
  let coolOverheadW = era.base.cooling * BASE_OVERHEAD;
  let slotsCap = era.base.space;
  let traffic = era.base.traffic;
  let itWatts = 0;
  let slotsUsed = 0;
  let rdRate = 0;
  let autoClick = 0;
  let repairRate = 0.002; // réparation naturelle
  let staffEff = 0;
  let solarUnits = 0;

  for (const b of BUILDINGS) {
    const n = s.owned[b.id] ?? 0;
    if (n <= 0) continue;
    const mult = (m.building[b.id] ?? 1) * (m.cat[b.cat] ?? 1);
    const p = effectiveProvides(b, m);
    if (p.cpu) raw.cpu += n * p.cpu * mult;
    if (p.ram) raw.ram += n * p.ram * mult;
    if (p.storage) raw.storage += n * p.storage * mult;
    if (p.gpu) raw.gpu += n * p.gpu * mult;
    if (p.bw) raw.bw += n * p.bw * mult;
    if (p.power) powerCap += n * p.power * mult * m.stat.power;
    if (p.cooling) {
      const c = n * p.cooling * mult * m.stat.cooling;
      coolCap += c;
      coolOverheadW += c * (b.overhead ?? 0.5);
    }
    if (p.space) slotsCap += n * p.space;
    if (p.traffic) traffic += n * p.traffic * mult;
    if (p.rd) rdRate += n * p.rd;
    if (p.autoClick) autoClick += n * p.autoClick;
    if (p.repair) repairRate += n * p.repair;
    if (p.efficiency) staffEff += n * p.efficiency;
    if (b.flags?.includes('solar')) solarUnits += b.id === 'solarfarm' ? n * 10 : n;
    itWatts += n * b.watts;
    slotsUsed += n * b.slots;
  }
  itWatts *= m.watts;
  traffic *= m.stat.traffic;
  rdRate *= m.stat.rd;
  autoClick *= m.stat.autoClick;
  repairRate *= m.repair;

  // --- Refroidissement & PUE ---
  coolCap *= fx.coolingMult;
  const heat = itWatts;
  const coolFactor = heat <= 0 ? 1 : Math.min(1, coolCap / heat);
  const avgOverhead = coolCap > 0 ? coolOverheadW / (coolCap / fx.coolingMult) : BASE_OVERHEAD;
  const pue = heat > 0 ? 1 + avgOverhead * m.pue : 1;

  // --- Électricité ---
  const totalWatts = itWatts * pue;
  let powerFactor = totalWatts <= 0 ? 1 : Math.min(1, powerCap / totalWatts);
  if (fx.powerOutage) {
    if (m.flags.has('generator')) powerFactor *= 1;
    else if (m.flags.has('ups')) powerFactor *= 0.6;
    else powerFactor = 0;
  }

  const efficiency =
    powerFactor * coolFactor * (1 - s.damage) * (1 + m.efficiency + staffEff);

  // --- Offre ---
  const supply = zeroRes();
  supply.cpu = raw.cpu * m.stat.cpu * efficiency;
  supply.ram = raw.ram * m.stat.ram * efficiency;
  supply.storage = raw.storage * m.stat.storage * efficiency;
  supply.gpu = raw.gpu * m.stat.gpu * efficiency;
  supply.bw = (era.base.bw + raw.bw) * m.stat.bw * fx.bwMult;

  // --- Demande ---
  const repMult = 0.5 + s.reputation / 100;
  const demand: Record<string, number> = {};
  const need = zeroRes();
  let totalDemand = 0;
  for (const rt of REQUEST_TYPES) {
    if (rt.era > s.era) continue;
    const d = traffic * rt.weight * m.demand * (m.demandByType[rt.id] ?? 1) * repMult * fx.demandMult;
    demand[rt.id] = d;
    totalDemand += d;
    for (const r of RESOURCES) {
      const k = rt.needs[r];
      if (k) need[r] += d * k * m.need[r];
    }
  }

  const ratio = zeroRes();
  for (const r of RESOURCES) ratio[r] = need[r] <= 0 ? 1 : Math.min(1, supply[r] / need[r]);

  // --- Service ---
  const served: Record<string, number> = {};
  const bottleneck: Record<string, Res | null> = {};
  const slaMult = slaMultiplier(m.sla, s.uptime);
  const globalMult = m.price * m.revenue * slaMult;
  let revenue = 0;
  let totalServed = 0;
  for (const rt of REQUEST_TYPES) {
    if (rt.era > s.era) continue;
    let f = 1;
    let bn: Res | null = null;
    for (const r of RESOURCES) {
      if (!rt.needs[r]) continue;
      if (ratio[r] < f) {
        f = ratio[r];
        bn = r;
      }
    }
    const sv = demand[rt.id] * f;
    served[rt.id] = sv;
    bottleneck[rt.id] = f < 0.999 ? bn : null;
    totalServed += sv;
    revenue += sv * rt.price * (m.priceByType[rt.id] ?? 1) * globalMult;
  }

  // --- Coûts ---
  // Facture d'énergie : part du chiffre d'affaires, modulée par le PUE, les
  // panneaux solaires, les contrats et les événements. Elle reste ainsi un
  // levier significatif tout au long de la partie.
  const solarDiscount = Math.min(0.45, solarUnits * 0.015);
  const consumedW = Math.min(totalWatts, powerCap);
  const energyShare =
    era.energyShare * (pue / REF_PUE) * m.elecPrice * fx.elecPriceMult * (1 - solarDiscount);
  const elecCost = itWatts > 0 ? revenue * Math.min(0.95, energyShare) : 0;
  const net = revenue - elecCost;

  rdRate += Math.sqrt(totalServed) * m.rdFromRequests;
  const autoClickValue = BASE_CLICK * m.click * Math.pow(1.5, s.era - 1);
  const clickValue = autoClickValue + Math.max(0, net) * m.clickIncome;

  return {
    supply, need, ratio, demand, served, bottleneck,
    totalDemand, totalServed, revenue, elecCost, net,
    itWatts, totalWatts, powerCap, heat, coolCap, pue,
    powerFactor, coolFactor, efficiency,
    slotsUsed, slotsCap, traffic, rdRate, autoClick, clickValue, autoClickValue, consumedW, energyShare,
    repairRate,
    slaMult, globalMult,
  };
}

/** Fiabilité (multiplicateur sur la fréquence des incidents négatifs). */
export function failureFactor(s: GameState, m: Modifiers): number {
  let rel = 1;
  for (const b of BUILDINGS) {
    const n = s.owned[b.id] ?? 0;
    if (n > 0 && b.provides.reliability) rel *= Math.pow(1 - b.provides.reliability, n);
  }
  return Math.max(0.15, rel * m.failure);
}
