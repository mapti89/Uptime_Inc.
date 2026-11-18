import { useGame } from '../../game/store';
import { eraDef } from '../../game/data/eras';
import { fmt, money, pct } from '../format';
import { Tweened } from './Tweened';
import type { ReactNode } from 'react';

function Chip({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: string }) {
  return (
    <div className={`chip ${tone ?? ''}`}>
      <span className="chip-label">{label}</span>
      <span className="chip-value">{value}</span>
      {sub && <span className="chip-sub">{sub}</span>}
    </div>
  );
}

export function TopBar() {
  const s = useGame((g) => g.state);
  const snap = useGame((g) => g.snap);
  const era = eraDef(s.era);
  const quality = snap.totalDemand > 0 ? snap.totalServed / snap.totalDemand : 1;
  const income = snap.net + snap.autoClick * snap.autoClickValue;
  return (
    <header className="topbar">
      <div className="brand">
        <img className="logo" src={`${import.meta.env.BASE_URL}assets/brand/logo.webp`} alt="" width={40} height={40} />
        <div>
          <div className="brand-name">Uptime Inc.</div>
          <div className="brand-era">
            {era.icon} Ère {era.id} · {era.name}
          </div>
        </div>
      </div>
      <div className="chips">
        <Chip label="Trésorerie" value={<Tweened value={s.money} format={money} />} sub={`${income >= 0 ? '+' : ''}${fmt(income)} $/s`} tone="money" />
        <Chip
          label="Requêtes"
          value={<Tweened value={snap.totalServed} format={(n) => `${fmt(n)}/s`} />}
          sub={`demande ${fmt(snap.totalDemand)}/s`}
          tone={quality < 0.9 ? 'warn' : ''}
        />
        <Chip label="Qualité de service" value={pct(quality)} tone={quality < 0.8 ? 'bad' : quality < 0.95 ? 'warn' : 'good'} />
        <Chip label="Uptime" value={pct(s.uptime, 2)} tone={s.uptime >= 0.999 ? 'good' : s.uptime < 0.9 ? 'bad' : ''} />
        <Chip label="Réputation" value={`${Math.round(s.reputation)}/100`} sub={`demande ×${(0.5 + s.reputation / 100).toFixed(2)}`} />
        {s.era >= 2 && <Chip label="R&D" value={<Tweened value={s.rd} format={fmt} />} sub={`+${fmt(snap.rdRate)}/s`} tone="rd" />}
        {s.prestige.totalShares > 0 && <Chip label="Actions" value={fmt(s.prestige.shares)} tone="shares" />}
      </div>
    </header>
  );
}
