import { useState } from 'react';

export type IconSet = 'buildings' | 'events' | 'categories';

/**
 * Icône générée (public/assets/icons/<set>/<id>.webp).
 * Retombe sur l'emoji d'origine si le fichier manque ou ne charge pas.
 */
export function GameIcon({ set, id, emoji, size, className }: { set: IconSet; id: string; emoji: string; size: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const cls = `game-icon ${className ?? ''}`;
  if (failed) {
    return (
      <span className={`${cls} emoji`} style={{ width: size, height: size, fontSize: size * 0.72 }} aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return (
    <img
      className={cls}
      src={`${import.meta.env.BASE_URL}assets/icons/${set}/${id}.webp`}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
