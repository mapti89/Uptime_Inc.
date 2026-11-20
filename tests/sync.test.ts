import { describe, expect, it } from 'vitest';
import { decide, isFreshGame } from '../src/game/sync/meta';
import { newGame } from '../src/game/engine/state';

describe('synchronisation : décision', () => {
  it('envoie la partie quand rien n’est en ligne', () => {
    expect(decide({ rev: -1, dirty: true }, null)).toBe('push');
  });
  it('envoie la partie quand la révision en ligne est celle de base', () => {
    expect(decide({ rev: 4, dirty: true }, 4)).toBe('push');
    expect(decide({ rev: 4, dirty: false }, 4)).toBe('push');
  });
  it('reprend la partie en ligne si le joueur n’a rien fait ici', () => {
    expect(decide({ rev: 4, dirty: false }, 7)).toBe('pull');
    expect(decide({ rev: -1, dirty: false }, 0)).toBe('pull');
  });
  it('demande au joueur s’il a joué des deux côtés', () => {
    expect(decide({ rev: 4, dirty: true }, 7)).toBe('conflict');
    expect(decide({ rev: -1, dirty: true }, 3)).toBe('conflict');
  });
  it('reconnaît une partie à peine commencée', () => {
    const s = newGame();
    expect(isFreshGame(s)).toBe(true);
    s.stats.playTime = 3600;
    expect(isFreshGame(s)).toBe(false);
  });
});
