import type { GameState, Snapshot } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { computeModifiers, type Modifiers } from './modifiers';
import { computeSnapshot } from './snapshot';
import { tickEvents, type Rng } from './events';
import { addLog } from './state';
import { buyAllUpgrades } from './actions';

export interface TickOptions {
  rng?: Rng;
  /** Mode hors-ligne : pas d'événements, revenus pondérés. */
  offline?: boolean;
  incomeMult?: number;
  /** Vérifier les succès (coûteux en simulation massive). */
  checkAchievements?: boolean;
}

const UPTIME_TAU = 600; // s
const REP_TAU = 90; // s

export function tick(s: GameState, dt: number, opts: TickOptions = {}): { snap: Snapshot; mods: Modifiers } {
  const rng = opts.rng ?? Math.random;
  const mods = computeModifiers(s);
  const snap = computeSnapshot(s, mods);
  const incomeMult = opts.incomeMult ?? 1;

  // --- Argent ---
  const gross = snap.revenue * dt * incomeMult;
  const autoClickGain = snap.autoClick * snap.autoClickValue * dt * incomeMult;
  const cost = snap.elecCost * dt * incomeMult;
  const delta = gross + autoClickGain - cost;
  s.money = Math.max(0, s.money + delta);
  const earned = Math.max(0, gross + autoClickGain - cost);
  s.runEarned += earned;
  s.totalEarned += earned;
  s.rd += snap.rdRate * dt * incomeMult;

  // --- Qualité de service ---
  const quality = snap.totalDemand > 0 ? snap.totalServed / snap.totalDemand : 1;
  const ku = 1 - Math.exp(-dt / UPTIME_TAU);
  s.uptime += (quality - s.uptime) * ku;
  const repTarget = 100 * Math.pow(quality, 4) * (0.6 + 0.4 * Math.min(1, s.uptime));
  const kr = 1 - Math.exp(-dt / REP_TAU);
  s.reputation += (repTarget - s.reputation) * kr;

  // --- Réparation ---
  if (s.damage > 0) s.damage = Math.max(0, s.damage - snap.repairRate * dt);

  // --- Statistiques ---
  s.stats.requestsServed += snap.totalServed * dt;
  s.stats.requestsDropped += (snap.totalDemand - snap.totalServed) * dt;
  s.stats.playTime += dt;
  s.stats.runTime += dt;
  if (snap.net > s.stats.peakIncome) s.stats.peakIncome = snap.net;
  if (snap.totalServed > s.stats.peakReqs) s.stats.peakReqs = snap.totalServed;

  // --- Événements ---
  tickEvents(s, dt, mods, snap, rng, !opts.offline);

  // --- Achats auto ---
  if (s.settings.autoUpgrades && (s.prestige.shop.autoUpgrades ?? 0) > 0) buyAllUpgrades(s, mods);

  if (opts.checkAchievements !== false) checkAchievements(s, snap);
  return { snap, mods };
}

export function checkAchievements(s: GameState, snap: Snapshot): string[] {
  const unlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (s.achievements[a.id]) continue;
    if (a.check(s, snap)) {
      s.achievements[a.id] = s.stats.playTime;
      unlocked.push(a.id);
      addLog(s, `🏆 Succès : ${a.name}`, 'achievement');
    }
  }
  return unlocked;
}
