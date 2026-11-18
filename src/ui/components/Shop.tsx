import { useRef, useState } from 'react';
import { useGame } from '../../game/store';
import { BUILDINGS, CATEGORIES } from '../../game/data/buildings';
import { quoteBuilding } from '../../game/engine/actions';
import type { BuildingDef, BuyAmount, Category, Provides } from '../../game/types';
import { GameIcon } from './GameIcon';
import { bandwidth, fmt, money, ram, storage, watts } from '../format';

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
  if (p.traffic) out.push(`+${fmt(p.traffic * mult)} req/s de demande`);
  if (p.rd) out.push(`+${fmt(p.rd)} R&D/s`);
  if (p.autoClick) out.push(`${fmt(p.autoClick)} clic/s`);
  if (p.repair) out.push(`réparation +${(p.repair * 100).toFixed(1)} %/s`);
  if (p.efficiency) out.push(`efficacité +${(p.efficiency * 100).toFixed(0)} %`);
  if (p.reliability) out.push(`incidents −${(p.reliability * 100).toFixed(0)} %`);
  return out;
}

function ShopItem({ b }: { b: BuildingDef }) {
  const s = useGame((g) => g.state);
  const mods = useGame((g) => g.mods);
  const buy = useGame((g) => g.buy);
  const owned = s.owned[b.id] ?? 0;
  const q = quoteBuilding(s, b, s.settings.buyAmount, mods);
  const mult = (mods.building[b.id] ?? 1) * (mods.cat[b.cat] ?? 1);
  const disabled = !!q.blocked;
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
    q.blocked === 'space' ? 'Plus de place !' : q.blocked === 'max' ? 'Maximum atteint' : q.blocked === 'era' ? 'Ère suivante' : '';
  return (
    <button className={`shop-item ${disabled ? 'disabled' : ''} ${q.blocked === 'money' ? 'poor' : ''}`} onClick={onBuy} disabled={disabled}>
      <span className="shop-icon">
        <GameIcon set="buildings" id={b.id} emoji={b.icon} size={44} />
      </span>
      <span className="shop-main">
        <span className="shop-name">
          {b.name} {mult > 1 && <span className="mult">×{fmt(mult)}</span>}
        </span>
        <span className="shop-desc">{b.desc}</span>
        <span className="shop-stats">
          {describeProvides(b.provides, mult).map((t) => (
            <span key={t} className="stat-pill">
              {t}
            </span>
          ))}
          {b.watts > 0 && <span className="stat-pill power">{watts(b.watts * mods.watts)}</span>}
          {b.slots > 0 && <span className="stat-pill space">{b.slots} U</span>}
          {b.overhead !== undefined && <span className="stat-pill">surcoût PUE {b.overhead}</span>}
        </span>
      </span>
      <span className="shop-side">
        <span key={owned} className={`shop-owned ${pops.length ? 'bump' : ''}`}>
          {owned}
        </span>
        {pops.map((p) => (
          <span key={p.id} className="buy-pop">
            +{p.n}
          </span>
        ))}
        <span className={`shop-cost ${q.blocked === 'money' ? 'bad' : ''}`}>
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
  const [cat, setCat] = useState<Category>('servers');
  const era = useGame((g) => g.state.era);
  const amount = useGame((g) => g.state.settings.buyAmount);
  const setAmount = useGame((g) => g.setBuyAmount);
  const items = BUILDINGS.filter((b) => b.cat === cat && b.era <= era + 1);
  return (
    <div className="shop">
      <div className="shop-toolbar">
        <div className="subtabs">
          {CATEGORIES.map((c) => (
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
            <ShopItem key={b.id} b={b} />
          ),
        )}
      </div>
    </div>
  );
}
