import type { BuildingDef, Category } from '../types';

// ---------------------------------------------------------------------------
// Catalogue de tout ce qui s'achète en quantité (« bâtiments » d'idle game).
// Coût de la n-ième unité : baseCost × growth^n.
// Règle d'équilibrage des serveurs : coût ×10, production ×5 par palier.
// ---------------------------------------------------------------------------

const SERVERS: BuildingDef[] = [
  {
    id: 'pi', cat: 'servers', name: 'Raspberry Pi', icon: '🍓', era: 1,
    desc: 'Petit, silencieux, sobre. Parfait pour débuter.',
    baseCost: 15, growth: 1.2, slots: 1, watts: 6,
    provides: { cpu: 1, ram: 1, storage: 0.03 },
  },
  {
    id: 'oldpc', cat: 'servers', name: 'Vieux PC récupéré', icon: '🖥️', era: 1,
    desc: 'Trouvé sur le trottoir. Bruyant et gourmand, mais il tourne.',
    baseCost: 150, growth: 1.2, slots: 1, watts: 90,
    provides: { cpu: 5, ram: 5, storage: 0.25 },
  },
  {
    id: 'nuc', cat: 'servers', name: 'Mini-PC', icon: '📦', era: 1,
    desc: 'Format compact, processeur moderne, consommation maîtrisée.',
    baseCost: 1_500, growth: 1.2, slots: 1, watts: 35,
    provides: { cpu: 25, ram: 25, storage: 1 },
  },
  {
    id: 'tower', cat: 'servers', name: 'Tour serveur', icon: '🗼', era: 2,
    desc: 'Xeon, RAM ECC et disques hot-swap. Le premier « vrai » serveur.',
    baseCost: 15_000, growth: 1.2, slots: 4, watts: 250,
    provides: { cpu: 125, ram: 130, storage: 6 },
  },
  {
    id: 'r1u', cat: 'servers', name: 'Serveur rack 1U', icon: '🧱', era: 2,
    desc: 'Dense et rackable. On commence à parler en « U ».',
    baseCost: 150_000, growth: 1.2, slots: 1, watts: 350,
    provides: { cpu: 625, ram: 650, storage: 8 },
  },
  {
    id: 'r2u', cat: 'servers', name: 'Serveur 2U bi-socket', icon: '🗃️', era: 3,
    desc: 'Deux sockets, des centaines de Go de RAM.',
    baseCost: 1_500_000, growth: 1.2, slots: 2, watts: 700,
    provides: { cpu: 3_125, ram: 3_300, storage: 30 },
  },
  {
    id: 'blade', cat: 'servers', name: 'Châssis blade', icon: '🔪', era: 3,
    desc: '16 lames dans un châssis 10U partagé.',
    baseCost: 15_000_000, growth: 1.2, slots: 10, watts: 6_000,
    provides: { cpu: 15_600, ram: 16_500, storage: 80 },
  },
  {
    id: 'ocp', cat: 'servers', name: 'Rack OCP haute densité', icon: '🏗️', era: 4,
    desc: 'Design Open Compute : rack entier livré prêt à brancher.',
    baseCost: 150_000_000, growth: 1.2, slots: 42, watts: 30_000,
    provides: { cpu: 78_000, ram: 82_000, storage: 400 },
  },
  {
    id: 'arm', cat: 'servers', name: 'Rack ARM basse conso', icon: '🦾', era: 4,
    desc: "Des centaines de cœurs ARM pour une fraction de l'énergie.",
    baseCost: 1_500_000_000, growth: 1.2, slots: 42, watts: 20_000,
    provides: { cpu: 390_000, ram: 410_000, storage: 1_000 },
  },
  {
    id: 'gpunode', cat: 'servers', name: 'Nœud GPU', icon: '🎮', era: 5,
    desc: '8 accélérateurs, NVLink et une facture électrique salée.',
    baseCost: 3_000_000_000, growth: 1.2, slots: 4, watts: 10_000,
    provides: { cpu: 20_000, ram: 100_000, gpu: 8, storage: 200 },
  },
  {
    id: 'aipod', cat: 'servers', name: 'Pod IA', icon: '🧬', era: 5,
    desc: '32 nœuds GPU interconnectés en InfiniBand.',
    baseCost: 30_000_000_000, growth: 1.2, slots: 42, watts: 400_000,
    provides: { cpu: 100_000, ram: 500_000, gpu: 40, storage: 1_000 },
  },
  {
    id: 'superpod', cat: 'servers', name: 'SuperPod', icon: '🌌', era: 6,
    desc: 'Des milliers de GPU qui ne forment plus qu’un seul cerveau.',
    baseCost: 3e11, growth: 1.2, slots: 300, watts: 4_000_000,
    provides: { cpu: 500_000, ram: 2_500_000, gpu: 200, storage: 5_000 },
  },
  {
    id: 'quantum', cat: 'servers', name: 'Ordinateur quantique', icon: '⚛️', era: 6,
    desc: 'Refroidi à 15 mK. Personne ne comprend vraiment comment il marche.',
    baseCost: 3e12, growth: 1.2, slots: 500, watts: 25_000_000,
    provides: { cpu: 2_500_000, ram: 12_500_000, gpu: 1_000, storage: 25_000 },
  },
  {
    id: 'orbital', cat: 'servers', name: 'Datacenter orbital', icon: '🛰️', era: 6,
    desc: 'En orbite basse : énergie solaire gratuite et refroidissement par le vide.',
    baseCost: 3e13, growth: 1.2, slots: 0, watts: 0,
    provides: { cpu: 12_500_000, ram: 62_500_000, gpu: 5_000, storage: 125_000 },
  },
];

