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

  // --- Conquête spatiale : le matériel est lancé (masse) au lieu d'être racké ---
  {
    id: 'orbital', cat: 'servers', name: 'Datacenter orbital', icon: '🛰️', era: 7,
    desc: 'En orbite basse : soleil permanent, mais la chaleur ne part que par rayonnement.',
    baseCost: 3e13, growth: 1.2, slots: 0, watts: 1e8, mass: 20, debris: 20,
    provides: { cpu: 1.25e07, ram: 6.25e07, gpu: 5_000, storage: 125_000 },
  },
  {
    id: 'orbmodule', cat: 'servers', name: 'Module de calcul orbital', icon: '🧑‍🚀', era: 7,
    desc: 'Un module pressurisé amarré à votre station, plein de baies durcies aux radiations.',
    baseCost: 3e14, growth: 1.2, slots: 0, watts: 4e8, mass: 100, debris: 60,
    provides: { cpu: 8.75e07, ram: 4.375e08, gpu: 35_000, storage: 875_000 },
  },
  {
    id: 'swarm', cat: 'servers', name: 'Essaim de micro-satellites', icon: '🐝', era: 8,
    desc: 'Des milliers de satellites jetables qui calculent en essaim. Gare aux débris.',
    baseCost: 3e15, growth: 1.2, slots: 0, watts: 1.6e9, mass: 500, debris: 1_000,
    provides: { cpu: 6.125e08, ram: 3.062e09, gpu: 245_000, storage: 6.125e06 },
  },
  {
    id: 'geostation', cat: 'servers', name: 'Station géostationnaire', icon: '🛸', era: 8,
    desc: 'À 36 000 km, immobile au-dessus de l’équateur. Robuste et durable.',
    baseCost: 3e16, growth: 1.2, slots: 0, watts: 6.4e9, mass: 2_500, debris: 500,
    provides: { cpu: 4.288e09, ram: 2.144e10, gpu: 1.715e06, storage: 4.288e07 },
  },
  {
    id: 'lavatube', cat: 'servers', name: 'Datacenter en tube de lave', icon: '🌋', era: 9,
    desc: 'Enfoui sous la Lune, à l’abri des radiations et des micrométéorites.',
    baseCost: 3e17, growth: 1.2, slots: 0, watts: 2.56e10, mass: 12_500,
    provides: { cpu: 3.001e10, ram: 1.501e11, gpu: 1.2e07, storage: 3.001e08 },
  },
  {
    id: 'l2hub', cat: 'servers', name: 'Hub au point L2', icon: '🔭', era: 9,
    desc: 'Au point de Lagrange L2, à l’ombre de la Terre : stable, froid et silencieux.',
    baseCost: 3e18, growth: 1.2, slots: 0, watts: 1e11, mass: 62_500,
    provides: { cpu: 2.101e11, ram: 1.05e12, gpu: 8.404e07, storage: 2.101e09 },
  },
  {
    id: 'marsdc', cat: 'servers', name: 'Datacenter martien', icon: '🔴', era: 10,
    desc: 'Froid naturel, poussière partout et 4 à 24 minutes de latence avec la Terre.',
    baseCost: 3e19, growth: 1.2, slots: 0, watts: 4e11, mass: 312_500, remote: true,
    provides: { cpu: 1.471e12, ram: 7.353e12, gpu: 5.882e08, storage: 1.471e10 },
  },
  {
    id: 'asteroidcore', cat: 'servers', name: 'Astéroïde-ordinateur', icon: '☄️', era: 10,
    desc: 'Un astéroïde métallique entièrement creusé et gravé en circuits.',
    baseCost: 3e20, growth: 1.2, slots: 0, watts: 1.6e12, mass: 1.5625e6, remote: true,
    provides: { cpu: 1.029e13, ram: 5.147e13, gpu: 4.118e09, storage: 1.029e11 },
  },
  {
    id: 'stellarnode', cat: 'servers', name: 'Nœud stellaire', icon: '⭐', era: 11,
    desc: 'Un datacenter en orbite d’une autre étoile. Il faut quelques minutes pour l’atteindre.',
    baseCost: 3e21, growth: 1.2, slots: 0, watts: 6.4e12, mass: 7.8125e6, remote: true, travel: 180,
    provides: { cpu: 7.206e13, ram: 3.603e14, gpu: 2.882e10, storage: 7.206e11 },
  },
  {
    id: 'neutroncore', cat: 'servers', name: 'Calculateur à étoile à neutrons', icon: '💫', era: 11,
    desc: 'De la matière si dense qu’une cuillère pèse un milliard de tonnes. Elle calcule vite.',
    baseCost: 3e22, growth: 1.2, slots: 0, watts: 2.56e13, mass: 3.90625e7, remote: true, travel: 360,
    provides: { cpu: 5.044e14, ram: 2.522e15, gpu: 2.018e11, storage: 5.044e12 },
  },
  {
    id: 'matrioshka', cat: 'servers', name: 'Cerveau Matriochka', icon: '🪆', era: 12,
    desc: 'Des sphères de Dyson emboîtées : chaque couche calcule avec la chaleur de la précédente.',
    baseCost: 3e23, growth: 1.2, slots: 0, watts: 1.024e14, mass: 1.953125e8, remote: true, travel: 600,
    provides: { cpu: 3.531e15, ram: 1.765e16, gpu: 1.412e12, storage: 3.531e13 },
  },
  {
    id: 'blackholecpu', cat: 'servers', name: 'Ordinateur à trou noir', icon: '🕳️', era: 12,
    desc: 'La limite ultime du calcul : chaque bit frôle l’horizon des événements.',
    baseCost: 3e24, growth: 1.2, slots: 0, watts: 4.096e14, mass: 9.765625e8, remote: true, travel: 900,
    provides: { cpu: 2.472e16, ram: 1.236e17, gpu: 9.887e12, storage: 2.472e14 },
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
  {
    id: 'leoarchive', cat: 'storage', name: 'Archive en orbite basse', icon: '🧊', era: 7,
    desc: 'Des baies froides en orbite, hors de portée des catastrophes terrestres.',
    baseCost: 8e13, growth: 1.2, slots: 0, watts: 2e5, mass: 15, debris: 15,
    provides: { storage: 3.2e9 },
  },
  {
    id: 'crystal5d', cat: 'storage', name: 'Mémoire cristalline 5D', icon: '💎', era: 8,
    desc: 'Gravée au laser femtoseconde dans du quartz : des milliards d’années de rétention.',
    baseCost: 8e15, growth: 1.2, slots: 0, watts: 8e5, mass: 60, debris: 30,
    provides: { storage: 1.28e11 },
  },
  {
    id: 'lunarvault', cat: 'storage', name: 'Coffre-fort lunaire', icon: '🏛️', era: 9,
    desc: 'Une sauvegarde de toute l’humanité, au fond d’un cratère polaire.',
    baseCost: 8e17, growth: 1.2, slots: 0, watts: 3.2e6, mass: 250,
    provides: { storage: 5.12e12 },
  },
  {
    id: 'titancryo', cat: 'storage', name: 'Stockage cryogénique sur Titan', icon: '🧪', era: 10,
    desc: 'À −180 °C dans les lacs de méthane. Lointain, mais parfait pour les archives.',
    baseCost: 8e19, growth: 1.2, slots: 0, watts: 1.28e7, mass: 1_000, remote: true,
    provides: { storage: 2.048e14 },
  },
  {
    id: 'degenerate', cat: 'storage', name: 'Mémoire en matière dégénérée', icon: '⚫', era: 11,
    desc: 'Les bits sont codés dans les états quantiques d’une naine blanche.',
    baseCost: 8e21, growth: 1.2, slots: 0, watts: 5.12e7, mass: 4_000, remote: true, travel: 240,
    provides: { storage: 8.192e15 },
  },
  {
    id: 'holohorizon', cat: 'storage', name: 'Stockage holographique d’horizon', icon: '🌀', era: 12,
    desc: 'Toute l’information d’un volume, écrite sur la surface d’un trou noir.',
    baseCost: 8e23, growth: 1.2, slots: 0, watts: 2.048e8, mass: 16_000, remote: true, travel: 600,
    provides: { storage: 3.2768e17 },
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
  {
    id: 'kaground', cat: 'network', name: 'Station sol en bande Ka', icon: '📡', era: 7,
    desc: 'Des paraboles géantes qui descendent les données de vos satellites.',
    baseCost: 5e13, growth: 1.2, slots: 0, watts: 400_000,
    provides: { bw: 2e9 },
  },
  {
    id: 'optsat', cat: 'network', name: 'Relais optique géostationnaire', icon: '🔦', era: 8,
    desc: 'Des lasers relient vos constellations à la Terre sans aucune fibre.',
    baseCost: 5e15, growth: 1.2, slots: 0, watts: 1.6e6, mass: 40, debris: 40,
    provides: { bw: 5e10 },
  },
  {
    id: 'lunarrelay', cat: 'network', name: 'Relais laser lunaire', icon: '🌙', era: 9,
    desc: 'Un réseau de relais en orbite lunaire, connecté en permanence à la Terre.',
    baseCost: 5e17, growth: 1.2, slots: 0, watts: 6.4e6, mass: 150,
    provides: { bw: 1.25e12 },
  },
  {
    id: 'deepnet', cat: 'network', name: 'Réseau de l’espace lointain', icon: '📶', era: 10,
    desc: 'Des antennes de 70 m et des relais dans tout le système solaire.',
    baseCost: 5e19, growth: 1.2, slots: 0, watts: 2.56e7, mass: 600,
    provides: { bw: 3.125e13 },
  },
  {
    id: 'wormhole', cat: 'network', name: 'Relais à trou de ver', icon: '🍩', era: 11,
    desc: 'Un raccourci dans l’espace-temps : la latence interplanétaire disparaît.',
    baseCost: 5e21, growth: 1.2, slots: 0, watts: 1e8, mass: 2_500, travel: 300, flags: ['wormhole'],
    provides: { bw: 7.8125e14 },
  },
  {
    id: 'galacticnet', cat: 'network', name: 'Réseau galactique', icon: '🕸️', era: 12,
    desc: 'Un maillage de trous de ver qui relie les bras de la galaxie.',
    baseCost: 5e23, growth: 1.2, slots: 0, watts: 4e8, mass: 10_000, travel: 600,
    provides: { bw: 1.953125e16 },
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
  {
    id: 'orbitalsolar', cat: 'power', name: 'Station solaire orbitale', icon: '🛰️', era: 7,
    desc: 'Des kilomètres de panneaux en plein soleil, sans nuit ni nuages.',
    baseCost: 2e16, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 8e10 },
  },
  {
    id: 'sbsp', cat: 'power', name: 'Ferme solaire géostationnaire', icon: '📶', era: 8,
    desc: 'L’énergie est renvoyée vers vos installations par faisceau micro-ondes.',
    baseCost: 2e18, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 1.28e12 },
  },
  {
    id: 'he3', cat: 'power', name: 'Fusion à l’hélium-3 lunaire', icon: '⚛️', era: 9,
    desc: 'Le régolithe lunaire regorge d’hélium-3 : la fusion propre devient rentable.',
    baseCost: 2e20, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 2.048e13 },
  },
  {
    id: 'mercuryring', cat: 'power', name: 'Anneau solaire de Mercure', icon: '💍', era: 10,
    desc: 'Une ceinture de panneaux autour de la planète la plus proche du Soleil.',
    baseCost: 2e22, growth: 1.2, slots: 0, watts: 0,
    provides: { power: 3.2768e14 },
  },
  {
    id: 'dysonswarm', cat: 'power', name: 'Essaim de Dyson', icon: '🌞', era: 11,
    desc: 'Des milliards de collecteurs en orbite d’une étoile captent une partie de sa lumière.',
    baseCost: 2e24, growth: 1.2, slots: 0, watts: 0, travel: 300,
    provides: { power: 5.24288e15 },
  },
  {
    id: 'dysonsphere', cat: 'power', name: 'Sphère de Dyson', icon: '🟠', era: 12,
    desc: 'Une étoile entièrement enveloppée : toute son énergie vous appartient.',
    baseCost: 2e26, growth: 1.2, slots: 0, watts: 0, travel: 900,
    provides: { power: 8.388608e16 },
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
  {
    id: 'heatpipes', cat: 'cooling', name: 'Radiateurs orbitaux', icon: '🪭', era: 7,
    desc: 'Dans le vide, la chaleur ne part que par rayonnement : il faut d’immenses ailettes.',
    baseCost: 8e15, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 3.2e10 }, overhead: 0.06,
  },
  {
    id: 'droplet', cat: 'cooling', name: 'Radiateurs à gouttelettes', icon: '💦', era: 8,
    desc: 'Un rideau de gouttelettes d’huile rayonne la chaleur, puis est récupéré.',
    baseCost: 8e17, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 5.12e11 }, overhead: 0.04,
  },
  {
    id: 'polarcrater', cat: 'cooling', name: 'Cratère d’ombre éternelle', icon: '🕳️', era: 9,
    desc: 'Au pôle sud lunaire, des cratères à −240 °C qui n’ont jamais vu le Soleil.',
    baseCost: 8e19, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 8.192e12 }, overhead: 0.02,
  },
  {
    id: 'europa', cat: 'cooling', name: 'Océan d’Europe', icon: '🧊', era: 10,
    desc: 'Un océan entier sous la glace d’une lune de Jupiter, pour dissiper vos calories.',
    baseCost: 8e21, growth: 1.18, slots: 0, watts: 0,
    provides: { cooling: 1.31072e14 }, overhead: 0.015,
  },
  {
    id: 'oortcloud', cat: 'cooling', name: 'Nuage de Oort', icon: '☁️', era: 11,
    desc: 'Aux confins du système solaire, à quelques kelvins du zéro absolu.',
    baseCost: 8e23, growth: 1.18, slots: 0, watts: 0, travel: 300,
    provides: { cooling: 2.097152e15 }, overhead: 0.01,
  },
  {
    id: 'cmb', cat: 'cooling', name: 'Rayonnement vers le fond cosmique', icon: '🌌', era: 12,
    desc: 'Vos radiateurs visent l’univers lui-même, à 2,7 K.',
    baseCost: 8e25, growth: 1.18, slots: 0, watts: 0, travel: 600,
    provides: { cooling: 3.3554432e16 }, overhead: 0.005,
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
  {
    id: 'spacetourism', cat: 'sales', name: 'Tourisme spatial', icon: '👨‍🚀', era: 7,
    desc: 'Les touristes en orbite veulent publier leurs photos tout de suite.',
    baseCost: 3.5e15, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 1e10 },
  },
  {
    id: 'satinternet', cat: 'sales', name: 'Internet orbital universel', icon: '📡', era: 8,
    desc: 'Chaque point du globe est connecté, des déserts aux océans.',
    baseCost: 3.5e17, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 2.5e11 },
  },
  {
    id: 'lunareco', cat: 'sales', name: 'Économie lunaire', icon: '🌕', era: 9,
    desc: 'Mines, hôtels et usines lunaires : tout ce petit monde a besoin de cloud.',
    baseCost: 3.5e19, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 6.25e12 },
  },
  {
    id: 'marscolonies', cat: 'sales', name: 'Colonies martiennes', icon: '🏜️', era: 10,
    desc: 'Un million de colons, et autant d’abonnements.',
    baseCost: 3.5e21, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 1.5625e14 },
  },
  {
    id: 'firstcontact', cat: 'sales', name: 'Premier contact', icon: '👽', era: 11,
    desc: 'Une civilisation voisine découvre le cloud. Elle a beaucoup de données.',
    baseCost: 3.5e23, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 3.90625e15 },
  },
  {
    id: 'galacticmarket', cat: 'sales', name: 'Marché galactique', icon: '🪐', era: 12,
    desc: 'Des milliers d’espèces, une seule plateforme d’hébergement.',
    baseCost: 3.5e25, growth: 1.17, slots: 0, watts: 0,
    provides: { traffic: 9.765625e16 },
  },
];

