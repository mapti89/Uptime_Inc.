import type { ReactNode } from 'react';
import { useGame } from '../../game/store';
import { RESOURCES, type Category, type Provides, type Res } from '../../game/types';
import { BUILDINGS, CATEGORIES, LAUNCH_DEBRIS } from '../../game/data/buildings';
import { buildingCap } from '../../game/engine/formulas';
import { REQUEST_TYPES } from '../../game/data/requestTypes';
import { useUi } from '../uiStore';
import { RES_LABEL, fmt, mass, pct, resValue, watts } from '../format';
import { GALAXY_STARS, starCap } from '../../game/data/galaxy';
import { InfoTip } from './InfoTip';

type Tone = 'good' | 'warn' | 'bad';

function toneOf(used: number, cap: number): Tone {
  const ratio = cap > 0 ? used / cap : used > 0 ? Infinity : 0;
  return ratio > 1 ? 'bad' : ratio > 0.9 ? 'warn' : 'good';
}

/** Une ligne de jauge : libellé, valeur, barre. */
interface Row {
  label: ReactNode;
  used: number;
  cap: number;
  text: string;
  /** Capacité d'origine « proche » : la barre distingue alors la part proche et la part lointaine pontée. */
  near?: number;
  legend?: ReactNode;
}

const Arrow = () => (
  <span className="gauge-go" aria-hidden="true">
    ›
  </span>
);

function GaugeRow({ row, sub, arrow }: { row: Row; sub?: boolean; arrow?: boolean }) {
  const tone = toneOf(row.used, row.cap);
  const shown = row.cap > 0 ? Math.min(1, row.used / row.cap) : row.used > 0 ? 1 : 0;
  return (
    <>
      <span className={`gauge-head ${sub ? 'sub' : ''}`}>
        <span>{row.label}</span>
        <span className={`gauge-val ${tone}`}>
          {row.text}
          {arrow && <Arrow />}
        </span>
      </span>
      {row.near === undefined ? (
        <span className="bar thin">
          <span className={`bar-fill ${tone}`} style={{ width: `${shown * 100}%` }} />
        </span>
      ) : (
        // Utilisation découpée : d'abord le matériel proche, puis la part pontée du lointain (hachurée).
        <span className="bar thin split">
          <span className={`bar-fill ${tone}`} style={{ width: `${(Math.min(row.used, row.near) / (row.cap || 1)) * 100}%` }} />
          <span
            className={`bar-fill ${tone} bridged`}
            style={{ width: `${(Math.min(Math.max(0, row.used - row.near), row.cap - row.near) / (row.cap || 1)) * 100}%` }}
          />
        </span>
      )}
      {row.legend && <span className="gauge-legend">{row.legend}</span>}
    </>
  );
}