const STORAGE: BuildingDef[] = [
  {
    id: 'hdd', cat: 'storage', name: 'Disque dur externe', icon: '💽', era: 1,
    desc: 'Branché en USB. Prions pour qu’il ne tombe pas.',
    baseCost: 25, growth: 1.2, slots: 0, watts: 5,
    provides: { storage: 0.5 },
  },
  {
    id: 'nas', cat: 'storage', name: 'NAS 4 baies', icon: '🗄️', era: 1,
    desc: 'RAID 5 et interface web. Le compagnon du homelab.',
    baseCost: 600, growth: 1.2, slots: 1, watts: 40,
    provides: { storage: 8 }, flags: ['raid'],
  },
  {
    id: 'raidbay', cat: 'storage', name: 'Baie RAID', icon: '📚', era: 2,
    desc: '24 disques en RAID 6, contrôleur à cache batterie.',
    baseCost: 25_000, growth: 1.2, slots: 2, watts: 250,
    provides: { storage: 150 }, flags: ['raid'],
  },
  {
    id: 'san', cat: 'storage', name: 'SAN Fibre Channel', icon: '🧊', era: 3,
    desc: 'Stockage partagé à haute disponibilité.',
    baseCost: 1_000_000, growth: 1.2, slots: 4, watts: 1_500,
    provides: { storage: 3_000 },
  },
  {
    id: 'nvme', cat: 'storage', name: 'Baie full-NVMe', icon: '⚡', era: 4,
    desc: 'Des millions d’IOPS dans 2U.',
    baseCost: 80_000_000, growth: 1.2, slots: 2, watts: 1_200,
    provides: { storage: 60_000 },
  },
  {
    id: 'objstore', cat: 'storage', name: 'Cluster stockage objet', icon: '🪣', era: 5,
    desc: 'Des pétaoctets répliqués sur trois zones.',
    baseCost: 8_000_000_000, growth: 1.2, slots: 42, watts: 30_000,
    provides: { storage: 2_000_000 },
  },
  {
    id: 'dna', cat: 'storage', name: 'Stockage ADN', icon: '🧪', era: 6,
    desc: 'Un exaoctet dans un tube à essai.',
    baseCost: 8e11, growth: 1.2, slots: 10, watts: 50_000,
    provides: { storage: 80_000_000 },
  },
];