// Programme spatial : lanceurs (capacité d'emport), nettoyage orbital, sondes.
const ORBIT: BuildingDef[] = [
  {
    id: 'launchpad', cat: 'orbit', name: 'Pas de tir', icon: '🗼', era: 7,
    desc: 'Votre propre pas de tir, et une fusée qui part toutes les semaines.',
    baseCost: 1e13, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 100 },
  },
  {
    id: 'reusable', cat: 'orbit', name: 'Lanceur réutilisable', icon: '🚀', era: 7,
    desc: 'Le premier étage revient se poser tout seul. Le coût du kilo s’effondre.',
    baseCost: 2e14, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 1_500 },
  },
  {
    id: 'superheavy', cat: 'orbit', name: 'Lanceur super-lourd', icon: '🏗️', era: 8,
    desc: '150 tonnes en orbite à chaque vol, ravitaillement en orbite compris.',
    baseCost: 4e15, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 25_000 },
  },
  {
    id: 'debristug', cat: 'orbit', name: 'Remorqueur de débris', icon: '🧹', era: 8,
    desc: 'Il capture les satellites morts et les désorbite proprement.',
    baseCost: 2e15, growth: 1.25, slots: 0, watts: 0,
    provides: { cleanup: 3_000 },
  },
  {
    id: 'massdriver', cat: 'orbit', name: 'Catapulte électromagnétique lunaire', icon: '🎯', era: 9,
    desc: 'Sans atmosphère, on lance le matériel depuis la Lune sur un simple rail.',
    baseCost: 8e16, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 400_000 },
  },
  {
    id: 'deorbitlaser', cat: 'orbit', name: 'Laser de désorbitation', icon: '🔫', era: 9,
    desc: 'Il freine les débris à distance pour qu’ils brûlent dans l’atmosphère.',
    baseCost: 2e17, growth: 1.25, slots: 0, watts: 0,
    provides: { cleanup: 100_000 },
  },
  {
    id: 'elevator', cat: 'orbit', name: 'Ascenseur spatial', icon: '🛗', era: 9,
    desc: 'Un câble de 100 000 km jusqu’à l’orbite géostationnaire. Ça monte tout seul.',
    baseCost: 1.6e18, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 6e6 },
  },
  {
    id: 'fusionfreighter', cat: 'orbit', name: 'Cargo à propulsion fusion', icon: '🚢', era: 10,
    desc: 'Mars en trois semaines, Jupiter en deux mois.',
    baseCost: 3.2e19, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 1e8 },
  },
  {
    id: 'vonneumann', cat: 'orbit', name: 'Sonde de von Neumann', icon: '🧬', era: 11,
    desc: 'Arrivée à destination, elle se copie avec les ressources locales et repart.',
    baseCost: 1e21, growth: 1.3, slots: 0, watts: 0,
    provides: { replication: 0.0004 },
  },
  {
    id: 'lasersail', cat: 'orbit', name: 'Voiles laser', icon: '⛵', era: 11,
    desc: 'Des voiles poussées par des lasers géants vers les étoiles voisines.',
    baseCost: 6.4e20, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 1.6e9 },
  },
  {
    id: 'seedship', cat: 'orbit', name: 'Vaisseau-graine galactique', icon: '🌱', era: 12,
    desc: 'Il emporte de quoi fonder mille colonies à travers la galaxie.',
    baseCost: 1e23, growth: 1.3, slots: 0, watts: 0,
    provides: { replication: 0.004 },
  },
  {
    id: 'antimatter', cat: 'orbit', name: 'Propulsion à antimatière', icon: '☢️', era: 12,
    desc: 'Un gramme d’antimatière, et le vaisseau file à une fraction de la vitesse de la lumière.',
    baseCost: 1.3e22, growth: 1.3, slots: 0, watts: 0,
    provides: { lift: 2.5e10 },
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
  {
    id: 'missioncontrol', cat: 'staff', name: 'Centre de contrôle de mission', icon: '🎧', era: 7,
    desc: 'Des écrans du sol au plafond et des ingénieurs qui ne dorment jamais.',
    baseCost: 6e12, growth: 1.3, slots: 0, watts: 0,
    provides: { rd: 3_000, efficiency: 0.02 },
  },
  {
    id: 'moonbase', cat: 'staff', name: 'Base lunaire habitée', icon: '🏕️', era: 9,
    desc: 'Vos équipes vivent sur place : réparations et expériences en direct.',
    baseCost: 6e16, growth: 1.3, slots: 0, watts: 0,
    provides: { rd: 60_000, repair: 0.01 },
  },
  {
    id: 'shipmind', cat: 'staff', name: 'Superintelligence de bord', icon: '🧠', era: 11,
    desc: 'Une IA qui pilote vos installations à des années-lumière de distance.',
    baseCost: 6e20, growth: 1.3, slots: 0, watts: 0,
    provides: { rd: 1.2e6, efficiency: 0.05 },
  },
];

