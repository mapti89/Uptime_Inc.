/**
 * Simulation headless d'une partie par un bot glouton, pour l'équilibrage.
 * Usage : npm run sim -- [--hours 30] [--clicks 0] [--seed 1] [--verbose]
 *   --dump-era N   enregistre la partie en arrivant à l'ère N (sim-eraN.json, préfixe SIM_DUMP)
 *   --load FICHIER repart d'une partie enregistrée (pour tester un réglage de fin de partie)
 *   --threshold 10=5e24,11=…   remplace le seuil (et le coût de déménagement, au même ratio) d'ères
 *   --research 9=8e9,10=4e10   remplace le coût des recherches d'ères
 *   --bridge 10=0.5            remplace le pont de latence de base d'ères
 *   --label NOM                préfixe des lignes de résultat (pour comparer des variantes)
 *   --balance FICHIER.json     plafonds / facteurs de production à essayer (sortie de `npm run caps -- --out`)
 *   --price X                  multiplie le prix de toutes les requêtes
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { BUILDINGS, RAW_BUILDINGS, applyBalance } from '../src/game/data/buildings';
import { REQUEST_TYPES } from '../src/game/data/requestTypes';
import { ERAS } from '../src/game/data/eras';
import { RESEARCH } from '../src/game/data/research';
import { UPGRADES } from '../src/game/data/upgrades';
import {
  buyBuilding, buyResearch, buyUpgrade, canMoveEra, click, doPrestige, moveEra,
  prestigeGain, quoteBuilding, researchAvailable, upgradeAvailable, upgradeCost,
} from '../src/game/engine/actions';
import { computeModifiers } from '../src/game/engine/modifiers';
import { computeSnapshot } from '../src/game/engine/snapshot';
import { newGame } from '../src/game/engine/state';
import { deserialize } from '../src/game/engine/save';
import { tick } from '../src/game/engine/tick';
import type { GameState } from '../src/game/types';

const args = process.argv.slice(2);
const arg = (name: string, def: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const HOURS = arg('hours', 30);
const CLICKS = arg('clicks', 0); // clics/s pendant les 10 premières minutes
const PRESTIGES = arg('prestiges', 0);
const DUMP_ERA = arg('dump-era', 0);
const LOAD = args.includes('--load') ? args[args.indexOf('--load') + 1] : null;
const strArg = (name: string) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : null);
const pairs = (v: string | null) => (v ? v.split(',').map((kv) => kv.split('=').map(Number) as [number, number]) : []);
// Réglages expérimentaux, appliqués en mémoire aux données du jeu.
for (const [era, threshold] of pairs(strArg('threshold'))) {
  const e = ERAS[era - 1];
  e.moveCost *= threshold / e.threshold;
  e.threshold = threshold;
}
for (const [era, cost] of pairs(strArg('research'))) for (const r of RESEARCH) if (r.era === era) r.cost = cost;
for (const [era, bridge] of pairs(strArg('bridge'))) ERAS[era - 1].latencyBridge = bridge;
const BALANCE_FILE = strArg('balance');
if (BALANCE_FILE) {
  const bal = JSON.parse(readFileSync(BALANCE_FILE, 'utf8')) as Record<string, { max: number[]; scale?: number }>;
  BUILDINGS.forEach((b, i) => Object.assign(b, applyBalance(RAW_BUILDINGS[i], bal[b.id])));
}
const PRICE = Number(strArg('price') ?? 1);
for (const rt of REQUEST_TYPES) rt.price *= PRICE;
const LABEL = strArg('label') ?? 'run1';
const VERBOSE = args.includes('--verbose');
let seed = arg('seed', 1);
const rng = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const DT = 1;
const DECIDE_EVERY = 5;

function netOf(s: GameState): number {
  const m = computeModifiers(s);
  const sn = computeSnapshot(s, m);
  return sn.net + sn.autoClick * sn.autoClickValue;
}

function fmt(t: number): string {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = Math.floor(t % 60);
  return `${h}h${String(m).padStart(2, '0')}m${String(sec).padStart(2, '0')}s`;
}

function fmtN(n: number): string {
  if (n < 1000) return n.toFixed(1);
  const e = Math.floor(Math.log10(n) / 3);
  return (n / Math.pow(1000, e)).toFixed(2) + (['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'][e] ?? `e${e * 3}`);
}

interface Candidate {
  kind: 'b' | 'u';
  id: string;
  cost: number;
  delta: number;
}

function evaluate(s: GameState): Candidate[] {
  const base = netOf(s);
  const m = computeModifiers(s);
  const out: Candidate[] = [];
  const snap0 = computeSnapshot(s, m);
  const quality = snap0.totalDemand > 0 ? snap0.totalServed / snap0.totalDemand : 1;
  let bestBlockedDelta = 0;
  let bestBlockedSlots = 1;
  let bestLiftDelta = 0;
  let bestLiftMass = 1;
  // Matériel spatial qui ferait déborder les débris : un joueur voit la jauge et nettoie d'abord.
  let bestDebrisDelta = 0;
  let bestDebrisAmt = 1;
  for (const b of BUILDINGS) {
    if (b.era > s.era) continue;
    const q = quoteBuilding(s, b, 1, m);
    if (q.blocked === 'era' || q.blocked === 'max') continue;
    if (b.cat === 'space' || b.cat === 'orbit') continue;
    // Un joueur n'ajoute pas de clients quand il n'arrive déjà plus à les servir.
    if (b.cat === 'sales' && (quality < 0.85 || s.reputation < 50)) continue;
    // Gain marginal
    s.owned[b.id] = (s.owned[b.id] ?? 0) + 1;
    let d = netOf(s) - base;
    s.owned[b.id]--;
    // Heuristiques pour le personnel
    if (b.id === 'researcher' || b.id === 'rdlab') d = Math.max(d, base * 0.02);
    if ((b.id === 'sysadmin' || b.id === 'sre') && (s.owned[b.id] ?? 0) < 3) d = Math.max(d, base * 0.02);
    if (b.mass && !q.blocked) {
      s.owned[b.id] = (s.owned[b.id] ?? 0) + 1;
      const sn1 = computeSnapshot(s, m);
      if (sn1.debris > sn1.cleanupCap) {
        // Gain si les débris étaient nettoyés : on simule un nettoyage abondant.
        const saved = s.owned.debristug ?? 0;
        s.owned.debristug = saved + 1e9;
        const ideal = netOf(s) - base;
        s.owned.debristug = saved;
        s.owned[b.id]--;
        if (ideal > bestDebrisDelta) {
          bestDebrisDelta = ideal;
          bestDebrisAmt = Math.max(1, sn1.debris - snap0.debris);
        }
        continue;
      }
      s.owned[b.id]--;
    }
    if (q.blocked === 'lift') {
      if (d > bestLiftDelta) {
        bestLiftDelta = d;
        bestLiftMass = b.mass ?? 1;
      }
      continue;
    }
    if (q.blocked === 'space') {
      if (d / q.cost > bestBlockedDelta / 1e300) {
        if (d > bestBlockedDelta) {
          bestBlockedDelta = d;
          bestBlockedSlots = b.slots;
        }
      }
      continue;
    }
    // Électricité / refroidissement à saturation : un joueur voit la jauge
    // rouge et ajoute de la capacité avant de pouvoir brancher la suite.
    if (b.cat === 'power' && snap0.totalWatts > 0.92 * snap0.powerCap) {
      d = Math.max(d, base * 0.05 * Math.min(5, (b.provides.power ?? 0) * m.stat.power / Math.max(1, snap0.totalWatts * 0.2)));
    }
    if (b.cat === 'cooling' && snap0.heat > 0.92 * snap0.coolCap) {
      d = Math.max(d, base * 0.05 * Math.min(5, (b.provides.cooling ?? 0) * m.stat.cooling / Math.max(1, snap0.heat * 0.2)));
    }
    if (d > 0) out.push({ kind: 'b', id: b.id, cost: q.cost, delta: d });
  }
  // Espace : valorisé par ce qu'il débloque
  for (const b of BUILDINGS) {
    if (b.cat !== 'space' || b.era > s.era) continue;
    const q = quoteBuilding(s, b, 1, m);
    if (q.blocked === 'max') continue;
    const sn = computeSnapshot(s, m);
    const free = sn.slotsCap - sn.slotsUsed;
    const val = free < 4 ? Math.max(bestBlockedDelta, base * 0.05) * Math.min(5, (b.provides.space ?? 1) / Math.max(1, bestBlockedSlots)) : 0;
    if (val > 0) out.push({ kind: 'b', id: b.id, cost: q.cost, delta: val });
  }
  // Programme spatial : emport, nettoyage des débris, sondes
  {
    const sn = computeSnapshot(s, m);
    for (const b of BUILDINGS) {
      if (b.cat !== 'orbit' || b.era > s.era) continue;
      const q = quoteBuilding(s, b, 1, m);
      if (q.blocked === 'era' || q.blocked === 'max') continue;
      let val = 0;
      if (b.provides.lift) {
        const free = sn.liftCap - sn.massUsed;
        if (free < bestLiftMass * 2 || bestLiftDelta > 0) val = Math.max(bestLiftDelta, base * 0.05) * Math.min(5, b.provides.lift / Math.max(1, bestLiftMass));
      } else if (b.provides.cleanup) {
        if (sn.debris > sn.cleanupCap * 0.85 || bestDebrisDelta > 0) {
          s.owned[b.id] = (s.owned[b.id] ?? 0) + 1;
          val = Math.max(netOf(s) - base, base * 0.03);
          s.owned[b.id]--;
          const clean = b.provides.cleanup * m.stat.cleanup;
          if (bestDebrisDelta > 0) val = Math.max(val, bestDebrisDelta * Math.min(5, clean / bestDebrisAmt));
        }
      } else if (b.provides.replication) {
        val = base * 0.04;
      }
      if (val > 0) out.push({ kind: 'b', id: b.id, cost: q.cost, delta: val });
    }
  }
  for (const u of UPGRADES) {
    if (!upgradeAvailable(s, u.id)) continue;
    const cost = upgradeCost(u.id, m);
    s.upgrades[u.id] = true;
    let d = netOf(s) - base;
    delete s.upgrades[u.id];
    if (d <= 0 && cost < base * 30) d = base * 0.01; // upgrades « défensifs » bon marché
    // Emport / nettoyage : valorisés par le matériel spatial qu'ils débloquent.
    for (const e of u.effects) {
      if (e.kind !== 'statMult') continue;
      if (e.stat === 'cleanup' && bestDebrisDelta > 0) d = Math.max(d, bestDebrisDelta * 5);
      if (e.stat === 'lift' && bestLiftDelta > 0) d = Math.max(d, bestLiftDelta * 5);
    }
    if (d > 0) out.push({ kind: 'u', id: u.id, cost, delta: d });
  }
  return out;
}

function runOnce(s: GameState, label: string) {
  const eraTimes: number[] = [];
  eraTimes[s.era - 1] = 0;
  let lastBuy = 0;
  let longestGap = 0;
  let longestGapAt = 0;
  const end = HOURS * 3600;
  let t = 0;
  let purchases = 0;
  let nextReport = 600;
  const startEra = s.era;
  while (t < end) {
    tick(s, DT, { rng, checkAchievements: t % 10 === 0 });
    t += DT;
    if (CLICKS > 0 && t < 600) for (let i = 0; i < CLICKS; i++) click(s);
    if (t % DECIDE_EVERY !== 0) continue;

    // Recherche
    for (const r of RESEARCH) if (researchAvailable(s, r.id)) buyResearch(s, r.id);

    // Déménagement
    if (canMoveEra(s)) {
      moveEra(s);
      eraTimes[s.era - 1] = t;
      const prevEra = s.era - 1;
      const resDone = RESEARCH.filter((r) => r.era <= prevEra && s.research[r.id]).length;
      const resAll = RESEARCH.filter((r) => r.era <= prevEra).length;
      console.log(`[${label}] ${fmt(t)}  → Ère ${s.era} (${ERAS[s.era - 1].name})  net=${fmtN(netOf(s))}$/s  recherche=${resDone}/${resAll} uptime=${(s.uptime * 100).toFixed(1)}% rép=${s.reputation.toFixed(0)}`);
      lastBuy = t;
      if (VERBOSE) console.log('   owned: ' + Object.entries(s.owned).filter(([, n]) => n > 0).map(([k, n]) => `${k}:${n}`).join(' '));
      if (DUMP_ERA && s.era === DUMP_ERA) {
        const file = `${process.env.SIM_DUMP ?? 'sim'}-era${DUMP_ERA}.json`;
        writeFileSync(file, JSON.stringify(s));
        console.log(`   partie enregistrée : ${file}`);
      }
    }
    if (s.era >= ERAS.length && (PRESTIGES > 0 || args.includes("--stop")) && t > eraTimes[ERAS.length - 1] + 1800) break;

    // Achats gloutons
    for (let guard = 0; guard < 50; guard++) {
      const net = Math.max(1e-9, netOf(s));
      const cands = evaluate(s);
      if (!cands.length) break;
      // Réserver pour le déménagement si proche
      let reserve = 0;
      if (s.era < ERAS.length) {
        const next = ERAS[s.era];
        if (s.runEarned >= next.threshold * 0.7) reserve = next.moveCost;
      }
      let best: Candidate | null = null;
      let bestScore = Infinity;
      for (const c of cands) {
        const score = c.cost / c.delta + Math.max(0, c.cost + reserve - s.money) / net;
        if (score < bestScore) {
          bestScore = score;
          best = c;
        }
      }
      if (!best || best.cost + reserve > s.money) break;
      if (args.includes('--trace') && s.era >= 4 && s.era <= 5) console.log(`    buy ${best.id} cost=${fmtN(best.cost)} delta=${fmtN(best.delta)} payback=${(best.cost / best.delta).toFixed(0)}s net=${fmtN(net)}`);
      const ok = best.kind === 'b' ? buyBuilding(s, best.id, 1) : buyUpgrade(s, best.id);
      if (!ok) {
        if (args.includes('--trace-stuck') && t % 1800 === 0) console.log(`    bloqué sur ${best.kind}:${best.id} coût=${fmtN(best.cost)} gain=${fmtN(best.delta)}`);
        break;
      }
      purchases++;
      const gap = t - lastBuy;
      if (gap > longestGap && s.era < 5) {
        longestGap = gap;
        longestGapAt = t;
      }
      lastBuy = t;
    }

    if (VERBOSE && t >= nextReport) {
      nextReport += 900;
      const m = computeModifiers(s);
      const sn = computeSnapshot(s, m);
      const bn = Object.entries(sn.ratio).filter(([, r]) => r < 0.99).map(([k, r]) => `${k}:${(r * 100).toFixed(0)}%`).join(' ');
      console.log(
        `  ${fmt(t)} era=${s.era} $=${fmtN(s.money)} net=${fmtN(sn.net)} elec=${fmtN(sn.elecCost)}(${((sn.elecCost / Math.max(1e-9, sn.revenue)) * 100).toFixed(1)}%) W=${fmtN(sn.totalWatts)} rep=${s.reputation.toFixed(0)} up=${(s.uptime * 100).toFixed(2)} pf=${sn.powerFactor.toFixed(2)} cf=${sn.coolFactor.toFixed(2)} pue=${sn.pue.toFixed(2)} slots=${sn.slotsUsed}/${sn.slotsCap}${s.era >= 7 ? ` lift=${fmtN(sn.massUsed)}/${fmtN(sn.liftCap)} debris=${fmtN(sn.debris)}/${fmtN(sn.cleanupCap)}` : ''}${s.era >= 11 ? ` stars=${fmtN(s.stars)}` : ''} rd=${fmtN(s.rd)} [${bn}]`,
      );
    }
  }
  const shares = prestigeGain(s);
  if (VERBOSE) console.log('   owned: ' + Object.entries(s.owned).filter(([, n]) => n > 0).map(([k, n]) => `${k}:${n}`).join(' '));
  if (args.includes('--dump')) writeFileSync(`${process.env.SIM_DUMP ?? 'sim-state'}.json`, JSON.stringify(s));
  console.log(`[${label}] fin à ${fmt(t)} : ère ${s.era}${s.era >= 11 ? ` (étoiles ${fmtN(s.stars)})` : ""}, ${purchases} achats, run=${fmtN(s.runEarned)}$, net=${fmtN(netOf(s))}$/s, actions dispo=${shares}`);
  console.log(`[${label}] plus long intervalle sans achat (ères<5) : ${fmt(longestGap)} vers ${fmt(longestGapAt)}`);
  const durations = eraTimes.map((v, i) => (i > 0 && eraTimes[i - 1] !== undefined && v !== undefined ? `${i}→${i + 1}: ${fmt(v - eraTimes[i - 1])}` : null)).filter(Boolean);
  console.log(`[${label}] durées : ${durations.join(' | ')} (ère de départ ${startEra})`);
  return s;
}

let s = LOAD ? deserialize(readFileSync(LOAD, 'utf8')) : newGame();
s = runOnce(s, LABEL);
for (let p = 0; p < PRESTIGES; p++) {
  const gain = prestigeGain(s);
  const ns = doPrestige(s);
  if (!ns) break;
  console.log(`--- Prestige ${p + 1} : +${gain} actions`);
  s = ns;
  s = runOnce(s, `run${p + 2}`);
}
