import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../game/store';
import { BUILDINGS, CATEGORIES, LAUNCH_DEBRIS } from '../../game/data/buildings';
import { inTransit, quoteBuilding } from '../../game/engine/actions';
import { buildingCap } from '../../game/engine/formulas';
import { effectiveProvides } from '../../game/engine/modifiers';
import type { BuildingDef, BuyAmount, Provides } from '../../game/types';
import { GameIcon } from './GameIcon';
import { useUi } from '../uiStore';
import { bandwidth, duration, fmt, mass, money, ram, storage, watts } from '../format';

const AMOUNTS: BuyAmount[] = [1, 10, 100, 'max'];

function describeProvides(p: Provides, mult: number): string[] {
  const out: string[] = [];
  if (p.cpu) out.push(`${fmt(p.cpu * mult)} vCPU`);
  if (p.ram) out.push(`${ram(p.ram * mult)} RAM`);
  if (p.gpu) out.push(`${fmt(p.gpu * mult)} GPU`);
  if (p.storage) out.push(`${storage(p.storage * mult)}`);
  if (p.bw) out.push(`${bandwidth(p.bw * mult)}`);
  if (p.power) out.push(`+${watts(p.power * mult)} dispo`);
  if (p.cooling) out.push(`${watts(p.cooling * mult)} évacués`);
  if (p.space) out.push(`+${fmt(p.space)} U`);
  if (p.lift) out.push(`+${mass(p.lift * mult)} d’emport`);
  if (p.cleanup) out.push(`${mass(p.cleanup * mult)} de débris nettoyés`);
  if (p.replication) out.push(`colonisation +${(p.replication * mult * 100).toFixed(2)} %/s`);
  if (p.traffic) out.push(`+${fmt(p.traffic * mult)} req/s de demande`);
  if (p.rd) out.push(`+${fmt(p.rd)} R&D/s`);
  if (p.autoClick) out.push(`${fmt(p.autoClick)} clic/s`);
  if (p.repair) out.push(`réparation +${(p.repair * 100).toFixed(1)} %/s`);
  if (p.efficiency) out.push(`efficacité +${(p.efficiency * 100).toFixed(0)} %`);
  if (p.reliability) out.push(`incidents −${(p.reliability * 100).toFixed(0)} %`);
  return out;
}

function ShopItem({ b, focus }: { b: BuildingDef; focus: boolean }) {
  const s = useGame((g) => g.state);
  const mods = useGame((g) => g.mods);
  const bridge = useGame((g) => g.snap.latencyBridge);
  const cleanShare = useGame((g) => g.snap.cleanLaunchShare);
  // Part de la demande déjà perdue : acheter encore de la demande (ventes) n'aidera pas.
  const lost = useGame((g) => (g.snap.totalDemand > 0 ? 1 - g.snap.totalServed / g.snap.totalDemand : 0));
  const buy = useGame((g) => g.buy);
  const owned = s.owned[b.id] ?? 0;
  const pending = b.travel ? inTransit(s, b.id) : 0;
  const q = quoteBuilding(s, b, s.settings.buyAmount, mods);
  const mult = (mods.building[b.id] ?? 1) * (mods.cat[b.cat] ?? 1);
  const disabled = !!q.blocked;
  // Plafond de l'ère : affiché sous le compteur, et à la place du prix une fois atteint.
  const cap = buildingCap(b, s.era);
  const nextCap = buildingCap(b, s.era + 1);
  const maxed = owned + pending >= cap;
  const capTip = isFinite(cap)
    ? `Maximum de l’ère : ${cap}.` + (nextCap > cap ? ` Il passe à ${nextCap} à l’ère suivante.` : ' Plafond définitif.')
    : undefined;
  const [pops, setPops] = useState<{ id: number; n: number }[]>([]);
  const popId = useRef(0);
  const onBuy = () => {
    const n = q.count;
    buy(b.id);
    const id = popId.current++;
    setPops((p) => [...p.slice(-3), { id, n }]);
    window.setTimeout(() => setPops((p) => p.filter((o) => o.id !== id)), 800);
  };
  const reason =
    q.blocked === 'space' ? 'Plus de place !' : q.blocked === 'lift' ? 'Emport insuffisant !' : q.blocked === 'max' ? 'MAX' : q.blocked === 'era' ? 'Ère suivante' : '';
  return (
    <button
      className={`shop-item ${disabled ? 'disabled' : ''} ${q.blocked === 'money' ? 'poor' : ''} ${maxed ? 'maxed' : ''} ${focus ? 'focus' : ''}`} onClick={onBuy} disabled={disabled}>
      <span className="shop-icon">
        <GameIcon set="buildings" id={b.id} emoji={b.icon} size={44} />
      </span>
      <span className="shop-main">
        <span className="shop-name">
          {b.name} {mult > 1 && <span className="mult">×{fmt(mult)}</span>}
        </span>
        <span className="shop-desc">{b.desc}</span>
        <span className="shop-stats">
          {describeProvides(effectiveProvides(b, mods), mult).map((t) => (
            <span key={t} className="stat-pill">
              {t}
            </span>
          ))}
          {b.watts > 0 && <span className="stat-pill power">{watts(b.watts * mods.watts)}</span>}
          {b.slots > 0 && <span className="stat-pill space">{b.slots} U</span>}
          {b.mass !== undefined && <span className="stat-pill space">🚀 {mass(b.mass * mods.mass)}</span>}
          {b.debris !== undefined && <span className="stat-pill">🛰️ {mass(b.debris * mods.mass)} de débris</span>}
          {b.debris === undefined && b.mass !== undefined && (
            <span
              className="stat-pill"
              title={`Étages et fragments laissés en orbite par le lancement (${LAUNCH_DEBRIS.perTonne * 100} % de la masse), réduits jusqu’à −${LAUNCH_DEBRIS.cleanCut * 100} % selon la part de vos lanceurs sans fusée (actuellement ${Math.round(cleanShare * 100)} %).`}
            >
              🛰️ {mass(b.mass * LAUNCH_DEBRIS.perTonne * (1 - LAUNCH_DEBRIS.cleanCut * cleanShare) * mods.mass)} de débris de lancement
            </span>
          )}
          {b.flags?.includes('cleanLaunch') && (
            <span className="stat-pill" title="Lanceur sans fusée : réduit les débris de lancement au prorata de sa part dans votre capacité d’emport.">
              ♻️ lancement propre
            </span>
          )}
          {b.remote && (
            <span
              className="stat-pill remote"
              title={
                bridge > 0
                  ? `Trop loin pour le temps réel : sert les requêtes tolérantes à la latence, et seulement ${Math.round(bridge * 100)} % de sa capacité sert aussi les requêtes temps réel (sites, API, BDD…).`
                  : 'Trop loin pour les requêtes temps réel : ne sert que les requêtes tolérantes à la latence.'
              }
            >
              🐢 lointain{bridge > 0 && bridge < 1 ? ` · ${Math.round(bridge * 100)} % temps réel` : ''}
            </span>
          )}
          {b.provides.traffic && lost > 0.05 && (
            <span className="stat-pill warn" title="Vos machines ne suivent déjà pas : plus de demande ne fera que perdre plus de requêtes (uptime et réputation en baisse).">
              ⚠️ {Math.round(lost * 100)} % de la demande déjà perdue
            </span>
          )}
          {b.travel !== undefined && <span className="stat-pill">⏳ voyage {duration(b.travel)}</span>}
          {b.overhead !== undefined && <span className="stat-pill">surcoût PUE {b.overhead}</span>}
        </span>
      </span>
      <span className="shop-side">
        <span key={owned} className={`shop-owned ${pops.length ? 'bump' : ''}`}>
          {owned}
          {isFinite(cap) && (
            <small className="shop-cap" title={capTip}>
              /{cap}
            </small>
          )}
        </span>
        {pending > 0 && <span className="shop-transit" title="En route">+{pending} ⏳</span>}
        {pops.map((p) => (
          <span key={p.id} className="buy-pop">
            +{p.n}
          </span>
        ))}
        <span className={`shop-cost ${q.blocked === 'money' ? 'bad' : ''} ${q.blocked === 'max' ? 'max' : ''}`} title={q.blocked === 'max' ? capTip : undefined}>
          {reason || (
            <>
              {q.count > 1 && <small>×{q.count} </small>}
              {money(q.cost)}
            </>
          )}
        </span>
      </span>
    </button>
  );
}

