import { useGame } from '../../game/store';
import { EVENT_BY_ID } from '../../game/data/events';
import { fixEventCost, repairCost } from '../../game/engine/actions';
import { duration, money, pct } from '../format';
import { GameIcon } from './GameIcon';

export function IncidentsPanel() {
  const s = useGame((g) => g.state);
  const fixEvent = useGame((g) => g.fixEvent);
  const repairNow = useGame((g) => g.repairNow);
  const repairRate = useGame((g) => g.snap.repairRate);
  if (s.events.length === 0 && s.damage <= 0.0005) return null;
  return (
    <div className="panel incidents">
      <h3>🚨 Incidents en cours</h3>
      {s.events.map((ev) => {
        const def = EVENT_BY_ID[ev.defId];
        const cost = def.fixCostSeconds ? fixEventCost(s, ev.uid) : Infinity;
        return (
          <div key={ev.uid} className={`incident ${def.good ? 'good' : 'bad'}`}>
            <div className="incident-head">
              <span className="incident-title">
                <GameIcon set="events" id={def.id} emoji={def.icon} size={26} /> {def.name}
              </span>
              <span className="muted">{duration(ev.remaining)}</span>
            </div>
            <div className="small muted">{def.desc}</div>
            <div className="bar thin">
              <div className={`bar-fill ${def.good ? 'good' : 'bad'}`} style={{ width: `${(ev.remaining / ev.duration) * 100}%` }} />
            </div>
            {isFinite(cost) && (
              <button className="btn small" disabled={s.money < cost} onClick={() => fixEvent(ev.uid)}>
                🔧 Intervention d&apos;urgence ({money(cost)})
              </button>
            )}
          </div>
        );
      })}
      {s.damage > 0.0005 && (
        <div className="incident bad">
          <div className="incident-head">
            <span>💥 Matériel endommagé : −{pct(s.damage)} de capacité</span>
            <span className="muted">~{duration(s.damage / Math.max(1e-9, repairRate))}</span>
          </div>
          <button className="btn small" disabled={s.money < repairCost(s)} onClick={repairNow}>
            🧰 Remplacer le matériel ({money(repairCost(s))})
          </button>
        </div>
      )}
    </div>
  );
}
