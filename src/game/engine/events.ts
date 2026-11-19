import type { GameState, Snapshot } from '../types';
import { EVENTS, EVENT_BY_ID } from '../data/events';
import type { Modifiers } from './modifiers';
import { failureFactor } from './snapshot';
import { addLog } from './state';

export type Rng = () => number;

const MIN_GAP = 70;
const MAX_GAP = 200;

function pickEvent(s: GameState, m: Modifiers, snap: Snapshot, rng: Rng) {
  const ff = failureFactor(s, m);
  const pool = EVENTS.filter((e) => e.era <= s.era && !s.events.some((a) => a.defId === e.id));
  // Les collisions en cascade dépendent de la saturation en débris.
  const debrisLoad = snap.cleanupCap > 0 ? snap.debris / snap.cleanupCap : 0;
  const weights = pool.map((e) => {
    if (e.id === 'kessler') return e.weight * ff * Math.min(6, debrisLoad * debrisLoad);
    return e.good ? e.weight : e.weight * ff;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/** Déclenche immédiatement un événement donné. */
export function triggerEvent(s: GameState, id: string, m: Modifiers, snap: Snapshot): void {
  const def = EVENT_BY_ID[id];
  if (!def) return;
  s.stats.eventsSeen++;
  const raid = m.flags.has('raid');
  switch (id) {
    case 'disk':
      s.damage = Math.min(0.9, s.damage + (raid ? 0.075 : 0.15));
      break;
    case 'acleak':
      s.damage = Math.min(0.9, s.damage + 0.05);
      break;
    case 'solarflare':
      s.damage = Math.min(0.9, s.damage + 0.1);
      break;
    case 'investor':
      s.money += Math.max(100, snap.net * 90);
      break;
    case 'launchwindow':
      s.money += Math.max(100, snap.net * 120);
      break;
    case 'launchfail':
      s.damage = Math.min(0.9, s.damage + 0.08);
      break;
    case 'kessler':
      s.damage = Math.min(0.9, s.damage + 0.15);
      break;
    case 'moonquake':
      s.damage = Math.min(0.9, s.damage + 0.06);
      break;
    case 'supernova':
      s.damage = Math.min(0.9, s.damage + 0.1);
      break;
    case 'audit':
      s.reputation = Math.min(100, s.reputation + 10);
      break;
  }
  let mitigated = '';
  if (id === 'outage' && m.flags.has('generator')) mitigated = ' (le groupe électrogène prend le relais)';
  else if (id === 'outage' && m.flags.has('ups')) mitigated = ' (l’onduleur limite la casse)';
  if (id === 'ddos' && m.flags.has('antiddos')) mitigated = ' (attaque absorbée)';
  if (id === 'disk' && raid) mitigated = ' (le RAID limite la casse)';
  if (def.duration > 0) {
    const duration = def.good ? def.duration : def.duration * m.eventDuration;
    s.events.push({ uid: s.eventUid++, defId: id, remaining: duration, duration });
  }
  addLog(s, `${def.icon} ${def.name}${mitigated}`, def.good ? 'good' : 'bad');
}

export function tickEvents(s: GameState, dt: number, m: Modifiers, snap: Snapshot, rng: Rng, allowNew: boolean): void {
  for (const ev of s.events) ev.remaining -= dt;
  s.events = s.events.filter((e) => e.remaining > 0);
  if (!allowNew) return;
  s.nextEventIn -= dt;
  if (s.nextEventIn <= 0) {
    s.nextEventIn = MIN_GAP + rng() * (MAX_GAP - MIN_GAP);
    // Pas d'événement tant que le joueur démarre à peine
    if (s.stats.runTime < 120) return;
    const def = pickEvent(s, m, snap, rng);
    if (def) triggerEvent(s, def.id, m, snap);
  }
}