const NETWORK: BuildingDef[] = [
  {
    id: 'adsl', cat: 'network', name: 'Ligne ADSL', icon: '📞', era: 1,
    desc: 'Une ligne de plus sur le vieux cuivre.',
    baseCost: 40, growth: 1.2, slots: 0, watts: 10,
    provides: { bw: 6 },
  },
  {
    id: 'vdsl', cat: 'network', name: 'Ligne VDSL2', icon: '📶', era: 1,
    desc: 'Plus de débit si vous êtes près du central.',
    baseCost: 450, growth: 1.2, slots: 0, watts: 12,
    provides: { bw: 35 },
  },
  {
    id: 'fiber', cat: 'network', name: 'Fibre FTTH', icon: '💡', era: 1,
    desc: 'Le Gigabit à la maison. Enfin.',
    baseCost: 5_000, growth: 1.2, slots: 0, watts: 15,
    provides: { bw: 200 },
  },
  {
    id: 'switch10g', cat: 'network', name: 'Switch manageable 10G', icon: '🔀', era: 2,
    desc: 'VLAN, LACP, et des LEDs qui clignotent beaucoup.',
    baseCost: 50_000, growth: 1.2, slots: 1, watts: 150,
    provides: { bw: 1_000 },
  },
  {
    id: 'prolink', cat: 'network', name: 'Lien pro 10 Gb/s', icon: '🛜', era: 3,
    desc: 'Fibre dédiée, GTR 4h, IP fixes à volonté.',
    baseCost: 500_000, growth: 1.2, slots: 0, watts: 200,
    provides: { bw: 5_000 },
  },
  {
    id: 'bgp', cat: 'network', name: 'Routeur BGP multi-transit', icon: '🧭', era: 3,
    desc: 'Votre propre AS, plusieurs transitaires.',
    baseCost: 5_000_000, growth: 1.2, slots: 2, watts: 800,
    provides: { bw: 25_000 },
  },
  {
    id: 'ix', cat: 'network', name: 'Port de peering IX', icon: '🤝', era: 4,
    desc: 'Échange direct avec les autres réseaux au point d’échange.',
    baseCost: 50_000_000, growth: 1.2, slots: 1, watts: 500,
    provides: { bw: 125_000 },
  },
  {
    id: 'cdn', cat: 'network', name: 'PoP CDN', icon: '🌐', era: 4,
    desc: 'Du cache au plus près des utilisateurs. Encaisse aussi les DDoS.',
    baseCost: 500_000_000, growth: 1.2, slots: 0, watts: 5_000,
    provides: { bw: 625_000 }, flags: ['antiddos'],
  },
  {
    id: 'backbone', cat: 'network', name: 'Backbone 400G', icon: '🛤️', era: 5,
    desc: 'Votre propre dorsale optique entre vos sites.',
    baseCost: 5_000_000_000, growth: 1.2, slots: 4, watts: 10_000,
    provides: { bw: 3_200_000 },
  },
  {
    id: 'subsea', cat: 'network', name: 'Câble sous-marin', icon: '🐙', era: 6,
    desc: 'Traverser un océan avec quelques paires de fibres.',
    baseCost: 5e11, growth: 1.2, slots: 0, watts: 100_000,
    provides: { bw: 80_000_000 },
  },
  {
    id: 'laser', cat: 'network', name: 'Constellation laser', icon: '🔦', era: 6,
    desc: 'Liaisons optiques inter-satellites à la vitesse de la lumière dans le vide.',
    baseCost: 5e13, growth: 1.2, slots: 0, watts: 0,
    provides: { bw: 2_000_000_000 },
  },
];

