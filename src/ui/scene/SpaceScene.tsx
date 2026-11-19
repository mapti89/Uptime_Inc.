import { memo, useState } from 'react';
import { GALAXY_STARS } from '../../game/data/galaxy';
import { SCENE_H, SCENE_W, type Body, type SpaceKind } from './layout';

// ---------------------------------------------------------------------------
// Décors de la conquête spatiale : l'orbite terrestre (ères 7 à 9), le système
// solaire (ère 10) et la galaxie (ères 11 et 12). Une illustration peinte sert
// de fond (Terre, Lune, Soleil, nébuleuses) ; le SVG dessine par-dessus tout
// ce qui dépend du parc. Le nombre d'objets suit le parc sur une échelle
// logarithmique pour rester lisible quelle que soit la quantité possédée.
// Si l'illustration manque, le décor entier est dessiné en SVG.
// ---------------------------------------------------------------------------

/** Générateur pseudo-aléatoire déterministe (le décor ne « saute » pas d'un rendu à l'autre). */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Nombre d'objets dessinés pour `n` exemplaires possédés. */
function shown(n: number, max: number): number {
  if (n <= 0) return 0;
  return Math.min(max, Math.ceil(Math.log2(1 + n) * 2));
}

const Starfield = memo(function Starfield({ count, seed }: { count: number; seed: number }) {
  const r = rng(seed);
  return (
    <g className="starfield">
      {Array.from({ length: count }, (_, i) => {
        const x = r() * SCENE_W;
        const y = r() * SCENE_H;
        const size = r() < 0.08 ? 2.2 : r() * 1.3 + 0.4;
        return <circle key={i} cx={x} cy={y} r={size} className={i % 7 === 0 ? 'star twinkle' : 'star'} style={{ animationDelay: `${(i % 13) * 0.4}s` }} />;
      })}
    </g>
  );
});

