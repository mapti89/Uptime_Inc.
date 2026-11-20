import { describe, expect, it } from 'vitest';
import { BUILDING_BY_ID } from '../src/game/data/buildings';
import { bulkCost, maxAffordable } from '../src/game/engine/formulas';
import { computeModifiers } from '../src/game/engine/modifiers';
import { computeSnapshot } from '../src/game/engine/snapshot';
import { newGame } from '../src/game/engine/state';
import { tick } from '../src/game/engine/tick';
import * as A from '../src/game/engine/actions';
import { deserialize, serialize, encodeExport, decodeImport, encodeTransfer, decodeTransfer, transferLink } from '../src/game/engine/save';
import { simulateOffline } from '../src/game/engine/offline';
import { sharesFor } from '../src/game/data/prestige';

const pi = BUILDING_BY_ID.pi;

describe('formules de coût', () => {
  it('bulkCost est la somme géométrique des coûts unitaires', () => {
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += pi.baseCost * Math.pow(pi.growth, 5 + i);
    expect(bulkCost(pi, 5, 10)).toBeCloseTo(sum, 6);
  });

  it('maxAffordable ne dépasse jamais le budget', () => {
    for (const money of [0, 10, 15, 100, 12345, 1e9]) {
      const n = maxAffordable(pi, 3, money);
      expect(bulkCost(pi, 3, n)).toBeLessThanOrEqual(money + 1e-9);
      expect(bulkCost(pi, 3, n + 1)).toBeGreaterThan(money);
    }
  });
});

describe('capacité et goulots', () => {
  it('une partie neuve sert des requêtes et gagne de l’argent', () => {
    const s = newGame();
    const snap = computeSnapshot(s, computeModifiers(s));
    expect(snap.totalDemand).toBeGreaterThan(0);
    expect(snap.totalServed).toBeGreaterThan(0);
    expect(snap.revenue).toBeGreaterThan(0);
    expect(snap.net).toBeLessThanOrEqual(snap.revenue);
  });

  it('le service ne dépasse jamais la demande, et la bande passante bride les sites statiques', () => {
    const s = newGame();
    s.owned.ads = 200; // énormément de demande
    const snap = computeSnapshot(s, computeModifiers(s));
    expect(snap.totalServed).toBeLessThanOrEqual(snap.totalDemand + 1e-9);
    expect(snap.bottleneck.static).not.toBeNull();
  });

  it('sans électricité suffisante, l’efficacité chute', () => {
    const s = newGame();
    s.owned.oldpc = 30; // 2 700 W pour 600 W disponibles
    s.owned.shelf = 20;
    const snap = computeSnapshot(s, computeModifiers(s));
    expect(snap.powerFactor).toBeLessThan(1);
    expect(snap.efficiency).toBeLessThan(1);
  });

  it('la surchauffe réduit la capacité', () => {
    const s = newGame();
    s.owned.nuc = 10;
    s.owned.shelf = 5;
    s.owned.outlet = 5;
    const snap = computeSnapshot(s, computeModifiers(s));
    expect(snap.heat).toBeGreaterThan(snap.coolCap);
    expect(snap.coolFactor).toBeLessThan(1);
  });

  it('une coupure de courant sans onduleur arrête tout', () => {
    const s = newGame();
    s.events.push({ uid: 1, defId: 'outage', remaining: 10, duration: 10 });
    const snap = computeSnapshot(s, computeModifiers(s));
    expect(snap.powerFactor).toBe(0);
    expect(snap.totalServed).toBe(0);
  });
});

describe('actions', () => {
  it('acheter un bâtiment déduit l’argent et respecte l’espace', () => {
    const s = newGame();
    s.money = 1e6;
    expect(A.buyBuilding(s, 'pi', 1)).toBe(true);
    expect(s.owned.pi).toBe(2);
    // L'étagère de départ a 3 emplacements : on ne peut pas dépasser
    A.buyBuilding(s, 'pi', 100);
    expect(s.owned.pi).toBe(3);
    expect(A.buyBuilding(s, 'pi', 1)).toBe(false);
  });

  it('le déménagement exige le seuil et le coût', () => {
    const s = newGame();
    expect(A.canMoveEra(s)).toBe(false);
    s.runEarned = 5000;
    s.money = 2000;
    expect(A.moveEra(s)).toBe(true);
    expect(s.era).toBe(2);
  });

  it('le prestige réinitialise mais conserve actions et succès', () => {
    const s = newGame();
    s.era = 4;
    s.runEarned = 1e12;
    s.achievements.earn_0 = 1;
    const gain = A.prestigeGain(s);
    expect(gain).toBe(sharesFor(1e12));
    const ns = A.doPrestige(s)!;
    expect(ns.era).toBe(1);
    expect(ns.prestige.shares).toBe(gain);
    expect(ns.achievements.earn_0).toBe(1);
    expect(ns.money).toBe(0);
  });
});

