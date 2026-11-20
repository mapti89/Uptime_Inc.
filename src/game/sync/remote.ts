/**
 * Accès Firebase (connexion Google + Firestore). Chargé à la demande (import dynamique) :
 * les joueurs qui n'utilisent pas la synchronisation ne téléchargent pas le SDK.
 */
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getFirestore, runTransaction, serverTimestamp } from 'firebase/firestore/lite';

// Configuration publique de l'application Web (pas un secret : l'accès est protégé par
// les règles Firestore, chaque joueur ne lit et n'écrit que saves/{son uid}).
const app = initializeApp({
  apiKey: 'AIzaSyBIXU8G7U7W4Z8BF_Njs0C4SeHJpimvJ7g',
  authDomain: 'uptime-inc-c7e79.firebaseapp.com',
  projectId: 'uptime-inc-c7e79',
  storageBucket: 'uptime-inc-c7e79.firebasestorage.app',
  messagingSenderId: '466110712676',
  appId: '1:466110712676:web:89576a5d44f0de6ed1c871',
});

const auth = getAuth(app);
auth.languageCode = 'fr';
const db = getFirestore(app);

export interface RemoteSave {
  /** Code de transfert compact (« UPT1. … »). */
  code: string;
  rev: number;
}

export type PushResult = { ok: true; rev: number } | { ok: false; remote: RemoteSave };

export async function currentUser(): Promise<User | null> {
  await auth.authStateReady();
  return auth.currentUser;
}

export async function signIn(): Promise<User> {
  const res = await signInWithPopup(auth, new GoogleAuthProvider());
  return res.user;
}

export function logOut(): Promise<void> {
  return signOut(auth);
}

/**
 * Envoie la partie si la sauvegarde en ligne est toujours celle sur laquelle on est basé
 * (`baseRev`). Sinon, n'écrit rien et renvoie la sauvegarde en ligne.
 */
export function pushSave(uid: string, baseRev: number, code: string, info: Record<string, unknown>): Promise<PushResult> {
  const ref = doc(db, 'saves', uid);
  return runTransaction(db, async (tx): Promise<PushResult> => {
    const snap = await tx.get(ref);
    const data = snap.exists() ? (snap.data() as RemoteSave) : null;
    if (data && data.rev !== baseRev) return { ok: false, remote: { code: data.code, rev: data.rev } };
    const rev = baseRev + 1;
    tx.set(ref, { code, rev, ...info, updatedAt: serverTimestamp() });
    return { ok: true, rev };
  });
}