function SpaceDefs() {
  return (
    <defs>
      <radialGradient id="spaceBg" cx="50%" cy="40%" r="80%">
        <stop offset="0%" stopColor="#0d1a33" />
        <stop offset="60%" stopColor="#060b18" />
        <stop offset="100%" stopColor="#02040a" />
      </radialGradient>
      <radialGradient id="earth" cx="40%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#4fc3f7" />
        <stop offset="45%" stopColor="#1565c0" />
        <stop offset="80%" stopColor="#0b2e5c" />
        <stop offset="100%" stopColor="#04152b" />
      </radialGradient>
      <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
        <stop offset="88%" stopColor="#4fc3f7" stopOpacity="0" />
        <stop offset="95%" stopColor="#4fc3f7" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="moon" cx="35%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#e0e0e0" />
        <stop offset="70%" stopColor="#8d8d8d" />
        <stop offset="100%" stopColor="#3d3d3d" />
      </radialGradient>
      <radialGradient id="sun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fffde7" />
        <stop offset="35%" stopColor="#ffd54f" />
        <stop offset="70%" stopColor="#ff8f00" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ff6f00" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.95" />
        <stop offset="25%" stopColor="#ffcc80" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#7c4dff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#7c4dff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="dyson" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffab40" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#ff6d00" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ff6d00" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** Petit satellite : corps + deux panneaux solaires. */
function Satellite({ x, y, s = 1, kind = 'sat' }: { x: number; y: number; s?: number; kind?: 'sat' | 'station' | 'swarm' }) {
  if (kind === 'swarm') return <circle cx={x} cy={y} r={2.2 * s} className="sat-swarm" />;
  const w = kind === 'station' ? 16 : 9;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={`sat ${kind}`}>
      <rect x={-w - 10} y={-3} width={10} height={6} className="sat-panel" />
      <rect x={w} y={-3} width={10} height={6} className="sat-panel" />
      <rect x={-w / 2} y={-5} width={w} height={10} rx={2} className="sat-body" />
      <circle cx={0} cy={0} r={1.6} className="sat-led" />
    </g>
  );
}

// --- Acte II : orbite terrestre et Lune -----------------------------------------

const OrbitScene = memo(function OrbitScene({
  ownedKey,
  era,
  debrisLoad,
  earth,
  moon,
  painted,
}: {
  ownedKey: string;
  era: number;
  debrisLoad: number;
  earth: Body;
  moon: Body | null;
  painted: boolean;
}) {
  const owned = Object.fromEntries(ownedKey.split(',').filter(Boolean).map((p) => p.split(':')).map(([k, v]) => [k, Number(v)]));
  const { x: ex, y: ey, r: er } = earth;
  const spin = { transformOrigin: `${ex}px ${ey - er * 0.5}px` };
  const leo = { rx: er + 150, ry: er * 0.42 + 150 };
  const geo = { rx: er + 520, ry: er * 0.42 + 360 };
  const r = rng(7);

  const leoSats = [
    ...Array.from({ length: shown(owned.orbital ?? 0, 10) }, () => 'sat' as const),
    ...Array.from({ length: shown(owned.orbmodule ?? 0, 6) }, () => 'station' as const),
    ...Array.from({ length: shown(owned.leoarchive ?? 0, 6) }, () => 'sat' as const),
  ];
  const swarm = shown(owned.swarm ?? 0, 14) * 4;
  const geoSats = shown((owned.geostation ?? 0) + (owned.optsat ?? 0), 12);
  const launches = shown((owned.launchpad ?? 0) + (owned.reusable ?? 0) + (owned.superheavy ?? 0), 4);
  const debris = Math.min(60, Math.round(debrisLoad * 30));

  const onEllipse = (o: { rx: number; ry: number }, a: number): [number, number] => [ex + o.rx * Math.cos(a), ey - er * 0.5 + o.ry * Math.sin(a)];

  return (
    <g>
      {/* Orbites */}
      <ellipse cx={ex} cy={ey - er * 0.5} rx={leo.rx} ry={leo.ry} className="orbit-line" />
      {era >= 8 && <ellipse cx={ex} cy={ey - er * 0.5} rx={geo.rx} ry={geo.ry} className="orbit-line geo" />}

      {/* Lune et installations lunaires */}
      {moon && (
        <g className="moon">
          {!painted && (
            <>
              <circle cx={moon.x} cy={moon.y} r={moon.r} fill="url(#moon)" />
              {[[-40, -30, 18], [30, 20, 26], [-10, 55, 12], [55, -45, 10]].map(([dx, dy, rr], i) => (
                <circle key={i} cx={moon.x + (dx * moon.r) / 120} cy={moon.y + (dy * moon.r) / 120} r={(rr * moon.r) / 120} className="crater" />
              ))}
            </>
          )}
          {/* Bases lunaires : lumières sur la face visible, côté sud */}
          {Array.from({ length: shown((owned.lavatube ?? 0) + (owned.lunarvault ?? 0) + (owned.moonbase ?? 0), 10) }, (_, i) => (
            <circle
              key={i}
              cx={moon.x + ((-60 + (i % 5) * 26) * moon.r) / 120}
              cy={moon.y + ((40 + Math.floor(i / 5) * 18) * moon.r) / 120}
              r={3.5}
              className="city-light"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
          {(owned.l2hub ?? 0) > 0 && <Satellite x={Math.min(SCENE_W - 60, moon.x + moon.r * 1.6)} y={Math.max(60, moon.y - moon.r * 0.9)} s={1.4} kind="station" />}
          {(owned.massdriver ?? 0) > 0 && (
            <path d={`M ${moon.x - moon.r * 0.66} ${moon.y + moon.r * 0.66} L ${moon.x - moon.r * 1.33} ${moon.y + moon.r * 1.42}`} className="mass-driver" />
          )}
        </g>
      )}

      {/* Satellites en orbite basse (le groupe tourne lentement autour de la Terre) */}
      <g className="orbit-spin slow" style={spin}>
        {leoSats.map((k, i) => {
          const [x, y] = onEllipse(leo, Math.PI + (i / Math.max(1, leoSats.length)) * Math.PI + r() * 0.1);
          return <Satellite key={i} x={x} y={y} kind={k} s={0.9} />;
        })}
        {Array.from({ length: swarm }, (_, i) => {
          const [x, y] = onEllipse({ rx: leo.rx + 40 + r() * 50, ry: leo.ry + 30 + r() * 40 }, Math.PI * (1 + r()));
          return <Satellite key={`sw${i}`} x={x} y={y} kind="swarm" />;
        })}
      </g>
      <g className="orbit-spin slower" style={spin}>
        {Array.from({ length: geoSats }, (_, i) => {
          const [x, y] = onEllipse(geo, Math.PI * (1.05 + (i / Math.max(1, geoSats)) * 0.9));
          return <Satellite key={i} x={x} y={y} kind="station" s={1.1} />;
        })}
      </g>

      {/* Débris */}
      {Array.from({ length: debris }, (_, i) => {
        const [x, y] = onEllipse({ rx: leo.rx + r() * 80 - 40, ry: leo.ry + r() * 60 - 30 }, Math.PI * (1 + r()));
        return <rect key={`d${i}`} x={x} y={y} width={3} height={2} className={`debris ${debrisLoad > 1 ? 'hot' : ''}`} transform={`rotate(${r() * 90} ${x} ${y})`} />;
      })}

      {/* Terre (dessinée seulement sans illustration) */}
      {!painted && (
        <>
          <circle cx={ex} cy={ey} r={er + 40} fill="url(#atmo)" />
          <circle cx={ex} cy={ey} r={er} fill="url(#earth)" />
          <g className="clouds">
            {[[-220, -540, 120], [60, -580, 160], [260, -470, 90], [-380, -380, 110]].map(([dx, dy, w], i) => (
              <ellipse key={i} cx={ex + (dx * er) / 600} cy={ey + (dy * er) / 600} rx={(w * er) / 600} ry={14} />
            ))}
          </g>
        </>
      )}

      {/* Lancements */}
      {Array.from({ length: launches }, (_, i) => {
        const sx = ex - er * 0.27 + i * er * 0.18;
        const sy = ey - Math.sqrt(er * er - (sx - ex) ** 2) + 4;
        const d = `M ${sx} ${sy} Q ${sx + 40} ${sy - 220} ${sx + 220} ${sy - 380}`;
        return (
          <g key={i} className="launch">
            <path id={`launch-${i}`} d={d} className="launch-trail" style={{ animationDelay: `${i * 2.3}s` }} />
            <circle r={4} className="rocket">
              <animateMotion dur="6s" begin={`${i * 2.3}s`} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear">
                <mpath href={`#launch-${i}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}
    </g>
  );
});

// --- Acte II bis : le système solaire ------------------------------------------

const PLANETS: { id: string; name: string; a: number; r: number; color: string; dur: number; owners: string[] }[] = [
  { id: 'mercury', name: 'Mercure', a: 120, r: 7, color: '#bcaaa4', dur: 40, owners: ['mercuryring'] },
  { id: 'venus', name: 'Vénus', a: 175, r: 10, color: '#ffe0b2', dur: 70, owners: [] },
  { id: 'earth', name: 'Terre', a: 240, r: 11, color: '#4fc3f7', dur: 110, owners: ['*'] },
  { id: 'mars', name: 'Mars', a: 315, r: 9, color: '#ff7043', dur: 190, owners: ['marsdc', 'marscolonies'] },
  { id: 'jupiter', name: 'Jupiter', a: 520, r: 26, color: '#d7ccc8', dur: 600, owners: ['europa'] },
  { id: 'saturn', name: 'Saturne', a: 680, r: 21, color: '#ffe082', dur: 900, owners: ['titancryo'] },
];

const SystemScene = memo(function SystemScene({ ownedKey, sun, painted }: { ownedKey: string; sun: Body; painted: boolean }) {
  const owned = Object.fromEntries(ownedKey.split(',').filter(Boolean).map((p) => p.split(':')).map(([k, v]) => [k, Number(v)]));
  const { x: sx, y: sy } = sun;
  const flat = 0.36;
  const r = rng(11);
  const belt = shown(owned.asteroidcore ?? 0, 12);
  return (
    <g>
      {!painted && (
        <>
          <circle cx={sx} cy={sy} r={110} fill="url(#sun)" className="sun-glow" />
          <circle cx={sx} cy={sy} r={sun.r} fill="#fff3c4" />
        </>
      )}
      {(owned.mercuryring ?? 0) > 0 && <ellipse cx={sx} cy={sy} rx={120} ry={120 * flat} className="dyson-ring" />}
      {PLANETS.map((p) => {
        const colonized = p.owners.includes('*') || p.owners.some((o) => (owned[o] ?? 0) > 0);
        const path = `M ${sx - p.a} ${sy} a ${p.a} ${p.a * flat} 0 1 0 ${2 * p.a} 0 a ${p.a} ${p.a * flat} 0 1 0 ${-2 * p.a} 0`;
        return (
          <g key={p.id}>
            <path id={`orb-${p.id}`} d={path} className={`orbit-line ${colonized ? 'claimed' : ''}`} />
            <g>
              <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" begin={`-${(p.a * 7) % p.dur}s`}>
                <mpath href={`#orb-${p.id}`} />
              </animateMotion>
              {colonized && <circle r={p.r + 9} className="colony-halo" />}
              <circle r={p.r} fill={p.color} />
              {p.id === 'saturn' && <ellipse rx={p.r * 1.9} ry={p.r * 0.5} className="saturn-ring" />}
              {colonized && <circle r={2.5} cx={p.r * 0.5} cy={-p.r * 0.4} className="city-light" />}
            </g>
          </g>
        );
      })}
      {/* Ceinture d'astéroïdes */}
      <g className="belt">
        {Array.from({ length: 140 }, (_, i) => {
          const a = r() * Math.PI * 2;
          const d = 400 + r() * 50;
          const mined = i < belt * 6;
          return <circle key={i} cx={sx + d * Math.cos(a)} cy={sy + d * flat * Math.sin(a)} r={mined ? 2.4 : 1.4} className={mined ? 'asteroid mined' : 'asteroid'} />;
        })}
      </g>
    </g>
  );
});

// --- Acte III : la galaxie -----------------------------------------------------

const GALAXY_POINTS = (() => {
  const r = rng(42);
  const pts: { x: number; y: number; d: number; size: number }[] = [];
  const arms = 4;
  for (let i = 0; i < 1100; i++) {
    const arm = i % arms;
    const t = Math.pow(r(), 0.7) * 3.4;
    const angle = t * 1.9 + (arm * Math.PI * 2) / arms + (r() - 0.5) * 0.55;
    const radius = 40 + t * 125 + (r() - 0.5) * 40;
    pts.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) * 0.55, d: 0, size: r() < 0.05 ? 2.6 : 1 + r() * 1.2 });
  }
  // Point de départ : un bras extérieur (comme notre Soleil). La colonisation
  // s'étend depuis là, les plus proches d'abord.
  const home = pts[Math.floor(pts.length * 0.62)];
  for (const p of pts) p.d = Math.hypot(p.x - home.x, (p.y - home.y) / 0.55);
  const order = [...pts].sort((a, b) => a.d - b.d);
  return { pts, order, home };
})();

const GalaxyScene = memo(function GalaxyScene({ starsLog, dyson }: { starsLog: number; dyson: number }) {
  const { pts, order, home } = GALAXY_POINTS;
  const cx = 800;
  const cy = 440;
  const frac = Math.min(1, starsLog / Math.log10(GALAXY_STARS));
  const lit = new Set(order.slice(0, Math.round(frac * order.length)));
  const spheres = order.slice(0, Math.min(lit.size, shown(dyson, 14))).filter((_, i) => i % 3 === 0 || i < 4);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className="galaxy-spin">
        <ellipse rx={560} ry={300} fill="url(#core)" opacity={0.35} />
        <circle r={150} fill="url(#core)" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} className={lit.has(p) ? 'gstar lit' : 'gstar'} />
        ))}
        {spheres.map((p, i) => (
          <circle key={`ds${i}`} cx={p.x} cy={p.y} r={9} fill="url(#dyson)" className="dyson" />
        ))}
        <circle cx={home.x} cy={home.y} r={6} className="home-star" />
      </g>
    </g>
  );
});

