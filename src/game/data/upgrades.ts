import type { UpgradeDef } from '../types';
import { BUILDINGS, ERA_COST_SCALE } from './buildings';

// ---------------------------------------------------------------------------
// Upgrades à seuil (mécanique « posséder N exemplaires débloque un ×2 »)
// ---------------------------------------------------------------------------

const TIERS: { count: number; costMult: number; suffix: string }[] = [
  { count: 10, costMult: 100, suffix: 'I' },
  { count: 25, costMult: 2_000, suffix: 'II' },
  { count: 50, costMult: 200_000, suffix: 'III' },
  { count: 100, costMult: 1e8, suffix: 'IV' },
  { count: 150, costMult: 1e11, suffix: 'V' },
  { count: 200, costMult: 1e14, suffix: 'VI' },
  { count: 250, costMult: 1e17, suffix: 'VII' },
];

const TIER_NAMES: Record<string, string[]> = {
  servers: ['Optimisation', 'Tuning noyau', 'Firmware à jour', 'Compilation native', 'Profilage', 'Ingénierie de perf', 'Silicium sur mesure'],
  storage: ['Alignement', 'Cache SSD', 'Compression', 'Tiering', 'Erasure coding', 'Dédoublonnage global', 'Holographie'],
  network: ['Câblage propre', 'Jumbo frames', 'QoS', 'Agrégation de liens', 'Routage optimisé', 'Optique cohérente', 'Photonique'],
  power: ['Répartition des phases', 'Câbles dimensionnés', 'Rendement 80+ Platinum', 'Distribution 48 V DC', 'Smart grid', 'Supraconducteurs', 'Énergie du point zéro'],
  cooling: ['Gestion des flux', 'Obturateurs de baie', 'Allées confinées', 'Consignes relevées', 'Récupération de chaleur', 'Fluides avancés', 'Cryogénie'],
  sales: ['Plaquette', 'Témoignages clients', 'Programme de parrainage', 'Account managers', 'Marque forte', 'Lobbying', 'Hégémonie'],
};

function tierUpgrades(): UpgradeDef[] {
  const list: UpgradeDef[] = [];
  for (const b of BUILDINGS) {
    const names = TIER_NAMES[b.cat];
    if (!names) continue;
    TIERS.forEach((t, i) => {
      list.push({
        id: `${b.id}_t${i + 1}`,
        name: `${names[i]} ${t.suffix}`,
        desc: `${b.name} : production ×2.`,
        icon: b.icon,
        cost: b.baseCost * t.costMult,
        era: b.era,
        req: { id: b.id, count: t.count },
        effects: [{ kind: 'buildingMult', id: b.id, mult: 2 }],
      });
    });
  }
  return list;
}

// ---------------------------------------------------------------------------
// Upgrades nommés (effets globaux)
// ---------------------------------------------------------------------------

