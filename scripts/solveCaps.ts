/**
 * Solveur d'équilibrage : plafonds de bâtiments et production des bâtiments d'appui.
 * Usage : npm run caps -- [--write] [--beta 0.6] [--beta-era 9=0.8] [--top-min 10] [--verbose]
 *
 * Principe, ère par ère (les bâtiments des ères précédentes sont déjà fixés) :
 *  1. Plafonds des serveurs : on achète un exemplaire tant que son prix reste sous λ × sa
 *     valeur (part de la demande qu'il sert). Les vieux serveurs décrochent d'eux-mêmes.
 *     λ est fixé par le plafond du serveur le plus récent de l'ère : le plus grand qui garde
 *     le coût du max sous β × seuil de l'ère suivante (au moins TOP_MIN).
 *     Équipe, commercial et appuis nouveaux prennent le même prix marginal que ce serveur ;
 *     les anciens commerciaux et appuis sont figés quand un successeur apparaît.
 *  2. Serveurs et équipe gardent leur production : ils fixent la capacité de l'ère.
 *  3. Commercial : sa production est calée pour que la demande, même triplée (buzz viral,
 *     signal extraterrestre), reste entièrement servie quand tout est au max. Son prix suit
 *     le même facteur (même coût par requête/s qu'avant) : c'est le plafond qui borne la demande.
 *  4. Stockage, réseau, espace, emport, nettoyage orbital : production calée au plus juste sur
 *     le besoin de l'état « tout au max » (pic ×3 pour le stockage et le réseau, petite marge
 *     pour le reste). Électricité et refroidissement gardent leur production d'origine jusqu'à
 *     l'ère 5 (leur nombre est calé au plus juste) ; ensuite, quelques exemplaires de
 *     puissance réduite (10 pour le plus gros de l'ère, 5 pour les autres).
 *  5. Arrivée : l'état max doit encore servir 95 % des requêtes en entrant dans l'ère suivante
 *     (nouveaux types de requêtes, trafic de base plus fort), le temps d'acheter le nouveau matériel.
 * Le résultat (plafond, facteur de production) est écrit dans src/game/data/balance.ts.
 */
import { writeFileSync } from 'node:fs';
import { BUILDINGS, RAW_BUILDINGS, round2, scaledKey } from '../src/game/data/buildings';
import { ERAS, MAX_ERA } from '../src/game/data/eras';
import type { BuildingDef, Provides } from '../src/game/types';
import { maxState, measure, eraCost, fmtN, type Measure } from './balanceLib';
import { REQUEST_TYPES } from '../src/game/data/requestTypes';

const args = process.argv.slice(2);
const strArg = (name: string) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : null);
const pairs = (v: string | null) => (v ? v.split(',').map((kv) => kv.split('=').map(Number) as [number, number]) : []);
const VERBOSE = args.includes('--verbose');

/** Coût de la montée au max de l'ère, en fraction du seuil de l'ère suivante. */
const BETA: Record<number, number> = {};
for (let e = 1; e <= MAX_ERA; e++) BETA[e] = Number(strArg('beta') ?? 0.6);
for (const [e, b] of pairs(strArg('beta-era'))) BETA[e] = b;
/** Plafond minimal du serveur le plus récent de chaque ère. */
const TOP_MIN = Number(strArg('top-min') ?? 10);
/** Pic de demande à absorber. */
const PEAK = 3;
/** Marge sur l'électricité, le refroidissement et le nettoyage orbital. */
const MARGIN = 1.05;
/** Part servie exigée pour chaque type de requête pendant le pic. */
const SERVED = 0.999;
/** Part des requêtes servies exigée à l'arrivée dans l'ère suivante, avec le matériel au max. */
const ARRIVAL = 0.95;

const RAW: Record<string, BuildingDef> = Object.fromEntries(RAW_BUILDINGS.map((b) => [b.id, b]));
const scale: Record<string, number> = {};

