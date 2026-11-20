import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const OPEN_DELAY_MS = 250;
const MARGIN = 8;

/** Survol possible (souris) : sinon, seul le bouton ⓘ ouvre l'infobulle. */
const canHover = () => typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover)').matches;

/** Une seule infobulle épinglée à la fois : ouvrir l'une ferme la précédente. */
let closePinned: (() => void) | null = null;

/**
 * Infobulle riche : au survol ou au focus clavier sur ordinateur ; sur écran tactile,
 * via le petit bouton ⓘ (le toucher sur l'élément garde son action normale).
 * Le panneau est rendu dans <body> et positionné sous l'élément (ou au-dessus s'il manque
 * de place), sans jamais déborder de l'écran.
 */
export function InfoTip({ content, children, className, label }: { content: ReactNode; children: ReactNode; className?: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const shown = open || pinned;

  const show = () => {
    if (!canHover()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Position : sous l'élément, ou au-dessus si la place manque.
  useLayoutEffect(() => {
    if (!shown || !anchor.current || !panel.current) return;
    const a = anchor.current.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 2 * MARGIN);
    const h = panel.current.offsetHeight;
    const left = Math.min(Math.max(MARGIN, a.left), window.innerWidth - width - MARGIN);
    const below = a.bottom + 6;
    const top = below + h + MARGIN <= window.innerHeight || a.top - h - 6 < MARGIN ? below : a.top - h - 6;
    const next = { left, top: Math.max(MARGIN, top), width };
    setPos((p) => (p && p.left === next.left && p.top === next.top && p.width === next.width ? p : next));
  }, [shown, content]);

  // Fermeture du mode épinglé (tactile) : toucher ailleurs, Échap, défilement de la page.
  useEffect(() => {
    if (!pinned) return;
    const unpin = () => setPinned(false);
    closePinned?.();
    closePinned = unpin;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      const inside = anchor.current?.contains(e.target as Node) || panel.current?.contains(e.target as Node);
      if ((e.type === 'pointerdown' || e.type === 'scroll') && inside) return;
      setPinned(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    window.addEventListener('scroll', close, true);
    return () => {
      if (closePinned === unpin) closePinned = null;
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [pinned]);

  return (
    <div
      ref={anchor}
      className={`infotip-anchor ${className ?? ''}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <button
        type="button"
        className={`infotip-btn ${pinned ? 'on' : ''}`}
        aria-label={`Détails : ${label}`}
        aria-expanded={shown}
        onClick={(e) => {
          e.stopPropagation();
          setPinned((p) => !p);
        }}
      >
        ⓘ
      </button>
      {shown &&
        createPortal(
          <div
            ref={panel}
            className={`infotip ${pinned ? 'pinned' : ''}`}
            role="tooltip"
            style={pos ? { left: pos.left, top: pos.top, width: pos.width } : { visibility: 'hidden', left: 0, top: 0 }}
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
}
