// ---------------------------------------------------------------------------
// Types centraux du jeu Uptime Inc.
// ---------------------------------------------------------------------------

/** Ressources « de calcul » consommées par les requêtes. */
export type Res = 'cpu' | 'ram' | 'storage' | 'gpu' | 'bw';
export const RESOURCES: Res[] = ['cpu', 'ram', 'storage', 'gpu', 'bw'];

/** Toutes les grandeurs pouvant recevoir un multiplicateur global. */
export type Stat =
  | Res
  | 'power'
  | 'cooling'
  | 'space'
  | 'traffic'
  | 'rd'
  | 'autoClick';

export type Category =
  | 'servers'
  | 'storage'
  | 'network'
  | 'power'
  | 'cooling'
  | 'space'
  | 'sales'
  | 'staff';

export type Flag = 'ups' | 'generator' | 'antiddos' | 'solar' | 'raid';

export interface Provides {
  cpu?: number; // vCPU
  ram?: number; // Go
  storage?: number; // To
  gpu?: number; // GPU
  bw?: number; // Mb/s
  power?: number; // W disponibles
  cooling?: number; // W thermiques évacués
  space?: number; // emplacements (U)
  traffic?: number; // requêtes/s de demande
  rd?: number; // points R&D / s
  autoClick?: number; // clics / s
  repair?: number; // fraction de dégâts réparés / s
  efficiency?: number; // bonus additif d'efficacité (0.02 = +2 %)
  reliability?: number; // réduction multiplicative du risque de panne (0.05 = -5 %)
}

export interface BuildingDef {
  id: string;
  cat: Category;
  name: string;
  desc: string;
  icon: string;
  era: number;
  baseCost: number;
  growth: number;
  /** Emplacements occupés par unité. */
  slots: number;
  /** Consommation électrique par unité (W). */
  watts: number;
  provides: Provides;
  /** Surcoût énergétique du refroidissement (contribue au PUE). */
  overhead?: number;
  flags?: Flag[];
  /** Nombre max possédé (optionnel). */
  max?: number;
}

export type Effect =
  | { kind: 'buildingMult'; id: string; mult: number }
  | { kind: 'catMult'; cat: Category; mult: number }
  | { kind: 'statMult'; stat: Stat; mult: number }
  | { kind: 'priceMult'; mult: number; reqType?: string }
  | { kind: 'demandMult'; mult: number; reqType?: string }
  | { kind: 'needMult'; res: Res; mult: number }
  | { kind: 'wattsMult'; mult: number }
  | { kind: 'pueMult'; mult: number }
  | { kind: 'elecPriceMult'; mult: number }
  | { kind: 'clickMult'; mult: number }
  | { kind: 'clickIncome'; add: number }
  | { kind: 'efficiency'; add: number }
  | { kind: 'failureMult'; mult: number }
  | { kind: 'repairMult'; mult: number }
  | { kind: 'eventDurationMult'; mult: number }
  | { kind: 'flag'; flag: Flag }
  | { kind: 'sla'; level: number }
  | { kind: 'costMult'; mult: number; cat?: Category }
  | { kind: 'rdFromRequests'; add: number }
  | { kind: 'revenueMult'; mult: number };

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  cost: number;
  era: number;
  /** Bâtiment requis + quantité pour débloquer l'upgrade. */
  req?: { id: string; count: number };
  effects: Effect[];
}

export interface ResearchDef {
  id: string;
  branch: 'logiciel' | 'materiel' | 'energie' | 'reseau' | 'business';
  name: string;
  desc: string;
  icon: string;
  cost: number; // points R&D
  era: number;
  prereq: string[];
  effects: Effect[];
}

export interface RequestTypeDef {
  id: string;
  name: string;
  icon: string;
  era: number;
  price: number; // $ par requête servie
  weight: number; // part de trafic attribuée
  needs: Partial<Record<Res, number>>; // ressources par requête/s
  color: string;
}

export interface EraDef {
  id: number;
  name: string;
  short: string;
  desc: string;
  icon: string;
  /** Gains cumulés (run) requis pour déménager vers cette ère. */
  threshold: number;
  /** Coût du déménagement. */
  moveCost: number;
  base: {
    space: number;
    power: number;
    cooling: number;
    bw: number;
    traffic: number;
  };
  /** Part de référence du chiffre d'affaires consacrée à l'énergie (PUE 1,5). */
  energyShare: number;
}

export interface ActiveEvent {
  uid: number;
  defId: string;
  remaining: number;
  duration: number;
}

export interface EventEffects {
  demandMult: number;
  coolingMult: number;
  powerOutage: boolean;
  bwMult: number;
  elecPriceMult: number;
}

export interface EventDef {
  id: string;
  name: string;
  icon: string;
  era: number;
  weight: number;
  duration: number; // s (0 = instantané)
  good: boolean;
  desc: string;
  /** Peut être résolu immédiatement en payant (secondes de revenu). */
  fixCostSeconds?: number;
}

export interface LogEntry {
  t: number;
  msg: string;
  kind: 'info' | 'good' | 'bad' | 'achievement';
}

export type BuyAmount = 1 | 10 | 100 | 'max';

export interface Stats {
  requestsServed: number;
  requestsDropped: number;
  clicks: number;
  playTime: number;
  runTime: number;
  eventsSeen: number;
  peakIncome: number;
  peakReqs: number;
  moneySpent: number;
}

export interface GameState {
  version: number;
  money: number;
  runEarned: number;
  totalEarned: number;
  rd: number;
  era: number;
  owned: Record<string, number>;
  upgrades: Record<string, true>;
  research: Record<string, true>;
  achievements: Record<string, number>;
  reputation: number; // 0..100
  uptime: number; // 0..1 (moyenne glissante)
  damage: number; // 0..0.9 fraction de capacité perdue
  events: ActiveEvent[];
  nextEventIn: number;
  eventUid: number;
  log: LogEntry[];
  stats: Stats;
  prestige: {
    shares: number;
    totalShares: number;
    count: number;
    shop: Record<string, number>;
  };
  settings: {
    buyAmount: BuyAmount;
    autoUpgrades: boolean;
  };
  lastSaved: number;
}

/** Résultat du calcul d'un instant (non sauvegardé). */
export interface Snapshot {
  supply: Record<Res, number>;
  need: Record<Res, number>;
  ratio: Record<Res, number>;
  demand: Record<string, number>;
  served: Record<string, number>;
  bottleneck: Record<string, Res | null>;
  totalDemand: number;
  totalServed: number;
  revenue: number;
  elecCost: number;
  net: number;
  itWatts: number;
  totalWatts: number;
  powerCap: number;
  heat: number;
  coolCap: number;
  pue: number;
  powerFactor: number;
  coolFactor: number;
  efficiency: number;
  slotsUsed: number;
  slotsCap: number;
  traffic: number;
  rdRate: number;
  autoClick: number;
  clickValue: number;
  autoClickValue: number;
  consumedW: number;
  energyShare: number;
  repairRate: number;
  slaMult: number;
  globalMult: number;
}