type Group = 'servers' | 'anchor' | 'sales' | 'storage' | 'network' | 'space' | 'lift' | 'cleanup' | 'cooling' | 'power';
function groupOf(b: BuildingDef): Group {
  const key = scaledKey(b);
  if (!key) return b.cat === 'servers' ? 'servers' : 'anchor';
  if (key === 'traffic') return 'sales';
  if (key === 'bw') return 'network';
  return key as Group;
}

/** Fixe la production principale d'un bâtiment d'appui (facteur appliqué aux valeurs brutes). */
function setScale(b: BuildingDef, k: number) {
  const key = scaledKey(b) as keyof Provides;
  scale[b.id] = k;
  b.provides = { ...RAW[b.id].provides, [key]: round2(RAW[b.id].provides[key]! * k) };
  if (b.cat === 'sales' || b.cat === 'power' || b.cat === 'cooling') b.baseCost = round2(RAW[b.id].baseCost * k);
}

/** Exemplaires dont le prix unitaire reste sous le budget. */
function unitsUnder(b: BuildingDef, budget: number): number {
  if (budget < b.baseCost) return 0;
  return Math.floor(Math.log(budget / b.baseCost) / Math.log(b.growth) + 1e-9) + 1;
}

const nextThreshold = (e: number) => (e < MAX_ERA ? ERAS[e].threshold : ERAS[MAX_ERA - 1].threshold * 1000);
const inGroup = (E: number, g: Group, onlyNew: boolean) =>
  BUILDINGS.filter((b) => (onlyNew ? b.era === E : b.era <= E) && groupOf(b) === g);

// On repart des valeurs brutes (le fichier balance.ts déjà appliqué est ignoré).
for (const b of BUILDINGS) {
  b.maxByEra = [];
  b.provides = { ...RAW[b.id].provides };
  b.baseCost = RAW[b.id].baseCost;
}
const capAt = (b: BuildingDef, E: number) => b.maxByEra![E - b.era] ?? 0;
const prevCap = (b: BuildingDef, E: number) => (E > b.era ? capAt(b, E - 1) : 0);
const setCap = (b: BuildingDef, E: number, n: number) => {
  b.maxByEra![E - b.era] = n;
};

const m = (E: number): Measure => measure(maxState(E), PEAK);
const peakOk = (r: Measure) => r.worstTypeViral >= SERVED;

/** Dichotomie en échelle log sur un paramètre : plus petit (ou plus grand) satisfaisant `ok`. */
function bisect(apply: (x: number) => void, ok: () => boolean, want: 'min' | 'max', lo: number, hi: number): number {
  for (let it = 0; it < 60; it++) {
    const mid = (lo + hi) / 2;
    apply(10 ** mid);
    if ((want === 'min') === ok()) hi = mid;
    else lo = mid;
  }
  const x = 10 ** (want === 'min' ? hi : lo);
  apply(x);
  return x;
}

/**
 * Groupe d'appui ou commercial. S'il a des nouveautés dans l'ère : les anciens sont figés,
 * les nouveaux prennent un plafond « naturel » et leur production est calée.
 * Sinon : les anciens montent juste ce qu'il faut.
 */
function placeGroup(E: number, g: Group, budget: number) {
  const fresh = inGroup(E, g, true);
  for (const b of inGroup(E, g, false)) if (b.era < E) setCap(b, E, prevCap(b, E));
  for (const b of fresh) setCap(b, E, Math.max(1, unitsUnder(RAW[b.id], budget)));
  return fresh;
}
function solveGroup(E: number, g: Group, ok: () => boolean, want: 'min' | 'max'): string {
  const fresh = inGroup(E, g, true);
  if (fresh.length) {
    const k = bisect((x) => fresh.forEach((b) => setScale(b, x)), ok, want, -12, 12);
    return `${g}×${fmtN(k)}`;
  }
  const old = inGroup(E, g, false);
  if (!old.length) return '';
  const bud = bisect((x) => old.forEach((b) => setCap(b, E, Math.max(prevCap(b, E), unitsUnder(b, x)))), ok, want, 0, 45);
  return `${g}:anciens≤${fmtN(bud)}`;
}
/**
 * Électricité et refroidissement gardent leur production d'origine (une centrale reste une
 * centrale) : c'est leur nombre qui est calé au plus juste. Les nouveautés de l'ère montent
 * juste ce qu'il faut (au moins un exemplaire) ; sans nouveauté, les anciens prennent le relais.
 */
