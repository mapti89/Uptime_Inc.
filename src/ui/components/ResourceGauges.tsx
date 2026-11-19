import { useGame } from '../../game/store';
import { RESOURCES } from '../../game/types';
import { RES_LABEL, fmt, pct, resValue, watts } from '../format';

function Gauge({
  label,
  used,
  cap,
  text,
  hint,
  invert,
}: {
  label: string;
  used: number;
  cap: number;
  text: string;
  hint?: string;
  invert?: boolean;
}) {
  const ratio = cap > 0 ? used / cap : used > 0 ? Infinity : 0;
  const shown = Math.min(1, ratio);
  const tone = invert
    ? ratio > 1
      ? 'bad'
      : ratio > 0.9
        ? 'warn'
        : 'good'
    : ratio > 1
      ? 'bad'
      : ratio > 0.9
        ? 'warn'
        : 'good';
  return (
    <div className="gauge" title={hint}>
      <div className="gauge-head">
        <span>{label}</span>
        <span className={`gauge-val ${tone}`}>{text}</span>
      </div>
      <div className="bar thin">
        <div className={`bar-fill ${tone}`} style={{ width: `${shown * 100}%` }} />
      </div>
      {hint && <p className="gauge-hint">{hint}</p>}
    </div>
  );
}

export function ResourceGauges() {
  const snap = useGame((g) => g.snap);
  const era = useGame((g) => g.state.era);
  return (
    <div className="panel gauges">
      <h3>📟 Ressources</h3>
      <p className="muted small">Demande / capacité. Au-delà de 100 %, les requêtes sont perdues.</p>
      {RESOURCES.filter((r) => r !== 'gpu' || era >= 5 || snap.supply.gpu > 0).map((r) => (
        <Gauge
          key={r}
          label={RES_LABEL[r]}
          used={snap.need[r]}
          cap={snap.supply[r]}
          text={`${resValue(r, snap.need[r])} / ${resValue(r, snap.supply[r])}`}
        />
      ))}
      <div className="sep" />
      <Gauge
        label="⚡ Électricité"
        used={snap.totalWatts}
        cap={snap.powerCap}
        text={`${watts(snap.totalWatts)} / ${watts(snap.powerCap)}`}
        hint="Consommation des machines × PUE. Si elle dépasse la capacité, tout ralentit."
      />
      <Gauge
        label="❄️ Chaleur"
        used={snap.heat}
        cap={snap.coolCap}
        text={`${watts(snap.heat)} / ${watts(snap.coolCap)}`}
        hint="Chaleur dégagée vs capacité de refroidissement. Surchauffe = throttling."
      />
      <Gauge
        label="📐 Espace"
        used={snap.slotsUsed}
        cap={snap.slotsCap}
        text={`${fmt(snap.slotsUsed)} / ${fmt(snap.slotsCap)} U`}
      />
      <div className="kv-grid">
        <span>PUE</span>
        <strong className={snap.pue > 1.6 ? 'bad' : snap.pue < 1.25 ? 'good' : ''}>{snap.pue.toFixed(2)}</strong>
        <span>Facture énergie</span>
        <strong>
          {fmt(snap.elecCost)} $/s <small className="muted">({pct(snap.energyShare)} du CA)</small>
        </strong>
        <span>Efficacité</span>
        <strong className={snap.efficiency < 0.9 ? 'warn' : ''}>{pct(snap.efficiency, 0)}</strong>
        {snap.powerFactor < 1 && (
          <>
            <span className="bad">Sous-alimentation</span>
            <strong className="bad">{pct(snap.powerFactor, 0)}</strong>
          </>
        )}
        {snap.coolFactor < 1 && (
          <>
            <span className="bad">Throttling thermique</span>
            <strong className="bad">{pct(snap.coolFactor, 0)}</strong>
          </>
        )}
      </div>
    </div>
  );
}
