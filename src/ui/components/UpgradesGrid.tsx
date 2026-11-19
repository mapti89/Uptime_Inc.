import { useState } from 'react';
import { useGame } from '../../game/store';
import { UPGRADES } from '../../game/data/upgrades';
import { BUILDING_BY_ID } from '../../game/data/buildings';
import { reqMissing, upgradeAvailable } from '../../game/engine/actions';
import type { GameState, UpgradeReq } from '../../game/types';
import { money, watts } from '../format';

function reqLabel(s: GameState, req: UpgradeReq, missing: number): string {
  if ('id' in req) return `encore ${missing} × ${BUILDING_BY_ID[req.id].name}`;
  const what = req.usage === 'power' ? 'consommés' : 'de chaleur évacuée';
  const peak = req.usage === 'power' ? s.stats.runPeakPower : s.stats.runPeakHeat;
  return `atteindre ${watts(req.value)} ${what} (record : ${watts(peak)})`;
}

export function UpgradesGrid() {
  const s = useGame((g) => g.state);
  const costMult = useGame((g) => g.mods.cost);
  const buy = useGame((g) => g.buyUpgrade);
  const buyAll = useGame((g) => g.buyAllUpgrades);
  const toggleAuto = useGame((g) => g.toggleAutoUpgrades);
  const [showOwned, setShowOwned] = useState(false);

  const available = UPGRADES.filter((u) => upgradeAvailable(s, u.id)).sort((a, b) => a.cost - b.cost);
  const owned = UPGRADES.filter((u) => s.upgrades[u.id]);
  const affordable = available.filter((u) => u.cost * costMult <= s.money).length;
  const next = UPGRADES.filter((u) => !s.upgrades[u.id] && !upgradeAvailable(s, u.id) && u.era <= s.era && u.req)
    .map((u) => ({ u, missing: reqMissing(s, u.req!) }))
    .filter((x) => x.missing > 0)
    .sort((a, b) => a.u.cost - b.u.cost)
    .slice(0, 6);

  return (
    <div className="upgrades">
      <div className="toolbar">
        <button className="btn primary" disabled={affordable === 0} onClick={buyAll}>
          Tout acheter ({affordable})
        </button>
        {(s.prestige.shop.autoUpgrades ?? 0) > 0 && (
          <label className="toggle">
            <input type="checkbox" checked={s.settings.autoUpgrades} onChange={toggleAuto} /> Achat automatique
          </label>
        )}
        <label className="toggle">
          <input type="checkbox" checked={showOwned} onChange={() => setShowOwned(!showOwned)} /> Voir les acquises ({owned.length})
        </label>
      </div>
      {available.length === 0 && <p className="muted">Aucune amélioration disponible pour le moment.</p>}
      <div className="upgrade-grid">
        {available.map((u) => {
          const cost = u.cost * costMult;
          return (
            <button key={u.id} className={`upgrade ${cost > s.money ? 'poor' : ''}`} disabled={cost > s.money} onClick={() => buy(u.id)}>
              <span className="up-icon">{u.icon}</span>
              <span className="up-name">{u.name}</span>
              <span className="up-desc">{u.desc}</span>
              <span className="up-cost">{money(cost)}</span>
            </button>
          );
        })}
      </div>
      {next.length > 0 && (
        <>
          <h4 className="muted">Prochains paliers</h4>
          <ul className="next-list">
            {next.map(({ u, missing }) => (
              <li key={u.id}>
                {u.icon} {u.name} — {reqLabel(s, u.req!, missing)}
              </li>
            ))}
          </ul>
        </>
      )}
      {showOwned && (
        <div className="upgrade-grid owned">
          {owned.map((u) => (
            <div key={u.id} className="upgrade done">
              <span className="up-icon">{u.icon}</span>
              <span className="up-name">{u.name}</span>
              <span className="up-desc">{u.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
