import { useGame } from '../../game/store';
import { resolveConflict, useSync } from '../../game/sync/sync';
import { Summary } from './ImportConfirm';

/** Deux parties différentes : celle en ligne (jouée ailleurs) et celle de cet appareil. */
export function SyncConflict() {
  const conflict = useSync((s) => s.conflict);
  const current = useGame((g) => g.state);
  if (!conflict) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sync-conflict-title">
        <h2 id="sync-conflict-title">☁️ Quelle partie garder ?</h2>
        <p className="muted small">
          Vous avez joué sur un autre appareil et sur celui-ci depuis la dernière synchronisation. L’autre partie sera remplacée.
        </p>
        <div className="import-compare">
          <Summary title="Partie en ligne (autre appareil)" s={conflict.remote} />
          <Summary title="Partie de cet appareil" s={current} />
        </div>
        <div className="row">
          <button className="btn primary" onClick={() => resolveConflict('remote')}>
            Reprendre la partie en ligne
          </button>
          <button className="btn" onClick={() => resolveConflict('local')}>
            Garder celle-ci
          </button>
        </div>
      </div>
    </div>
  );
}
