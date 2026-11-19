import { useGame } from '../../game/store';
import { RESOURCES, type Category, type Provides, type Res } from '../../game/types';
import { CATEGORIES } from '../../game/data/buildings';
import { useUi } from '../uiStore';
import { RES_LABEL, fmt, mass, pct, resValue, watts } from '../format';
import { GALAXY_STARS, starCap } from '../../game/data/galaxy';

function Gauge({
  label,
  used,
  cap,
  text,
  hint,
  invert,
  go,
}: {
  label: string;
  used: number;
  cap: number;
  text: string;
  hint?: string;
  invert?: boolean;
  /** Raccourci : catégorie de la boutique et caractéristique à mettre en évidence. */
  go: [Category, keyof Provides];
}) {
  const goToShop = useUi((u) => u.goToShop);
  const catName = CATEGORIES.find((c) => c.id === go[0])?.name ?? '';
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
    <button
      type="button"
      className="gauge gauge-link"
      title={`${hint ? `${hint}\n` : ''}Voir dans Infrastructure → ${catName}`}
      aria-label={`${label} : ${text}. Voir dans Infrastructure, ${catName}`}
      onClick={() => goToShop(go[0], go[1])}
    >
      <span className="gauge-head">
        <span>{label}</span>
        <span className={`gauge-val ${tone}`}>
          {text}
          <span className="gauge-go" aria-hidden="true">
            ›
          </span>
        </span>
      </span>
      <span className="bar thin">
        <span className={`bar-fill ${tone}`} style={{ width: `${shown * 100}%` }} />
      </span>
      {hint && <span className="gauge-hint">{hint}</span>}
    </button>
  );
}

/** Où acheter chaque ressource de calcul. */
const RES_SHOP: Record<Res, [Category, keyof Provides]> = {
  cpu: ['servers', 'cpu'],
  ram: ['servers', 'ram'],
  gpu: ['servers', 'gpu'],
  storage: ['storage', 'storage'],
  bw: ['network', 'bw'],
};

export function ResourceGauges() {
  const snap = useGame((g) => g.snap);
  const era = useGame((g) => g.state.era);
  const stars = useGame((g) => g.state.stars);
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
          hint={
            snap.remoteSupply[r] > 0
              ? `dont ${resValue(r, snap.remoteSupply[r])} lointains (requêtes tolérantes à la latence uniquement)`
              : undefined
          }
          go={RES_SHOP[r]}
        />
      ))}
      <div className="sep" />
      <Gauge
        label="⚡ Électricité"
        used={snap.totalWatts}
        cap={snap.powerCap}
        text={`${watts(snap.totalWatts)} / ${watts(snap.powerCap)}`}
        hint="Consommation des machines × PUE. Si elle dépasse la capacité, tout ralentit."
        go={['power', 'power']}
      />
      <Gauge
        label="❄️ Chaleur"
        used={snap.heat}
        cap={snap.coolCap}
        text={`${watts(snap.heat)} / ${watts(snap.coolCap)}`}
        hint="Chaleur dégagée vs capacité de refroidissement. Surchauffe = throttling."
        go={['cooling', 'cooling']}
      />
      <Gauge
        label="📐 Espace"
        used={snap.slotsUsed}
        cap={snap.slotsCap}
        text={`${fmt(snap.slotsUsed)} / ${fmt(snap.slotsCap)} U`}
        go={['space', 'space']}
      />
      {era >= 7 && (
        <Gauge
          label="🚀 Emport"
          used={snap.massUsed}
          cap={snap.liftCap}
          text={`${mass(snap.massUsed)} / ${mass(snap.liftCap)}`}
          hint="Masse du matériel spatial (en service ou en route) / capacité de vos lanceurs."
          go={['orbit', 'lift']}
        />
      )}
      {era >= 7 && snap.debris > 0 && (
        <Gauge
          label="🛰️ Débris orbitaux"
          used={snap.debris}
          cap={snap.cleanupCap}
          text={`${mass(snap.debris)} / ${mass(snap.cleanupCap)}`}
          hint="Débris générés / capacité de nettoyage. Au-delà, les collisions dégradent tout le parc."
          go={['orbit', 'cleanup']}
        />
      )}
      {era >= 11 && (
        <div className="gauge stars-gauge">
          <span className="gauge-head">
            <span>🌌 Étoiles colonisées</span>
            <span className="gauge-val good">
              {fmt(stars)} / {fmt(starCap(era))}
            </span>
          </span>
          <span className="bar thin">
            <span className="bar-fill era" style={{ width: `${(Math.log10(Math.max(1, stars)) / Math.log10(GALAXY_STARS)) * 100}%` }} />
          </span>
          <span className="gauge-hint">
            Croissance +{(snap.replication * 100).toFixed(2)} %/s · demande ×{snap.starMult.toFixed(2)}
            {era === 11 && ' · la galaxie entière s’ouvre à l’ère suivante'}
          </span>
        </div>
      )}
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
        {snap.debrisFactor < 1 && (
          <>
            <span className="bad">Collisions orbitales</span>
            <strong className="bad">{pct(snap.debrisFactor, 0)}</strong>
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
