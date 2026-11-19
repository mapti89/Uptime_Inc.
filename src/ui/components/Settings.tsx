import { useRef, useState, type ChangeEvent } from 'react';
import { useGame } from '../../game/store';
import { offlineCap, offlineEfficiency } from '../../game/engine/offline';
import { duration, pct } from '../format';
import { decodeTransfer, transferLink } from '../../game/engine/save';
import { useUi } from '../uiStore';

export function Settings() {
  const s = useGame((g) => g.state);
  const save = useGame((g) => g.save);
  const exportSave = useGame((g) => g.exportSave);
  const hardReset = useGame((g) => g.hardReset);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const propose = useUi((u) => u.proposeImport);
  const fileInput = useRef<HTMLInputElement>(null);
  const canShare = typeof navigator.share === 'function';

  const tryImport = async (raw: string) => {
    try {
      propose(await decodeTransfer(raw));
      setMsg('');
    } catch {
      setMsg('Sauvegarde invalide ou incomplète.');
    }
  };

  const copy = async (value: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMsg(ok);
    } catch {
      setText(value);
      setMsg('Copie impossible : le code est affiché dans « Coller le code à la main ».');
    }
  };

  const shareLink = async () => {
    const link = transferLink(await exportSave());
    if (canShare) {
      try {
        await navigator.share({ title: 'Ma partie Uptime Inc.', url: link });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    await copy(link, 'Lien copié : ouvrez-le sur l’autre appareil.');
  };

  const copyCode = async () => copy(await exportSave(), 'Code copié dans le presse-papiers.');

  const downloadFile = async () => {
    const blob = new Blob([await exportSave()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `uptime-inc-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setMsg('Fichier de sauvegarde téléchargé.');
  };

  const pasteAndImport = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (!clip.trim()) return setMsg('Le presse-papiers est vide.');
      await tryImport(clip);
    } catch {
      setMsg('Accès au presse-papiers refusé : collez le code à la main ci-dessous.');
    }
  };

  const openFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await tryImport(await file.text());
  };

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
        </div>

        <h4 className="save-title">📤 Envoyer vers un autre appareil</h4>
        <div className="save-actions">
          <button className="btn primary" onClick={shareLink}>
            🔗 {canShare ? 'Partager un lien' : 'Copier un lien'}
          </button>
          <button className="btn" onClick={copyCode}>
            📋 Copier le code
          </button>
          <button className="btn" onClick={downloadFile}>
            💾 Fichier
          </button>
        </div>
        <p className="muted small">
          Ouvrez le lien sur l’autre appareil : le jeu propose de charger la partie. Sur iPhone, l’appli installée a sa propre
          sauvegarde : copiez plutôt le code, puis « Coller et importer » dans l’appli.
        </p>

        <h4 className="save-title">📥 Recevoir une partie</h4>
        <div className="save-actions">
          <button className="btn primary" onClick={pasteAndImport}>
            📥 Coller et importer
          </button>
          <button className="btn" onClick={() => fileInput.current?.click()}>
            📂 Ouvrir un fichier
          </button>
          <input ref={fileInput} type="file" accept=".txt,text/plain" hidden onChange={openFile} />
        </div>
        <details className="save-manual">
          <summary>Coller le code à la main</summary>
          <textarea className="save-box" value={text} onChange={(e) => setText(e.target.value)} placeholder="Collez un code ou un lien de sauvegarde…" />
          <button className="btn" disabled={!text.trim()} onClick={() => tryImport(text)}>
            Importer
          </button>
        </details>
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