describe('boucle de jeu', () => {
  it('tick accumule de l’argent', () => {
    const s = newGame();
    for (let i = 0; i < 60; i++) tick(s, 1, { rng: () => 0.5 });
    expect(s.money).toBeGreaterThan(0);
    expect(s.stats.playTime).toBeCloseTo(60);
  });

  it('le hors-ligne équivaut à des ticks pondérés par l’efficacité', () => {
    const a = newGame();
    const b = newGame();
    simulateOffline(a, 600);
    for (let i = 0; i < 600; i++) tick(b, 1, { offline: true, incomeMult: 0.5, checkAchievements: i === 599 });
    expect(a.money).toBeCloseTo(b.money, 3);
  });
});

describe('sauvegarde', () => {
  it('aller-retour JSON et export base64', () => {
    const s = newGame();
    s.money = 1234.5;
    s.owned.nuc = 3;
    s.settings.buyAmount = 'max';
    const back = deserialize(serialize(s));
    expect(back).toEqual(s);
    expect(decodeImport(encodeExport(s))).toEqual(s);
  });

  it('une sauvegarde partielle est complétée par les valeurs par défaut', () => {
    const back = deserialize(JSON.stringify({ money: 42, owned: { pi: 4 } }));
    expect(back.money).toBe(42);
    expect(back.owned.pi).toBe(4);
    expect(back.stats.clicks).toBe(0);
    expect(back.prestige.shares).toBe(0);
  });
});

describe('Cartes GPU PCIe', () => {
  it('ajoute 2 GPU par rack OCP et ARM, et seulement une fois achetée', () => {
    const s = newGame();
    s.era = 4;
    s.owned = { ocp: 3, arm: 2 };
    const before = computeSnapshot(s, computeModifiers(s));
    expect(before.supply.gpu).toBe(0);
    expect(A.upgradeAvailable(s, 'pcigpu')).toBe(true);

    s.upgrades.pcigpu = true;
    const m = computeModifiers(s);
    const after = computeSnapshot(s, m);
    // 5 racks × 2 GPU, modulés par l'efficacité globale
    expect(after.supply.gpu).toBeCloseTo(10 * m.stat.gpu * after.efficiency, 6);
  });

  it("n'est pas proposée sans rack OCP", () => {
    const s = newGame();
    s.era = 4;
    expect(A.upgradeAvailable(s, 'pcigpu')).toBe(false);
  });
});

describe('code de transfert compact', () => {
  const sample = () => {
    const s = newGame();
    s.money = 123456.5;
    s.era = 3;
    s.owned = { pi: 12, tower: 3 };
    s.upgrades = { premium: true };
    s.log = [{ t: 1, msg: 'journal', kind: 'info' } as (typeof s.log)[number]];
    return s;
  };

  it('fait un aller-retour sans perte (hors journal) et est bien plus court', async () => {
    const s = sample();
    const code = await encodeTransfer(s);
    expect(code.startsWith('UPT1.')).toBe(true);
    expect(code).toMatch(/^[A-Za-z0-9._-]+$/); // sûr dans une URL
    expect(code.length).toBeLessThan(encodeExport(s).length);
    expect(await decodeTransfer(code)).toEqual({ ...s, log: [] });
  });

  it('accepte un lien complet, des retours à la ligne et l’ancien format', async () => {
    const s = sample();
    const code = await encodeTransfer(s);
    const link = transferLink(code, 'https://exemple.test/jeu/');
    expect((await decodeTransfer(link)).money).toBe(s.money);
    expect((await decodeTransfer(code.replace(/(.{40})/g, '$1\n'))).money).toBe(s.money);
    expect(await decodeTransfer(encodeExport(s))).toEqual(s);
  });

  it('rejette un code tronqué', async () => {
    const code = await encodeTransfer(sample());
    await expect(decodeTransfer(code.slice(0, code.length / 2))).rejects.toThrow();
  });
});

