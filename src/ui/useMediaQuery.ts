import { useEffect, useState } from 'react';

/** Suit une media query CSS et renvoie `true` tant qu'elle correspond. */
export function useMediaQuery(query: string): boolean {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Même seuil que les media queries « mobile » de global.css. */
export const MOBILE_QUERY = '(max-width: 820px)';
