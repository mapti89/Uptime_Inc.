import { useEffect, useState } from 'react';

/** Position de la charnière (en px CSS depuis le haut de la fenêtre) quand l'écran est plié à l'horizontale. */
export type Hinge = { top: number; bottom: number };

type DevicePosture = EventTarget & { type: 'continuous' | 'folded' };
type FoldWindow = Window & { viewportSegments?: DOMRect[] | null };

function devicePosture(): DevicePosture | undefined {
  return (navigator as Navigator & { devicePosture?: DevicePosture }).devicePosture;
}

/**
 * Détecte un pliable à moitié plié avec une charnière horizontale (mode Flex du Galaxy Z Flip,
 * Fold posé en « portable »…) : deux segments d'écran empilés verticalement.
 * - Viewport Segments API (Chromium récent) : position exacte de la charnière.
 * - Repli Device Posture API : « plié » en portrait → charnière supposée au milieu.
 * Renvoie `null` sur un écran à plat ou si le navigateur ne sait rien du pli.
 */
function computeHinge(): Hinge | null {
  const w = window as FoldWindow;
  if ('viewportSegments' in w) {
    const segs = w.viewportSegments;
    if (segs && segs.length === 2) {
      const [a, b] = segs[0].top <= segs[1].top ? segs : [segs[1], segs[0]];
      const stacked = a.bottom <= b.top + 1 && Math.abs(a.left - b.left) < 1;
      if (stacked) return { top: a.bottom, bottom: b.top };
    }
    return null;
  }
  if (devicePosture()?.type === 'folded' && window.innerHeight > window.innerWidth) {
    const mid = Math.round(window.innerHeight / 2);
    return { top: mid, bottom: mid };
  }
  return null;
}

export function useFoldHinge(): Hinge | null {
  const [hinge, setHinge] = useState<Hinge | null>(computeHinge);
  useEffect(() => {
    const update = () =>
      setHinge((prev) => {
        const next = computeHinge();
        return prev && next && prev.top === next.top && prev.bottom === next.bottom ? prev : next;
      });
    update();
    window.addEventListener('resize', update);
    const posture = devicePosture();
    posture?.addEventListener('change', update);
    const mql = window.matchMedia('(vertical-viewport-segments: 2)');
    mql.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('resize', update);
      posture?.removeEventListener('change', update);
      mql.removeEventListener?.('change', update);
    };
  }, []);
  return hinge;
}
