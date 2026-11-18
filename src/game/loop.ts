import { useGame } from './store';

const TICK_MS = 100;
const AUTOSAVE_MS = 15_000;
/** Au-delà de ce délai entre deux ticks (onglet en veille), on passe par le rattrapage hors-ligne. */
const CATCHUP_THRESHOLD = 5;

let started = false;

export function startLoop(): void {
  if (started) return;
  started = true;
  let last = performance.now();

  setInterval(() => {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
    const g = useGame.getState();
    if (dt > CATCHUP_THRESHOLD) g.catchUp(dt);
    else g.advance(dt);
  }, TICK_MS);

  setInterval(() => useGame.getState().save(), AUTOSAVE_MS);

  const saveNow = () => useGame.getState().save();
  window.addEventListener('beforeunload', saveNow);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveNow();
  });
}
