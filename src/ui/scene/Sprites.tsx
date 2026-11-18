// Dessins SVG des machines (coordonnées de l'image de fond 1600 × 900).
import type { CSSProperties } from 'react';
import type { UnitKind } from './allocate';

/** LED clignotante : la cadence est pilotée par la variable CSS --blink de la scène. */
export function Led({ x, y, r = 3.2, seed, tone = 'status' }: { x: number; y: number; r?: number; seed: number; tone?: 'status' | 'activity' | 'amber' | 'red' }) {
  const style = { animationDelay: `${-((seed * 137) % 1000)}ms` } as CSSProperties;
  return <circle className={`sled sled-${tone}`} cx={x} cy={y} r={r} style={style} />;
}

// --- Ère 1 : appareils de bureau --------------------------------------------

interface DeviceSize {
  w: number;
  h: number;
}

export const DEVICE_SIZE: Record<string, DeviceSize> = {
  pi: { w: 58, h: 18 },
  oldpc: { w: 60, h: 108 },
  nuc: { w: 66, h: 24 },
  nas: { w: 64, h: 76 },
  ups: { w: 52, h: 48 },
};
const DEFAULT_SIZE: DeviceSize = { w: 62, h: 32 };

export function deviceSize(id: string): DeviceSize {
  return DEVICE_SIZE[id] ?? DEFAULT_SIZE;
}

/** Appareil posé, origine en bas à gauche. */
export function Device({ id, x, y, seed }: { id: string; x: number; y: number; seed: number }) {
  const { w, h } = deviceSize(id);
  const top = y - h;
  switch (id) {
    case 'pi':
      return (
        <g>
          <rect x={x} y={top + 4} width={w} height={h - 4} rx={2} fill="#1f7a46" stroke="#0f3d23" />
          <rect x={x + 8} y={top + 7} width={14} height={8} fill="#222" />
          <rect x={x + 30} y={top} width={12} height={8} fill="#b9c2cc" />
          <rect x={x + 44} y={top + 1} width={10} height={7} fill="#b9c2cc" />
          <Led x={x + 52} y={top + 13} r={2.4} seed={seed} tone="red" />
          <Led x={x + 46} y={top + 13} r={2.4} seed={seed + 3} tone="activity" />
        </g>
      );
    case 'oldpc':
      return (
        <g>
          <rect x={x} y={top} width={w} height={h} rx={3} fill="#c9bf9f" stroke="#7e7660" />
          <rect x={x + 6} y={top + 10} width={w - 12} height={10} fill="#a59c80" />
          <rect x={x + 6} y={top + 24} width={w - 12} height={10} fill="#a59c80" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={x + 10} y={top + 54 + i * 7} width={w - 20} height={2.5} fill="#8f876d" />
          ))}
          <Led x={x + w - 12} y={top + h - 12} r={3} seed={seed} tone="status" />
          <Led x={x + w - 22} y={top + h - 12} r={3} seed={seed + 5} tone="amber" />
        </g>
      );
    case 'nuc':
      return (
        <g>
          <rect x={x} y={top} width={w} height={h} rx={5} fill="#1a1f27" stroke="#3a4352" />
          <rect x={x + 6} y={top + h - 6} width={w - 12} height={2} fill="#2c3542" />
          <Led x={x + w - 10} y={top + 9} r={2.8} seed={seed} tone="activity" />
        </g>
      );
    case 'nas':
      return (
        <g>
          <rect x={x} y={top} width={w} height={h} rx={4} fill="#262b33" stroke="#4a5363" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={x + 6 + i * 13.5} y={top + 10} width={11} height={h - 26} rx={1.5} fill="#171b21" />
              <Led x={x + 11.5 + i * 13.5} y={top + h - 9} r={2.2} seed={seed + i * 7} tone="activity" />
            </g>
          ))}
        </g>
      );
    case 'ups':
      return (
        <g>
          <rect x={x} y={top} width={w} height={h} rx={4} fill="#14171c" stroke="#3a3f48" />
          <rect x={x + 8} y={top + 10} width={w - 16} height={12} rx={2} fill="#0a2a33" />
          <Led x={x + w - 12} y={top + h - 10} r={3} seed={seed} tone="amber" />
        </g>
      );
    default:
      return (
        <g>
          <rect x={x} y={top} width={w} height={h} rx={3} fill="#1d2430" stroke="#435064" />
          <Led x={x + w - 10} y={top + h / 2} r={3} seed={seed} tone="activity" />
        </g>
      );
  }
}

