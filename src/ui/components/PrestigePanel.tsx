import { useState } from 'react';
import { useGame } from '../../game/store';
import { PRESTIGE_MIN_ERA, PRESTIGE_SHOP, SHARE_BONUS, SHARE_SOFTCAP, shareBonus } from '../../game/data/prestige';
import { prestigeGain, prestigeShopCost } from '../../game/engine/actions';
import { eraDef } from '../../game/data/eras';
import { fmt, pct } from '../format';

export function PrestigePanel() {
  const s = useGame((g) => g.state);
  const prestige = useGame((g) => g.prestige);
  const buy = useGame((g) => g.buyPrestige);
  const [confirm, setConfirm] = useState(false);
  const gain = prestigeGain(s);
  const p = s.prestige;
  return (
    <div className="prestige">
      <div className="panel inner">
        <h3>🔔 Introduction en bourse</h3>
        <p>
          Revendez l&apos;entreprise aux marchés et recommencez depuis le garage avec l&apos;expérience accumulée. Vous obtenez des{' '}
          <strong>actions</strong> selon l&apos;argent gagné pendant la partie. Chaque action détenue donne{' '}
          <strong>+{pct(SHARE_BONUS, 0)}</strong> de revenus jusqu&apos;à {fmt(SHARE_SOFTCAP)} actions, puis le bonus
          ralentit (il suit la racine carrée du nombre d&apos;actions). Les actions dépensées dans la boutique ne comptent plus.
        </p>
        <p>
          Actions détenues : <strong>{fmt(p.shares)}</strong> (bonus +{pct(shareBonus(p.shares), 0)}) · Total historique : {fmt(p.totalShares)}
        </p>
        {s.era < PRESTIGE_MIN_ERA ? (
          <p className="muted">
            Disponible à partir de l&apos;ère {PRESTIGE_MIN_ERA} ({eraDef(PRESTIGE_MIN_ERA).name}).
          </p>
        ) : (
          <>
            <p>
              Gain si vous entrez en bourse maintenant : <strong className="good">+{fmt(gain)} actions</strong>
            </p>
            {!confirm ? (
              <button className="btn primary" disabled={gain <= 0} onClick={() => setConfirm(true)}>
                Préparer l&apos;introduction en bourse
              </button>
            ) : (
              <div className="confirm">
                <p className="warn">
                  Vous perdrez argent, machines, améliorations{(p.shop.keepResearch ?? 0) > 0 ? '' : ', recherche'} et ère. Succès et actions sont conservés.
                </p>
                <button
                  className="btn danger"
                  onClick={() => {
                    prestige();
                    setConfirm(false);
                  }}
                >
                  🔔 Sonner la cloche (+{fmt(gain)})
                </button>
                <button className="btn" onClick={() => setConfirm(false)}>
                  Annuler
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <h3>🛒 Boutique des actionnaires</h3>
      <div className="upgrade-grid">
        {PRESTIGE_SHOP.map((d) => {
          const lvl = p.shop[d.id] ?? 0;
          const cost = prestigeShopCost(s, d.id);
          const maxed = lvl >= d.max;
          return (
            <button key={d.id} className={`upgrade ${maxed ? 'done' : cost > p.shares ? 'poor' : ''}`} disabled={maxed || cost > p.shares} onClick={() => buy(d.id)}>
              <span className="up-icon">{d.icon}</span>
              <span className="up-name">
                {d.name}{' '}
                <small>
                  {lvl}/{d.max}
                </small>
              </span>
              <span className="up-desc">{d.desc}</span>
              <span className="up-cost">{maxed ? 'MAX' : `${fmt(cost)} actions`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
