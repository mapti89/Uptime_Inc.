import { useGame } from '../../game/store';
import { duration } from '../format';

export function EventLog() {
  const log = useGame((g) => g.state.log);
  const playTime = useGame((g) => Math.floor(g.state.stats.playTime / 5));
  return (
    <div className="panel log">
      <h3>📜 Journal</h3>
      {log.length === 0 && <p className="muted small">Rien à signaler… pour l&apos;instant.</p>}
      <ul>
        {log.slice(0, 25).map((e, i) => (
          <li key={`${e.t}-${i}`} className={`log-${e.kind}`}>
            <span className="log-t">il y a {duration(playTime * 5 - e.t)}</span>
            <span>{e.msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
