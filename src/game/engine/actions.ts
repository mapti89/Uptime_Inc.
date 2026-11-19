import type { BuildingDef, BuyAmount, GameState, UpgradeReq } from '../types';
import { BUILDING_BY_ID } from '../data/buildings';
import { UPGRADES, UPGRADE_BY_ID } from '../data/upgrades';
import { RESEARCH_BY_ID } from '../data/research';
import { ERAS, MAX_ERA, eraDef } from '../data/eras';
import { EVENT_BY_ID } from '../data/events';
import { PRESTIGE_BY_ID, PRESTIGE_MIN_ERA, sharesFor } from '../data/prestige';
import { computeModifiers, type Modifiers } from './modifiers';
import { computeSnapshot } from './snapshot';
import { bulkCost, costFactor, freeSlots, maxAffordable, placeable } from './formulas';
import { addLog, newGame } from './state';
import { STAR_ERA } from '../data/galaxy';

export interface BuyQuote {
  count: number;
  cost: number;
  /** Raison si impossible. */
  blocked?: 'era' | 'space' | 'lift' | 'money' | 'max';
}

/** Exemplaires possédés + en route (le prix suit les deux). */
export function ownedOrPending(s: GameState, id: string): number {
  let n = s.owned[id] ?? 0;
  for (const tr of s.transit) if (tr.id === id) n += tr.count;
  return n;
}

/** Nombre d'exemplaires en route. */
export function inTransit(s: GameState, id: string): number {
  let n = 0;
  for (const tr of s.transit) if (tr.id === id) n += tr.count;
  return n;
}

/** Calcule combien on achèterait et pour quel prix. */
export function quoteBuilding(s: GameState, b: BuildingDef, amount: BuyAmount, m?: Modifiers): BuyQuote {
  const mods = m ?? computeModifiers(s);
  const owned = ownedOrPending(s, b.id);
  const f = costFactor(b, mods);
  if (b.era > s.era) return { count: 0, cost: bulkCost(b, owned, 1, f), blocked: 'era' };
  const snap = computeSnapshot(s, mods);
  let room = placeable(b, s, freeSlots(snap.slotsCap, snap.slotsUsed));
  let liftBlocked = false;
  if (b.mass) {
    const fit = Math.floor((snap.liftCap - snap.massUsed) / (b.mass * mods.mass) + 1e-9);
    if (fit < room) {
      room = Math.max(0, fit);
      liftBlocked = true;
    }
  }
  if (room <= 0) {
    const blocked = b.max !== undefined && owned >= b.max ? 'max' : liftBlocked ? 'lift' : 'space';
    return { count: 0, cost: bulkCost(b, owned, 1, f), blocked };
  }
  if (amount === 'max') {
    const n = Math.min(room, maxAffordable(b, owned, s.money, f));
    if (n <= 0) return { count: 1, cost: bulkCost(b, owned, 1, f), blocked: 'money' };
    return { count: n, cost: bulkCost(b, owned, n, f) };
  }
  const n = Math.min(amount, room);
  const cost = bulkCost(b, owned, n, f);
  return { count: n, cost, blocked: cost > s.money ? 'money' : undefined };
}

export function buyBuilding(s: GameState, id: string, amount: BuyAmount = 1): boolean {
  const b = BUILDING_BY_ID[id];
  if (!b) return false;
  const q = quoteBuilding(s, b, amount);
  if (q.blocked || q.count <= 0 || q.cost > s.money) return false;
  s.money -= q.cost;
  s.stats.moneySpent += q.cost;
  if (b.travel) {
    s.transit.push({ id, count: q.count, remaining: b.travel });
    addLog(s, `${b.icon} ${q.count} × ${b.name} en route (${Math.round(b.travel / 60)} min).`, 'info');
  } else {
    s.owned[id] = (s.owned[id] ?? 0) + q.count;
  }
  return true;
}

export function upgradeAvailable(s: GameState, id: string): boolean {
  const u = UPGRADE_BY_ID[id];
  if (!u || s.upgrades[id]) return false;
  if (u.era > s.era) return false;
  if (u.req && reqMissing(s, u.req) > 0) return false;
  return true;
}

/** Ce qu'il manque pour remplir la condition (0 si elle est remplie). */
export function reqMissing(s: GameState, req: UpgradeReq): number {
  if ('id' in req) return Math.max(0, req.count - (s.owned[req.id] ?? 0));
  const peak = req.usage === 'power' ? s.stats.runPeakPower : s.stats.runPeakHeat;
  return Math.max(0, req.value - peak);
}

export function upgradeCost(id: string, m: Modifiers): number {
  return UPGRADE_BY_ID[id].cost * m.cost;
}

export function buyUpgrade(s: GameState, id: string, m?: Modifiers): boolean {
  if (!upgradeAvailable(s, id)) return false;
  const cost = upgradeCost(id, m ?? computeModifiers(s));
  if (s.money < cost) return false;
  s.money -= cost;
  s.stats.moneySpent += cost;
  s.upgrades[id] = true;
  return true;
}

