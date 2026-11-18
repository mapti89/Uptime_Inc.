import { useState } from 'react';
import { useGame } from '../../game/store';
import { offlineCap, offlineEfficiency } from '../../game/engine/offline';
import { duration, pct } from '../format';

export function Settings() {
  const s = useGame((g) => g.state);
  const save = useGame((g) => g.save);
  const exportSave = useGame((g) => g.exportSave);
  const importSave = useGame((g) => g.importSave);
  const hardReset = useGame((g) => g.hardReset);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="settings">
      <div className="panel inner">
        <h3>💾 Sauvegarde</h3>
        <p className="muted small">
          Sauvegarde automatique toutes les 15 s dans le navigateur. Dernière : {new Date(s.lastSaved).toLocaleTimeString('fr-FR')}
        </p>
        <div className="row">
          <button
            className="btn"
            onClick={() => {
              save();
              setMsg('Partie sauvegardée.');
            }}
          >
            Sauvegarder maintenant
          </button>
          <button
            className="btn"
            onClick={async () => {
              const data = exportSave();
              setText(data);
              try {
                await navigator.clipboard.writeText(data);
                setMsg('Sauvegarde copiée dans le presse-papiers.');
              } catch {
                setMsg('Sauvegarde exportée ci-dessous.');
              }
            }}
          >
            Exporter
          </button>
          <button
            className="btn"
            disabled={!text.trim()}
            onClick={() => setMsg(importSave(text) ? 'Sauvegarde importée !' : 'Sauvegarde invalide.')}
          >
            Importer
          </button>
        </div>
        <textarea className="save-box" value={text} onChange={(e) => setText(e.target.value)} placeholder="Collez une sauvegarde ici pour l'importer…" />
        {msg && <p className="hint">{msg}</p>}
      </div>
      <div className="panel inner">
        <h3>🌙 Progression hors-ligne</h3>
        <p>
          Durée maximale : <strong>{duration(offlineCap(s))}</strong> · Efficacité : <strong>{pct(offlineEfficiency(s), 0)}</strong>
        </p>
        <p className="muted small">Les incidents sont suspendus pendant votre absence. Améliorable via la boutique des actionnaires.</p>
      </div>
      <div className="panel inner danger-zone">
        <h3>⚠️ Zone dangereuse</h3>
        {!confirmReset ? (
          <button className="btn danger" onClick={() => setConfirmReset(true)}>
            Effacer la partie
          </button>
        ) : (
          <div className="row">
            <span className="warn">Tout sera perdu, y compris le prestige. Sûr ?</span>
            <button
              className="btn danger"
              onClick={() => {
                hardReset();
                setConfirmReset(false);
              }}
            >
              Oui, tout effacer
            </button>
            <button className="btn" onClick={() => setConfirmReset(false)}>
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
