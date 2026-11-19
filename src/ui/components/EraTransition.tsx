import { useEffect } from 'react';
import { useGame } from '../../game/store';
import { eraDef } from '../../game/data/eras';
import { eraScene, spaceKind } from '../scene/layout';

/** Écran plein « Vous déménagez dans… » après un changement d'ère. */
export function EraTransition() {
  const era = useGame((g) => g.eraTransition);
  const dismiss = useGame((g) => g.dismissEraTransition);

  useEffect(() => {
    if (era === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [era, dismiss]);

  if (era === null) return null;
  const def = eraDef(era);
  const img = eraScene(era).transition ?? eraScene(era).background;
  const space = spaceKind(era);
  return (
    <div className="era-transition" onClick={dismiss} role="dialog" aria-label={`Nouvelle ère : ${def.name}`}>
      {img ? (
        <div className="era-transition-img" style={{ backgroundImage: `url(${img})` }} />
      ) : (
        <div className={`era-transition-img space-backdrop space-${space}`} />
      )}
      <div className="era-transition-shade" />
      <div className="era-transition-text">
        <div className="era-transition-kicker">{space ? '🚀 Cap sur…' : '🚚 Vous déménagez dans…'}</div>
        <h1>
          {def.icon} {def.name}
        </h1>
        <div className="era-transition-sub">
          Ère {def.id} · {def.short}
        </div>
        <p>{def.desc}</p>
        <button className="btn primary" onClick={dismiss} autoFocus>
          {space ? 'Mettre le cap' : 'Prendre possession des lieux'}
        </button>
      </div>
    </div>
  );
}

/** Précharge les images de l'ère suivante dès que le déménagement devient possible. */
export function preloadEra(era: number): void {
  const s = eraScene(era);
  for (const src of [s.background, s.transition]) {
    if (!src) continue;
    const img = new Image();
    img.src = src;
  }
}
