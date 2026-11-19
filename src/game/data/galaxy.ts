// ---------------------------------------------------------------------------
// Colonisation stellaire (ères 11 et 12) : les sondes auto-réplicantes font
// croître le nombre d'étoiles colonisées de façon exponentielle, jusqu'à un
// plafond fixé par l'ère. La galaxie entière marque la fin du jeu.
// ---------------------------------------------------------------------------

/** Ère à partir de laquelle la colonisation commence (le Soleil compte pour 1). */
export const STAR_ERA = 11;

/** Nombre d'étoiles de la Voie lactée (objectif final). */
export const GALAXY_STARS = 1e11;

/** Plafond d'étoiles colonisables selon l'ère. */
export function starCap(era: number): number {
  if (era < STAR_ERA) return 0;
  if (era === STAR_ERA) return 1e5;
  return GALAXY_STARS;
}