// --- Ères 2+ : unités en baie -----------------------------------------------

const UNIT_FILL: Record<UnitKind, string> = {
  server: '#1c2532',
  gpu: '#221d38',
  storage: '#20252d',
  network: '#121922',
  power: '#16181c',
};

/** Unité montée en baie (x, y = coin haut gauche). */
export function RackUnit({ kind, x, y, w, h, seed }: { kind: UnitKind; x: number; y: number; w: number; h: number; seed: number }) {
  const ledR = Math.max(1.8, Math.min(3.4, h * 0.16));
  const cy = y + h / 2;
  return (
    <g className="unit">
      <rect x={x} y={y + 0.8} width={w} height={h - 1.6} rx={1.5} fill={UNIT_FILL[kind]} stroke="#3b475a" strokeWidth={0.8} />
      {kind === 'server' && (
        <>
          <rect x={x + 6} y={cy - 1} width={w * 0.45} height={2} fill="#2f3b4d" />
          <Led x={x + w - 10} y={cy} r={ledR} seed={seed} tone="status" />
          <Led x={x + w - 20} y={cy} r={ledR} seed={seed + 11} tone="activity" />
        </>
      )}
      {kind === 'gpu' && (
        <>
          <rect x={x + 4} y={y + 2.5} width={w * 0.6} height={h - 5} fill="url(#gpuGrille)" />
          <Led x={x + w - 10} y={cy} r={ledR} seed={seed} tone="status" />
          <rect x={x + w * 0.66} y={cy - 1.2} width={w * 0.14} height={2.4} className="gpu-bar" />
        </>
      )}
      {kind === 'storage' && (
        <>
          <rect x={x + 4} y={y + 2} width={w - 22} height={h - 4} fill="url(#driveBays)" />
          <Led x={x + w - 10} y={cy} r={ledR} seed={seed} tone="activity" />
        </>
      )}
      {kind === 'network' && (
        <>
          <rect x={x + 5} y={cy - 2.5} width={w - 30} height={5} fill="url(#ports)" />
          <Led x={x + w - 18} y={cy} r={ledR * 0.8} seed={seed} tone="amber" />
          <Led x={x + w - 10} y={cy} r={ledR * 0.8} seed={seed + 4} tone="activity" />
        </>
      )}
      {kind === 'power' && (
        <>
          <rect x={x + 8} y={cy - 2} width={w * 0.3} height={4} rx={1} fill="#0a2a33" />
          <Led x={x + w - 10} y={cy} r={ledR} seed={seed} tone="amber" />
        </>
      )}
    </g>
  );
}

/** Motifs partagés par les unités en baie. */
export function SpriteDefs() {
  return (
    <defs>
      <pattern id="driveBays" width="9" height="40" patternUnits="userSpaceOnUse">
        <rect x="0.8" y="0" width="7" height="40" fill="#141820" />
        <rect x="2.2" y="0" width="1" height="40" fill="#39434f" />
      </pattern>
      <pattern id="ports" width="7" height="5" patternUnits="userSpaceOnUse">
        <rect x="0.8" y="0.5" width="5" height="4" fill="#05080c" stroke="#3a4656" strokeWidth="0.5" />
      </pattern>
      <pattern id="gpuGrille" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="2.5" r="1.3" fill="#120f20" />
      </pattern>
      <pattern id="perforation" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.1" fill="rgba(0,0,0,0.35)" />
      </pattern>
      <linearGradient id="rackShell" x1="0" x2="1">
        <stop offset="0" stopColor="#0d1219" />
        <stop offset="0.5" stopColor="#1a2230" />
        <stop offset="1" stopColor="#0d1219" />
      </linearGradient>
      <radialGradient id="heatGlow" cx="0.5" cy="0.6" r="0.7">
        <stop offset="0" stopColor="rgba(255,77,40,0.55)" />
        <stop offset="1" stopColor="rgba(255,77,40,0)" />
      </radialGradient>
    </defs>
  );
}
