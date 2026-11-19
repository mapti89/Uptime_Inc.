import { memo, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useGame } from '../../game/store';
import { BUILDINGS } from '../../game/data/buildings';
import { EVENT_BY_ID } from '../../game/data/events';
import { fmt } from '../format';
import { eraScene, SCENE_H, SCENE_W, type BenchLayout, type RackLayout } from '../scene/layout';
import { benchDevices, rackUnits } from '../scene/allocate';
import { Device, deviceSize, RackUnit, SpriteDefs } from '../scene/Sprites';

/** Clé stable du parc de machines (le state est cloné à chaque tick). */
function machineKey(owned: Record<string, number>): string {
  let k = '';
  for (const b of BUILDINGS) if (b.slots > 0 && owned[b.id]) k += `${b.id}:${owned[b.id]},`;
  return k;
}

function parseKey(key: string): Record<string, number> {
  const owned: Record<string, number> = {};
  for (const part of key.split(',')) {
    if (!part) continue;
    const [id, n] = part.split(':');
    owned[id] = Number(n);
  }
  return owned;
}

// --- Couches de la scène (mémoïsées : ne bougent qu'à l'achat) ---------------

const BenchLayer = memo(function BenchLayer({ layout, ownedKey }: { layout: BenchLayout; ownedKey: string }) {
  const devices = benchDevices(BUILDINGS, parseKey(ownedKey));
  const gap = 12;
  const total = devices.reduce((a, d) => a + deviceSize(d.id).w, 0) + gap * Math.max(0, devices.length - 1);
  const tallest = Math.max(1, ...devices.map((d) => deviceSize(d.id).h));
  const scale = Math.min(2.4, layout.maxH / tallest, layout.w / Math.max(1, total));
  const width = total * scale;
  let x = layout.x + (layout.w - width) / 2;
  return (
    <g>
      {devices.map((d, i) => {
        const w = deviceSize(d.id).w * scale;
        const gx = x;
        x += w + gap * scale;
        return (
          <g key={`${i}-${d.id}`} className="unit" transform={`translate(${gx} ${layout.floor}) scale(${scale})`}>
            <ellipse cx={deviceSize(d.id).w / 2} cy={2} rx={deviceSize(d.id).w * 0.55} ry={5} fill="rgba(0,0,0,0.35)" />
            <Device id={d.id} x={0} y={0} seed={i} />
          </g>
        );
      })}
    </g>
  );
});

const RackLayer = memo(function RackLayer({
  layout,
  ownedKey,
  slotsUsed,
  slotsCap,
}: {
  layout: RackLayout;
  ownedKey: string;
  slotsUsed: number;
  slotsCap: number;
}) {
  const { racks, unitsPerRack: per, shell } = layout;
  const units = rackUnits(BUILDINGS, parseKey(ownedKey), slotsUsed, slotsCap, racks.length, per);
  const inner = racks.map((r) =>
    shell ? { x: r.x + 9, y: r.y + 14, w: r.w - 18, h: r.h - 26 } : { x: r.x + 4, y: r.y, w: r.w - 8, h: r.h },
  );
  const uh = inner[0].h / per;
  return (
    <g>
      <defs>
        <pattern id="rails" x={inner[0].x} y={inner[0].y} width={inner[0].w} height={uh} patternUnits="userSpaceOnUse">
          <rect width={inner[0].w} height={uh} fill="#070b11" />
          <rect y={uh - 1.2} width={inner[0].w} height={1.2} fill="#1a2433" />
          <circle cx={4} cy={uh / 2} r={1.4} fill="#2a3648" />
          <circle cx={inner[0].w - 4} cy={uh / 2} r={1.4} fill="#2a3648" />
        </pattern>
      </defs>
      {shell &&
        racks.map((r, i) => (
          <g key={`shell-${i}`}>
            <ellipse cx={r.x + r.w / 2} cy={r.y + r.h + 4} rx={r.w * 0.62} ry={10} fill="rgba(0,0,0,0.45)" />
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={4} fill="url(#rackShell)" stroke="#2d3a4f" strokeWidth={2} />
            <rect x={inner[i].x} y={inner[i].y} width={inner[i].w} height={inner[i].h} fill="url(#rails)" />
            <rect x={r.x + 3} y={r.y + 3} width={r.w - 6} height={6} rx={2} className="rack-cap" />
          </g>
        ))}
      {units.map((u) => {
        const box = inner[u.rack];
        const uh = box.h / per;
        return (
          <RackUnit
            key={`${u.rack}-${u.start}`}
            kind={u.kind}
            x={box.x}
            y={box.y + box.h - (u.start + u.size) * uh}
            w={box.w}
            h={u.size * uh}
            seed={u.rack * 31 + u.start}
          />
        );
      })}
      {shell &&
        racks.map((_, i) => (
          // Porte perforée par-dessus : donne de la matière sans masquer les LEDs.
          <rect key={`door-${i}`} x={inner[i].x} y={inner[i].y} width={inner[i].w} height={inner[i].h} fill="url(#perforation)" pointerEvents="none" />
        ))}
    </g>
  );
});

