import { useEffect, useState } from 'react';
import { useGame } from '../../game/store';
import { eraDef } from '../../game/data/eras';
import { useUi } from '../uiStore';
import { ERA_NEWS, INTRO, eraNewItems } from '../help/content';

/** Fiche des nouveautés d'une ère (tutoriel, et rubrique de l'aide). */
export function EraNewsBody({ era }: { era: number }) {
  const news = ERA_NEWS[era];
  const { requests, buildings, events } = eraNewItems(era);
  return (
    <>
      {news?.mechanics}
      {requests.length > 0 && (
        <>
          <h4 className="tuto-sub">Nouveaux clients</h4>
          <ul className="tuto-list">
            {requests.map((r) => (
              <li key={r.id}>
                {r.icon} <strong>{r.name}</strong>
                {era >= 10 && <span className="muted"> · {r.tolerant ? '🐢 tolère la latence' : '⚡ temps réel'}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
      {buildings.length > 0 && (
        <>
          <h4 className="tuto-sub">Nouveaux équipements</h4>
          <ul className="tuto-list">
            {buildings.map(({ cat, names }) => (
              <li key={cat.id}>
                <span className="muted">{cat.name} :</span> {names.join(', ')}
              </li>
            ))}
          </ul>
        </>
      )}
      {events.length > 0 && (
        <>
          <h4 className="tuto-sub">Nouveaux événements</h4>
          <ul className="tuto-list">
            {events.map((e) => (
              <li key={e.id}>
                {e.icon} <strong>{e.name}</strong> <span className="muted">— {e.desc}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {news?.tip && <p className="tuto-tip">💡 {news.tip}</p>}
    </>
  );
}

/**
 * Tutoriel : présentation des grands principes en début de partie, puis fiche
 * « Nouveautés » à l'arrivée dans chaque ère. Chaque fiche peut être passée, et
 * le tutoriel entier désactivé (réactivable dans l'aide).
 */
export function Tutorial() {
  const settings = useGame((g) => g.state.settings);
  const era = useGame((g) => g.state.era);
  const busy = useGame((g) => g.eraTransition !== null || g.offline !== null || g.victory);
  const pendingImport = useUi((u) => u.pendingImport);
  const helpOpen = useUi((u) => u.helpOpen);
  const replay = useUi((u) => u.tutoReplay);
  const replayTuto = useUi((u) => u.replayTuto);
  const markTuto = useGame((g) => g.markTuto);
  const setTutorial = useGame((g) => g.setTutorial);
  const [page, setPage] = useState(0);

  // Fiche à afficher : rouverte depuis l'aide, ou prochaine étape non vue.
  let what: 'intro' | number | null = replay;
  if (what === null && settings.tutorial && !busy && !pendingImport && !helpOpen) {
    if (!settings.tutoSeen.intro) what = 'intro';
    else if (era >= 2 && !settings.tutoSeen[`era-${era}`]) what = era;
  }
  const key = what === null ? null : what === 'intro' ? 'intro' : `era-${what}`;

  useEffect(() => setPage(0), [key]);

  const close = () => {
    if (replay !== null) replayTuto(null);
    else if (key) markTuto(key);
  };
  const disable = () => {
    if (key) markTuto(key);
    setTutorial(false);
    replayTuto(null);
  };

  useEffect(() => {
    if (!key) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (what === null) return null;

  if (what === 'intro') {
    const step = INTRO[Math.min(page, INTRO.length - 1)];
    const last = page >= INTRO.length - 1;
    return (
      <div className="modal-backdrop tuto-backdrop">
        <div className="modal tuto" role="dialog" aria-labelledby="tuto-title">
          <div className="tuto-kicker">
            Tutoriel · {page + 1}/{INTRO.length}
          </div>
          <h2 id="tuto-title">
            {step.icon} {step.title}
          </h2>
          <div className="tuto-body">{step.body}</div>
          <div className="tuto-dots" aria-hidden="true">
            {INTRO.map((p, i) => (
              <button key={p.id} className={`tuto-dot ${i === page ? 'on' : ''}`} onClick={() => setPage(i)} tabIndex={-1} />
            ))}
          </div>
          <div className="tuto-actions">
            <button className="btn ghost" onClick={close}>
              {replay !== null ? 'Fermer' : 'Passer le tutoriel'}
            </button>
            <span className="tuto-spacer" />
            {page > 0 && (
              <button className="btn" onClick={() => setPage(page - 1)}>
                ← Précédent
              </button>
            )}
            {last ? (
              <button className="btn primary" onClick={close} autoFocus>
                C’est parti !
              </button>
            ) : (
              <button className="btn primary" onClick={() => setPage(page + 1)} autoFocus>
                Suivant →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const def = eraDef(what);
  return (
    <div className="modal-backdrop tuto-backdrop">
      <div className="modal tuto" role="dialog" aria-labelledby="tuto-title">
        <div className="tuto-kicker">Nouveautés · Ère {def.id}</div>
        <h2 id="tuto-title">
          {def.icon} {def.name}
        </h2>
        <div className="tuto-body">
          <EraNewsBody era={what} />
        </div>
        <div className="tuto-actions">
          {replay === null && (
            <button className="btn ghost" onClick={disable}>
              Ne plus afficher le tutoriel
            </button>
          )}
          <span className="tuto-spacer" />
          <button className="btn primary" onClick={close} autoFocus>
            Compris
          </button>
        </div>
      </div>
    </div>
  );
}
