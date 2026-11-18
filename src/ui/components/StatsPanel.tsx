import { useGame } from '../../game/store';
import { duration, fmt, money, pct } from '../format';

export function StatsPanel() {
  const s = useGame((g) => g.state);
  const snap = useGame((g) => g.snap);
  const mods = useGame((g) => g.mods);
  const st = s.stats;
  const rows: [string, string][] = [
    ['Temps de jeu total', duration(st.playTime)],
    ['Durée de la partie en cours', duration(st.runTime)],
    ['Argent gagné (partie)', money(s.runEarned)],
    ['Argent gagné (total)', money(s.totalEarned)],
    ['Argent dépensé', money(st.moneySpent)],
    ['Requêtes servies', fmt(st.requestsServed)],
    ['Requêtes perdues', fmt(st.requestsDropped)],
    ['Record de revenu', `${money(st.peakIncome)}/s`],
    ['Record de requêtes', `${fmt(st.peakReqs)}/s`],
    ['Clics', fmt(st.clicks)],
    ['Incidents vécus', fmt(st.eventsSeen)],
    ['Introductions en bourse', fmt(s.prestige.count)],
  ];
  const mult: [string, string][] = [
    ['Multiplicateur de prix', `×${fmt(mods.price)}`],
    ['Multiplicateur de revenus (succès, actions, prestige)', `×${fmt(mods.revenue)}`],
    ['Bonus SLA', `×${snap.slaMult.toFixed(2)}`],
    ['Multiplicateur de demande', `×${fmt(mods.demand)}`],
    ['Efficacité des machines', pct(snap.efficiency, 0)],
    ['Multiplicateur CPU', `×${fmt(mods.stat.cpu)}`],
    ['Multiplicateur RAM', `×${fmt(mods.stat.ram)}`],
    ['Multiplicateur stockage', `×${fmt(mods.stat.storage)}`],
    ['Multiplicateur bande passante', `×${fmt(mods.stat.bw)}`],
    ['Consommation des serveurs', `×${mods.watts.toFixed(2)}`],
    ['Prix de l’énergie', `×${mods.elecPrice.toFixed(2)}`],
    ['Valeur d’un clic', money(snap.clickValue)],
  ];
  return (
    <div className="stats">
      <div className="stats-grid">
        <div>
          <h4>📊 Carrière</h4>
          <dl>
            {rows.map(([k, v]) => (
              <div key={k} className="dl-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h4>✖️ Multiplicateurs</h4>
          <dl>
            {mult.map(([k, v]) => (
              <div key={k} className="dl-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
