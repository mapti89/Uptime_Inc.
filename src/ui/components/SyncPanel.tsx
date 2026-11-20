import { signIn, signOut, syncNow, useSync } from '../../game/sync/sync';

const STATUS: Record<string, string> = {
  connecting: 'Connexion…',
  syncing: 'Synchronisation…',
  conflict: 'En attente de votre choix entre deux parties.',
};

export function SyncPanel() {
  const { status, user, lastSync, error } = useSync();
  const busy = status === 'connecting' || status === 'syncing';

  return (
    <div className="panel inner">
      <h3>☁️ Synchronisation</h3>
      {!user ? (
        <>
          <p className="muted small">
            Connectez-vous avec Google pour retrouver votre partie sur tous vos appareils (ordinateur, téléphone…). La partie est
            enregistrée en ligne automatiquement.
          </p>
          <div className="row">
            <button className="btn primary" disabled={busy} onClick={() => void signIn()}>
              {busy ? 'Connexion…' : 'Se connecter avec Google'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            Connecté : <strong>{user.name ?? user.email}</strong>
            {user.name && user.email && <span className="muted small"> · {user.email}</span>}
          </p>
          <p className="muted small">
            {STATUS[status] ??
              (lastSync ? `Dernière synchronisation : ${new Date(lastSync).toLocaleTimeString('fr-FR')}` : 'Pas encore synchronisée.')}
          </p>
          <div className="row">
            <button className="btn" disabled={busy || status === 'conflict'} onClick={() => void syncNow()}>
              🔄 Synchroniser maintenant
            </button>
            <button className="btn" disabled={busy} onClick={() => void signOut()}>
              Se déconnecter
            </button>
          </div>
        </>
      )}
      {error && <p className="warn small">{error}</p>}
    </div>
  );
}
