import type { GameState, LogEntry } from '../types';

export const SAVE_VERSION = 5;

export function newGame(prev?: GameState['prestige']): GameState {
  const prestige = prev
    ? { ...prev, shop: { ...prev.shop } }
    : { shares: 0, totalShares: 0, count: 0, shop: {} as Record<string, number> };
  const seedLvl = prestige.shop.seed ?? 0;
  const head = prestige.shop.headstart ?? 0;
  return {
    version: SAVE_VERSION,
    money: seedLvl > 0 ? 1000 * Math.pow(30, seedLvl) : 0,
    runEarned: 0,
    totalEarned: 0,
    rd: 0,
    era: 1 + head,
    owned: { pi: 1 },
    upgrades: {},
    research: {},
    achievements: {},
    reputation: 50,
    uptime: 1,
    damage: 0,
    events: [],
    nextEventIn: 150,
    eventUid: 1,
    log: [],
    stats: {
      requestsServed: 0,
      requestsDropped: 0,
      clicks: 0,
      playTime: 0,
      runTime: 0,
      eventsSeen: 0,
      peakIncome: 0,
      peakReqs: 0,
      moneySpent: 0,
      runPeakPower: 0,
      runPeakHeat: 0,
    },
    prestige,
    settings: { buyAmount: 1, autoUpgrades: false, tutorial: true, tutoSeen: {} },
    lastSaved: Date.now(),
    transit: [],
    stars: 0,
  };
}

export function addLog(s: GameState, msg: string, kind: LogEntry['kind'] = 'info'): void {
  s.log.unshift({ t: s.stats.playTime, msg, kind });
  if (s.log.length > 60) s.log.length = 60;
}
