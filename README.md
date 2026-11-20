# Uptime Inc.

Idle game sur l'hébergement : partez d'un Raspberry Pi dans votre garage et bâtissez un cloud planétaire.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build statique dans dist/
npm test           # tests du moteur (vitest)
npm run sim        # simulation d'équilibrage par un bot glouton
```

Options du simulateur : `--hours 14 --clicks 2 --stop --verbose --prestiges 1 --trace --seed 2`.
Pour l'équilibrage de fin de partie : `--dump-era 8` enregistre la partie en arrivant à une ère, `--load sim-era8.json` en repart, et `--threshold 10=5e24`, `--research 9=8e9`, `--bridge 10=0.25` testent un réglage sans modifier les données (plusieurs variantes peuvent tourner en parallèle).

## Principe

- Les clients envoient des **requêtes** de plusieurs types (site statique, blog, API, BDD, sauvegarde, e-commerce, streaming, inférence IA, entraînement IA).
- Chaque type consomme des **ressources** (CPU, RAM, stockage, GPU, bande passante). La ressource la plus saturée est le **goulot** : le surplus de requêtes est perdu.
- En cas de pénurie d'une ressource, le manque est **réparti au prorata** entre tous les types qui en dépendent (temps réel comme tolérants).
- Les machines consomment de l'**électricité** et dégagent de la **chaleur** : sans assez de capacité électrique ou de refroidissement, tout ralentit. Le **PUE** pèse sur la facture d'énergie ; il suit la charge réelle (les groupes les plus sobres tournent en premier, les unités à l'arrêt consomment un peu à vide).
- La **qualité de service** fait évoluer **uptime** et **réputation** (qui module la demande). Les recherches SLA donnent des bonus de prix si l'uptime est élevé.
- **12 ères** en trois actes : le datacenter (Homelab → Placard serveur → Salle serveur → Colocation → Datacenter régional → Hyperscale mondial), l'espace proche (NewSpace → Constellations → Cislunaire → Système solaire) puis les étoiles (Interstellaire → Galactique).
- **Conquête spatiale** (ère 7+) : le matériel spatial consomme de la **capacité d'emport** (lanceurs) au lieu de l'espace ; les satellites génèrent des **débris orbitaux** à nettoyer ; au-delà de la Lune, le matériel est **lointain** : il sert les requêtes tolérantes à la latence, et seule une part « pontée » sert aussi le temps réel (25 % dès l'ère 10, +25 % par recherche, 100 % avec un trou de ver) ; le matériel interstellaire **voyage** plusieurs minutes avant d'être opérationnel ; les **sondes auto-réplicantes** colonisent les étoiles jusqu'à la galaxie entière (100 milliards d'étoiles : écran de fin, puis le jeu continue). Le décor de la salle devient une vue de l’orbite, du système solaire puis de la galaxie : une illustration peinte en fond, et par-dessus un SVG qui suit le parc (satellites, débris, planètes colonisées, étoiles allumées).
- **Améliorations** (paliers à 10/25/50/100… exemplaires, ×2 ; électricité et refroidissement : paliers au record de consommation / de chaleur évacuée), **recherche** (5 branches), **équipe**, **incidents** aléatoires (pannes, canicules, DDoS, buzz…), **succès** (+1 % de revenus chacun).
- **Introduction en bourse** (prestige, dès l'ère 4) : actions = 3 × ∛(gains / 1 Md), +2 % de revenus par action, boutique d'actionnaires.
- Sauvegarde automatique (localStorage), export/import, progression hors-ligne (2 h à 50 % par défaut).
- **Synchronisation en ligne** facultative (connexion Google, Firebase Auth + Firestore `saves/{uid}`) : `src/game/sync/`. Le SDK Firebase n'est chargé qu'à la connexion.

## Architecture

- `src/game/data/` — toutes les constantes d'équilibrage (ères, bâtiments, requêtes, upgrades, recherche, événements, succès, prestige).
- `src/game/engine/` — moteur pur sans React : `snapshot.ts` (capacité, goulots, revenus), `tick.ts`, `actions.ts`, `events.ts`, `offline.ts`, `save.ts`.
- `src/game/store.ts` (zustand) et `src/game/loop.ts` (tick 100 ms, autosave 15 s).
- `src/ui/` — composants React et thème CSS.
- `scripts/simulate.ts` — bot d'équilibrage ; rythme mesuré (bot optimal, sans prestige) : ère 2 ≈ 18 min, ère 4 ≈ 2 h, ère 6 ≈ 5 h, ère 7 ≈ 8 h, ère 8 ≈ 10 h 30, ère 9 ≈ 16 h, ère 10 ≈ 23 h 30, ère 11 ≈ 32 h, ère 12 ≈ 39 h 30 ; une 2e partie après prestige est ~4× plus rapide.
