export interface PrestigeShopDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  max: number;
  /** Coût (en actions) du niveau `lvl` (0-indexé). */
  cost: (lvl: number) => number;
}

export const SHARE_BONUS = 0.02; // +2 % de revenus par action détenue
export const PRESTIGE_MIN_ERA = 4;

export function sharesFor(runEarned: number): number {
  return Math.floor(3 * Math.cbrt(Math.max(0, runEarned) / 1e9));
}

export const PRESTIGE_SHOP: PrestigeShopDef[] = [
  {
    id: 'seed', name: 'Capital d’amorçage', icon: '💰', max: 6,
    desc: 'Démarrer chaque partie avec 1 K$ × 30^niveau.',
    cost: (l) => 5 * Math.pow(3, l),
  },
  {
    id: 'veteran', name: 'Fondateur expérimenté', icon: '🎖️', max: 20,
    desc: '+25 % de revenus par niveau.',
    cost: (l) => 10 * Math.pow(2, l),
  },
  {
    id: 'clicker', name: 'Doigts de fée', icon: '👆', max: 10,
    desc: 'Clics ×3 par niveau.',
    cost: (l) => 3 * Math.pow(2, l),
  },
  {
    id: 'offlineCap', name: 'Astreinte', icon: '⏰', max: 11,
    desc: '+2 h de progression hors-ligne maximale par niveau.',
    cost: (l) => 4 * Math.pow(2, l),
  },
  {
    id: 'offlineEff', name: 'Ops autonomes', icon: '🌙', max: 5,
    desc: '+10 % d’efficacité hors-ligne par niveau.',
    cost: (l) => 8 * Math.pow(2.5, l),
  },
  {
    id: 'headstart', name: 'Carnet d’adresses', icon: '📇', max: 2,
    desc: 'Commencer directement à l’ère 2 (niveau 1) ou 3 (niveau 2).',
    cost: (l) => [40, 800][l] ?? Infinity,
  },
  {
    id: 'keepResearch', name: 'Brevets', icon: '📑', max: 1,
    desc: 'La recherche est conservée lors de l’introduction en bourse.',
    cost: () => 150,
  },
  {
    id: 'autoUpgrades', name: 'Assistant d’achat', icon: '🤖', max: 1,
    desc: 'Débloque l’achat automatique des améliorations.',
    cost: () => 25,
  },
  {
    id: 'cheaper', name: 'Centrale d’achat', icon: '🏷️', max: 10,
    desc: 'Tout l’équipement coûte −5 % par niveau.',
    cost: (l) => 20 * Math.pow(2.2, l),
  },
];

export const PRESTIGE_BY_ID: Record<string, PrestigeShopDef> = Object.fromEntries(
  PRESTIGE_SHOP.map((p) => [p.id, p]),
);
