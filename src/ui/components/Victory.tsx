import { useEffect } from 'react';
import { useGame } from '../../game/store';
import { fmt, money } from '../format';
import { VICTORY_IMAGE } from '../scene/layout';

/** Écran de fin : la Voie lactée est entièrement colonisée. Le jeu continue ensuite. */
export function Victory() {
  const show = useGame((g) => g.victory);
  const dismiss = useGame((g) => g.dismissVictory);
  const st = useGame((g) => g.state);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, dismiss]);

  if (!show) return null;
  const hours = st.stats.playTime / 3600;
  return (
    <div className="era-transition victory" onClick={dismiss} role="dialog" aria-label="Uptime galactique">
      <div className="era-transition-img space-backdrop space-galaxy" style={{ backgroundImage: `url(${VICTORY_IMAGE})` }} />
      <div className="era-transition-shade" />
      <div className="era-transition-text">
        <div className="era-transition-kicker">🌌 Uptime galactique : 100 %</div>
        <h1>La Voie lactée vous appartient</h1>
        <p>
          Tout a commencé avec un Raspberry Pi sur une étagère du garage. Aujourd’hui, cent milliards d’étoiles
          hébergent vos serveurs, et pas une seule requête de la galaxie ne vous échappe.
        </p>
        <div className="victory-stats">
          <span>⏱️ {fmt(hours)} h de jeu</span>
          <span>💰 {money(st.totalEarned)} gagnés</span>
          <span>🔔 {st.prestige.count} introductions en bourse</span>
          <span>📨 {fmt(st.stats.requestsServed)} requêtes servies</span>
        </div>
        <p className="muted">Merci d’avoir joué à Uptime Inc. La partie continue : il reste toujours un neuf à ajouter au SLA.</p>
        <button className="btn primary" onClick={dismiss} autoFocus>
          Continuer à régner
        </button>
      </div>
    </div>
  );
}
