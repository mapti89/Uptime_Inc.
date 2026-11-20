import { useEffect } from 'react';
import { useGame } from '../../game/store';
import { eraDef } from '../../game/data/eras';
import { decodeTransfer } from '../../game/engine/save';
import type { GameState } from '../../game/types';
import { duration, money } from '../format';
import { useUi } from '../uiStore';

export function Summary({ title, s }: { title: string; s: GameState }) {
  const era = eraDef(s.era);
  return (
    <div className="import-card">
      <h4>{title}</h4>
      <div>
        {era.icon} Ère {s.era} · {era.name}
      </div>
      <div className="muted small">
        {money(s.money)} · {s.prestige.totalShares} actions · {duration(s.stats.playTime)} de jeu
      </div>
    </div>
  );
}

/**
 * Fenêtre de confirmation avant de remplacer la partie (import par code, fichier ou lien).
 * Gère aussi l'ouverture d'un lien de transfert (…#import=CODE).
 */
export function ImportConfirm() {
  const pending = useUi((u) => u.pendingImport);
  const propose = useUi((u) => u.proposeImport);
  const current = useGame((g) => g.state);
  const loadState = useGame((g) => g.loadState);

  useEffect(() => {
    const { hash } = window.location;
    if (!hash.startsWith('#import=')) return;
    // On retire le code de l'adresse tout de suite : un rechargement ne doit pas le rejouer.
    history.replaceState(null, '', window.location.pathname + window.location.search);
    decodeTransfer(hash)
      .then(propose)
      .catch(() => window.alert('Ce lien de transfert est invalide ou incomplet.'));
  }, [propose]);

  if (!pending) return null;
  return (
    <div className="modal-backdrop" onClick={() => propose(null)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="import-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="import-title">📥 Charger cette partie ?</h2>
        <div className="import-compare">
          <Summary title="Partie importée" s={pending} />
          <Summary title="Partie actuelle (sera remplacée)" s={current} />
        </div>
        <div className="row">
          <button
            className="btn primary"
            onClick={() => {
              loadState(pending);
              propose(null);
            }}
          >
            Remplacer ma partie
          </button>
          <button className="btn" onClick={() => propose(null)}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
