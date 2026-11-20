import type { EventEffects, GameState, Res, Snapshot } from '../types';
import { RESOURCES } from '../types';
import { BUILDINGS, BUILDING_BY_ID } from '../data/buildings';
import { eraDef } from '../data/eras';
import { REQUEST_TYPES } from '../data/requestTypes';
import { effectiveProvides, type Modifiers } from './modifiers';

export const BASE_CLICK = 0.5;
const BASE_OVERHEAD = 0.5; // surcoût de refroidissement « ambiant » de l'ère
const REF_PUE = 1.5;
/** Part du surcoût consommée par un groupe de refroidissement inutilisé. */
const IDLE_OVERHEAD = 0.1;
/** Efficacité minimale quand les débris orbitaux débordent. */
const MIN_DEBRIS_FACTOR = 0.25;
/** Bonus de demande par décade d'étoiles colonisées. */
const STAR_DEMAND_PER_DECADE = 0.15;

/** Bonus de demande lié aux étoiles colonisées (×1 sans colonisation). */
export function starMultiplier(stars: number): number {
  return stars > 1 ? 1 + STAR_DEMAND_PER_DECADE * Math.log10(stars) : 1;
}

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
      case 'conjunction':
        fx.bwMult *= 0.5;
        break;
      case 'xenosignal':
        fx.demandMult *= 3;
        break;
      case 'supernova':
        fx.coolingMult *= 0.7;
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
  // Matériel lointain (au-delà de la Lune) : ne sert que les requêtes tolérantes.
  const rawFar = zeroRes();
  let liftCap = era.base.lift ?? 0;
  let cleanupCap = era.base.cleanup ?? 0;
  let massUsed = 0;
  let debris = 0;
  let replication = 0;
  let powerCap = era.base.power;
  let coolCap = era.base.cooling;
  // Groupes de refroidissement : capacité (avant événements) + surcoût électrique.
  // Le refroidissement de base du local n'a pas de consommation à vide : il
  // n'a pas été choisi par le joueur.
  const coolUnits: { cap: number; unit: number; overhead: number; idle: number }[] = [
    { cap: era.base.cooling, unit: era.base.cooling, overhead: BASE_OVERHEAD, idle: 0 },
  ];
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
    const pool = b.remote ? rawFar : raw;
    if (p.cpu) pool.cpu += n * p.cpu * mult;
    if (p.ram) pool.ram += n * p.ram * mult;
    if (p.storage) pool.storage += n * p.storage * mult;
    if (p.gpu) pool.gpu += n * p.gpu * mult;
    if (p.bw) raw.bw += n * p.bw * mult;
    if (p.power) powerCap += n * p.power * mult * m.stat.power;
    if (p.cooling) {
      const c = n * p.cooling * mult * m.stat.cooling;
      coolCap += c;
      coolUnits.push({ cap: c, unit: c / n, overhead: b.overhead ?? 0.5, idle: IDLE_OVERHEAD });
    }
    if (p.space) slotsCap += n * p.space;
    if (p.traffic) traffic += n * p.traffic * mult;
    if (p.rd) rdRate += n * p.rd;
    if (p.autoClick) autoClick += n * p.autoClick;
    if (p.repair) repairRate += n * p.repair;
    if (p.efficiency) staffEff += n * p.efficiency;
    if (b.flags?.includes('solar')) solarUnits += b.id === 'solarfarm' ? n * 10 : n;
    if (p.lift) liftCap += n * p.lift * mult;
    if (p.cleanup) cleanupCap += n * p.cleanup * mult;
    if (p.replication) replication += n * p.replication * mult;
    if (b.mass) massUsed += n * b.mass;
    if (b.debris) debris += n * b.debris;
    itWatts += n * b.watts;
    slotsUsed += n * b.slots;
  }
  // Le matériel en route réserve déjà sa place dans les lanceurs.
  for (const tr of s.transit) massUsed += tr.count * (BUILDING_BY_ID[tr.id]?.mass ?? 0);
  massUsed *= m.mass;
  debris *= m.mass;
  liftCap *= m.stat.lift;
  cleanupCap *= m.stat.cleanup;
  replication *= m.stat.replication;
  const debrisFactor = debris <= cleanupCap ? 1 : Math.max(MIN_DEBRIS_FACTOR, cleanupCap / debris);
  itWatts *= m.watts;
  traffic *= m.stat.traffic;
  rdRate *= m.stat.rd;
  autoClick *= m.stat.autoClick;
  repairRate *= m.repair;

  // --- Refroidissement & PUE ---
  coolCap *= fx.coolingMult;
  const heat = itWatts;
  const coolFactor = heat <= 0 ? 1 : Math.min(1, coolCap / heat);
  // Préséance économique : les groupes les plus sobres tournent en premier,
  // les autres n'interviennent qu'en appoint. Une unité partiellement chargée
  // tourne au ralenti ; une unité entièrement à l'arrêt consomme encore une
  // petite fraction de son surcoût (pompes, ventilateurs en veille).
  coolUnits.sort((a, b) => a.overhead - b.overhead);
  let remaining = heat;
  let coolOverheadW = 0;
  for (const u of coolUnits) {
    const cap = u.cap * fx.coolingMult;
    const unit = u.unit * fx.coolingMult;
    const load = Math.min(cap, remaining);
    remaining -= load;
    const idleUnits = unit > 0 ? Math.floor((cap - load) / unit + 1e-9) : 0;
    coolOverheadW += (load + idleUnits * unit * u.idle) * u.overhead;
  }
  const heatDissipated = heat - remaining;
  const pue = heatDissipated > 0 ? 1 + (coolOverheadW / heatDissipated) * m.pue : 1;

  // --- Électricité ---
  const totalWatts = itWatts * pue;
  let powerFactor = totalWatts <= 0 ? 1 : Math.min(1, powerCap / totalWatts);
  if (fx.powerOutage) {
    if (m.flags.has('generator')) powerFactor *= 1;
    else if (m.flags.has('ups')) powerFactor *= 0.6;
    else powerFactor = 0;
  }

  const efficiency =
    powerFactor * coolFactor * debrisFactor * (1 - s.damage) * (1 + m.efficiency + staffEff);

  // --- Offre ---
  const near = zeroRes();
  const far = zeroRes();
  for (const r of ['cpu', 'ram', 'storage', 'gpu'] as const) {
    near[r] = raw[r] * m.stat[r] * efficiency;
    far[r] = rawFar[r] * m.stat[r] * efficiency;
  }
  near.bw = (era.base.bw + raw.bw) * m.stat.bw * fx.bwMult;
  const supply = zeroRes();
  for (const r of RESOURCES) supply[r] = near[r] + far[r];

  // --- Demande ---
  const repMult = 0.5 + s.reputation / 100;
  const starMult = starMultiplier(s.stars);
  const demand: Record<string, number> = {};
  const need = zeroRes();
  const needRealtime = zeroRes();
  let totalDemand = 0;
  for (const rt of REQUEST_TYPES) {
    if (rt.era > s.era) continue;
    const d = traffic * rt.weight * m.demand * (m.demandByType[rt.id] ?? 1) * repMult * fx.demandMult * starMult;
    demand[rt.id] = d;
    totalDemand += d;
    for (const r of RESOURCES) {
      const k = rt.needs[r];
      if (!k) continue;
      need[r] += d * k * m.need[r];
      if (!rt.tolerant) needRealtime[r] += d * k * m.need[r];
    }
  }

  const ratio = zeroRes();
  for (const r of RESOURCES) ratio[r] = need[r] <= 0 ? 1 : Math.min(1, supply[r] / need[r]);

  // Latence et pénurie. Le matériel lointain se divise en une part « pontée » (accessible
  // aussi au temps réel) et le reste, réservé aux requêtes tolérantes. Les tolérantes
  // utilisent d'abord ce reste ; puis le matériel proche et la part pontée sont partagés
  // au prorata des besoins : une pénurie de x % fait perdre ~x % à chacun, au lieu de
  // priver entièrement les requêtes tolérantes.
  const bridge = m.flags.has('wormhole') ? 1 : m.latencyBridge;
  const ratioRealtime = zeroRes();
  const ratioTolerant = zeroRes();
  const realtimeCap = zeroRes();
  for (const r of RESOURCES) {
    const needI = needRealtime[r];
    const needT = need[r] - needI;
    const farOnly = far[r] * (1 - bridge);
    const fromFar = Math.min(needT, farOnly);
    const restT = needT - fromFar;
    const shared = near[r] + far[r] * bridge;
    realtimeCap[r] = shared;
    const k = needI + restT <= shared ? 1 : shared / (needI + restT);
    ratioRealtime[r] = needI <= 0 ? 1 : k;
    ratioTolerant[r] = needT <= 0 ? 1 : (fromFar + restT * k) / needT;
  }

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
    const rr = rt.tolerant ? ratioTolerant : ratioRealtime;
    for (const r of RESOURCES) {
      if (!rt.needs[r]) continue;
      if (rr[r] < f) {
        f = rr[r];
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
    itWatts, totalWatts, powerCap, heat, coolCap, heatDissipated, pue,
    powerFactor, coolFactor, efficiency,
    slotsUsed, slotsCap, massUsed, liftCap, debris, cleanupCap, debrisFactor,
    remoteSupply: far, needRealtime, realtimeCap, latencyBridge: bridge, replication, starMult, traffic, rdRate, autoClick, clickValue, autoClickValue, consumedW, energyShare,
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