const POWER: BuildingDef[] = [
  {
    id: 'outlet', cat: 'power', name: 'Prise supplémentaire', icon: '🔌', era: 1,
    desc: 'Un circuit de plus tiré depuis le tableau.',
    baseCost: 60, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 500 },
  },
  {
    id: 'ups', cat: 'power', name: 'Onduleur (UPS)', icon: '🔋', era: 1,
    desc: 'Tient les coupures de courant. Un seul suffit à protéger le homelab.',
    baseCost: 400, growth: 1.25, slots: 1, watts: 0,
    provides: { power: 800 }, flags: ['ups'],
  },
  {
    id: 'line32', cat: 'power', name: 'Ligne dédiée 32 A', icon: '⚡', era: 1,
    desc: 'Le garage a enfin son propre disjoncteur.',
    baseCost: 3_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 4_000 },
  },
  {
    id: 'tri', cat: 'power', name: 'Tableau triphasé', icon: '🎛️', era: 2,
    desc: 'Trois phases, 36 kVA.',
    baseCost: 30_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 20_000 },
  },
  {
    id: 'solar', cat: 'power', name: 'Panneaux solaires', icon: '☀️', era: 2,
    desc: 'Réduisent la facture d’électricité (−1,5 % chacun, max −45 %).',
    baseCost: 60_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 8_000 }, flags: ['solar'],
  },
  {
    id: 'transfo', cat: 'power', name: 'Transformateur HTA', icon: '🏭', era: 3,
    desc: 'Raccordement moyenne tension 20 kV.',
    baseCost: 1_500_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 100_000 },
  },
  {
    id: 'genset', cat: 'power', name: 'Groupe électrogène', icon: '🛢️', era: 3,
    desc: 'Diesel de secours : plus aucune coupure ne vous fait peur.',
    baseCost: 4_000_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 150_000 }, flags: ['generator'],
  },
  {
    id: 'substation', cat: 'power', name: 'Poste source dédié', icon: '🗼', era: 4,
    desc: 'Raccordement haute tension, 20 MW.',
    baseCost: 200_000_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 2_000_000 },
  },
  {
    id: 'solarfarm', cat: 'power', name: 'Ferme solaire', icon: '🌞', era: 5,
    desc: 'Des hectares de panneaux. Bonus solaire inclus.',
    baseCost: 20_000_000_000, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 20_000_000 }, flags: ['solar'],
  },
  {
    id: 'smr', cat: 'power', name: 'Mini-réacteur SMR', icon: '☢️', era: 6,
    desc: 'Un petit réacteur modulaire rien que pour vous.',
    baseCost: 2e12, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 300_000_000 },
  },
  {
    id: 'fusion', cat: 'power', name: 'Réacteur à fusion', icon: '🌟', era: 6,
    desc: 'Le soleil en bouteille. Enfin opérationnel.',
    baseCost: 2e14, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 5_000_000_000 },
  },
];

const COOLING: BuildingDef[] = [
  {
    id: 'fan', cat: 'cooling', name: 'Ventilateur', icon: '🌀', era: 1,
    desc: 'Pointé vers les machines. Ça aide un peu.',
    baseCost: 20, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 100 }, overhead: 0.25,
  },
  {
    id: 'portableac', cat: 'cooling', name: 'Clim mobile', icon: '❄️', era: 1,
    desc: 'Le tuyau sort par la fenêtre entrouverte.',
    baseCost: 500, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 1_500 }, overhead: 0.9,
  },
  {
    id: 'splitac', cat: 'cooling', name: 'Clim split', icon: '🧊', era: 2,
    desc: 'Unité murale avec groupe extérieur.',
    baseCost: 12_000, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 8_000 }, overhead: 0.6,
  },
  {
    id: 'crac', cat: 'cooling', name: 'Armoire CRAC', icon: '🏔️', era: 3,
    desc: 'Climatisation de précision, soufflage sous faux plancher.',
    baseCost: 800_000, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 60_000 }, overhead: 0.45,
  },
  {
    id: 'freecool', cat: 'cooling', name: 'Free cooling', icon: '🌬️', era: 4,
    desc: 'L’air extérieur fait le travail la majeure partie de l’année.',
    baseCost: 80_000_000, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 600_000 }, overhead: 0.15,
  },
  {
    id: 'liquid', cat: 'cooling', name: 'Refroidissement liquide', icon: '💧', era: 5,
    desc: 'Plaques froides directement sur les puces.',
    baseCost: 8_000_000_000, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 8_000_000 }, overhead: 0.08,
  },
  {
    id: 'immersion', cat: 'cooling', name: 'Immersion diphasique', icon: '🛁', era: 6,
    desc: 'Les serveurs baignent dans un fluide diélectrique en ébullition.',
    baseCost: 8e11, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 100_000_000 }, overhead: 0.03,
  },
  {
    id: 'seawater', cat: 'cooling', name: 'Eau des abysses', icon: '🌊', era: 6,
    desc: 'Pompage d’eau à 4 °C depuis les grands fonds.',
    baseCost: 8e13, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 2_000_000_000 }, overhead: 0.02,
  },
];

