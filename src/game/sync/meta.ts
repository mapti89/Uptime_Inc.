/**
 * État local de la synchronisation en ligne (sans dépendance à Firebase, pour rester léger :
 * le store l'importe à chaque action du joueur).
 *
 * Principe : la sauvegarde en ligne porte un numéro de révision `rev`. Chaque appareil retient
 * la révision sur laquelle sa partie est basée, et s'il y a eu depuis des actions du joueur
 * (`dirty`). La progression purement passive (idle, hors-ligne) ne compte pas : si une autre
 * révision existe en ligne et que le joueur n'a rien fait ici, on la reprend sans rien demander.
 */
import type { GameState } from '../types';

export const SYNC_KEY = 'uptime-inc-sync';

export interface SyncMeta {
  uid: string;
  /** Révision en ligne sur laquelle la partie locale est basée (-1 : jamais synchronisée). */
  rev: number;
  /** Le joueur a agi sur cet appareil depuis la dernière synchronisation. */
  dirty: boolean;
  lastSync: number | null;
}

let cache: SyncMeta | null | undefined;

export function loadMeta(): SyncMeta | null {
  if (cache !== undefined) return cache;
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    cache = raw ? (JSON.parse(raw) as SyncMeta) : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function saveMeta(m: SyncMeta | null): void {
  cache = m;
  try {
    if (m) localStorage.setItem(SYNC_KEY, JSON.stringify(m));
    else localStorage.removeItem(SYNC_KEY);
  } catch {
    /* stockage indisponible */
  }
}

let actions = 0;

/** Nombre d'actions du joueur depuis le chargement (pour savoir s'il a agi pendant un envoi). */
export function actionCount(): number {
  return actions;
}

/** À appeler à chaque action du joueur (achat, clic, import…). */
export function markDirty(): void {
  actions++;
  const m = loadMeta();
  if (m && !m.dirty) saveMeta({ ...m, dirty: true });
}

export type SyncDecision = 'push' | 'pull' | 'conflict';

/**
 * Que faire face à la révision en ligne ?
 * - aucune sauvegarde en ligne, ou c'est celle sur laquelle on est basé → on envoie la nôtre ;
 * - une autre révision, et le joueur n'a rien fait ici → on la reprend ;
 * - une autre révision, et le joueur a joué ici aussi → on lui demande de choisir.
 */
export function decide(meta: Pick<SyncMeta, 'rev' | 'dirty'>, remoteRev: number | null): SyncDecision {
  if (remoteRev === null || remoteRev === meta.rev) return 'push';
  return meta.dirty ? 'conflict' : 'pull';
}

/** Partie à peine commencée : à la première connexion, on reprend la partie en ligne sans demander. */
export function isFreshGame(s: GameState): boolean {
  return s.era === 1 && s.prestige.totalShares === 0 && s.stats.playTime < 300;
}