describe('électricité, refroidissement et espace (v2)', () => {
  it('aucun succès ne demande d’empiler de l’infrastructure', async () => {
    const { ACHIEVEMENTS } = await import('../src/game/data/achievements');
    const infra = ['power', 'cooling', 'space'];
    const bad = ACHIEVEMENTS.filter((a) => {
      const m = /^own_(.+)_(\d+)$/.exec(a.id);
      return m && m[2] !== '1' && infra.includes(BUILDING_BY_ID[m[1]].cat);
    });
    expect(bad).toEqual([]);
  });

  it('le PUE dépend de la charge réelle : les groupes sobres passent en premier', () => {
    const s = newGame();
    s.era = 5;
    s.owned = { gpunode: 20, crac: 30 };
    const pueOf = () => computeSnapshot(s, computeModifiers(s)).pue;
    const cracOnly = pueOf();
    // Un groupe plus sobre qui prend réellement la charge fait baisser le PUE.
    s.owned.liquid = 1;
    const withLiquid = pueOf();
    expect(withLiquid).toBeLessThan(cracOnly);
    // Sur-construire au-delà du besoin le dégrade (consommation à vide).
    s.owned.liquid = 100;
    expect(pueOf()).toBeGreaterThan(withLiquid);
  });

  it('les améliorations d’électricité se débloquent au record de consommation', () => {
    const s = newGame();
    expect(A.upgradeAvailable(s, 'power_u1')).toBe(false);
    s.stats.runPeakPower = 300;
    expect(A.upgradeAvailable(s, 'power_u1')).toBe(true);
    expect(A.upgradeAvailable(s, 'cooling_u1')).toBe(false);
    s.stats.runPeakHeat = 1e6;
    expect(A.upgradeAvailable(s, 'cooling_u1')).toBe(true);
    expect(A.upgradeAvailable(s, 'cooling_u2')).toBe(false); // ère 2 requise
  });

  it('le record de la partie est mis à jour par le tick et remis à zéro par le prestige', () => {
    const s = newGame();
    tick(s, 1);
    expect(s.stats.runPeakPower).toBeGreaterThan(0);
    expect(s.stats.runPeakHeat).toBeGreaterThan(0);
    s.era = 4;
    s.runEarned = 1e12;
    const ns = A.doPrestige(s)!;
    expect(ns.stats.runPeakPower).toBe(0);
  });

  it('migre une sauvegarde v1 : anciens succès retirés, paliers remboursés', () => {
    const s = newGame();
    const raw = JSON.parse(serialize(s));
    raw.version = 1;
    raw.money = 10;
    raw.achievements = { earn_0: 1, own_fan_50: 2, own_campus_100: 3 };
    raw.upgrades = { fan_t1: true, premium: true, pi_t1: true };
    const out = deserialize(JSON.stringify(raw));
    expect(out.achievements).toEqual({ earn_0: 1 });
    expect(out.upgrades).toEqual({ premium: true, pi_t1: true });
    expect(out.money).toBe(10 + BUILDING_BY_ID.fan.baseCost * 100);
    expect(out.stats.runPeakPower).toBe(0);
  });
});

