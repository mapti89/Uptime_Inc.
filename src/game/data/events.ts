import type { EventDef } from '../types';

export const EVENTS: EventDef[] = [
  {
    id: 'disk', name: 'Panne de disque', icon: '💥', era: 1, weight: 10, duration: 0, good: false,
    desc: 'Un disque rend l’âme : 15 % de capacité perdue jusqu’à réparation (moitié moins avec du RAID).',
  },
  {
    id: 'outage', name: 'Coupure de courant', icon: '🔌', era: 1, weight: 7, duration: 25, good: false,
    desc: 'Plus de jus ! Tout s’arrête sans onduleur ni groupe électrogène.',
    fixCostSeconds: 20,
  },
  {
    id: 'heatwave', name: 'Canicule', icon: '🥵', era: 1, weight: 6, duration: 120, good: false,
    desc: 'Il fait 40 °C dehors : refroidissement −35 %.',
    fixCostSeconds: 40,
  },
  {
    id: 'viral', name: 'Buzz viral', icon: '🔥', era: 1, weight: 8, duration: 45, good: true,
    desc: 'Un de vos clients fait le buzz : demande ×3 !',
  },
  {
    id: 'ddos', name: 'Attaque DDoS', icon: '☠️', era: 2, weight: 7, duration: 60, good: false,
    desc: 'Un botnet sature vos liens : bande passante −70 % (sauf protection anti-DDoS).',
    fixCostSeconds: 30,
  },
  {
    id: 'acleak', name: 'Fuite de clim', icon: '💧', era: 2, weight: 5, duration: 90, good: false,
    desc: 'De l’eau sous le faux plancher : refroidissement −20 % et 5 % de dégâts.',
    fixCostSeconds: 25,
  },
  {
    id: 'elecspike', name: 'Flambée du prix de l’électricité', icon: '📈', era: 2, weight: 5, duration: 180, good: false,
    desc: 'Le prix du kWh est multiplié par 3.',
  },
  {
    id: 'investor', name: 'Business angel', icon: '😇', era: 2, weight: 4, duration: 0, good: true,
    desc: 'Un investisseur croit en vous : +90 s de revenus immédiatement.',
  },
  {
    id: 'blackfriday', name: 'Black Friday', icon: '🛍️', era: 3, weight: 4, duration: 90, good: true,
    desc: 'Les boutiques en ligne s’affolent : demande ×2,5 !',
  },
  {
    id: 'audit', name: 'Audit de sécurité réussi', icon: '✅', era: 3, weight: 4, duration: 0, good: true,
    desc: 'Le rapport est élogieux : réputation +10.',
  },
  {
    id: 'fiber_cut', name: 'Coup de pelleteuse', icon: '🚜', era: 3, weight: 4, duration: 60, good: false,
    desc: 'Une fibre arrachée sur un chantier : bande passante −50 %.',
    fixCostSeconds: 30,
  },
  {
    id: 'solarflare', name: 'Éruption solaire', icon: '🌞', era: 5, weight: 3, duration: 60, good: false,
    desc: 'Des bits flippent partout : 10 % de dégâts.',
  },
];

export const EVENT_BY_ID: Record<string, EventDef> = Object.fromEntries(EVENTS.map((e) => [e.id, e]));