const COUNTED: Group[] = ['power', 'cooling'];

/**
 * À partir de cette ère, les centrales et refroidissements d'origine sont surdimensionnés
 * (un seul exemplaire couvre 100 fois le besoin) : leur puissance est réduite pour qu'il en
 * faille quelques-uns — PLANT_CAP pour le plus gros de l'ère, la moitié pour les autres —
 * sans descendre sous le double du plus gros équipement de l'ère précédente.
 */
const SCALED_PLANTS_FROM = 6;
const PLANT_CAP = 10;

function solveCount(E: number, g: Group, ok: () => boolean): string {
  const fresh = inGroup(E, g, true);
  if (fresh.length && E >= SCALED_PLANTS_FROM) {
    const sorted = [...fresh].sort((a, b) => b.baseCost - a.baseCost);
    const key = g as 'power' | 'cooling';
    sorted.forEach((b, i) => setCap(b, E, i === 0 ? PLANT_CAP : PLANT_CAP / 2));
    let k = bisect((x) => fresh.forEach((b) => setScale(b, x)), ok, 'min', -12, 12);
    // Le plus gros équipement de l'ère produit au moins deux fois plus que celui de l'ère
    // précédente : s'il le faut, on garde cette puissance et on réduit leur nombre.
    const prevTop = inGroup(E - 1, g, false).reduce((mx, b) => Math.max(mx, b.provides[key] ?? 0), 0);
    const kMin = (2 * prevTop) / (RAW[sorted[0].id].provides[key] ?? 1);
    if (k < kMin) {
      k = Math.min(1, kMin);
      fresh.forEach((b) => setScale(b, k));
      bisect((x) => sorted.forEach((b, i) => setCap(b, E, Math.max(1, Math.min(i === 0 ? PLANT_CAP : PLANT_CAP / 2, Math.round(x))))), ok, 'min', 0, 1.1);
    }
    return `${g}:${fresh.map((b) => `${b.id}=${capAt(b, E)}`).join(',')} ×${fmtN(k)}`;
  }
  if (fresh.length) {
    const bud = bisect((x) => fresh.forEach((b) => setCap(b, E, Math.max(1, unitsUnder(RAW[b.id], x)))), ok, 'min', 0, 45);
    return `${g}:${fresh.map((b) => `${b.id}=${capAt(b, E)}`).join(',')} (≤${fmtN(bud)})`;
  }
  return solveGroup(E, g, ok, 'min');
}

function unlimited(E: number, g: Group) {
  const fresh = inGroup(E, g, true);
  if (fresh.length && COUNTED.includes(g)) {
    fresh.forEach((b) => setCap(b, E, 1e6));
    if (E >= SCALED_PLANTS_FROM) fresh.forEach((b) => setScale(b, 1));
  }
  else if (fresh.length) fresh.forEach((b) => setScale(b, 1e9));
  else inGroup(E, g, false).forEach((b) => setCap(b, E, 1e6));
}

const SUPPORT: Group[] = ['storage', 'network', 'cooling', 'power', 'space', 'lift', 'cleanup'];

/**
 * Valeur d'un serveur : part de la demande (par requête/s) qu'il sert, ressource par ressource.
 * Sert à comparer un vieux serveur et un récent à prix égal.
 */
