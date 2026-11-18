import type { GameState } from '../types';
import { tick } from './tick';

export const BASE_OFFLINE_CAP = 2 * 3600;
export const BASE_OFFLINE_EFF = 0.5;
const MAX_STEPS = 2000;

export function offlineCap(s: GameState): number {
  return BASE_OFFLINE_CAP + 2 * 3600 * (s.prestige.shop.offlineCap ?? 0);
}

export function offlineEfficiency(s: GameState): number {
  return Math.min(1, BASE_OFFLINE_EFF + 0.1 * (s.prestige.shop.offlineEff ?? 0));
}

export interface OfflineReport {
  seconds: number;
  simulated: number;
  money: number;
  requests: number;
  rd: number;
  efficiency: number;
}

/** Rattrape `seconds` de jeu hors-ligne (événements désactivés). */
export function simulateOffline(s: GameState, seconds: number): OfflineReport {
  const simulated = Math.min(seconds, offlineCap(s));
  const eff = offlineEfficiency(s);
  const before = { money: s.money, req: s.stats.requestsServed, rd: s.rd };
  if (simulated >= 1) {
    const steps = Math.min(MAX_STEPS, Math.ceil(simulated));
    const dt = simulated / steps;
    for (let i = 0; i < steps; i++) {
      tick(s, dt, { offline: true, incomeMult: eff, checkAchievements: i === steps - 1 });
    }
  }
  return {
    seconds,
    simulated,
    money: s.money - before.money,
    requests: s.stats.requestsServed - before.req,
    rd: s.rd - before.rd,
    efficiency: eff,
  };
}
