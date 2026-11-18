import { useGame } from '../../game/store';
import { duration, fmt, money, pct } from '../format';

export function OfflineModal() {
  const report = useGame((g) => g.offline);
  const dismiss = useGame((g) => g.dismissOffline);
  if (!report) return null;
  const capped = report.simulated < report.seconds;
  return (
    <div className="modal-backdrop" onClick={dismiss}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>🌙 Pendant votre absence…</h2>
        <p>
          Vous étiez absent <strong>{duration(report.seconds)}</strong>
          {capped && (
            <>
              {' '}
              (seules <strong>{duration(report.simulated)}</strong> ont été prises en compte)
            </>
          )}
          . Vos serveurs ont tourné à {pct(report.efficiency, 0)} d&apos;efficacité.
        </p>
        <ul className="offline-list">
          <li>
            💰 <strong>{money(report.money)}</strong> gagnés
          </li>
          <li>
            📨 <strong>{fmt(report.requests)}</strong> requêtes servies
          </li>
          {report.rd > 0 && (
            <li>
              🔬 <strong>{fmt(report.rd)}</strong> points R&amp;D
            </li>
          )}
        </ul>
        <button className="btn primary wide" onClick={dismiss}>
          Retour au datacenter
        </button>
      </div>
    </div>
  );
}