function serverValue(b: BuildingDef, E: number, mods: Measure['mods']): number {
  const k: Record<string, number> = { cpu: 0, ram: 0, gpu: 0 };
  for (const rt of REQUEST_TYPES) {
    if (rt.era > E) continue;
    for (const r of ['cpu', 'ram', 'gpu'] as const) k[r] += rt.weight * (rt.needs[r] ?? 0) * mods.need[r];
  }
  let v = 0;
  for (const r of ['cpu', 'ram', 'gpu'] as const) {
    const p = b.provides[r] ?? 0;
    if (p > 0 && k[r] > 0) v += (p * mods.stat[r]) / k[r];
  }
  return v;
}
const unitPrice = (b: BuildingDef, n: number) => b.baseCost * b.growth ** Math.max(0, n - 1);

/**
 * Plafonds de l'ère E pour un prix « par unité de valeur » λ :
 *  - serveurs : exemplaires dont le prix reste sous λ × valeur (les vieux décrochent d'eux-mêmes) ;
 *  - équipe et sondes : même prix marginal que le meilleur serveur, tant qu'elles ont moins de deux ères ;
 *  - commercial et appuis : les nouveaux prennent ce même prix marginal, les anciens sont figés.
 */
function placeCaps(E: number, lambda: number, mods: Measure['mods']) {
  let marginal = 0;
  for (const b of inGroup(E, 'servers', false)) {
    const n = Math.max(prevCap(b, E), unitsUnder(b, lambda * serverValue(b, E, mods)), b.era === E ? 1 : 0);
    setCap(b, E, n);
    if (b.era === E) marginal = Math.max(marginal, unitPrice(b, n));
  }
  for (const b of inGroup(E, 'anchor', false)) setCap(b, E, b.era >= E - 1 ? Math.max(prevCap(b, E), unitsUnder(b, marginal), b.era === E ? 1 : 0) : prevCap(b, E));
  for (const g of ['sales', ...SUPPORT] as Group[]) placeGroup(E, g, marginal);
}

