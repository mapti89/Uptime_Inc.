import { useEffect } from 'react';
import { useGame, type Toast } from '../../game/store';

function ToastItem({ t, onDone }: { t: Toast; onDone: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(t.id), 6000);
    return () => clearTimeout(timer);
  }, [t.id, onDone]);
  return (
    <div className={`toast toast-${t.kind}`} onClick={() => onDone(t.id)}>
      {t.msg}
    </div>
  );
}

export function Toasts() {
  const toasts = useGame((g) => g.toasts);
  const dismiss = useGame((g) => g.dismissToast);
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onDone={dismiss} />
      ))}
    </div>
  );
}