/** Paquets réseau qui circulent du point d'entrée vers les machines. */
const Packets = memo(function Packets({
  from,
  to,
  count,
  dropped,
  dur,
}: {
  from: [number, number];
  to: [number, number];
  count: number;
  dropped: number;
  dur: number;
}) {
  const id = useId().replace(/:/g, '');
  const cx = (from[0] + to[0]) / 2;
  const cy = Math.min(from[1], to[1]) - 90;
  const d = `M ${from[0]} ${from[1]} Q ${cx} ${cy} ${to[0]} ${to[1]}`;
  return (
    <g className="packets">
      <path id={`p${id}`} d={d} className="packet-cable" />
      {Array.from({ length: count }, (_, i) => {
        // Paquets perdus répartis dans le flux plutôt que groupés
        const drop = Math.floor(((i + 1) * dropped) / count) > Math.floor((i * dropped) / count);
        return (
          <circle key={`${i}-${drop}`} r={drop ? 10 : 9} className={drop ? 'packet drop' : 'packet'}>
            <animateMotion
              dur={`${dur}s`}
              begin={`${-(i * dur) / count}s`}
              repeatCount="indefinite"
              keyPoints={drop ? '0;0.6' : '0;1'}
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href={`#p${id}`} />
            </animateMotion>
            {drop && <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.7;1" dur={`${dur}s`} begin={`${-(i * dur) / count}s`} repeatCount="indefinite" />}
          </circle>
        );
      })}
    </g>
  );
});

// --- Composant principal ------------------------------------------------------

export function ServerRoom({ compact = false }: { compact?: boolean } = {}) {
  const era = useGame((g) => g.state.era);
  const ownedKey = useGame((g) => machineKey(g.state.owned));
  const slotsUsed = useGame((g) => g.snap.slotsUsed);
  const slotsCap = useGame((g) => g.snap.slotsCap);
  const clickValue = useGame((g) => g.snap.clickValue);
  const served = useGame((g) => g.snap.totalServed);
  const demand = useGame((g) => g.snap.totalDemand);
  const efficiency = useGame((g) => g.snap.efficiency);
  const powerFactor = useGame((g) => g.snap.powerFactor);
  const coolFactor = useGame((g) => g.snap.coolFactor);
  const eventsKey = useGame((g) => g.state.events.map((e) => e.defId).join(','));
  const floaters = useGame((g) => g.floaters);
  const click = useGame((g) => g.click);

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const clicks = useRef<number[]>([]);
  const rippleId = useRef(0);
  const comboTimer = useRef<number>();

  const scene = eraScene(era);
  const events = eventsKey ? eventsKey.split(',') : [];
  const badEvents = events.filter((id) => !EVENT_BY_ID[id]?.good);

  // Charge (quantifiée pour ne pas relancer les animations à chaque tick)
  const load = Math.round(Math.min(1, Math.log10(1 + served) / 6) * 10) / 10;
  const quality = demand > 0 ? served / demand : 1;
  const status = efficiency <= 0.01 ? 'down' : efficiency < 0.8 || quality < 0.8 ? 'degraded' : 'ok';
  const blackout = powerFactor <= 0.01;
  const brownout = !blackout && powerFactor < 0.999;
  const hot = coolFactor < 0.999 || events.includes('heatwave') || events.includes('acleak');
  const ddos = events.includes('ddos');

  const packetCount = served <= 0 || blackout ? 0 : Math.max(1, Math.min(12, Math.round(Math.log10(1 + served) * 2)));
  const dropped = Math.min(packetCount, Math.round(packetCount * (1 - quality) + (ddos ? 3 : 0)));
  const packetDur = Math.round((3 - load * 1.6) * 5) / 5;

  const target: [number, number] =
    scene.layout.mode === 'bench'
      ? [scene.layout.x + scene.layout.w / 2, scene.layout.floor - 30]
      : (() => {
          const r = scene.layout.racks;
          const mid = r[Math.floor(r.length / 2)];
          return [mid.x + mid.w / 2, mid.y + 20] as [number, number];
        })();

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    click(x, y);

    const id = rippleId.current++;
    setRipples((r) => [...r.slice(-4), { id, x, y }]);
    window.setTimeout(() => setRipples((r) => r.filter((o) => o.id !== id)), 600);

    const now = performance.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 1500), now];
    setCombo(clicks.current.length);
    window.clearTimeout(comboTimer.current);
    comboTimer.current = window.setTimeout(() => setCombo(0), 1500);
  };

  const classes = [
    'scene',
    `status-${status}`,
    hot && 'hot',
    brownout && 'brownout',
    blackout && 'blackout',
    badEvents.length > 0 && 'alarm',
    ddos && 'ddos',
  ]
    .filter(Boolean)
    .join(' ');

  const statusLabel = blackout ? 'Panne de courant' : status === 'down' ? 'Hors service' : status === 'degraded' ? 'Dégradé' : 'Opérationnel';

  return (
    <div className={`panel server-room ${compact ? 'compact' : ''}`}>
      <button
        className={classes}
        style={{ '--blink': `${0.35 + (1 - load) * 1.4}s` } as CSSProperties}
        onClick={onClick}
        title="Cliquez pour traiter des requêtes à la main"
      >
        <svg className="scene-svg" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <SpriteDefs />
          <g className="scene-world">
            <image key={scene.background} className="scene-bg" href={scene.background} width={SCENE_W} height={SCENE_H} />
            {scene.layout.mode === 'bench' ? (
              <BenchLayer layout={scene.layout} ownedKey={ownedKey} />
            ) : (
              <RackLayer layout={scene.layout} ownedKey={ownedKey} slotsUsed={slotsUsed} slotsCap={slotsCap} />
            )}
            <Packets from={scene.packetFrom} to={target} count={packetCount} dropped={dropped} dur={packetDur} />
            {hot && <rect className="heat-overlay" width={SCENE_W} height={SCENE_H} fill="url(#heatGlow)" />}
          </g>
        </svg>

        {slotsUsed === 0 && <span className="scene-empty">Achetez une première machine dans l’onglet Infrastructure 👇</span>}

        <div className="scene-hud">
          <span className={`scene-status ${blackout ? 'down' : status}`}>
            <i /> {statusLabel}
          </span>
          <span className="scene-metric">{fmt(served)} req/s</span>
        </div>
        {badEvents.length > 0 && <span className="beacon" />}

        <div className="scene-cta">
          ⌨️ Traiter manuellement <strong>+{fmt(clickValue)} $</strong>
        </div>
        {combo >= 5 && (
          <span key={combo} className="combo">
            Combo ×{combo}
          </span>
        )}

        {ripples.map((r) => (
          <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
        ))}
        {floaters.map((f) => (
          <span
            key={f.id}
            className="floater"
            style={{ left: f.x, top: f.y, '--rot': `${((f.id * 47) % 24) - 12}deg`, '--dx': `${((f.id * 29) % 60) - 30}px` } as CSSProperties}
          >
            {f.text}
          </span>
        ))}
      </button>
    </div>
  );
}