describe('conquête spatiale', () => {
  const spaceGame = (era: number) => {
    const s = newGame();
    s.era = era;
    s.money = 1e40;
    s.runEarned = 1e40;
    return s;
  };

  it('le matériel spatial consomme la capacité d’emport et se bloque sans lanceur', () => {
    const s = spaceGame(7);
    const m = computeModifiers(s);
    const snap = computeSnapshot(s, m);
    expect(snap.liftCap).toBe(50);
    // 50 t d'emport de base : deux datacenters orbitaux de 20 t, pas trois.
    expect(A.buyBuilding(s, 'orbital', 1)).toBe(true);
    expect(A.buyBuilding(s, 'orbital', 1)).toBe(true);
    expect(A.quoteBuilding(s, BUILDING_BY_ID.orbital, 1).blocked).toBe('lift');
    expect(A.buyBuilding(s, 'launchpad', 1)).toBe(true);
    expect(A.quoteBuilding(s, BUILDING_BY_ID.orbital, 1).blocked).toBeUndefined();
  });

  it('les débris au-delà du nettoyage dégradent l’efficacité', () => {
    const s = spaceGame(8);
    s.owned = { swarm: 4, superheavy: 2 };
    const ok = computeSnapshot(s, computeModifiers(s));
    expect(ok.debrisFactor).toBe(1);
    s.owned.swarm = 20;
    const bad = computeSnapshot(s, computeModifiers(s));
    expect(bad.debris).toBeGreaterThan(bad.cleanupCap);
    expect(bad.debrisFactor).toBeLessThan(1);
    s.owned.debristug = 10;
    expect(computeSnapshot(s, computeModifiers(s)).debrisFactor).toBe(1);
  });

  it('le matériel lointain sert surtout les requêtes tolérantes à la latence', () => {
    const s = spaceGame(10);
    s.owned = { marsdc: 50, fusionfreighter: 5, deepnet: 20, marscolonies: 3 };
    s.reputation = 100;
    const m = computeModifiers(s);
    const snap = computeSnapshot(s, m);
    expect(snap.remoteSupply.cpu).toBeGreaterThan(0);
    // Pont de base de l'ère 10 : un quart du matériel lointain sert aussi le temps réel…
    expect(snap.latencyBridge).toBe(0.25);
    expect(snap.realtimeCap.cpu).toBeCloseTo(snap.supply.cpu - snap.remoteSupply.cpu * 0.75, -3);
    expect(snap.served.static).toBeGreaterThan(0);
    // …et sans ce pont, rien de temps réel n'est servi sans matériel proche.
    m.latencyBridge = 0;
    const noBridge = computeSnapshot(s, m);
    expect(noBridge.served.static).toBe(0);
    // Les simulations scientifiques (tolérantes) le sont.
    expect(noBridge.served.scisim).toBeGreaterThan(0);
    // Un trou de ver supprime la contrainte.
    s.owned.wormhole = 1;
    s.era = 11;
    const worm = computeSnapshot(s, computeModifiers(s));
    expect(worm.latencyBridge).toBe(1);
    expect(worm.realtimeCap.cpu).toBeCloseTo(worm.supply.cpu, -3);
  });

  it('une pénurie est répartie au prorata entre requêtes temps réel et tolérantes', () => {
    const s = newGame();
    s.era = 4;
    s.reputation = 100;
    s.owned = { blade: 10, san: 10, adsl: 10, forum: 10 };
    const m = computeModifiers(s);
    m.stat.cpu = m.stat.ram = m.stat.storage = 1e6;
    // Bande passante réglée à 90 % du besoin.
    const before = computeSnapshot(s, m);
    m.stat.bw *= (0.9 * before.need.bw) / before.supply.bw;
    const snap = computeSnapshot(s, m);
    expect(snap.ratio.bw).toBeCloseTo(0.9, 6);
    // 10 % de bande passante en moins : chaque type qui en dépend perd 10 %, y compris
    // la sauvegarde (tolérante), qui n'est plus sacrifiée au profit du temps réel.
    for (const id of ['static', 'api', 'streaming', 'backup']) {
      expect(snap.served[id] / snap.demand[id]).toBeCloseTo(0.9, 6);
    }
    expect(snap.served.db).toBeCloseTo(snap.demand.db, 6);
  });

  it('le matériel interstellaire voyage avant d’être opérationnel', () => {
    const s = spaceGame(11);
    s.owned = { lasersail: 3 };
    expect(A.buyBuilding(s, 'stellarnode', 1)).toBe(true);
    expect(s.owned.stellarnode ?? 0).toBe(0);
    expect(A.inTransit(s, 'stellarnode')).toBe(1);
    // Le prix suit aussi les exemplaires en route.
    const before = A.quoteBuilding(s, BUILDING_BY_ID.stellarnode, 1).cost;
    expect(before).toBeCloseTo(BUILDING_BY_ID.stellarnode.baseCost * BUILDING_BY_ID.stellarnode.growth, -10);
    tick(s, BUILDING_BY_ID.stellarnode.travel! + 1, { rng: () => 0.5 });
    expect(s.owned.stellarnode).toBe(1);
    expect(s.transit).toEqual([]);
  });

  it('les sondes colonisent les étoiles, plafonnées par l’ère, jusqu’à la galaxie entière', async () => {
    const { GALAXY_STARS, starCap } = await import('../src/game/data/galaxy');
    const s = spaceGame(10);
    expect(A.moveEra(s)).toBe(true);
    expect(s.era).toBe(11);
    expect(s.stars).toBe(1);
    s.owned.vonneumann = 50;
    for (let i = 0; i < 200; i++) tick(s, 60, { rng: () => 0.99 });
    expect(s.stars).toBe(starCap(11));
    s.era = 12;
    s.owned.seedship = 50;
    for (let i = 0; i < 400; i++) tick(s, 60, { rng: () => 0.99 });
    expect(s.stars).toBe(GALAXY_STARS);
    expect(s.achievements.galaxy).toBeDefined();
    // La colonisation repart de zéro à l'introduction en bourse.
    expect(A.doPrestige(s)!.stars).toBe(0);
  });
});

describe('bonus des actions', () => {
  it('reste linéaire jusqu’au seuil puis suit la racine carrée', async () => {
    const { shareBonus, SHARE_BONUS, SHARE_SOFTCAP } = await import('../src/game/data/prestige');
    expect(shareBonus(100)).toBeCloseTo(100 * SHARE_BONUS);
    expect(shareBonus(SHARE_SOFTCAP)).toBeCloseTo(SHARE_SOFTCAP * SHARE_BONUS);
    expect(shareBonus(SHARE_SOFTCAP * 100)).toBeCloseTo(SHARE_SOFTCAP * 10 * SHARE_BONUS);
  });
});
