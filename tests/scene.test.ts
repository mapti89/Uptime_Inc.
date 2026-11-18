import { describe, expect, it } from 'vitest';
import { BUILDINGS } from '../src/game/data/buildings';
import { apportion, benchDevices, rackUnits } from '../src/ui/scene/allocate';

describe('apportion', () => {
  it('respecte le total et les proportions', () => {
    expect(apportion([1, 1, 2], 8)).toEqual([2, 2, 4]);
    expect(apportion([1, 1, 1], 10).reduce((a, n) => a + n, 0)).toBe(10);
    expect(apportion([0, 0], 5)).toEqual([0, 0]);
  });
});

describe('benchDevices', () => {
  it('montre chaque machine quand le parc est petit', () => {
    const d = benchDevices(BUILDINGS, { pi: 2, nas: 1, adsl: 3 });
    expect(d.map((x) => x.id)).toEqual(['pi', 'pi', 'nas']);
  });
  it('plafonne en gardant chaque type visible', () => {
    const d = benchDevices(BUILDINGS, { pi: 200, oldpc: 1 }, 10);
    expect(d).toHaveLength(10);
    expect(d.some((x) => x.id === 'oldpc')).toBe(true);
  });
});

describe('rackUnits', () => {
  it('suit le taux d’occupation et ne déborde pas', () => {
    const units = rackUnits(BUILDINGS, { r1u: 20, raidbay: 5 }, 30, 120, 2, 20);
    const used = units.reduce((a, u) => a + u.size, 0);
    expect(used).toBe(20); // √(25 %) de 40 U visuels
    for (const u of units) {
      expect(u.start + u.size).toBeLessThanOrEqual(20);
      expect(u.rack).toBeLessThan(2);
    }
    expect(units.some((u) => u.kind === 'storage')).toBe(true);
  });
  it('est vide sans machine', () => {
    expect(rackUnits(BUILDINGS, {}, 0, 50, 3, 20)).toEqual([]);
  });
  it('remplit tout quand l’espace est saturé', () => {
    const units = rackUnits(BUILDINGS, { ocp: 10 }, 420, 400, 4, 20);
    expect(units.reduce((a, u) => a + u.size, 0)).toBe(80);
  });
});
