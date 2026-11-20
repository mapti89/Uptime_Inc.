/**
 * Synchronisation de la partie entre appareils (compte Google + Firestore).
 *
 * Quand : au lancement, au retour sur l'onglet, quand l'onglet passe en arrière-plan,
 * au retour du réseau, et toutes les 3 min. Chaque synchronisation tente d'envoyer la partie ;
 * si une autre révision est en ligne, on la reprend ou on demande au joueur (voir `decide`).
 */
import { create } from 'zustand';
import type { GameState } from '../types';
import { useGame } from '../store';
import { decodeTransfer, encodeTransfer } from '../engine/save';
import { actionCount, decide, isFreshGame, loadMeta, saveMeta, type SyncMeta } from './meta';

const SYNC_EVERY_MS = 3 * 60_000;

export type SyncStatus = 'off' | 'connecting' | 'ready' | 'syncing' | 'error' | 'conflict';

interface SyncStore {
  status: SyncStatus;
  user: { name: string | null; email: string | null } | null;
  lastSync: number | null;
  error: string | null;
  /** Partie en ligne différente de la partie locale, alors que le joueur a joué ici aussi. */
  conflict: { remote: GameState; rev: number } | null;
}

export const useSync = create<SyncStore>(() => ({
  status: 'off',
  user: null,
  lastSync: loadMeta()?.lastSync ?? null,
  error: null,
  conflict: null,
}));

type Remote = typeof import('./remote');
let remoteModule: Promise<Remote> | null = null;
const api = () => (remoteModule ??= import('./remote'));

let running: Promise<void> | null = null;
let timersStarted = false;

function errorMessage(e: unknown): string | null {
  const code = (e as { code?: string })?.code ?? '';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
  if (code === 'auth/popup-blocked')
    return 'La fenêtre de connexion a été bloquée. Autorisez les fenêtres pop-up pour ce site, ou ouvrez le jeu dans le navigateur plutôt que dans l’appli installée.';
  if (code === 'auth/operation-not-supported-in-this-environment')
    return 'La connexion n’est pas possible ici : ouvrez le jeu dans le navigateur.';
  if (code === 'auth/unauthorized-domain') return 'Ce site n’est pas autorisé à se connecter (domaine non déclaré dans Firebase).';
  if (code === 'auth/network-request-failed' || code === 'unavailable' || !navigator.onLine)
    return 'Pas de connexion réseau : nouvel essai plus tard.';
  if (code === 'permission-denied') return 'Accès refusé par le serveur de sauvegarde.';
  return `Synchronisation impossible (${code || (e as Error)?.message || 'erreur inconnue'}).`;
}

function fail(e: unknown) {
  const msg = errorMessage(e);
  useSync.setState({ status: msg ? 'error' : useSync.getState().user ? 'ready' : 'off', error: msg });
}

function setUser(u: { displayName: string | null; email: string | null }) {
  useSync.setState({ user: { name: u.displayName, email: u.email } });
}

function startTimers() {
  if (timersStarted) return;
  timersStarted = true;
  setInterval(() => {
    if (document.visibilityState === 'visible') void syncNow();
  }, SYNC_EVERY_MS);
  // En arrière-plan : on envoie la partie (l'autre appareil la retrouvera). Au retour : on regarde
  // si un autre appareil a joué entre-temps.
  document.addEventListener('visibilitychange', () => void syncNow());
  window.addEventListener('online', () => void syncNow());
}

/** Au lancement : reprend la session si le joueur s'était connecté sur cet appareil. */
export async function initSync(): Promise<void> {
  const meta = loadMeta();
  if (!meta) return;
  useSync.setState({ status: 'connecting' });
  try {
    const user = await (await api()).currentUser();
    if (!user || user.uid !== meta.uid) {
      saveMeta(null);
      useSync.setState({ status: 'off', user: null });
      return;
    }
    setUser(user);
    useSync.setState({ status: 'ready' });
    startTimers();
    await syncNow();
  } catch (e) {
    fail(e);
  }
}

export async function signIn(): Promise<void> {
  useSync.setState({ status: 'connecting', error: null });
  try {
    const user = await (await api()).signIn();
    const meta = loadMeta();
    if (!meta || meta.uid !== user.uid) {
      // Première connexion sur cet appareil : on n'est basé sur aucune révision en ligne.
      // Si la partie locale vient de commencer, la partie en ligne sera reprise sans question.
      saveMeta({ uid: user.uid, rev: -1, dirty: !isFreshGame(useGame.getState().state), lastSync: null });
    }
    setUser(user);
    useSync.setState({ status: 'ready' });
    startTimers();
    await syncNow();
  } catch (e) {
    fail(e);
  }
}

export async function signOut(): Promise<void> {
  try {
    await (await api()).logOut();
  } finally {
    saveMeta(null);
    useSync.setState({ status: 'off', user: null, error: null, conflict: null, lastSync: null });
  }
}

/** Synchronise maintenant (les appels concurrents partagent la même synchronisation). */
export function syncNow(): Promise<void> {
  running ??= run().finally(() => (running = null));
  return running;
}

async function run(): Promise<void> {
  const meta = loadMeta();
  const { status } = useSync.getState();
  if (!meta || status === 'off' || status === 'connecting' || status === 'conflict') return;
  useSync.setState({ status: 'syncing' });
  const before = actionCount();
  try {
    const game = useGame.getState();
    game.save();
    const state = useGame.getState().state;
    const code = await encodeTransfer(state);
    const res = await (await api()).pushSave(meta.uid, meta.rev, code, {
      era: state.era,
      playTime: Math.floor(state.stats.playTime),
      savedAt: state.lastSaved,
    });
    // Une action pendant l'envoi n'est pas dans la partie envoyée : la partie locale reste « modifiée ».
    if (res.ok) return synced({ ...(loadMeta() ?? meta), rev: res.rev, dirty: actionCount() !== before });

    const remote = await decodeTransfer(res.remote.code);
    const current = loadMeta() ?? meta; // le joueur a pu agir pendant l'envoi
    if (decide(current, res.remote.rev) === 'pull') {
      useGame.getState().adoptState(remote);
      return synced({ ...current, rev: res.remote.rev, dirty: false });
    }
    useSync.setState({ status: 'conflict', conflict: { remote, rev: res.remote.rev } });
  } catch (e) {
    fail(e);
  }
}

function synced(meta: SyncMeta) {
  const now = Date.now();
  saveMeta({ ...meta, lastSync: now });
  useSync.setState({ status: 'ready', error: null, lastSync: now });
}

/** Résout un conflit : `remote` reprend la partie en ligne, `local` l'écrase avec celle de cet appareil. */
export function resolveConflict(keep: 'remote' | 'local'): void {
  const { conflict } = useSync.getState();
  const meta = loadMeta();
  if (!conflict || !meta) return;
  if (keep === 'remote') {
    useGame.getState().adoptState(conflict.remote);
    synced({ ...meta, rev: conflict.rev, dirty: false });
    useSync.setState({ conflict: null });
  } else {
    saveMeta({ ...meta, rev: conflict.rev, dirty: true });
    useSync.setState({ status: 'ready', conflict: null });
    void syncNow();
  }
}