function Gauge({
  label,
  rows,
  tip,
  go,
}: {
  label: string;
  /** Une seule ligne : jauge simple. Plusieurs : titre puis une barre par ligne. */
  rows: Row[];
  tip: ReactNode;
  /** Raccourci : catégorie de la boutique et caractéristique à mettre en évidence. */
  go: [Category, keyof Provides];
}) {
  const goToShop = useUi((u) => u.goToShop);
  const catName = CATEGORIES.find((c) => c.id === go[0])?.name ?? '';
  const single = rows.length === 1;
  return (
    <InfoTip
      label={label}
      className="gauge"
      content={
        <>
          {tip}
          <p className="infotip-go">Cliquer sur la jauge : Infrastructure → {catName}</p>
        </>
      }
    >
      <button
        type="button"
        className="gauge-link"
        aria-label={`${label} : ${rows.map((r) => r.text).join(', ')}. Voir dans Infrastructure, ${catName}`}
        onClick={() => goToShop(go[0], go[1])}
      >
        {single ? (
          <GaugeRow row={{ ...rows[0], label }} arrow />
        ) : (
          <>
            <span className="gauge-head">
              <span>{label}</span>
              <span className="gauge-val">
                <Arrow />
              </span>
            </span>
            {rows.map((r, i) => (
              <GaugeRow key={i} row={r} sub />
            ))}
          </>
        )}
      </button>
    </InfoTip>
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

const RES_ABOUT: Record<Res, string> = {
  cpu: 'Puissance de calcul : sites, API, e-commerce, bases de données…',
  ram: 'Mémoire vive : bases de données, IA, applications.',
  storage: 'Espace disque : sauvegardes, archives, streaming, BDD.',
  gpu: 'Accélérateurs : inférence et entraînement IA, observation de la Terre.',
  bw: 'Débit réseau vers vos clients. Jamais « lointain » : il sert tous les types de requêtes.',
};

/** Contenu de l'infobulle d'une ressource de calcul. */
function ResourceTip({ r }: { r: Res }) {
  const snap = useGame((g) => g.snap);
  const mods = useGame((g) => g.mods);
  const far = snap.remoteSupply[r];
  const ratio = snap.need[r] > 0 ? snap.supply[r] / snap.need[r] : Infinity;
  const consumers = REQUEST_TYPES.filter((rt) => rt.needs[r] && snap.demand[rt.id] !== undefined)
    .map((rt) => ({ rt, need: snap.demand[rt.id] * (rt.needs[r] ?? 0) * mods.need[r] }))
    .filter((c) => c.need > 0)
    .sort((a, b) => b.need - a.need);
  const total = consumers.reduce((t, c) => t + c.need, 0);
  const lostTypes = consumers.filter((c) => snap.bottleneck[c.rt.id] === r);
  const bridge = Math.round(snap.latencyBridge * 100);
  return (
    <>
      <h4>{RES_LABEL[r]}</h4>
      <p className="muted">{RES_ABOUT[r]}</p>
      <dl className="infotip-kv">
        <dt>Demande / capacité</dt>
        <dd>
          {resValue(r, snap.need[r])} / {resValue(r, snap.supply[r])}
        </dd>
        {far > 0 && (
          <>
            <dt>⚡ Temps réel</dt>
            <dd>
              {resValue(r, snap.needRealtime[r])} / {resValue(r, snap.realtimeCap[r])}
              <br />
              <span className="muted">
                = proche {resValue(r, snap.supply[r] - far)} + lointain {resValue(r, far * snap.latencyBridge)}
              </span>
            </dd>
            <dt>🐢 Tolérant</dt>
            <dd>
              {resValue(r, snap.need[r] - snap.needRealtime[r])} /{' '}
              {resValue(r, far * (1 - snap.latencyBridge) + Math.max(0, snap.realtimeCap[r] - snap.needRealtime[r]))}
              <br />
              <span className="muted">= lointain réservé + ce que le ⚡ laisse libre du partagé</span>
            </dd>
            <dt>🐢 Matériel lointain</dt>
            <dd>
              {resValue(r, far)}, dont {resValue(r, far * snap.latencyBridge)} ({bridge} %) utilisables aussi par le ⚡ temps réel
            </dd>
          </>
        )}
      </dl>
      {consumers.length > 0 && (
        <>
          <p className="infotip-sub">Consommé par</p>
          <ul className="infotip-list">
            {consumers.slice(0, 5).map(({ rt, need }) => (
              <li key={rt.id}>
                <span>
                  {rt.tolerant ? '🐢' : '⚡'} {rt.name}
                </span>
                <span className="muted">{pct(need / total, 0)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {lostTypes.length > 0 ? (
        <p className="infotip-alert">
          ⚠️ Goulot pour : {lostTypes.map((c) => c.rt.name).join(', ')}. Les requêtes en trop sont perdues (uptime et réputation en baisse).
        </p>
      ) : (
        ratio < Infinity && <p className="infotip-ok">Marge : {pct(Math.max(0, 1 - 1 / ratio), 0)} de capacité libre.</p>
      )}
      {far > 0 && (
        <p className="muted small">
          Le matériel lointain (Mars et au-delà) sert les requêtes 🐢 tolérantes à la latence ; seule une part pontée sert aussi les ⚡
          temps réel. Le pont augmente avec la recherche, et un trou de ver le supprime.
        </p>
      )}
    </>
  );
}

/** Tous les équipements qui fournissent `key` sont-ils au maximum de l'ère ? */
function useAllMaxed(key: keyof Provides): boolean {
  const s = useGame((g) => g.state);
  const list = BUILDINGS.filter((b) => b.era <= s.era && b.provides[key]);
  return list.length > 0 && list.every((b) => (s.owned[b.id] ?? 0) >= buildingCap(b, s.era));
}

/** Conseil affiché quand une jauge déborde alors que tout son matériel est au maximum. */
function MaxedHint({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="infotip-alert">
      Tous les équipements de ce type sont au maximum de l’ère : cherchez une amélioration ou une recherche qui augmente
      cette capacité (ou réduit le besoin), sinon l’ère suivante relèvera les plafonds.
    </p>
  );
}

function SimpleTip({ title, value, children, hint }: { title: string; value: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <>
      <h4>{title}</h4>
      <dl className="infotip-kv">
        <dt>Utilisé / capacité</dt>
        <dd>{value}</dd>
      </dl>
      <p className="muted">{children}</p>
      {hint}
    </>
  );
}

export function ResourceGauges() {
  const snap = useGame((g) => g.snap);
  const era = useGame((g) => g.state.era);
  const stars = useGame((g) => g.state.stars);
  const maxed = {
    power: useAllMaxed('power'),
    cooling: useAllMaxed('cooling'),
    space: useAllMaxed('space'),
    lift: useAllMaxed('lift'),
    cleanup: useAllMaxed('cleanup'),
  };
  return (
    <div className="panel gauges">
      <h3>📟 Ressources</h3>
      <p className="muted small">Demande / capacité. Au-delà de 100 %, les requêtes sont perdues.</p>
      {RESOURCES.filter((r) => r !== 'gpu' || era >= 5 || snap.supply.gpu > 0).map((r) => {
        const far = snap.remoteSupply[r];
        let rows: Row[];
        if (far > 0) {
          // Deux barres, chacune face à la capacité qui lui reste vraiment (même logique que le moteur) :
          // - le tolérant prend d'abord le lointain réservé, puis déborde sur le partagé (proche + ponté) ;
          // - le temps réel dispose du partagé, moins ce débordement.
          // Une barre ne passe au rouge que si des requêtes de sa catégorie sont réellement perdues.
          const needI = snap.needRealtime[r];
          const needT = snap.need[r] - needI;
          const bridged = far * snap.latencyBridge;
          const near = snap.supply[r] - far;
          const reserved = far - bridged;
          const shared = snap.realtimeCap[r];
          const overflowT = Math.max(0, needT - reserved);
          const capI = Math.max(0, shared - overflowT);
          const spareShared = Math.max(0, shared - needI);
          const capT = reserved + spareShared;
          const bridgePct = Math.round(snap.latencyBridge * 100);
          rows = [
            {
              label: '⚡ Temps réel',
              used: needI,
              cap: capI,
              near: Math.min(near, capI),
              text: `${resValue(r, needI)} / ${resValue(r, capI)}`,
              legend: (
                <>
                  <i className="swatch" /> proche {resValue(r, near)} · <i className="swatch bridged" /> lointain {bridgePct} %{' '}
                  {resValue(r, bridged)}
                  {overflowT > 0 && <> · − {resValue(r, Math.min(overflowT, shared))} pris par le 🐢</>}
                </>
              ),
            },
            {
              label: '🐢 Tolérant',
              used: needT,
              cap: capT,
              text: `${resValue(r, needT)} / ${resValue(r, capT)}`,
              legend: (
                <>
                  lointain réservé {resValue(r, reserved)} + partagé libre {resValue(r, spareShared)}
                </>
              ),
            },
          ];
        } else {
          rows = [{ label: RES_LABEL[r], used: snap.need[r], cap: snap.supply[r], text: `${resValue(r, snap.need[r])} / ${resValue(r, snap.supply[r])}` }];
        }
        return <Gauge key={r} label={RES_LABEL[r]} rows={rows} tip={<ResourceTip r={r} />} go={RES_SHOP[r]} />;
      })}
      <div className="sep" />
      <Gauge
        label="⚡ Électricité"
        rows={[{ label: '', used: snap.totalWatts, cap: snap.powerCap, text: `${watts(snap.totalWatts)} / ${watts(snap.powerCap)}` }]}
        tip={
          <SimpleTip title="⚡ Électricité" value={`${watts(snap.totalWatts)} / ${watts(snap.powerCap)}`} hint={<MaxedHint show={snap.totalWatts > snap.powerCap && maxed.power} />}>
            Consommation des machines × PUE ({snap.pue.toFixed(2)}) face à la capacité électrique. Au-delà, toutes les machines ralentissent
            d’autant{snap.powerFactor < 1 ? ` : actuellement ${pct(snap.powerFactor, 0)} de puissance` : ''}.
          </SimpleTip>
        }
        go={['power', 'power']}
      />
      <Gauge
        label="❄️ Chaleur"
        rows={[{ label: '', used: snap.heat, cap: snap.coolCap, text: `${watts(snap.heat)} / ${watts(snap.coolCap)}` }]}
        tip={
          <SimpleTip title="❄️ Chaleur" value={`${watts(snap.heat)} / ${watts(snap.coolCap)}`} hint={<MaxedHint show={snap.heat > snap.coolCap && maxed.cooling} />}>
            Chaleur dégagée par les machines face à la capacité de refroidissement. Au-delà, surchauffe : les machines brident leurs
            performances{snap.coolFactor < 1 ? ` (actuellement ${pct(snap.coolFactor, 0)})` : ''}. Le refroidissement pèse aussi sur le PUE.
          </SimpleTip>
        }
        go={['cooling', 'cooling']}
      />
      <Gauge
        label="📐 Espace"
        rows={[{ label: '', used: snap.slotsUsed, cap: snap.slotsCap, text: `${fmt(snap.slotsUsed)} / ${fmt(snap.slotsCap)} U` }]}
        tip={
          <SimpleTip title="📐 Espace" value={`${fmt(snap.slotsUsed)} / ${fmt(snap.slotsCap)} U`} hint={<MaxedHint show={snap.slotsCap - snap.slotsUsed < 1 && maxed.space} />}>
            Emplacements de baie occupés. Quand c’est plein, on ne peut plus installer de machines : achetez des baies, des salles…
          </SimpleTip>
        }
        go={['space', 'space']}
      />
      {era >= 7 && (
        <Gauge
          label="🚀 Emport"
          rows={[{ label: '', used: snap.massUsed, cap: snap.liftCap, text: `${mass(snap.massUsed)} / ${mass(snap.liftCap)}` }]}
          tip={
            <SimpleTip title="🚀 Emport" value={`${mass(snap.massUsed)} / ${mass(snap.liftCap)}`} hint={<MaxedHint show={snap.massUsed >= snap.liftCap * 0.98 && maxed.lift} />}>
              Masse du matériel spatial (en service ou en route) face à la capacité de vos lanceurs. Sans emport libre, impossible
              d’envoyer plus de matériel.
            </SimpleTip>
          }
          go={['orbit', 'lift']}
        />
      )}
      {era >= 7 && snap.debris > 0 && (
        <Gauge
          label="🛰️ Débris orbitaux"
          rows={[{ label: '', used: snap.debris, cap: snap.cleanupCap, text: `${mass(snap.debris)} / ${mass(snap.cleanupCap)}` }]}
          tip={
            <>
              <h4>🛰️ Débris orbitaux</h4>
              <dl className="infotip-kv">
                <dt>Générés / nettoyage</dt>
                <dd>
                  {mass(snap.debris)} / {mass(snap.cleanupCap)}
                </dd>
                <dt>🛰️ Satellites</dt>
                <dd>{mass(snap.debris - snap.launchDebris)}</dd>
                {snap.launchDebris > 0 && (
                  <>
                    <dt>🚀 Lancements</dt>
                    <dd>
                      {mass(snap.launchDebris)}
                      <br />
                      <span className="muted">
                        lanceurs sans fusée : {pct(snap.cleanLaunchShare, 0)} de l’emport → −{pct(snap.cleanLaunchShare * LAUNCH_DEBRIS.cleanCut, 0)}
                      </span>
                    </dd>
                  </>
                )}
              </dl>
              <p className="muted">
                Les satellites en orbite basse produisent leurs propres débris ; tout autre matériel lancé (Lune, Mars, étoiles…) laisse
                des étages et des fragments proportionnels à sa masse. Catapulte, ascenseur et voiles laser en suppriment l’essentiel.
                Au-delà du nettoyage, les collisions dégradent tout le parc
                {snap.debrisFactor < 1 ? ` (actuellement ${pct(snap.debrisFactor, 0)} d’efficacité)` : ''}.
              </p>
              <MaxedHint show={snap.debris >= snap.cleanupCap * 0.98 && maxed.cleanup} />
            </>
          }
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