for (let E = 1; E <= MAX_ERA; E++) {
  // Technologies de l'ère, matériel de l'ère précédente : sert à évaluer la valeur des serveurs.
  const mods = measure(maxState(E, { ownedEra: E - 1 }), PEAK).mods;
  // λ tel que le serveur le plus récent (le plus cher) de l'ère plafonne à N exemplaires,
  // N étant le plus grand qui garde le coût du max sous β × seuil suivant (au moins TOP_MIN).
  const top = inGroup(E, 'servers', true).sort((a, b) => b.baseCost - a.baseCost)[0];
  const lambdaFor = (n: number) => (unitPrice(top, n) * 1.0001) / serverValue(top, E, mods);
  let n = TOP_MIN;
  while (n < 400) {
    placeCaps(E, lambdaFor(n + 1), mods);
    if (eraCost(E, mods) > BETA[E] * nextThreshold(E)) break;
    n++;
  }
  const lambda = lambdaFor(n);
  placeCaps(E, lambda, mods);
  for (const g of SUPPORT) unlimited(E, g);
  const notes: string[] = [];
  // Au max, l'ère doit aussi encaisser l'arrivée dans la suivante (nouveaux types de requêtes,
  // trafic de base plus élevé) sans s'effondrer : au moins ARRIVAL des requêtes servies.
  const arrOk = () => E >= MAX_ERA || measure(maxState(E + 1, { ownedEra: E, techEra: E }), PEAK).quality >= ARRIVAL;
  const serveOk = () => peakOk(m(E)) && arrOk();
  notes.push(solveGroup(E, 'sales', serveOk, 'max'));
  notes.push(solveGroup(E, 'storage', serveOk, 'min'));
  notes.push(solveGroup(E, 'network', serveOk, 'min'));
  unlimited(E, 'power');
  // Électricité et froid doivent suffire au matériel de l'ère au max même avant d'en avoir
  // terminé la recherche et les améliorations (qui réduisent la consommation) : sinon le
  // joueur resterait bloqué, centrales au maximum, le temps de les débloquer.
  const early = () => measure(maxState(E, { techEra: E - 1 }), PEAK);
  notes.push(solveCount(E, 'cooling', () => m(E).cooling >= MARGIN && (E === 1 || early().cooling >= 1)));
  notes.push(solveCount(E, 'power', () => m(E).power >= MARGIN && (E === 1 || early().power >= 1)));
  notes.push(solveGroup(E, 'space', () => m(E).slotsFree >= 0, 'min'));
  notes.push(solveGroup(E, 'lift', () => m(E).lift >= 1, 'min'));
  notes.push(solveGroup(E, 'cleanup', () => m(E).debris >= MARGIN, 'min'));
  // Les arrondis peuvent laisser le pic juste hors d'atteinte : on rabote le commercial.
  const freshSales = inGroup(E, 'sales', true);
  for (let i = 0; i < 60 && !serveOk() && freshSales.length; i++) freshSales.forEach((b) => setScale(b, scale[b.id] * 0.99));

  const r = m(E);
  const arr = measure(maxState(E, { ownedEra: E - 1, techEra: E - 1 }), PEAK);
  const ratio = Object.entries(r.ratio)
    .filter(([, v]) => isFinite(v))
    .map(([key, v]) => `${key}=${v.toFixed(2)}`)
    .join(' ');
  const cost = eraCost(E, r.mods);
  console.log(
    `E${E} pire=${r.worstType.toFixed(3)} pic=${r.worstTypeViral.toFixed(3)} [${ratio}] pow=${r.power.toFixed(2)} cool=${r.cooling.toFixed(2)} free=${fmtN(r.slotsFree)} lift=${fmtN(r.lift)} deb=${fmtN(r.debris)}` +
      ` | coût=${(cost / nextThreshold(E)).toFixed(2)}×seuil net=${fmtN(r.snap.net)} seuil/net=${fmtN(nextThreshold(E) / r.snap.net)}s` +
      (E > 1 ? ` | arrivée qualité=${arr.quality.toFixed(2)} pire=${arr.worstType.toFixed(2)}` : ''),
  );
  if (VERBOSE) {
    console.log(`   λ=${fmtN(lambda)} ${notes.filter(Boolean).join(' ')}`);
    console.log('   ' + BUILDINGS.filter((b) => b.era <= E).map((b) => `${b.id}:${capAt(b, E)}`).join(' '));
  }
}

const OUT = strArg('out');
if (OUT) {
  const json: Record<string, { max: number[]; scale?: number }> = {};
  for (const b of BUILDINGS) json[b.id] = { max: b.maxByEra!, ...(scale[b.id] !== undefined ? { scale: scale[b.id] } : {}) };
  writeFileSync(OUT, JSON.stringify(json));
  console.log(`${OUT} écrit.`);
}
if (args.includes('--write')) {
  const body = BUILDINGS.map((b) => {
    const c = [...b.maxByEra!];
    while (c.length > 1 && c[c.length - 1] === c[c.length - 2]) c.pop();
    const k = scale[b.id];
    return `  ${b.id}: { max: [${c.join(', ')}]${k !== undefined ? `, scale: ${Number(k.toPrecision(6))}` : ''} },`;
  }).join('\n');
  writeFileSync(
    new URL('../src/game/data/balance.ts', import.meta.url),
    `// Fichier généré par \`npm run caps\` (scripts/solveCaps.ts) : ne pas modifier à la main.
// Pour chaque bâtiment : plafond d'exemplaires (\`max\`) et, pour les bâtiments d'appui
// (commercial, stockage, réseau, énergie, refroidissement, espace, spatial), facteur
// appliqué à leur production principale (\`scale\`).
export const BALANCE: Record<string, { max: number[]; scale?: number }> = {
${body}
};
`,
  );
  console.log('src/game/data/balance.ts écrit.');
}
