import type { EraDef } from '../types';

export const ERAS: EraDef[] = [
  {
    id: 1,
    name: 'Homelab',
    short: 'Garage',
    icon: '🏠',
    desc: "Un Raspberry Pi qui ronronne sur une étagère du garage, branché sur la box familiale.",
    threshold: 0,
    moveCost: 0,
    base: { space: 3, power: 600, cooling: 80, bw: 8, traffic: 4 },
    energyShare: 0.1,
  },
  {
    id: 2,
    name: 'Placard serveur',
    short: 'Startup',
    icon: '🚪',
    desc: "Vous louez un local pour votre jeune startup : une baie dans un placard ventilé et la fibre.",
    threshold: 5_000,
    moveCost: 1_500,
    base: { space: 12, power: 3_000, cooling: 600, bw: 300, traffic: 30 },
    energyShare: 0.15,
  },
  {
    id: 3,
    name: 'Salle serveur',
    short: 'PME hébergeur',
    icon: '🏢',
    desc: "Une vraie salle machine avec faux plancher, onduleurs et climatisation de précision.",
    threshold: 500_000,
    moveCost: 150_000,
    base: { space: 80, power: 15_000, cooling: 4_000, bw: 10_000, traffic: 300 },
    energyShare: 0.2,
  },
  {
    id: 4,
    name: 'Colocation',
    short: 'Cages en datacenter',
    icon: '🔒',
    desc: "Vos cages grillagées dans un datacenter Tier III, au plus près des points d'échange Internet.",
    threshold: 50_000_000,
    moveCost: 15_000_000,
    base: { space: 600, power: 80_000, cooling: 25_000, bw: 300_000, traffic: 3_000 },
    energyShare: 0.25,
  },
  {
    id: 5,
    name: 'Datacenter régional',
    short: 'Votre propre DC',
    icon: '🏭',
    desc: "Votre propre bâtiment : groupes électrogènes, free cooling et salles blanches à perte de vue.",
    threshold: 20_000_000_000,
    moveCost: 6_000_000_000,
    base: { space: 8_000, power: 600_000, cooling: 200_000, bw: 10_000_000, traffic: 30_000 },
    energyShare: 0.3,
  },
  {
    id: 6,
    name: 'Hyperscale mondial',
    short: 'Cloud planétaire',
    icon: '🌍',
    desc: "Des régions cloud sur tous les continents, reliées par vos propres câbles sous-marins.",
    threshold: 20_000_000_000_000,
    moveCost: 6_000_000_000_000,
    base: { space: 150_000, power: 5_000_000, cooling: 1_500_000, bw: 500_000_000, traffic: 300_000 },
    energyShare: 0.35,
  },
];

export const MAX_ERA = ERAS.length;

export function eraDef(id: number): EraDef {
  return ERAS[Math.max(0, Math.min(ERAS.length - 1, id - 1))];
}
