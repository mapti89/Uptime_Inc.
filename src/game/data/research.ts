import type { ResearchDef } from '../types';

export const BRANCHES: { id: ResearchDef['branch']; name: string; icon: string }[] = [
  { id: 'logiciel', name: 'Logiciel', icon: '💻' },
  { id: 'materiel', name: 'Matériel', icon: '🔩' },
  { id: 'energie', name: 'Énergie', icon: '⚡' },
  { id: 'reseau', name: 'Réseau', icon: '🌐' },
  { id: 'business', name: 'Business', icon: '💼' },
];

export const RESEARCH: ResearchDef[] = [
  // --- Logiciel ---
  { id: 'linux', branch: 'logiciel', name: 'Linux tuning', icon: '🐧', era: 2, cost: 25, prereq: [], desc: 'CPU ×1,1.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.1 }] },
  { id: 'ci', branch: 'logiciel', name: 'Intégration continue', icon: '🔁', era: 2, cost: 120, prereq: ['linux'], desc: 'Efficacité +5 %, le trafic servi génère de la R&D.', effects: [{ kind: 'efficiency', add: 0.05 }, { kind: 'rdFromRequests', add: 0.01 }] },
  { id: 'k8s', branch: 'logiciel', name: 'Kubernetes', icon: '☸️', era: 3, cost: 900, prereq: ['ci'], desc: 'CPU ×1,25, RAM ×1,25.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.25 }, { kind: 'statMult', stat: 'ram', mult: 1.25 }] },
  { id: 'servicemesh', branch: 'logiciel', name: 'Service mesh', icon: '🕸️', era: 4, cost: 8_000, prereq: ['k8s'], desc: 'Efficacité +10 %.', effects: [{ kind: 'efficiency', add: 0.1 }] },
  { id: 'serverless', branch: 'logiciel', name: 'Serverless', icon: 'λ', era: 4, cost: 40_000, prereq: ['servicemesh'], desc: 'Besoins CPU et RAM −30 %.', effects: [{ kind: 'needMult', res: 'cpu', mult: 0.7 }, { kind: 'needMult', res: 'ram', mult: 0.7 }] },
  { id: 'wasm', branch: 'logiciel', name: 'WebAssembly en edge', icon: '🧩', era: 5, cost: 400_000, prereq: ['serverless'], desc: 'CPU ×1,5.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.5 }] },
  { id: 'agi', branch: 'logiciel', name: 'Ordonnanceur autonome', icon: '🧠', era: 6, cost: 2e7, prereq: ['wasm'], desc: 'Efficacité +25 %, revenus ×1,5.', effects: [{ kind: 'efficiency', add: 0.25 }, { kind: 'revenueMult', mult: 1.5 }] },

  // --- Matériel ---
  { id: 'ssd', branch: 'materiel', name: 'SSD partout', icon: '💿', era: 2, cost: 40, prereq: [], desc: 'Stockage ×1,25.', effects: [{ kind: 'statMult', stat: 'storage', mult: 1.25 }] },
  { id: 'ddr5', branch: 'materiel', name: 'DDR5', icon: '🧮', era: 2, cost: 200, prereq: ['ssd'], desc: 'RAM ×1,25.', effects: [{ kind: 'statMult', stat: 'ram', mult: 1.25 }] },
  { id: 'armchips', branch: 'materiel', name: 'Puces ARM', icon: '🦾', era: 3, cost: 1_500, prereq: ['ddr5'], desc: 'Consommation des serveurs −20 %.', effects: [{ kind: 'wattsMult', mult: 0.8 }] },
  { id: 'nvmeof', branch: 'materiel', name: 'NVMe over Fabrics', icon: '⚡', era: 4, cost: 12_000, prereq: ['armchips'], desc: 'Stockage ×1,5.', effects: [{ kind: 'statMult', stat: 'storage', mult: 1.5 }] },
  { id: 'hbm', branch: 'materiel', name: 'Mémoire HBM', icon: '🧊', era: 5, cost: 150_000, prereq: ['nvmeof'], desc: 'GPU ×1,25, RAM ×1,25.', effects: [{ kind: 'statMult', stat: 'gpu', mult: 1.25 }, { kind: 'statMult', stat: 'ram', mult: 1.25 }] },
  { id: 'photonic', branch: 'materiel', name: 'Calcul photonique', icon: '🔆', era: 6, cost: 1e7, prereq: ['hbm'], desc: 'GPU ×2, consommation −25 %.', effects: [{ kind: 'statMult', stat: 'gpu', mult: 2 }, { kind: 'wattsMult', mult: 0.75 }] },

  // --- Énergie ---
  { id: 'pdu', branch: 'energie', name: 'PDU intelligents', icon: '🔌', era: 2, cost: 30, prereq: [], desc: 'Capacité électrique ×1,25.', effects: [{ kind: 'statMult', stat: 'power', mult: 1.25 }] },
  { id: 'cfd', branch: 'energie', name: 'Simulation thermique CFD', icon: '🌡️', era: 2, cost: 150, prereq: ['pdu'], desc: 'Refroidissement ×1,3.', effects: [{ kind: 'statMult', stat: 'cooling', mult: 1.3 }] },
  { id: 'battery', branch: 'energie', name: 'Stockage batterie', icon: '🔋', era: 3, cost: 1_200, prereq: ['cfd'], desc: 'Protection contre les coupures, électricité −10 %.', effects: [{ kind: 'flag', flag: 'ups' }, { kind: 'elecPriceMult', mult: 0.9 }] },
  { id: 'pue', branch: 'energie', name: 'Chasse au PUE', icon: '📉', era: 3, cost: 4_000, prereq: ['battery'], desc: 'Surcoût du refroidissement −30 %.', effects: [{ kind: 'pueMult', mult: 0.7 }] },
  { id: 'adiabatic', branch: 'energie', name: 'Refroidissement adiabatique', icon: '💦', era: 4, cost: 30_000, prereq: ['pue'], desc: 'Refroidissement ×1,5, canicules raccourcies.', effects: [{ kind: 'statMult', stat: 'cooling', mult: 1.5 }, { kind: 'eventDurationMult', mult: 0.8 }] },
  { id: 'microgrid', branch: 'energie', name: 'Micro-réseau', icon: '🕸️', era: 5, cost: 300_000, prereq: ['adiabatic'], desc: 'Capacité électrique ×1,5, électricité −20 %.', effects: [{ kind: 'statMult', stat: 'power', mult: 1.5 }, { kind: 'elecPriceMult', mult: 0.8 }] },
  { id: 'superconductor', branch: 'energie', name: 'Supraconducteurs', icon: '🧲', era: 6, cost: 1.5e7, prereq: ['microgrid'], desc: 'Capacité électrique ×2, refroidissement ×2.', effects: [{ kind: 'statMult', stat: 'power', mult: 2 }, { kind: 'statMult', stat: 'cooling', mult: 2 }] },

  // --- Réseau ---
  { id: 'ipv6', branch: 'reseau', name: 'IPv6', icon: '6️⃣', era: 2, cost: 35, prereq: [], desc: 'Bande passante ×1,25.', effects: [{ kind: 'statMult', stat: 'bw', mult: 1.25 }] },
  { id: 'quic', branch: 'reseau', name: 'QUIC', icon: '🏎️', era: 2, cost: 180, prereq: ['ipv6'], desc: 'Besoin en bande passante −15 %.', effects: [{ kind: 'needMult', res: 'bw', mult: 0.85 }] },
  { id: 'ddosscrub', branch: 'reseau', name: 'Nettoyage anti-DDoS', icon: '🧹', era: 3, cost: 1_000, prereq: ['quic'], desc: 'Immunité aux DDoS.', effects: [{ kind: 'flag', flag: 'antiddos' }] },
  { id: 'edge', branch: 'reseau', name: 'Edge computing', icon: '📍', era: 4, cost: 15_000, prereq: ['ddosscrub'], desc: 'Bande passante ×2.', effects: [{ kind: 'statMult', stat: 'bw', mult: 2 }] },
  { id: 'sdn', branch: 'reseau', name: 'SDN', icon: '🎚️', era: 5, cost: 200_000, prereq: ['edge'], desc: 'Bande passante ×2, efficacité +5 %.', effects: [{ kind: 'statMult', stat: 'bw', mult: 2 }, { kind: 'efficiency', add: 0.05 }] },
  { id: 'quantumnet', branch: 'reseau', name: 'Réseau quantique', icon: '🔗', era: 6, cost: 1.2e7, prereq: ['sdn'], desc: 'Bande passante ×3.', effects: [{ kind: 'statMult', stat: 'bw', mult: 3 }] },

  // --- Business ---
  { id: 'sla999', branch: 'business', name: 'SLA 99,9 %', icon: '🥉', era: 2, cost: 60, prereq: [], desc: 'Bonus de prix +20 % si uptime ≥ 99,9 % (+10 % si ≥ 99 %).', effects: [{ kind: 'sla', level: 1 }] },
  { id: 'growthhack', branch: 'business', name: 'Growth hacking', icon: '📈', era: 2, cost: 250, prereq: ['sla999'], desc: 'Demande ×1,5.', effects: [{ kind: 'demandMult', mult: 1.5 }] },
  { id: 'sla9999', branch: 'business', name: 'SLA 99,99 %', icon: '🥈', era: 3, cost: 2_000, prereq: ['growthhack'], desc: 'Bonus +50 % si uptime ≥ 99,99 %.', effects: [{ kind: 'sla', level: 2 }] },
  { id: 'brand', branch: 'business', name: 'Image de marque', icon: '🏷️', era: 4, cost: 20_000, prereq: ['sla9999'], desc: 'Demande ×1,5, prix ×1,25.', effects: [{ kind: 'demandMult', mult: 1.5 }, { kind: 'priceMult', mult: 1.25 }] },
  { id: 'sla99999', branch: 'business', name: 'SLA 99,999 %', icon: '🥇', era: 5, cost: 250_000, prereq: ['brand'], desc: 'Bonus +100 % si uptime ≥ 99,999 %.', effects: [{ kind: 'sla', level: 3 }] },
  { id: 'ecosystem', branch: 'business', name: 'Écosystème', icon: '🌳', era: 6, cost: 1e7, prereq: ['sla99999'], desc: 'Demande ×3, revenus ×1,5.', effects: [{ kind: 'demandMult', mult: 3 }, { kind: 'revenueMult', mult: 1.5 }] },
  // --- Conquête spatiale (ères 7 à 12) ---
  { id: 'radsoft', branch: 'logiciel', name: 'Logiciel tolérant aux radiations', icon: '☢️', era: 7, cost: 3e8, prereq: ['agi'], desc: 'Pannes −30 %, efficacité +10 %.', effects: [{ kind: 'failureMult', mult: 0.7 }, { kind: 'efficiency', add: 0.1 }] },
  { id: 'swarmos', branch: 'logiciel', name: 'OS d’essaim', icon: '🐝', era: 8, cost: 6e9, prereq: ['radsoft'], desc: 'Efficacité +25 %.', effects: [{ kind: 'efficiency', add: 0.25 }] },
  { id: 'dtn', branch: 'logiciel', name: 'Réseau tolérant aux délais', icon: '📨', era: 9, cost: 1.2e11, prereq: ['swarmos'], desc: 'Besoin en bande passante −30 %, revenus ×1,5.', effects: [{ kind: 'needMult', res: 'bw', mult: 0.7 }, { kind: 'revenueMult', mult: 1.5 }] },
  { id: 'predictcache', branch: 'logiciel', name: 'Cache prédictif interplanétaire', icon: '🔮', era: 10, cost: 2.5e12, prereq: ['dtn'], desc: '25 % de la capacité lointaine sert aussi les requêtes temps réel.', effects: [{ kind: 'latencyBridge', add: 0.25 }] },
  { id: 'selfrep', branch: 'logiciel', name: 'Code auto-réplicant', icon: '🧬', era: 11, cost: 5e13, prereq: ['predictcache'], desc: 'Colonisation ×1,5, efficacité +25 %.', effects: [{ kind: 'statMult', stat: 'replication', mult: 1.5 }, { kind: 'efficiency', add: 0.25 }] },
  { id: 'universalcalc', branch: 'logiciel', name: 'Calcul universel', icon: '♾️', era: 12, cost: 1e15, prereq: ['selfrep'], desc: 'Revenus ×2, colonisation ×1,5.', effects: [{ kind: 'revenueMult', mult: 2 }, { kind: 'statMult', stat: 'replication', mult: 1.5 }] },

  { id: 'radchips', branch: 'materiel', name: 'Puces durcies', icon: '🛡️', era: 7, cost: 3e8, prereq: ['photonic'], desc: 'CPU ×1,5, GPU ×1,5.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 1.5 }, { kind: 'statMult', stat: 'gpu', mult: 1.5 }] },
  { id: 'miniaturize', branch: 'materiel', name: 'Miniaturisation', icon: '🔬', era: 8, cost: 6e9, prereq: ['radchips'], desc: 'Masse des équipements spatiaux −25 %.', effects: [{ kind: 'massMult', mult: 0.75 }] },
  { id: 'regolith', branch: 'materiel', name: 'Impression 3D en régolithe', icon: '🖨️', era: 9, cost: 1.2e11, prereq: ['miniaturize'], desc: 'Programme spatial −30 %, masse −20 %.', effects: [{ kind: 'costMult', cat: 'orbit', mult: 0.7 }, { kind: 'massMult', mult: 0.8 }] },
  { id: 'asteroidmining', branch: 'materiel', name: 'Minage d’astéroïdes', icon: '⛏️', era: 10, cost: 2.5e12, prereq: ['regolith'], desc: 'Tout l’équipement coûte −30 %.', effects: [{ kind: 'costMult', mult: 0.7 }] },
  { id: 'computronium', branch: 'materiel', name: 'Computronium', icon: '🧱', era: 11, cost: 5e13, prereq: ['asteroidmining'], desc: 'CPU ×2, GPU ×2.', effects: [{ kind: 'statMult', stat: 'cpu', mult: 2 }, { kind: 'statMult', stat: 'gpu', mult: 2 }] },
  { id: 'strangematter', branch: 'materiel', name: 'Matière étrange', icon: '🟣', era: 12, cost: 1e15, prereq: ['computronium'], desc: 'RAM ×3, stockage ×3.', effects: [{ kind: 'statMult', stat: 'ram', mult: 3 }, { kind: 'statMult', stat: 'storage', mult: 3 }] },

  { id: 'spacesolar', branch: 'energie', name: 'Solaire spatial', icon: '☀️', era: 7, cost: 3e8, prereq: ['superconductor'], desc: 'Capacité électrique ×1,5.', effects: [{ kind: 'statMult', stat: 'power', mult: 1.5 }] },
  { id: 'radiatorfins', branch: 'energie', name: 'Ailettes à haute émissivité', icon: '🪶', era: 8, cost: 6e9, prereq: ['spacesolar'], desc: 'Refroidissement ×1,5.', effects: [{ kind: 'statMult', stat: 'cooling', mult: 1.5 }] },
  { id: 'he3fusion', branch: 'energie', name: 'Fusion aneutronique', icon: '⚛️', era: 9, cost: 1.2e11, prereq: ['radiatorfins'], desc: 'Capacité électrique ×2, électricité −20 %.', effects: [{ kind: 'statMult', stat: 'power', mult: 2 }, { kind: 'elecPriceMult', mult: 0.8 }] },
  { id: 'solarwind', branch: 'energie', name: 'Récolte du vent solaire', icon: '🌬️', era: 10, cost: 2.5e12, prereq: ['he3fusion'], desc: 'Électricité −30 %, refroidissement ×1,5.', effects: [{ kind: 'elecPriceMult', mult: 0.7 }, { kind: 'statMult', stat: 'cooling', mult: 1.5 }] },
  { id: 'starlifting', branch: 'energie', name: 'Ascension stellaire', icon: '🌟', era: 11, cost: 5e13, prereq: ['solarwind'], desc: 'Capacité électrique ×2, refroidissement ×2.', effects: [{ kind: 'statMult', stat: 'power', mult: 2 }, { kind: 'statMult', stat: 'cooling', mult: 2 }] },
  { id: 'penrose', branch: 'energie', name: 'Processus de Penrose', icon: '🕳️', era: 12, cost: 1e15, prereq: ['starlifting'], desc: 'On extrait l’énergie de rotation d’un trou noir : capacité électrique ×3.', effects: [{ kind: 'statMult', stat: 'power', mult: 3 }] },

  { id: 'opticlinks', branch: 'reseau', name: 'Liaisons optiques spatiales', icon: '🔆', era: 7, cost: 3e8, prereq: ['quantumnet'], desc: 'Bande passante ×2.', effects: [{ kind: 'statMult', stat: 'bw', mult: 2 }] },
  { id: 'debrisradar', branch: 'reseau', name: 'Radar de surveillance orbitale', icon: '📡', era: 8, cost: 6e9, prereq: ['opticlinks'], desc: 'Nettoyage des débris ×2.', effects: [{ kind: 'statMult', stat: 'cleanup', mult: 2 }] },
  { id: 'lunarlaser', branch: 'reseau', name: 'Laser Terre-Lune', icon: '🌙', era: 9, cost: 1.2e11, prereq: ['debrisradar'], desc: 'Bande passante ×3.', effects: [{ kind: 'statMult', stat: 'bw', mult: 3 }] },
  { id: 'interplanetnet', branch: 'reseau', name: 'Internet interplanétaire', icon: '🪐', era: 10, cost: 2.5e12, prereq: ['lunarlaser'], desc: '25 % de la capacité lointaine sert aussi les requêtes temps réel, bande passante ×2.', effects: [{ kind: 'latencyBridge', add: 0.25 }, { kind: 'statMult', stat: 'bw', mult: 2 }] },
  { id: 'entanglement', branch: 'reseau', name: 'Réseau d’intrication', icon: '🔗', era: 11, cost: 5e13, prereq: ['interplanetnet'], desc: 'Bande passante ×5.', effects: [{ kind: 'statMult', stat: 'bw', mult: 5 }] },
  { id: 'galacticbackbone', branch: 'reseau', name: 'Épine dorsale galactique', icon: '🌌', era: 12, cost: 1e15, prereq: ['entanglement'], desc: 'Bande passante ×10, demande ×2.', effects: [{ kind: 'statMult', stat: 'bw', mult: 10 }, { kind: 'demandMult', mult: 2 }] },

  { id: 'spacelaw', branch: 'business', name: 'Droit spatial', icon: '⚖️', era: 7, cost: 3e8, prereq: ['ecosystem'], desc: 'Demande ×2, prix ×1,25.', effects: [{ kind: 'demandMult', mult: 2 }, { kind: 'priceMult', mult: 1.25 }] },
  { id: 'orbitalfreq', branch: 'business', name: 'Licences de fréquences', icon: '📻', era: 8, cost: 6e9, prereq: ['spacelaw'], desc: 'Demande ×2.', effects: [{ kind: 'demandMult', mult: 2 }] },
  { id: 'lunarexchange', branch: 'business', name: 'Bourse lunaire', icon: '💹', era: 9, cost: 1.2e11, prereq: ['orbitalfreq'], desc: 'Prix ×1,5, lanceurs −25 %.', effects: [{ kind: 'priceMult', mult: 1.5 }, { kind: 'costMult', cat: 'orbit', mult: 0.75 }] },
  { id: 'solarconcession', branch: 'business', name: 'Concession du système solaire', icon: '📜', era: 10, cost: 2.5e12, prereq: ['lunarexchange'], desc: 'Demande ×3.', effects: [{ kind: 'demandMult', mult: 3 }] },
  { id: 'xenodiplomacy', branch: 'business', name: 'Xénodiplomatie', icon: '🤝', era: 11, cost: 5e13, prereq: ['solarconcession'], desc: 'Prix ×2.', effects: [{ kind: 'priceMult', mult: 2 }] },
  { id: 'kardashev', branch: 'business', name: 'Civilisation de type III', icon: '🏆', era: 12, cost: 1e15, prereq: ['xenodiplomacy'], desc: 'Revenus ×3.', effects: [{ kind: 'revenueMult', mult: 3 }] },
];

export const RESEARCH_BY_ID: Record<string, ResearchDef> = Object.fromEntries(
  RESEARCH.map((r) => [r.id, r]),
);
