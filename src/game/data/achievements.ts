import type { GameState, Snapshot } from '../types';
import { BUILDINGS } from './buildings';
import { RESEARCH } from './research';

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  check: (s: GameState, snap: Snapshot) => boolean;
}

export const ACHIEVEMENT_BONUS = 0.01; // +1 % de revenus chacun

const list: AchievementDef[] = [];

// Argent gagné au total
const EARN = [1e3, 1e5, 1e7, 1e9, 1e11, 1e13, 1e15, 1e18];
const EARN_NAMES = ['Argent de poche', 'Premier salaire', 'Millionnaire', 'Milliardaire', 'Licorne', 'Décacorne', 'Capitalisation absurde', 'PIB mondial'];
EARN.forEach((v, i) =>
  list.push({
    id: `earn_${i}`, icon: '💰', name: EARN_NAMES[i],
    desc: `Gagner ${v.toExponential(0).replace('e+', 'e')} $ au total.`,
    check: (s) => s.totalEarned >= v,
  }),
);

// Requêtes servies
const REQS = [1e3, 1e6, 1e9, 1e12, 1e15];
const REQ_NAMES = ['Hello World', 'Ça scale !', 'Trafic de masse', 'Internet passe par vous', 'Tout le web'];
REQS.forEach((v, i) =>
  list.push({
    id: `req_${i}`, icon: '📨', name: REQ_NAMES[i],
    desc: `Servir ${v.toExponential(0).replace('e+', 'e')} requêtes.`,
    check: (s) => s.stats.requestsServed >= v,
  }),
);

// Revenu / seconde
const INC = [10, 1e3, 1e5, 1e7, 1e9, 1e11];
INC.forEach((v, i) =>
  list.push({
    id: `inc_${i}`, icon: '📈', name: `Débit financier ${i + 1}`,
    desc: `Atteindre ${v.toExponential(0).replace('e+', 'e')} $/s de revenu net.`,
    check: (_s, snap) => snap.net >= v,
  }),
);

// Possession de bâtiments
for (const b of BUILDINGS) {
  for (const n of [1, 50, 100]) {
    if (n === 1 && b.cat !== 'servers') continue;
    list.push({
      id: `own_${b.id}_${n}`, icon: b.icon,
      name: n === 1 ? `Premier ${b.name}` : `${n} × ${b.name}`,
      desc: `Posséder ${n} ${b.name}.`,
      check: (s) => (s.owned[b.id] ?? 0) >= n,
    });
  }
}

// Ères
const ERA_NAMES = ['', 'Startup !', 'PME', 'En colocation', 'Bâtisseur', 'Hyperscaler'];
for (let e = 2; e <= 6; e++) {
  list.push({
    id: `era_${e}`, icon: '🚚', name: ERA_NAMES[e - 1],
    desc: `Atteindre l’ère ${e}.`,
    check: (s) => s.era >= e,
  });
}

// Divers
list.push(
  { id: 'click_100', icon: '👆', name: 'Cliqueur', desc: 'Cliquer 100 fois.', check: (s) => s.stats.clicks >= 100 },
  { id: 'click_5000', icon: '🖐️', name: 'Tendinite', desc: 'Cliquer 5 000 fois.', check: (s) => s.stats.clicks >= 5000 },
  { id: 'uptime_99', icon: '🟢', name: 'Deux neufs', desc: 'Uptime ≥ 99 %.', check: (s) => s.uptime >= 0.99 && s.stats.runTime > 300 },
  { id: 'uptime_9999', icon: '💚', name: 'Quatre neufs', desc: 'Uptime ≥ 99,99 %.', check: (s) => s.uptime >= 0.9999 && s.stats.runTime > 900 },
  { id: 'rep_100', icon: '⭐', name: 'Réputation parfaite', desc: 'Réputation ≥ 99.', check: (s) => s.reputation >= 99 },
  { id: 'pue_15', icon: '🌿', name: 'Éco-responsable', desc: 'PUE ≤ 1,5 avec au moins 100 kW.', check: (_s, sn) => sn.pue <= 1.5 && sn.itWatts >= 100_000 },
  { id: 'pue_12', icon: '🍃', name: 'Green IT', desc: 'PUE ≤ 1,2 avec au moins 10 MW.', check: (_s, sn) => sn.pue <= 1.2 && sn.itWatts >= 10_000_000 },
  { id: 'gw', icon: '⚡', name: 'Gigawatt !', desc: 'Consommer 1 GW.', check: (_s, sn) => sn.totalWatts >= 1e9 },
  { id: 'overheat', icon: '🔥', name: 'Ça sent le chaud', desc: 'Subir une surchauffe (refroidissement < 50 %).', check: (_s, sn) => sn.coolFactor < 0.5 },
  { id: 'events_25', icon: '🎲', name: 'Vétéran des incidents', desc: 'Vivre 25 événements.', check: (s) => s.stats.eventsSeen >= 25 },
  { id: 'research_all', icon: '🎓', name: 'Prix Turing', desc: 'Terminer tout l’arbre de recherche.', check: (s) => Object.keys(s.research).length >= RESEARCH.length },
  { id: 'ipo_1', icon: '🔔', name: 'Introduction en bourse', desc: 'Faire une première introduction en bourse.', check: (s) => s.prestige.count >= 1 },
  { id: 'ipo_5', icon: '🏛️', name: 'Serial entrepreneur', desc: 'Faire 5 introductions en bourse.', check: (s) => s.prestige.count >= 5 },
  { id: 'gpu_1000', icon: '🎮', name: 'Ferme de GPU', desc: 'Disposer de 1 000 GPU.', check: (_s, sn) => sn.supply.gpu >= 1000 },
  { id: 'ai_training', icon: '🧠', name: 'Frontier lab', desc: 'Servir des requêtes d’entraînement IA.', check: (_s, sn) => (sn.served.training ?? 0) > 0 },
);

export const ACHIEVEMENTS = list;
export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(list.map((a) => [a.id, a]));
