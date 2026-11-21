import { useEffect, useState } from 'react';
import { useGame } from '../../game/store';
import { ERAS } from '../../game/data/eras';
import { useUi } from '../uiStore';
import { HELP_TOPICS } from '../help/content';
import { EraNewsBody } from './Tutorial';

/** Bouton « ❓ Aide » de la barre du haut. */
export function HelpButton() {
  const open = useUi((u) => u.setHelpOpen);
  return (
    <button className="help-btn" onClick={() => open(true)} aria-label="Aide" title="Aide">
      ❓<span className="help-btn-label"> Aide</span>
    </button>
  );
}

type Section = { kind: 'topic'; id: string } | { kind: 'era'; era: number } | { kind: 'tuto' };

/** Menu d'aide : rubriques de référence, nouveautés de chaque ère déjà atteinte, réglages du tutoriel. */
export function HelpMenu() {
  const isOpen = useUi((u) => u.helpOpen);
  const setOpen = useUi((u) => u.setHelpOpen);
  const replayTuto = useUi((u) => u.replayTuto);
  const era = useGame((g) => g.state.era);
  const tutorial = useGame((g) => g.state.settings.tutorial);
  const setTutorial = useGame((g) => g.setTutorial);
  const [section, setSection] = useState<Section>({ kind: 'tuto' });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const isOn = (s: Section) => JSON.stringify(s) === JSON.stringify(section);
  const topic = section.kind === 'topic' ? HELP_TOPICS.find((t) => t.id === section.id) : null;
  const eraDefSel = section.kind === 'era' ? ERAS[section.era - 1] : null;

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal help" role="dialog" aria-labelledby="help-title" onClick={(e) => e.stopPropagation()}>
        <div className="help-head">
          <h2 id="help-title">❓ Aide</h2>
          <button className="btn ghost" onClick={() => setOpen(false)} aria-label="Fermer l’aide">
            ✕
          </button>
        </div>
        <div className="help-cols">
          <nav className="help-nav" aria-label="Rubriques">
            <button className={`help-link ${isOn({ kind: 'tuto' }) ? 'active' : ''}`} onClick={() => setSection({ kind: 'tuto' })}>
              🎓 Tutoriel
            </button>
            <div className="help-group">Comment ça marche</div>
            {HELP_TOPICS.map((t) => (
              <button
                key={t.id}
                className={`help-link ${isOn({ kind: 'topic', id: t.id }) ? 'active' : ''}`}
                onClick={() => setSection({ kind: 'topic', id: t.id })}
              >
                {t.icon} {t.title}
              </button>
            ))}
            <div className="help-group">Nouveautés par ère</div>
            {ERAS.filter((e) => e.id >= 2).map((e) =>
              e.id <= era ? (
                <button
                  key={e.id}
                  className={`help-link ${isOn({ kind: 'era', era: e.id }) ? 'active' : ''}`}
                  onClick={() => setSection({ kind: 'era', era: e.id })}
                >
                  {e.icon} {e.id}. {e.name}
                </button>
              ) : (
                <span key={e.id} className="help-link locked">
                  🔒 {e.id}. ???
                </span>
              ),
            )}
          </nav>
          <section className="help-body">
            {section.kind === 'tuto' && (
              <>
                <h3>🎓 Tutoriel</h3>
                <p>
                  Le tutoriel présente les grands principes en début de partie, puis les nouveautés à l’arrivée dans chaque ère. Chaque fiche
                  peut être passée.
                </p>
                <label className="toggle">
                  <input type="checkbox" checked={tutorial} onChange={() => setTutorial(!tutorial)} /> Afficher les fiches du tutoriel
                </label>
                <div className="help-actions">
                  <button className="btn primary" onClick={() => replayTuto('intro')}>
                    Revoir l’introduction
                  </button>
                  {era >= 2 && (
                    <button className="btn" onClick={() => replayTuto(era)}>
                      Nouveautés de l’ère {era}
                    </button>
                  )}
                </div>
              </>
            )}
            {topic && (
              <>
                <h3>
                  {topic.icon} {topic.title}
                </h3>
                {topic.body}
              </>
            )}
            {eraDefSel && (
              <>
                <h3>
                  {eraDefSel.icon} Ère {eraDefSel.id} · {eraDefSel.name}
                </h3>
                <p className="muted">{eraDefSel.desc}</p>
                <EraNewsBody era={eraDefSel.id} />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
