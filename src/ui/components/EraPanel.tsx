import { useGame } from '../../game/store';
import { ERAS, MAX_ERA, eraDef } from '../../game/data/eras';
import { canMoveEra } from '../../game/engine/actions';
import { money } from '../format';

export function EraPanel() {
  const s = useGame((g) => g.state);
  const moveEra = useGame((g) => g.moveEra);
  const era = eraDef(s.era);
  if (s.era >= MAX_ERA) {
    return (
      <div className="panel era-panel">
        <h3>
          {era.icon} {era.name}
        </h3>
        <p className="muted">{era.desc}</p>
        <p className="hint">Vous êtes au sommet. Préparez votre introduction en bourse 🔔</p>
      </div>
    );
  }
  const next = ERAS[s.era];
  const progress = Math.min(1, s.runEarned / next.threshold);
  const can = canMoveEra(s);
  return (
    <div className="panel era-panel">
      <h3>
        {era.icon} {era.name} <small className="muted">— {era.short}</small>
      </h3>
      <p className="muted">{era.desc}</p>
      <div className="era-next">
        Prochaine étape : <strong>{next.icon} {next.name}</strong>
      </div>
      <div className="bar">
        <div className="bar-fill era" style={{ width: `${progress * 100}%` }} />
        <span className="bar-text">
          {money(s.runEarned)} / {money(next.threshold)} gagnés
        </span>
      </div>
      <button className="btn primary wide" disabled={!can} onClick={moveEra}>
        🚚 Déménager ({money(next.moveCost)})
      </button>
    </div>
  );
}
