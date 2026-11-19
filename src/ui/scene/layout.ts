// ---------------------------------------------------------------------------
// Géométrie de la scène « salle serveur », en coordonnées de l'image de fond
// (1600 × 900). Les emplacements reprennent public/assets/manifest.json,
// ajustés à la main sur les éléments du décor (établi, cadre de baie,
// marquages au sol, cage…).
// ---------------------------------------------------------------------------

export const SCENE_W = 1600;
export const SCENE_H = 900;

export interface RackSlot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BenchLayout {
  mode: 'bench';
  /** Zone horizontale disponible sur le plan de travail. */
  x: number;
  w: number;
  /** Ligne où les appareils reposent. */
  floor: number;
  /** Hauteur max d'un appareil. */
  maxH: number;
}

export interface RackLayout {
  mode: 'racks';
  racks: RackSlot[];
  /** Nombre d'unités visuelles par baie (indépendant des 42U réels). */
  unitsPerRack: number;
  /** Dessiner la carrosserie des baies (faux à l'ère 2 : le cadre est dans le décor). */
  shell: boolean;
}

/** Scènes de la conquête spatiale, dessinées entièrement en SVG. */
export type SpaceKind = 'orbit' | 'system' | 'galaxy';

/** Astre peint dans l'illustration (pixels de la scène 1600 × 900). */
export interface Body {
  x: number;
  y: number;
  r: number;
}

export interface SpaceLayout {
  mode: 'space';
  kind: SpaceKind;
  /** Astres peints dans le fond (mesurés dans public/assets/manifest.json). */
  earth: Body;
  moon: Body | null;
  sun: Body;
}

/** Repères normalisés du manifeste → pixels de la scène. */
const body = (cx: number, cy: number, r: number): Body => ({ x: cx * SCENE_W, y: cy * SCENE_H, r: r * SCENE_W });

/** Géométrie par défaut (décor procédural, sans illustration). */
const DEFAULT_EARTH: Body = { x: 470, y: 1040, r: 600 };
const DEFAULT_MOON: Body = { x: 1310, y: 250, r: 120 };
const DEFAULT_SUN: Body = { x: 800, y: 450, r: 34 };

const SPACE_SCENES: Record<number, { earth?: Body; moon?: Body; sun?: Body }> = {
  7: { earth: body(0.2698, 1.1359, 0.3393) },
  8: { earth: body(0.2695, 1.1357, 0.3393) },
  9: { earth: body(0.2697, 1.1349, 0.3388), moon: body(0.8168, 0.2905, 0.0753) },
  10: { sun: body(0.5, 0.5, 0.0209) },
  11: {},
  12: {},
};

export interface EraScene {
  /** Illustration de fond (null : décor procédural de la conquête spatiale). */
  background: string | null;
  transition: string | null;
  layout: BenchLayout | RackLayout | SpaceLayout;
  /** Point d'arrivée du trafic Internet (box, boîtier fibre, chemin de câbles…). */
  packetFrom: [number, number];
}

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

function row(count: number, startX: number, w: number, gap: number, bottom: number, h: number): RackSlot[] {
  return Array.from({ length: count }, (_, i) => ({ x: startX + i * (w + gap), y: bottom - h, w, h }));
}

export const ERA_SCENES: Record<number, EraScene> = {
  1: {
    background: asset('assets/eras/era-1.webp'),
    transition: null,
    layout: { mode: 'bench', x: 400, w: 780, floor: 506, maxH: 210 },
    packetFrom: [468, 214],
  },
  2: {
    background: asset('assets/eras/era-2.webp'),
    transition: asset('assets/transitions/era-2.webp'),
    layout: { mode: 'racks', racks: [{ x: 684, y: 238, w: 262, h: 502 }], unitsPerRack: 24, shell: false },
    packetFrom: [1230, 330],
  },
  3: {
    background: asset('assets/eras/era-3.webp'),
    transition: asset('assets/transitions/era-3.webp'),
    // Posées sur les 5 emplacements marqués au sol.
    layout: {
      mode: 'racks',
      racks: [290, 512, 722, 937, 1157].map((x) => ({ x, y: 300, w: 156, h: 392 })),
      unitsPerRack: 20,
      shell: true,
    },
    packetFrom: [300, 140],
  },
  4: {
    background: asset('assets/eras/era-4.webp'),
    transition: asset('assets/transitions/era-4.webp'),
    layout: { mode: 'racks', racks: row(4, 470, 150, 20, 722, 420), unitsPerRack: 20, shell: true },
    packetFrom: [660, 112],
  },
  5: {
    background: asset('assets/eras/era-5.webp'),
    transition: asset('assets/transitions/era-5.webp'),
    layout: { mode: 'racks', racks: row(6, 335, 140, 18, 724, 400), unitsPerRack: 20, shell: true },
    packetFrom: [240, 170],
  },
  6: {
    background: asset('assets/eras/era-6.webp'),
    transition: asset('assets/transitions/era-6.webp'),
    layout: { mode: 'racks', racks: row(7, 376, 110, 13, 756, 360), unitsPerRack: 20, shell: true },
    packetFrom: [1190, 215],
  },
};

/** Acte II (orbite, système solaire) puis acte III (galaxie). */
export function spaceKind(era: number): SpaceKind | null {
  if (era >= 11) return 'galaxy';
  if (era >= 10) return 'system';
  if (era >= 7) return 'orbit';
  return null;
}

export function eraScene(era: number): EraScene {
  const kind = spaceKind(era);
  if (kind) {
    const e = Math.min(12, era);
    const g = SPACE_SCENES[e] ?? {};
    return {
      background: asset(`assets/eras/era-${e}.webp`),
      transition: asset(`assets/transitions/era-${e}.webp`),
      layout: {
        mode: 'space',
        kind,
        earth: g.earth ?? DEFAULT_EARTH,
        moon: e >= 9 ? (g.moon ?? DEFAULT_MOON) : null,
        sun: g.sun ?? DEFAULT_SUN,
      },
      packetFrom: [560, 520],
    };
  }
  return ERA_SCENES[Math.max(1, Math.min(6, era))];
}

/** Illustration de l'écran de fin. */
export const VICTORY_IMAGE = asset('assets/transitions/victory.webp');