// --- Point d'entrée -------------------------------------------------------------

export function SpaceScene({
  kind,
  era,
  ownedKey,
  debrisLoad,
  stars,
  dyson,
  background,
  earth,
  moon,
  sun,
}: {
  kind: SpaceKind;
  era: number;
  ownedKey: string;
  debrisLoad: number;
  stars: number;
  dyson: number;
  /** Illustration de fond ; null ou introuvable : décor entièrement procédural. */
  background: string | null;
  earth: Body;
  moon: Body | null;
  sun: Body;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const painted = !!background && failed !== background;
  // Quantifiés pour ne pas recalculer le décor à chaque tick.
  const debrisQ = Math.round(debrisLoad * 10) / 10;
  const starsLog = Math.round(Math.log10(Math.max(1, stars)) * 20) / 20;
  return (
    <g className={`space-scene space-${kind}`}>
      <SpaceDefs />
      <rect width={SCENE_W} height={SCENE_H} fill="url(#spaceBg)" />
      {painted ? (
        <image key={background} className="scene-bg" href={background!} width={SCENE_W} height={SCENE_H} onError={() => setFailed(background)} />
      ) : (
        <Starfield count={kind === 'galaxy' ? 90 : 160} seed={kind === 'galaxy' ? 3 : 1} />
      )}
      {kind === 'orbit' && <OrbitScene ownedKey={ownedKey} era={era} debrisLoad={debrisQ} earth={earth} moon={moon} painted={painted} />}
      {kind === 'system' && <SystemScene ownedKey={ownedKey} sun={sun} painted={painted} />}
      {kind === 'galaxy' && <GalaxyScene starsLog={starsLog} dyson={dyson} />}
    </g>
  );
}

/** Point visé par les paquets réseau dans les scènes spatiales. */
export function spaceTarget(kind: SpaceKind): [number, number] {
  if (kind === 'orbit') return [880, 300];
  if (kind === 'system') return [1115, 450];
  return [800, 440];
}

/** Point d'entrée des paquets dans les scènes spatiales. */
export function spaceSource(kind: SpaceKind): [number, number] {
  if (kind === 'orbit') return [560, 470];
  if (kind === 'system') return [560, 450];
  return [300, 760];
}