const NAMED: UpgradeDef[] = [
  // --- Clic ---
  { id: 'mouse', name: 'Souris gaming', icon: '🖱️', era: 1, cost: 50, desc: 'Clics ×2.', effects: [{ kind: 'clickMult', mult: 2 }] },
  { id: 'keyboard', name: 'Clavier mécanique', icon: '⌨️', era: 1, cost: 600, desc: 'Clics ×2.', effects: [{ kind: 'clickMult', mult: 2 }] },
  { id: 'bash', name: 'Scripts Bash', icon: '📜', era: 1, cost: 4_000, desc: 'Chaque clic rapporte en plus 2 % du revenu/s.', effects: [{ kind: 'clickIncome', add: 0.02 }] },
  { id: 'ansible', name: 'Playbooks Ansible', icon: '📘', era: 2, cost: 150_000, desc: 'Chaque clic rapporte en plus 3 % du revenu/s.', effects: [{ kind: 'clickIncome', add: 0.03 }] },
  { id: 'terraform', name: 'Infra as Code', icon: '🏗️', era: 3, cost: 20_000_000, desc: 'Chaque clic rapporte en plus 5 % du revenu/s. Clics ×3.', effects: [{ kind: 'clickIncome', add: 0.05 }, { kind: 'clickMult', mult: 3 }] },

  // --- Efficacité réseau / ressources ---
  { id: 'gzip', name: 'Compression gzip', icon: '🗜️', era: 1, cost: 300, desc: 'Besoin en bande passante −25 %.', effects: [{ kind: 'needMult', res: 'bw', mult: 0.75 }] },
  { id: 'overclock', name: 'Overclocking', icon: '🔥', era: 1, cost: 2_500, desc: 'CPU ×1,25 mais consommation ×1,1.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.25 }, { kind: 'wattsMult', mult: 1.1 }] },
  { id: 'cablemgmt', name: 'Rangement des câbles', icon: '🧶', era: 1, cost: 1_200, desc: 'Le flux d’air respire : refroidissement ×1,25.', effects: [{ kind: 'statMult', stat: 'cooling', mult: 1.25 }] },
  { id: 'offpeak', name: 'Tarif heures creuses', icon: '🌙', era: 1, cost: 3_000, desc: 'Prix de l’électricité −20 %.', effects: [{ kind: 'elecPriceMult', mult: 0.8 }] },
  { id: 'nginx', name: 'Nginx en reverse proxy', icon: '🟩', era: 1, cost: 8_000, desc: 'Besoin CPU −20 %.', effects: [{ kind: 'needMult', res: 'cpu', mult: 0.8 }] },
  { id: 'virtualization', name: 'Virtualisation (KVM)', icon: '🪟', era: 2, cost: 40_000, desc: 'CPU ×1,25, RAM ×1,2.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.25 }, { kind: 'statMult', stat: 'ram', mult: 1.2 }] },
  { id: 'redis', name: 'Cache Redis', icon: '🟥', era: 2, cost: 90_000, desc: 'Besoin CPU −20 % et RAM −10 %.', effects: [{ kind: 'needMult', res: 'cpu', mult: 0.8 }, { kind: 'needMult', res: 'ram', mult: 0.9 }] },
  { id: 'docker', name: 'Conteneurs Docker', icon: '🐳', era: 2, cost: 300_000, desc: 'CPU ×1,25, RAM ×1,25.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.25 }, { kind: 'statMult', stat: 'ram', mult: 1.25 }] },
  { id: 'monitoring', name: 'Monitoring Grafana', icon: '📊', era: 2, cost: 120_000, desc: 'Efficacité +5 %, réparation ×1,5.', effects: [{ kind: 'efficiency', add: 0.05 }, { kind: 'repairMult', mult: 1.5 }] },
  { id: 'waf', name: 'Pare-feu applicatif', icon: '🧱', era: 2, cost: 250_000, desc: 'Protection anti-DDoS de base.', effects: [{ kind: 'flag', flag: 'antiddos' }] },
  { id: 'brotli', name: 'Brotli + HTTP/3', icon: '🚀', era: 3, cost: 4_000_000, desc: 'Besoin en bande passante −30 %.', effects: [{ kind: 'needMult', res: 'bw', mult: 0.7 }] },
  { id: 'dedup', name: 'Déduplication', icon: '♻️', era: 3, cost: 6_000_000, desc: 'Besoin en stockage −40 %.', effects: [{ kind: 'needMult', res: 'storage', mult: 0.6 }] },
  { id: 'hotaisle', name: 'Confinement allée chaude', icon: '🚧', era: 3, cost: 10_000_000, desc: 'PUE : surcoût du refroidissement −25 %.', effects: [{ kind: 'pueMult', mult: 0.75 }] },
  { id: 'eccram', name: 'RAM ECC partout', icon: '🧠', era: 3, cost: 25_000_000, desc: 'RAM ×1,25, pannes −15 %.', effects: [{ kind: 'statMult', stat: 'ram', mult: 1.25 }, { kind: 'failureMult', mult: 0.85 }] },
  { id: 'loadbalancer', name: 'Load balancers', icon: '⚖️', era: 3, cost: 60_000_000, desc: 'Efficacité +10 %.', effects: [{ kind: 'efficiency', add: 0.1 }] },
  { id: 'hvdc', name: 'Distribution HVDC', icon: '🔋', era: 4, cost: 600_000_000, desc: 'Consommation des serveurs −15 %.', effects: [{ kind: 'wattsMult', mult: 0.85 }] },
  { id: 'ppa', name: 'Contrat PPA vert', icon: '📃', era: 4, cost: 1_500_000_000, desc: 'Prix de l’électricité −30 %.', effects: [{ kind: 'elecPriceMult', mult: 0.7 }] },
  { id: 'anycast', name: 'Anycast', icon: '📡', era: 4, cost: 3_000_000_000, desc: 'Bande passante ×1,5.', effects: [{ kind: 'statMult', stat: 'bw', mult: 1.5 }] },
  { id: 'heatreuse', name: 'Réseau de chaleur urbain', icon: '♨️', era: 5, cost: 80_000_000_000, desc: 'Vous revendez votre chaleur : électricité −25 %, PUE −20 %.', effects: [{ kind: 'elecPriceMult', mult: 0.75 }, { kind: 'pueMult', mult: 0.8 }] },
  { id: 'customasic', name: 'ASIC maison', icon: '🔧', era: 5, cost: 250_000_000_000, desc: 'GPU ×1,5.', effects: [{ kind: 'statMult', stat: 'gpu', mult: 1.5 }] },
  { id: 'chiplet', name: 'Chiplets 2 nm', icon: '🔬', era: 6, cost: 4e13, desc: 'CPU ×1,5, consommation −20 %.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.5 }, { kind: 'wattsMult', mult: 0.8 }] },

  // --- Prix / offres ---
  { id: 'premium', name: 'Offre Premium', icon: '💎', era: 1, cost: 2_000, desc: 'Prix de toutes les requêtes ×1,25.', effects: [{ kind: 'priceMult', mult: 1.25 }] },
  { id: 'letsencrypt', name: 'HTTPS gratuit', icon: '🔐', era: 1, cost: 700, desc: 'Sites statiques ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'static' }] },
  { id: 'wordpress', name: 'WordPress managé', icon: '🅦', era: 1, cost: 5_000, desc: 'Blogs ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'blog' }] },
  { id: 'apigw', name: 'API Gateway', icon: '🚪', era: 2, cost: 80_000, desc: 'API ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'api' }] },
  { id: 'dbaas', name: 'Base de données managée', icon: '🐘', era: 2, cost: 200_000, desc: 'Bases de données ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'db' }] },
  { id: 'usagebilling', name: 'Facturation à l’usage', icon: '🧾', era: 2, cost: 400_000, desc: 'Prix ×1,25.', effects: [{ kind: 'priceMult', mult: 1.25 }] },
  { id: 's3api', name: 'API compatible S3', icon: '🪣', era: 3, cost: 8_000_000, desc: 'Sauvegardes ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'backup' }] },
  { id: 'pcidss', name: 'Certification PCI-DSS', icon: '💳', era: 3, cost: 30_000_000, desc: 'E-commerce ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'ecommerce' }] },
  { id: 'support247', name: 'Support 24/7', icon: '☎️', era: 3, cost: 50_000_000, desc: 'Prix ×1,25.', effects: [{ kind: 'priceMult', mult: 1.25 }] },
  { id: 'iso27001', name: 'ISO 27001', icon: '📜', era: 4, cost: 800_000_000, desc: 'Prix ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5 }] },
  { id: 'transcoding', name: 'Transcodage matériel', icon: '🎞️', era: 4, cost: 2_000_000_000, desc: 'Streaming ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'streaming' }] },
  { id: 'secnumcloud', name: 'Qualification SecNumCloud', icon: '🛡️', era: 5, cost: 100_000_000_000, desc: 'Prix ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5 }] },
  { id: 'llmserving', name: 'Serving LLM optimisé', icon: '💬', era: 5, cost: 300_000_000_000, desc: 'Inférence IA ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'inference' }] },
  { id: 'frontier', name: 'Contrats modèles frontière', icon: '🏔️', era: 6, cost: 2e13, desc: 'Entraînement IA ×1,5.', effects: [{ kind: 'priceMult', mult: 1.5, reqType: 'training' }] },
  { id: 'monopoly', name: 'Position dominante', icon: '👑', era: 6, cost: 1e15, desc: 'Prix ×2.', effects: [{ kind: 'priceMult', mult: 2 }] },
];

export const UPGRADES: UpgradeDef[] = [
  ...NAMED.map((u) => ({ ...u, cost: u.cost * ERA_COST_SCALE[u.era - 1] })),
  ...tierUpgrades(),
];

export const UPGRADE_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);