export function buyAllUpgrades(s: GameState, m?: Modifiers): number {
  const mods = m ?? computeModifiers(s);
  const avail = UPGRADES.filter((u) => upgradeAvailable(s, u.id)).sort((a, b) => a.cost - b.cost);
  let n = 0;
  for (const u of avail) {
    if (buyUpgrade(s, u.id, mods)) n++;
    else break;
  }
  return n;
}

export function researchAvailable(s: GameState, id: string): boolean {
  const r = RESEARCH_BY_ID[id];
  if (!r || s.research[id]) return false;
  if (r.era > s.era) return false;
  return r.prereq.every((p) => s.research[p]);
}

export function buyResearch(s: GameState, id: string): boolean {
  if (!researchAvailable(s, id)) return false;
  const r = RESEARCH_BY_ID[id];
  if (s.rd < r.cost) return false;
  s.rd -= r.cost;
  s.research[id] = true;
  addLog(s, `🔬 Recherche terminée : ${r.name}`, 'good');
  return true;
}

export function click(s: GameState): number {
  const m = computeModifiers(s);
  const snap = computeSnapshot(s, m);
  const v = snap.clickValue;
  s.money += v;
  s.runEarned += v;
  s.totalEarned += v;
  s.stats.clicks++;
  return v;
}

// --- Ères --------------------------------------------------------------------

export function canMoveEra(s: GameState): boolean {
  if (s.era >= MAX_ERA) return false;
  const next = ERAS[s.era];
  return s.runEarned >= next.threshold && s.money >= next.moveCost;
}

export function moveEra(s: GameState): boolean {
  if (!canMoveEra(s)) return false;
  const next = eraDef(s.era + 1);
  s.money -= next.moveCost;
  s.era = next.id;
  if (s.era >= STAR_ERA) s.stars = Math.max(1, s.stars);
  addLog(s, next.id >= 7 ? `🚀 Expansion : bienvenue dans l’ère « ${next.name} » !` : `🚚 Déménagement : bienvenue dans l’ère « ${next.name} » !`, 'good');
  return true;
}

// --- Événements --------------------------------------------------------------

export function fixEventCost(s: GameState, uid: number): number {
  const ev = s.events.find((e) => e.uid === uid);
  if (!ev) return Infinity;
  const def = EVENT_BY_ID[ev.defId];
  if (!def.fixCostSeconds) return Infinity;
  const snap = computeSnapshot(s, computeModifiers(s));
  return Math.max(50, snap.revenue * def.fixCostSeconds);
}

export function fixEvent(s: GameState, uid: number): boolean {
  const cost = fixEventCost(s, uid);
  if (!isFinite(cost) || s.money < cost) return false;
  s.money -= cost;
  s.events = s.events.filter((e) => e.uid !== uid);
  addLog(s, '🔧 Incident résolu en urgence.', 'info');
  return true;
}

export function repairCost(s: GameState): number {
  const snap = computeSnapshot(s, computeModifiers(s));
  return Math.max(30, snap.revenue * 60 * s.damage);
}

export function repairNow(s: GameState): boolean {
  if (s.damage <= 0) return false;
  const c = repairCost(s);
  if (s.money < c) return false;
  s.money -= c;
  s.damage = 0;
  addLog(s, '🧰 Matériel remplacé, tout est réparé.', 'info');
  return true;
}

// --- Prestige ----------------------------------------------------------------

export function prestigeGain(s: GameState): number {
  if (s.era < PRESTIGE_MIN_ERA) return 0;
  return sharesFor(s.runEarned);
}

export function doPrestige(s: GameState): GameState | null {
  const gain = prestigeGain(s);
  if (gain <= 0) return null;
  const prestige = {
    shares: s.prestige.shares + gain,
    totalShares: s.prestige.totalShares + gain,
    count: s.prestige.count + 1,
    shop: { ...s.prestige.shop },
  };
  const ns = newGame(prestige);
  ns.totalEarned = s.totalEarned;
  ns.achievements = { ...s.achievements };
  ns.stats.playTime = s.stats.playTime;
  ns.stats.clicks = s.stats.clicks;
  ns.stats.requestsServed = s.stats.requestsServed;
  ns.stats.requestsDropped = s.stats.requestsDropped;
  ns.stats.eventsSeen = s.stats.eventsSeen;
  ns.stats.peakIncome = s.stats.peakIncome;
  ns.stats.peakReqs = s.stats.peakReqs;
  ns.settings = { ...s.settings };
  if ((prestige.shop.keepResearch ?? 0) > 0) ns.research = { ...s.research };
  addLog(ns, `🔔 Introduction en bourse ! +${gain} actions.`, 'good');
  return ns;
}

export function prestigeShopCost(s: GameState, id: string): number {
  const d = PRESTIGE_BY_ID[id];
  const lvl = s.prestige.shop[id] ?? 0;
  if (!d || lvl >= d.max) return Infinity;
  return Math.ceil(d.cost(lvl));
}

export function buyPrestigeShop(s: GameState, id: string): boolean {
  const c = prestigeShopCost(s, id);
  if (!isFinite(c) || s.prestige.shares < c) return false;
  s.prestige.shares -= c;
  s.prestige.shop[id] = (s.prestige.shop[id] ?? 0) + 1;
  return true;
}