const SPACE: BuildingDef[] = [
  {
    id: 'shelf', cat: 'space', name: 'Étagère', icon: '🪜', era: 1,
    desc: 'De la place pour quelques machines de plus.',
    baseCost: 30, growth: 1.35, slots: 0, watts: 0,
    provides: { space: 3 },
  },
  {
    id: 'rack', cat: 'space', name: 'Baie 42U', icon: '🗄️', era: 2,
    desc: 'La baie standard 19 pouces.',
    baseCost: 8_000, growth: 1.3, slots: 0, watts: 0,
    provides: { space: 42 },
  },
  {
    id: 'row', cat: 'space', name: 'Rangée de baies', icon: '🧱', era: 3,
    desc: 'Dix baies alignées, allée froide incluse.',
    baseCost: 800_000, growth: 1.3, slots: 0, watts: 0,
    provides: { space: 420 },
  },
  {
    id: 'cage', cat: 'space', name: 'Cage privative', icon: '🔐', era: 4,
    desc: 'Un espace grillagé rien qu’à vous dans le datacenter.',
    baseCost: 80_000_000, growth: 1.3, slots: 0, watts: 0,
    provides: { space: 4_200 },
  },
  {
    id: 'hall', cat: 'space', name: 'Salle blanche', icon: '🏟️', era: 5,
    desc: 'Mille mètres carrés de faux plancher.',
    baseCost: 8_000_000_000, growth: 1.3, slots: 0, watts: 0,
    provides: { space: 42_000 },
  },
  {
    id: 'campus', cat: 'space', name: 'Campus datacenter', icon: '🏙️', era: 6,
    desc: 'Plusieurs bâtiments, une sous-station, un lac pour refroidir.',
    baseCost: 8e11, growth: 1.3, slots: 0, watts: 0,
    provides: { space: 600_000 },
  },
];

const SALES: BuildingDef[] = [
  {
    id: 'ads', cat: 'sales', name: 'Petites annonces', icon: '📰', era: 1,
    desc: '« Hébergement pas cher, demandez Kevin. »',
    baseCost: 12, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 1.5 },
  },
  {
    id: 'forum', cat: 'sales', name: 'Pub sur les forums', icon: '💬', era: 1,
    desc: 'Signature de forum et messages bien placés.',
    baseCost: 130, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 8 },
  },
  {
    id: 'seo', cat: 'sales', name: 'Référencement SEO', icon: '🔎', era: 1,
    desc: 'Premier sur « hébergeur sympa ».',
    baseCost: 1_400, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 40 },
  },
  {
    id: 'salesrep', cat: 'sales', name: 'Commercial', icon: '👔', era: 2,
    desc: 'Il connaît tout le monde et décroche des contrats.',
    baseCost: 15_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 200 },
  },
  {
    id: 'partners', cat: 'sales', name: 'Partenariat agences web', icon: '🤝', era: 2,
    desc: 'Les agences vous confient tous leurs clients.',
    baseCost: 160_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 1_000 },
  },
  {
    id: 'enterprise', cat: 'sales', name: 'Contrats grands comptes', icon: '🏦', era: 3,
    desc: 'Banques, assurances, collectivités.',
    baseCost: 1_700_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 5_000 },
  },
  {
    id: 'marketplace', cat: 'sales', name: 'Marketplace cloud', icon: '🛍️', era: 3,
    desc: 'Vos offres en un clic dans les catalogues SaaS.',
    baseCost: 18_000_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 25_000 },
  },
  {
    id: 'events', cat: 'sales', name: 'Salons & conférences', icon: '🎤', era: 4,
    desc: 'Votre stand au plus grand salon tech d’Europe.',
    baseCost: 200_000_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 125_000 },
  },
  {
    id: 'sovereign', cat: 'sales', name: 'Cloud souverain', icon: '🇪🇺', era: 5,
    desc: 'Les administrations s’arrachent votre certification.',
    baseCost: 2_200_000_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 600_000 },
  },
  {
    id: 'aiplatform', cat: 'sales', name: 'Plateforme IA', icon: '✨', era: 5,
    desc: 'Les startups IA font la queue pour vos GPU.',
    baseCost: 25_000_000_000, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 3_000_000 },
  },
  {
    id: 'globalcampaign', cat: 'sales', name: 'Campagne mondiale', icon: '📺', era: 6,
    desc: 'Votre logo à la mi-temps de la finale.',
    baseCost: 3e11, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 15_000_000 },
  },
  {
    id: 'interplanet', cat: 'sales', name: 'Clients interplanétaires', icon: '🚀', era: 6,
    desc: 'La colonie martienne a besoin d’un hébergeur.',
    baseCost: 3.5e13, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 400_000_000 },
  },
];

