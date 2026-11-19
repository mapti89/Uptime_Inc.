import { describe, expect, it } from 'vitest';
import { BUILDING_BY_ID } from '../src/game/data/buildings';
import { bulkCost, maxAffordable } from '../src/game/engine/formulas';
import { computeModifiers } from '../src/game/engine/modifiers';
import { computeSnapshot } from '../src/game/engine/snapshot';
import { newGame } from '../src/game/engine/state';
import { tick } from '../src/game/engine/tick';
import * as A from '../src/game/engine/actions';
import { deserialize, serialize, encodeExport, decodeImport } from '../src/game/engine/save';
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
