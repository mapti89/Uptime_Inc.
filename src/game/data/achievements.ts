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
const EARN = [1e3, 1e5, 1e7, 1e9, 1e11, 1e13, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33];
const EARN_NAMES = [
  'Argent de poche', 'Premier salaire', 'Millionnaire', 'Milliardaire', 'Licorne', 'Décacorne', 'Capitalisation absurde', 'PIB mondial',
  'Richesse orbitale', 'Trésor lunaire', 'PIB du système solaire', 'Fortune stellaire', 'Plus riche que la galaxie',
];
EARN.forEach((v, i) =>
  list.push({
    id: `earn_${i}`, icon: '💰', name: EARN_NAMES[i],
    desc: `Gagner ${v.toExponential(0).replace('e+', 'e')} $ au total.`,
    check: (s) => s.totalEarned >= v,
  }),
);

// Requêtes servies
const REQS = [1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21];
const REQ_NAMES = ['Hello World', 'Ça scale !', 'Trafic de masse', 'Internet passe par vous', 'Tout le web', 'Hello Universe', 'Le cosmos passe par vous'];
REQS.forEach((v, i) =>
  list.push({
    id: `req_${i}`, icon: '📨', name: REQ_NAMES[i],
    desc: `Servir ${v.toExponential(0).replace('e+', 'e')} requêtes.`,
    check: (s) => s.stats.requestsServed >= v,
  }),
);

// Revenu / seconde
const INC = [10, 1e3, 1e5, 1e7, 1e9, 1e11, 1e14, 1e17, 1e20, 1e23, 1e26];
INC.forEach((v, i) =>
  list.push({
    id: `inc_${i}`, icon: '📈', name: `Débit financier ${i + 1}`,
    desc: `Atteindre ${v.toExponential(0).replace('e+', 'e')} $/s de revenu net.`,
    check: (_s, snap) => snap.net >= v,
  }),
);

// Possession de bâtiments. L'infrastructure (électricité, refroidissement,
// espace) n'a que « Premier X » : on la récompense à l'usage (plus bas),
// pas à la quantité, pour ne jamais pousser à construire sans besoin.
const INFRA_CATS = new Set(['power', 'cooling', 'space']);
for (const b of BUILDINGS) {
  const infra = INFRA_CATS.has(b.cat);
  for (const n of infra ? [1] : [1, 50, 100]) {
    if (n === 1 && b.cat !== 'servers' && !infra) continue;
    list.push({
      id: `own_${b.id}_${n}`, icon: b.icon,
      name: n === 1 ? `Premier ${b.name}` : `${n} × ${b.name}`,
      desc: `Posséder ${n} ${b.name}.`,
      check: (s) => (s.owned[b.id] ?? 0) >= n,
    });
  }
}

// Infrastructure : usage réel
const wattsLabel = (w: number) =>
  w >= 1e9 ? `${w / 1e9} GW` : w >= 1e6 ? `${w / 1e6} MW` : `${w / 1e3} kW`;

const SLOTS = [100, 1_000, 5_000, 25_000, 100_000];
const SLOT_NAMES = ['Ça se remplit', 'Salle comble', 'Allées serrées', 'Hall plein à craquer', 'Ville de serveurs'];
SLOTS.forEach((v, i) =>
  list.push({
    id: `slots_${i}`, icon: '📐', name: SLOT_NAMES[i],
    desc: `Occuper ${v.toLocaleString('fr-FR')} emplacements.`,
    check: (_s, sn) => sn.slotsUsed >= v,
  }),
);

const HEAT = [1e4, 1e5, 1e6, 1e7, 1e8];
const HEAT_NAMES = ['Ça chauffe', 'Bouilloire géante', 'Chaufferie', 'Volcan domestiqué', 'Soleil en cage'];
HEAT.forEach((v, i) =>
  list.push({
    id: `heat_${i}`, icon: '♨️', name: HEAT_NAMES[i],
    desc: `Évacuer ${wattsLabel(v)} de chaleur.`,
    check: (_s, sn) => sn.heatDissipated >= v,
  }),
);

