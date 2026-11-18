import { useGame } from '../../game/store';
import { ACHIEVEMENTS, ACHIEVEMENT_BONUS } from '../../game/data/achievements';
import { pct } from '../format';

export function Achievements() {
  const unlocked = useGame((g) => g.state.achievements);
  const n = Object.keys(unlocked).length;
  return (
    <div className="achievements">
      <p>
        <strong>
          {n} / {ACHIEVEMENTS.length}
        </strong>{' '}
        succès débloqués — bonus de revenus : <strong>+{pct(n * ACHIEVEMENT_BONUS, 0)}</strong>
      </p>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const ok = !!unlocked[a.id];
          return (
            <div key={a.id} className={`ach ${ok ? 'ok' : ''}`} title={a.desc}>
              <span className="ach-icon">{ok ? a.icon : '🔒'}</span>
              <span className="ach-name">{ok ? a.name : '???'}</span>
              <span className="ach-desc">{a.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
