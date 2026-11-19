import { useGame } from '../../game/store';
import { REQUEST_TYPES } from '../../game/data/requestTypes';
import { RES_LABEL, fmt } from '../format';

export function RequestsPanel() {
  const snap = useGame((g) => g.snap);
  const era = useGame((g) => g.state.era);
  const priceByType = useGame((g) => g.mods.priceByType);
  const types = REQUEST_TYPES.filter((t) => t.era <= era);
  const locked = REQUEST_TYPES.find((t) => t.era > era);
  return (
    <div className="panel requests">
      <h3>📨 Requêtes entrantes</h3>
      <div className="req-list">
        {types.map((t) => {
          const d = snap.demand[t.id] ?? 0;
          const sv = snap.served[t.id] ?? 0;
          const ratio = d > 0 ? sv / d : 1;
          const bn = snap.bottleneck[t.id];
          const price = t.price * (priceByType[t.id] ?? 1) * snap.globalMult;
          return (
            <div key={t.id} className="req-row">
              <div className="req-head">
                <span className="req-name">
                  {t.icon} {t.name}
                  {era >= 10 && (
                    <span
                      className={`latency-tag ${t.tolerant ? 'tolerant' : 'realtime'}`}
                      title={
                        t.tolerant
                          ? 'Tolère la latence : peut être servie par le matériel lointain (Mars et au-delà).'
                          : 'Temps réel : seul le matériel proche (Terre, orbite, Lune) peut la servir.'
                      }
                    >
                      {t.tolerant ? '🐢' : '⚡'}
                    </span>
                  )}
                </span>
                <span className="req-income">{fmt(sv * price)} $/s</span>
              </div>
              <div className="bar thin">
                <div className="bar-fill" style={{ width: `${ratio * 100}%`, background: t.color }} />
              </div>
              <div className="req-meta">
                <span>
                  {fmt(sv)} / {fmt(d)} req/s
                </span>
                {bn ? (
                  <span className="bottleneck">⛔ {RES_LABEL[bn]}</span>
                ) : (
                  <span className="ok-tag">✔ servi</span>
                )}
              </div>
              <div className="req-needs">
                {Object.entries(t.needs).map(([r]) => (
                  <span key={r} className={`need ${bn === r ? 'need-bn' : ''}`}>
                    {RES_LABEL[r]}
                  </span>
                ))}
                <span className="need price">{fmt(price, 3)} $/req</span>
              </div>
            </div>
          );
        })}
        {locked && (
          <div className="req-row locked">
            🔒 {locked.icon} {locked.name} — débloqué à l&apos;ère {locked.era}
          </div>
        )}
      </div>
      {snap.slaMult > 1 && <div className="sla">🏅 Bonus SLA actif : ×{snap.slaMult.toFixed(2)}</div>}
    </div>
  );
}