const POWER = [1e4, 1e6, 1e8];
const POWER_NAMES = ['Compteur qui tourne', 'Mégawatt', 'Ville entière'];
POWER.forEach((v, i) =>
  list.push({
    id: `power_${i}`, icon: '🔌', name: POWER_NAMES[i],
    desc: `Consommer ${wattsLabel(v)}.`,
    check: (_s, sn) => sn.consumedW >= v,
  }),
);

list.push(
  {
    id: 'tight_space', icon: '🧩', name: 'Tetris',
    desc: 'Occuper au moins 90 % de l’espace, avec au moins 1 000 emplacements utilisés.',
    check: (_s, sn) => sn.slotsUsed >= 1_000 && sn.slotsUsed >= 0.9 * sn.slotsCap,
  },
  {
    id: 'tight_cooling', icon: '🎯', name: 'Juste ce qu’il faut',
    desc: 'Évacuer au moins 1 MW de chaleur avec moins de 10 % de marge de refroidissement.',
    check: (_s, sn) => sn.heat >= 1e6 && sn.coolCap >= sn.heat && sn.coolCap <= 1.1 * sn.heat,
  },
  {
    id: 'tight_power', icon: '📏', name: 'Pile-poil',
    desc: 'Consommer au moins 1 MW avec moins de 10 % de marge électrique.',
    check: (_s, sn) => sn.totalWatts >= 1e6 && sn.powerCap >= sn.totalWatts && sn.powerCap <= 1.1 * sn.totalWatts,
  },
);

// Ères
const ERA_NAMES = [
  '', 'Startup !', 'PME', 'En colocation', 'Bâtisseur', 'Hyperscaler',
  'Décollage !', 'Maître des orbites', 'Premier pas', 'Seigneur du système solaire', 'Voyageur interstellaire', 'Empereur galactique',
];
for (let e = 2; e <= ERA_NAMES.length; e++) {
  list.push({
    id: `era_${e}`, icon: '🚚', name: ERA_NAMES[e - 1],
    desc: `Atteindre l’ère ${e}.`,
    check: (s) => s.era >= e,
  });
}

// Conquête spatiale
list.push(
  { id: 'lift_1k', icon: '🚀', name: 'Mille tonnes en orbite', desc: 'Disposer de 1 000 t de capacité d’emport.', check: (_s, sn) => sn.liftCap >= 1_000 },
  { id: 'lift_1m', icon: '🛗', name: 'Pont vers les étoiles', desc: 'Disposer d’un million de tonnes de capacité d’emport.', check: (_s, sn) => sn.liftCap >= 1e6 },
  { id: 'clean_orbit', icon: '🧹', name: 'Orbite propre', desc: 'Générer au moins 10 000 t de débris sans jamais déborder.', check: (_s, sn) => sn.debris >= 10_000 && sn.debris <= sn.cleanupCap },
  { id: 'remote_serve', icon: '🐢', name: 'Patience interplanétaire', desc: 'Servir des requêtes avec du matériel au-delà de la Lune.', check: (_s, sn) => sn.remoteSupply.cpu > 0 && (sn.served.scisim ?? 0) > 0 },
  { id: 'transit_1', icon: '🌠', name: 'Bon voyage', desc: 'Envoyer du matériel vers une autre étoile.', check: (s) => s.transit.length > 0 },
  { id: 'stars_1k', icon: '✨', name: 'Mille soleils', desc: 'Coloniser 1 000 étoiles.', check: (s) => s.stars >= 1_000 },
  { id: 'stars_1m', icon: '🌟', name: 'Amas stellaire', desc: 'Coloniser un million d’étoiles.', check: (s) => s.stars >= 1e6 },
  { id: 'stars_1b', icon: '💫', name: 'Bras spiral', desc: 'Coloniser un milliard d’étoiles.', check: (s) => s.stars >= 1e9 },
  { id: 'galaxy', icon: '🌌', name: 'Uptime galactique', desc: 'Coloniser la Voie lactée tout entière.', check: (s) => s.stars >= 1e11 },
);

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