const STAFF: BuildingDef[] = [
  {
    id: 'intern', cat: 'staff', name: 'Stagiaire', icon: '🧑‍🎓', era: 1,
    desc: 'Traite les requêtes à la main à votre place (1 clic/s).',
    baseCost: 100, growth: 1.2, slots: 0, watts: 0,
    provides: { autoClick: 1 },
  },
  {
    id: 'sysadmin', cat: 'staff', name: 'Sysadmin', icon: '🧔', era: 1,
    desc: 'Répare les pannes plus vite (+0,5 %/s de réparation).',
    baseCost: 2_000, growth: 1.25, slots: 0, watts: 0,
    provides: { repair: 0.005 },
  },
  {
    id: 'researcher', cat: 'staff', name: 'Ingénieur R&D', icon: '🧑‍🔬', era: 2,
    desc: 'Produit des points de recherche.',
    baseCost: 20_000, growth: 1.2, slots: 0, watts: 0,
    provides: { rd: 0.25 },
  },
  {
    id: 'devops', cat: 'staff', name: 'Ingénieur DevOps', icon: '🛠️', era: 2,
    desc: 'Automatise tout : +2 % d’efficacité des serveurs.',
    baseCost: 60_000, growth: 1.25, slots: 0, watts: 0,
    provides: { efficiency: 0.02 },
  },
  {
    id: 'sre', cat: 'staff', name: 'SRE', icon: '📟', era: 3,
    desc: 'Réduit la fréquence des incidents (−5 % chacun).',
    baseCost: 1_000_000, growth: 1.3, slots: 0, watts: 0,
    provides: { reliability: 0.05, repair: 0.005 },
  },
  {
    id: 'rdlab', cat: 'staff', name: 'Laboratoire R&D', icon: '🔬', era: 4,
    desc: 'Une équipe entière dédiée à la recherche.',
    baseCost: 100_000_000, growth: 1.2, slots: 0, watts: 0,
    provides: { rd: 15 },
  },
  {
    id: 'aiops', cat: 'staff', name: 'IA d’exploitation', icon: '🦾', era: 5,
    desc: 'Une IA pilote le datacenter : +5 % d’efficacité.',
    baseCost: 30_000_000_000, growth: 1.3, slots: 0, watts: 0,
    provides: { efficiency: 0.05, rd: 200 },
  },
];

/**
 * Facteur de coût par ère : ralentit la croissance exponentielle des ères
 * avancées (la rentabilité d'un achat y est naturellement plus élevée à cause
 * des multiplicateurs cumulés). Réglé avec `npm run sim`.
 */
export const ERA_COST_SCALE = [1, 1, 1, 1.5, 2, 3];

export const BUILDINGS: BuildingDef[] = [
  ...SERVERS,
  ...STORAGE,
  ...NETWORK,
  ...POWER,
  ...COOLING,
  ...SPACE,
  ...SALES,
  ...STAFF,
].map((b) => ({ ...b, baseCost: b.baseCost * ERA_COST_SCALE[b.era - 1] }));

export const BUILDING_BY_ID: Record<string, BuildingDef> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
);

export const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: 'servers', name: 'Serveurs', icon: '🖥️' },
  { id: 'storage', name: 'Stockage', icon: '💾' },
  { id: 'network', name: 'Réseau', icon: '🌐' },
  { id: 'power', name: 'Électricité', icon: '⚡' },
  { id: 'cooling', name: 'Refroidissement', icon: '❄️' },
  { id: 'space', name: 'Espace', icon: '📐' },
  { id: 'sales', name: 'Commercial', icon: '📈' },
  { id: 'staff', name: 'Équipe', icon: '👥' },
];
