import { useMemo, type MouseEvent } from 'react';
import { useGame } from '../../game/store';
import { BUILDINGS } from '../../game/data/buildings';
import { fmt } from '../format';

/** Visuel « baie » : une LED par machine possédée (plafonné), qui clignote selon la charge. */
export function ServerRoom() {
  const owned = useGame((g) => g.state.owned);
  const clickValue = useGame((g) => g.snap.clickValue);
  // Les LEDs clignotent plus vite quand le trafic augmente
  const load = useGame((g) => Math.min(1, Math.log10(1 + g.snap.totalServed) / 7));
  const efficiency = useGame((g) => g.snap.efficiency);
  const floaters = useGame((g) => g.floaters);
  const click = useGame((g) => g.click);

  const units = useMemo(() => {
    const list: { icon: string; id: string; n: number }[] = [];
    for (const b of BUILDINGS) {
      if (b.cat !== 'servers' && b.cat !== 'storage') continue;
      const n = owned[b.id] ?? 0;
      if (n > 0) list.push({ icon: b.icon, id: b.id, n });
    }
    return list;
  }, [owned]);

  const leds = useMemo(() => {
    const total = units.reduce((a, u) => a + u.n, 0);
    const n = Math.min(64, total);
    return Array.from({ length: n }, (_, i) => i);
  }, [units]);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    click(e.clientX - rect.left, e.clientY - rect.top);
  };

  const status = efficiency <= 0.01 ? 'down' : efficiency < 0.8 ? 'degraded' : 'ok';

  return (
    <div className="panel server-room">
      <button className={`rack-button status-${status}`} onClick={onClick} title="Traiter des requêtes à la main">
        <div className="rack">
          {leds.map((i) => (
            <span
              key={i}
              className="led"
              style={{ animationDelay: `${(i * 137) % 1000}ms`, animationDuration: `${0.4 + (1 - load) * 1.6}s` }}
            />
          ))}
          {leds.length === 0 && <span className="rack-empty">Rack vide</span>}
        </div>
        <div className="rack-label">
          ⌨️ Traiter manuellement <strong>+{fmt(clickValue)} $</strong>
        </div>
        {floaters.map((f) => (
          <span key={f.id} className="floater" style={{ left: f.x, top: f.y }}>
            {f.text}
          </span>
        ))}
      </button>
      <div className="machine-list">
        {units.map((u) => (
          <span key={u.id} className="machine" title={u.id}>
            {u.icon}
            <small>×{u.n}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