export function Shop() {
  const cat = useUi((u) => u.shopCat);
  const setCat = useUi((u) => u.setShopCat);
  const focus = useUi((u) => u.shopFocus);
  const clearFocus = useUi((u) => u.clearShopFocus);
  const root = useRef<HTMLDivElement>(null);

  // Raccourci depuis une jauge : amener le premier article concerné à l'écran, puis éteindre la surbrillance.
  useEffect(() => {
    if (!focus) return;
    const frame = requestAnimationFrame(() => {
      const target = root.current?.querySelector('.shop-item.focus') ?? root.current;
      target?.scrollIntoView({ behavior: 'smooth', block: target === root.current ? 'nearest' : 'center' });
    });
    const timer = window.setTimeout(() => clearFocus(focus.nonce), 2600);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [focus, clearFocus]);
  const era = useGame((g) => g.state.era);
  const mods = useGame((g) => g.mods);
  const amount = useGame((g) => g.state.settings.buyAmount);
  const setAmount = useGame((g) => g.setBuyAmount);
  const items = BUILDINGS.filter((b) => b.cat === cat && b.era <= era + 1);
  return (
    <div className="shop" ref={root}>
      <div className="shop-toolbar">
        <div className="subtabs">
          {CATEGORIES.filter((c) => !c.era || c.era <= era + 1).map((c) => (
            <button key={c.id} className={`subtab ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
              <GameIcon set="categories" id={c.id} emoji={c.icon} size={20} /> {c.name}
            </button>
          ))}
        </div>
        <div className="amounts">
          {AMOUNTS.map((a) => (
            <button key={a} className={`amount ${amount === a ? 'active' : ''}`} onClick={() => setAmount(a)}>
              {a === 'max' ? 'Max' : `×${a}`}
            </button>
          ))}
        </div>
      </div>
      <div className="shop-list">
        {items.map((b) =>
          b.era > era ? (
            <div key={b.id} className="shop-item locked">
              <span className="shop-icon">❔</span>
              <span className="shop-main">
                <span className="shop-name">??? </span>
                <span className="shop-desc">Disponible à l&apos;ère suivante.</span>
              </span>
            </div>
          ) : (
            (() => {
              const hit = !!focus && !!effectiveProvides(b, mods)[focus.key];
              // La clé change avec le raccourci pour relancer l'animation de surbrillance.
              return <ShopItem key={hit ? `${b.id}-${focus.nonce}` : b.id} b={b} focus={hit} />;
            })()
          ),
        )}
      </div>
    </div>
  );
}