/**
 * Facteur de coût par ère : ralentit la croissance exponentielle des ères
 * avancées (la rentabilité d'un achat y est naturellement plus élevée à cause
 * des multiplicateurs cumulés). Réglé avec `npm run sim`.
 */
export const ERA_COST_SCALE = [1, 1, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9];

export const BUILDINGS: BuildingDef[] = [
  ...SERVERS,
  ...STORAGE,
  ...NETWORK,
  ...POWER,
  ...COOLING,
  ...SPACE,
  ...SALES,
  ...STAFF,
  ...ORBIT,
].map((b) => ({ ...b, baseCost: b.baseCost * ERA_COST_SCALE[b.era - 1] }));

export const BUILDING_BY_ID: Record<string, BuildingDef> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
);

/** `era` : ère à partir de laquelle la catégorie apparaît dans la boutique. */
export const CATEGORIES: { id: Category; name: string; icon: string; era?: number }[] = [
  { id: 'servers', name: 'Serveurs', icon: '🖥️' },
  { id: 'storage', name: 'Stockage', icon: '💾' },
  { id: 'network', name: 'Réseau', icon: '🌐' },
  { id: 'power', name: 'Électricité', icon: '⚡' },
  { id: 'cooling', name: 'Refroidissement', icon: '❄️' },
  { id: 'space', name: 'Espace', icon: '📐' },
  { id: 'sales', name: 'Commercial', icon: '📈' },
  { id: 'staff', name: 'Équipe', icon: '👥' },
  { id: 'orbit', name: 'Spatial', icon: '🚀', era: 7 },
];
