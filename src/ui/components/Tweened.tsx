import { useEffect, useRef } from 'react';

/**
 * Nombre qui glisse vers sa valeur cible au lieu de sauter à chaque tick.
 * Le texte est écrit directement dans le DOM (pas de re-rendu React à 60 i/s).
 * Une baisse nette (dépense) déclenche un bref flash.
 */
export function Tweened({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const target = useRef(value);
  const fmtRef = useRef(format);
  fmtRef.current = format;

  useEffect(() => {
    const el = ref.current;
    const prev = target.current;
    target.current = value;
    if (el && prev > 0 && value < prev * 0.98) {
      el.classList.remove('spent');
      void el.offsetWidth; // relance l'animation CSS
      el.classList.add('spent');
    }
  }, [value]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = target.current;
      let s = shown.current;
      if (reduce || !isFinite(t) || Math.abs(t - s) <= Math.abs(t) * 1e-4) s = t;
      else s += (t - s) * (1 - Math.exp(-dt / 0.12));
      shown.current = s;
      if (ref.current) ref.current.textContent = fmtRef.current(s);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
