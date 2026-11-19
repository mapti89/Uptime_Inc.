# Mission : générer les images de la conquête spatiale d'« Uptime Inc. »

Tu travailles dans le dépôt d'**Uptime Inc.**, un idle game web (React + Vite, GitHub Pages) sur
l'hébergement : on part d'un Raspberry Pi dans un garage. Le jeu compte désormais **12 ères** en
trois actes : le datacenter (ères 1 à 6, déjà illustrées), l'espace proche (ères 7 à 10) puis les
étoiles (ères 11 et 12).

Les images des ères 1 à 6 et les 96 premières icônes existent déjà : lis `ASSETS.md`,
`PROMPT_CODEX.md` et `PROMPT_CODEX_ICONS.md`, et regarde `public/assets/` et
`assets-src/icons-preview.png`. **Tout ce que tu génères doit appartenir au même univers visuel.**

Ta tâche : générer **77 images** (6 fonds d'ère, 7 illustrations plein écran, 64 icônes), les
optimiser, les ranger dans `public/assets/` et compléter `public/assets/manifest.json` et
`ASSETS.md`. **Ne modifie pas le code du jeu** (`src/`) : l'intégration sera faite séparément.
Le jeu fonctionne déjà sans ces images (décor SVG procédural, emojis à la place des icônes), donc
chaque image livrée doit être meilleure que ce repli.

---

## 1. Comment les images seront utilisées (important)

### Fonds d'ère 7 à 12

Comme pour les ères 1 à 6, le fond est un **décor statique** sur lequel le jeu dessine en SVG les
éléments **dynamiques**, qui reflètent ce que le joueur possède :

| Ère | Ce que le jeu dessine par-dessus (ne PAS le mettre dans l'image) |
|---|---|
| 7–8 | satellites, stations, essaims, débris orbitaux, fusées qui décollent, lignes d'orbite pointillées, paquets réseau |
| 9 | idem + lumières des bases lunaires, catapulte électromagnétique, station au point L2 |
| 10 | les planètes (qui tournent), leurs orbites, les halos des colonies, la ceinture d'astéroïdes |
| 11–12 | une galaxie spirale de ~1 100 points qui s'allument au fil de la colonisation, des sphères de Dyson |

Conséquences :

- **Aucun vaisseau, satellite, station, fusée ni planète « en trop »** dans les fonds : le jeu les
  ajoute lui-même, en quantité variable.
- Les **astres fixes** (Terre, Lune, Soleil) sont dans l'image : le code placera ses objets autour
  d'eux grâce au manifeste (§ 5). Respecte autant que possible le cadrage demandé ; de toute façon,
  tu **mesureras leur position réelle** sur l'image finale.
- **Ères 11 et 12 : pas de galaxie dans l'image.** Le jeu dessine sa propre galaxie au centre ; une
  galaxie peinte ne coïnciderait jamais avec ses bras. Le fond est un ciel profond avec des
  nébuleuses **sur les bords**, et un centre sombre et peu détaillé.
- Pas de texte, logo, interface, filigrane ni personnage. Image plutôt sombre, contraste modéré :
  l'interface (thème sombre) se superpose.

### Illustrations plein écran

Affichées au passage d'une ère (« Cap sur… ») et à la victoire finale. Le titre et un paragraphe
s'affichent **en bas, au centre**, sur un dégradé sombre : garde le **tiers inférieur calme** (peu
de détails importants), l'action dans le centre et le haut de l'image. Mise en scène, vaisseaux et
équipements autorisés ; toujours ni texte ni personnage reconnaissable.

### Icônes

Mêmes règles que `PROMPT_CODEX_ICONS.md` : boutique 44 px, événements 28 px, catégories 20 px, sur
fond de carte sombre `#121a27`. Un seul objet, silhouette forte, fond transparent.

## 2. Direction artistique

### Palette par ère

Le jeu change ses couleurs d'accent pour chaque acte (`src/ui/styles/global.css`, classes
`act-space` et `act-galaxy`) : les images doivent suivre.

| Ère | Nom | Accent dominant | Accent secondaire |
|---|---|---|---|
| 7 | NewSpace | bleu ciel `#6ec6ff` | violet `#9575ff` |
| 8 | Constellations | bleu ciel `#6ec6ff` | violet `#9575ff` |
| 9 | Cislunaire | gris argent `#b0bec5` | cyan `#6ec6ff` |
| 10 | Système solaire | ambre solaire `#ffb74d` | bleu ciel `#6ec6ff` |
| 11 | Interstellaire | lavande `#c792ff` | ambre `#ffab40` |
| 12 | Galactique | lavande `#c792ff` | ambre `#ffab40` |

La progression doit se sentir : **orbite terrestre familière** (ère 7) → **froid et vide de
l'espace profond** (ère 10) → **démesure cosmique, chaude et violette** (ère 12).

### Bloc de style des fonds (à placer au début de CHAQUE prompt de fond, à l'identique)

> Stylized digital illustration for a video game background, clean semi-flat style with soft
> painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan
> rim lights and small glowing accent lights, palette dominated by near-black and deep navy
> (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no
> letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm
> dark areas reserved for game elements, 16:9 composition.

### Bloc de style des illustrations plein écran (à l'identique)

> Stylized digital illustration for a video game cinematic, clean semi-flat style with soft
> painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim
> lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a,
> #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no
> logos, no watermark, no people, 16:9 composition, calm and dark lower third.

### Bloc de style des icônes

**Exactement** celui de `PROMPT_CODEX_ICONS.md` (§ 2), pour rester cohérent avec les 96 icônes
existantes :

> Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading,
> three-quarter isometric view from slightly above, consistent lighting from top-left,
> subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials
> (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at
> 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos,
> no background, no shadow plane.

Règles complémentaires :

- Matériel spatial : **blanc cassé, gris titane, or des couvertures thermiques, panneaux solaires
  bleu nuit**, avec le liseré cyan habituel. Plus on avance dans les ères, plus les objets
  deviennent **lumineux, abstraits et cosmiques** (étoiles, trous noirs, sphères).
- Astres en icône (Lune, Mars, Europe, étoiles…) : petits, nets, ressemblant à des **objets de
  collection**, pas à des photos.
- Pas de drapeau, d'insigne d'agence spatiale réelle, ni de fusée reconnaissable d'un vrai
  constructeur.
- Événements négatifs : accent **rouge** `#ff4d6a` ; positifs : **vert** `#3ddc84` ou **doré**
  `#ffd166`.
- Catégorie : emblème **quasi plat**, 2–3 couleurs, lisible à 20 px (comme les 8 existantes).

---

## 3. Fonds d'ère : 6 images

- Génération : **1536×1024** (paysage), puis recadrage/redimensionnement en **1600×900**.
- Sortie : `public/assets/eras/era-<n>.webp` (qualité ~80, **≤ 250 Ko** chacune).
- Les ères 7, 8 et 9 partagent **le même cadrage de la Terre** (le jeu y place les mêmes orbites) :
  génère l'ère 7 d'abord, puis joins-la comme référence pour les ères 8 et 9.

Repères de cadrage (image finale 1600×900, en pixels) :

| Astre | Où le placer |
|---|---|
| Terre (ères 7–9) | grand disque dont seul l'arc supérieur est visible, en bas à gauche ; centre vers (470, 1040) hors cadre, rayon ~600 px ; sommet de l'arc vers (470, 440), soit environ mi-hauteur ; l'arc rejoint le bord gauche et le bas du cadre vers x ≈ 1000 |
| Lune (ère 9) | disque d'environ 240 px de diamètre, centré vers (1310, 250), en haut à droite |
| Soleil (ère 10) | petit disque très lumineux d'environ 70 px au centre exact (800, 450), halo jusqu'à ~110 px |
| Zone libre (ères 11–12) | ellipse centrale d'environ 1200 × 650 px centrée en (800, 440), sombre et peu détaillée |

### `eras/era-7.webp` : NewSpace

```text
<bloc de style des fonds>

Low Earth orbit viewpoint at the edge of night and day. A huge Earth curve fills the lower-left of the frame: only the upper arc of the planet is visible, its highest point at mid-height slightly left of centre, the arc running down to the bottom edge around two thirds of the width. Deep blue oceans, soft white cloud bands, a few warm city light clusters on the night side, and a thin glowing cyan-blue atmospheric rim. Above the horizon: a calm black sky with a fine, sparse star field and a very faint violet airglow. The upper half and the right side stay dark, empty and uncluttered. Sky blue (#6ec6ff) accent lighting.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No spacecraft, satellites, debris, rockets, Moon or Sun disc in view. Moderate contrast, matte painterly finish, no written marks.
```

### `eras/era-8.webp` : Constellations

```text
<bloc de style des fonds>

The same Earth framing as the reference image: the upper arc of the planet in the lower-left, highest point at mid-height slightly left of centre. Now mostly on the night side: dense networks of warm city lights across the continents, a brighter cyan atmospheric rim, and a faint violet aurora near the horizon. High above the planet, a very subtle, wide, pale band of scattered light suggests the busy geostationary belt, without any visible object. Black sky with a fine star field, upper half and right side calm and empty. Sky blue (#6ec6ff) and violet (#9575ff) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. Match the camera, horizon position and Earth size of the reference image exactly. No spacecraft, satellites, debris or rockets. Moderate contrast, no written marks.
```

### `eras/era-9.webp` : Cislunaire

```text
<bloc de style des fonds>

The same Earth framing as the reference image: the upper arc of the planet in the lower-left, highest point at mid-height slightly left of centre, daylight side with blue oceans and white clouds. In the upper-right, the full Moon as a crisp grey disc about one sixth of the image height wide, with clearly readable maria and a few large craters, lit from the left, its south polar region slightly shadowed. A faint silvery haze between the Earth and the Moon. Black sky with a fine star field; the space between the two bodies stays dark and empty. Silver-grey (#b0bec5) and cyan accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. Match the camera, horizon position and Earth size of the reference image. No bases, domes, lights or structures on the Moon, no spacecraft. Moderate contrast, no written marks.
```

### `eras/era-10.webp` : Système solaire

```text
<bloc de style des fonds>

Top-down oblique view of the inner solar system plane, seen from far above. A small, intensely bright white-yellow Sun sits exactly at the centre of the frame, with a soft warm amber corona. A very faint, flat horizontal band of zodiacal dust light passes through the Sun, slightly tilted like an ellipse seen at a low angle. Distant deep-space background with a sparse star field and a subtle, dim amber and blue nebula only near the left and right edges. The whole wide horizontal area around the Sun stays dark and clear for the game's planets and orbits. Solar amber (#ffb74d) and sky blue (#6ec6ff) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No planets, moons, asteroids, orbit lines, rings or spacecraft. Moderate contrast, no written marks.
```

### `eras/era-11.webp` : Interstellaire

```text
<bloc de style des fonds>

Deep interstellar space between neighbouring stars. A rich but calm star field with a few brighter nearby stars of different colours (white, pale blue, warm orange) placed near the corners. Wispy lavender and amber nebula clouds frame the image along the left, right and top edges, fading out towards the middle. The broad centre of the frame is a dark, low-detail, slightly darker oval area, kept free for the game's galaxy drawing. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No galaxy, spiral, planets or spacecraft. Moderate contrast, matte painterly finish, no written marks.
```

### `eras/era-12.webp` : Galactique

```text
<bloc de style des fonds>

Intergalactic deep field seen from outside our galaxy. Faint, tiny distant galaxies scattered across a black background, and the delicate filaments of the cosmic web glowing in lavender and warm amber along the edges and corners of the frame. The broad centre of the frame is a dark, low-detail, slightly darker oval area, kept free for the game's own spiral galaxy drawing. Majestic, quiet, enormous scale. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No large galaxy, no spiral in the centre, no planets or spacecraft. Moderate contrast, no written marks.
```

---

## 4. Illustrations plein écran : 7 images

- Génération : **1536×1024**, sortie **1600×900**, qualité ~80, **≤ 250 Ko** chacune.
- Sorties : `public/assets/transitions/era-<n>.webp` pour n = 7…12, et
  `public/assets/transitions/victory.webp` pour l'écran de fin.

### `transitions/era-7.webp` : décollage

```text
<bloc de style des illustrations plein écran>

A sleek unbranded reusable rocket lifting off from a coastal launch pad at night, seen from a low three-quarter angle. A blazing white-orange exhaust plume and billowing clouds of steam light up the launch tower. A cutaway window in the payload fairing reveals stacked server modules with tiny cyan status lights. The sea reflects the flame, a faint dawn glow on the horizon. Sky blue (#6ec6ff) accents. All hulls and structures are blank, with no flags, numbers or markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, rocket and plume in the upper two thirds. Cinematic depth, clear silhouettes, moderate contrast. No visible people.
```

### `transitions/era-8.webp` : déploiement d'une constellation

```text
<bloc de style des illustrations plein écran>

In low Earth orbit, an open upper stage releases a long glittering string of dozens of small flat satellites that unfold their blue solar wings one after another, stretching into the distance like a necklace of light. Below, the night side of the Earth with city lights and a thin cyan atmospheric rim. A larger ring-shaped station shines far away on a higher orbit. Sky blue (#6ec6ff) and violet (#9575ff) accents. Unbranded, unmarked hardware.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Cinematic depth, clear silhouettes, moderate contrast. No visible people.
```

### `transitions/era-9.webp` : la Lune

```text
<bloc de style des illustrations plein écran>

On the grey lunar surface, the glowing entrance of an underground lava tube datacenter: a reinforced arch carved into a crater wall, rows of cyan-lit server racks visible deep inside the tunnel. A long electromagnetic launch rail runs across the plain towards the horizon. In the black sky, the blue Earth rises above the horizon. Hard, low sunlight with long shadows. Silver-grey (#b0bec5) and cyan accents. No flags, signs or markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, Earth and tunnel entrance in the upper two thirds. Cinematic depth, moderate contrast. No visible people, no astronauts.
```

### `transitions/era-10.webp` : Mars et au-delà

```text
<bloc de style des illustrations plein écran>

A long fusion-powered cargo ship with stacked container modules and a bright blue-white exhaust approaches Mars. On the rusty planet below, a cluster of glowing domed habitats and large antenna dishes sits at the edge of a canyon. Far in the background, Jupiter appears as a small striped disc and the Sun as a bright point. Solar amber (#ffb74d) and sky blue (#6ec6ff) accents. Unbranded hull, no markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, ship and Mars in the upper two thirds. Cinematic depth, moderate contrast. No visible people.
```

### `transitions/era-11.webp` : vers les étoiles

```text
<bloc de style des illustrations plein écran>

A huge, paper-thin, shimmering square light sail carrying a tiny probe at its centre is pushed away from the solar system by a powerful red-violet laser beam coming from a distant ring of collectors around the Sun. Ahead, a bright binary star system, one white and one orange star, glows against a lavender nebula. Sense of an immense journey. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, sail and stars in the upper two thirds. Cinematic depth, moderate contrast. No text, no people.
```

### `transitions/era-12.webp` : la sphère de Dyson

```text
<bloc de style des illustrations plein écran>

A completed Dyson sphere enclosing a star: a colossal sphere made of interlocking dark hexagonal plates, warm orange light leaking through thin seams and a few open panels, thin cyan data lines running across its surface. Beyond it, the Milky Way spiral glows across the black sky. Epic, quiet scale. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, sphere in the upper two thirds. Cinematic depth, moderate contrast. No text, no people.
```

### `transitions/victory.webp` : uptime galactique

Affichée quand la Voie lactée entière est colonisée (fin du jeu, la partie continue ensuite).

```text
<bloc de style des illustrations plein écran>

The entire Milky Way seen from outside, a majestic barred spiral galaxy tilted three-quarters towards the viewer, its arms sparkling with countless tiny golden and cyan lights as if every star system were lit by a datacenter. A gentle web of faint luminous lines links the arms. The galactic core glows warm amber; the black intergalactic space around is calm, with a few distant galaxies. Triumphant, serene, awe-inspiring. Lavender (#c792ff), gold (#ffd166) and cyan accents.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, galaxy in the upper two thirds. Cinematic depth, moderate contrast. No text, no people.
```

---

## 5. Icônes : 64 images

Les noms de fichiers sont **exactement les `id`** ci-dessous. Les descriptions servent à choisir
l'objet (ne les écris pas dans l'image).

### A. Éléments de boutique (56) → `public/assets/icons/buildings/<id>.webp`

`orbital` (Datacenter orbital) a déjà son icône : ne la régénère pas, mais **joins-la comme
référence de style** à chaque planche.

#### Serveurs (`servers`, 11 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `orbmodule` | Module de calcul orbital | 7 | Un module pressurisé amarré à votre station, plein de baies durcies aux radiations. |
| `swarm` | Essaim de micro-satellites | 8 | Des milliers de satellites jetables qui calculent en essaim. Gare aux débris. |
| `geostation` | Station géostationnaire | 8 | À 36 000 km, immobile au-dessus de l’équateur. Robuste et durable. |
| `lavatube` | Datacenter en tube de lave | 9 | Enfoui sous la Lune, à l’abri des radiations et des micrométéorites. |
| `l2hub` | Hub au point L2 | 9 | Au point de Lagrange L2, à l’ombre de la Terre : stable, froid et silencieux. |
| `marsdc` | Datacenter martien | 10 | Froid naturel, poussière partout et 4 à 24 minutes de latence avec la Terre. |
| `asteroidcore` | Astéroïde-ordinateur | 10 | Un astéroïde métallique entièrement creusé et gravé en circuits. |
| `stellarnode` | Nœud stellaire | 11 | Un datacenter en orbite d’une autre étoile. Il faut quelques minutes pour l’atteindre. |
| `neutroncore` | Calculateur à étoile à neutrons | 11 | De la matière si dense qu’une cuillère pèse un milliard de tonnes. Elle calcule vite. |
| `matrioshka` | Cerveau Matriochka | 12 | Des sphères de Dyson emboîtées : chaque couche calcule avec la chaleur de la précédente. |
| `blackholecpu` | Ordinateur à trou noir | 12 | La limite ultime du calcul : chaque bit frôle l’horizon des événements. |

#### Stockage (`storage`, 6 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `leoarchive` | Archive en orbite basse | 7 | Des baies froides en orbite, hors de portée des catastrophes terrestres. |
| `crystal5d` | Mémoire cristalline 5D | 8 | Gravée au laser femtoseconde dans du quartz : des milliards d’années de rétention. |
| `lunarvault` | Coffre-fort lunaire | 9 | Une sauvegarde de toute l’humanité, au fond d’un cratère polaire. |
| `titancryo` | Stockage cryogénique sur Titan | 10 | À −180 °C dans les lacs de méthane. Lointain, mais parfait pour les archives. |
| `degenerate` | Mémoire en matière dégénérée | 11 | Les bits sont codés dans les états quantiques d’une naine blanche. |
| `holohorizon` | Stockage holographique d’horizon | 12 | Toute l’information d’un volume, écrite sur la surface d’un trou noir. |

#### Réseau (`network`, 6 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `kaground` | Station sol en bande Ka | 7 | Des paraboles géantes qui descendent les données de vos satellites. |
| `optsat` | Relais optique géostationnaire | 8 | Des lasers relient vos constellations à la Terre sans aucune fibre. |
| `lunarrelay` | Relais laser lunaire | 9 | Un réseau de relais en orbite lunaire, connecté en permanence à la Terre. |
| `deepnet` | Réseau de l’espace lointain | 10 | Des antennes de 70 m et des relais dans tout le système solaire. |
| `wormhole` | Relais à trou de ver | 11 | Un raccourci dans l’espace-temps : la latence interplanétaire disparaît. |
| `galacticnet` | Réseau galactique | 12 | Un maillage de trous de ver qui relie les bras de la galaxie. |

#### Électricité (`power`, 6 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `orbitalsolar` | Station solaire orbitale | 7 | Des kilomètres de panneaux en plein soleil, sans nuit ni nuages. |
| `sbsp` | Ferme solaire géostationnaire | 8 | L’énergie est renvoyée vers vos installations par faisceau micro-ondes. |
| `he3` | Fusion à l’hélium-3 lunaire | 9 | Le régolithe lunaire regorge d’hélium-3 : la fusion propre devient rentable. |
| `mercuryring` | Anneau solaire de Mercure | 10 | Une ceinture de panneaux autour de la planète la plus proche du Soleil. |
| `dysonswarm` | Essaim de Dyson | 11 | Des milliards de collecteurs en orbite d’une étoile captent une partie de sa lumière. |
| `dysonsphere` | Sphère de Dyson | 12 | Une étoile entièrement enveloppée : toute son énergie vous appartient. |

#### Refroidissement (`cooling`, 6 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `heatpipes` | Radiateurs orbitaux | 7 | Dans le vide, la chaleur ne part que par rayonnement : il faut d’immenses ailettes. |
| `droplet` | Radiateurs à gouttelettes | 8 | Un rideau de gouttelettes d’huile rayonne la chaleur, puis est récupéré. |
| `polarcrater` | Cratère d’ombre éternelle | 9 | Au pôle sud lunaire, des cratères à −240 °C qui n’ont jamais vu le Soleil. |
| `europa` | Océan d’Europe | 10 | Un océan entier sous la glace d’une lune de Jupiter, pour dissiper vos calories. |
| `oortcloud` | Nuage de Oort | 11 | Aux confins du système solaire, à quelques kelvins du zéro absolu. |
| `cmb` | Rayonnement vers le fond cosmique | 12 | Vos radiateurs visent l’univers lui-même, à 2,7 K. |

#### Commercial (`sales`, 6 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `spacetourism` | Tourisme spatial | 7 | Les touristes en orbite veulent publier leurs photos tout de suite. |
| `satinternet` | Internet orbital universel | 8 | Chaque point du globe est connecté, des déserts aux océans. |
| `lunareco` | Économie lunaire | 9 | Mines, hôtels et usines lunaires : tout ce petit monde a besoin de cloud. |
| `marscolonies` | Colonies martiennes | 10 | Un million de colons, et autant d’abonnements. |
| `firstcontact` | Premier contact | 11 | Une civilisation voisine découvre le cloud. Elle a beaucoup de données. |
| `galacticmarket` | Marché galactique | 12 | Des milliers d’espèces, une seule plateforme d’hébergement. |

#### Équipe (`staff`, 3 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `missioncontrol` | Centre de contrôle de mission | 7 | Des écrans du sol au plafond et des ingénieurs qui ne dorment jamais. |
| `moonbase` | Base lunaire habitée | 9 | Vos équipes vivent sur place : réparations et expériences en direct. |
| `shipmind` | Superintelligence de bord | 11 | Une IA qui pilote vos installations à des années-lumière de distance. |

#### Spatial (`orbit`, 12 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `launchpad` | Pas de tir | 7 | Votre propre pas de tir, et une fusée qui part toutes les semaines. |
| `reusable` | Lanceur réutilisable | 7 | Le premier étage revient se poser tout seul. Le coût du kilo s’effondre. |
| `superheavy` | Lanceur super-lourd | 8 | 150 tonnes en orbite à chaque vol, ravitaillement en orbite compris. |
| `debristug` | Remorqueur de débris | 8 | Il capture les satellites morts et les désorbite proprement. |
| `massdriver` | Catapulte électromagnétique lunaire | 9 | Sans atmosphère, on lance le matériel depuis la Lune sur un simple rail. |
| `deorbitlaser` | Laser de désorbitation | 9 | Il freine les débris à distance pour qu’ils brûlent dans l’atmosphère. |
| `elevator` | Ascenseur spatial | 9 | Un câble de 100 000 km jusqu’à l’orbite géostationnaire. Ça monte tout seul. |
| `fusionfreighter` | Cargo à propulsion fusion | 10 | Mars en trois semaines, Jupiter en deux mois. |
| `vonneumann` | Sonde de von Neumann | 11 | Arrivée à destination, elle se copie avec les ressources locales et repart. |
| `lasersail` | Voiles laser | 11 | Des voiles poussées par des lasers géants vers les étoiles voisines. |
| `seedship` | Vaisseau-graine galactique | 12 | Il emporte de quoi fonder mille colonies à travers la galaxie. |
| `antimatter` | Propulsion à antimatière | 12 | Un gramme d’antimatière, et le vaisseau file à une fraction de la vitesse de la lumière. |

### B. Événements (7) → `public/assets/icons/events/<id>.webp`

| id | Nom | Positif | Description |
|---|---|---|---|
| `launchfail` | Échec au lancement | non | Le lanceur explose en vol avec une partie de votre matériel : 8 % de dégâts. |
| `launchwindow` | Fenêtre de tir parfaite | oui | Météo idéale, tous les lancements partent à l’heure : +120 s de revenus. |
| `kessler` | Collisions en cascade | non | Un satellite mort en percute un autre, et ainsi de suite : 15 % de dégâts. |
| `moonquake` | Séisme lunaire | non | La Lune tremble aussi : 6 % de dégâts dans vos installations souterraines. |
| `conjunction` | Conjonction solaire | non | Le Soleil s’interpose entre la Terre et Mars : bande passante −50 %. |
| `xenosignal` | Signal extraterrestre | oui | Un message venu d’ailleurs fait exploser l’intérêt pour vos services : demande ×3 ! |
| `supernova` | Supernova proche | non | Une étoile voisine explose : 10 % de dégâts et refroidissement −30 %. |

### C. Catégorie (1) → `public/assets/icons/categories/orbit.webp`

| id | Nom | Idée de pictogramme |
|---|---|---|
| `orbit` | Spatial | une fusée stylisée qui décolle, ou une fusée sur une orbite elliptique |

### D. Prompts des planches

Même méthode que pour les icônes existantes : **une planche par groupe** sur un canevas carré
transparent, une icône par case, puis découpe. Joins à chaque génération l'icône `orbital` et une
planche existante (par exemple celle des serveurs) comme **références de style**. Si une case est
ratée, régénère-la seule avec le même bloc de style et la planche comme référence.

#### Planche 1 : serveurs spatiaux (11)

```text
<bloc de style des icônes>

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: one white cylindrical pressurized space station module with a docking ring at one end and a row of small cyan-lit portholes | a tight formation of seven tiny cube satellites with miniature dark-blue solar wings, flying together as one compact cluster | a large wheel-shaped space station with a central hub, four spokes and a dish antenna | a cutaway grey lunar rock mound revealing a glowing cyan tunnel lined with server racks inside.
Row 2: a dark hexagonal space hub sitting on a large layered gold and violet sunshield | a rust-red Martian dome habitat with dim server rack silhouettes inside and red dust heaped at its base | a grey metallic asteroid covered with glowing cyan circuit traces | a small blazing white-yellow star with a slim dark ring-shaped station orbiting around it.
Row 3: a tiny intensely bright blue-white sphere with two thin violet jets from its poles, wrapped by one thin metallic ring | three nested translucent spheres made of hexagonal panels with a glowing orange core | a pure black disc surrounded by a bright orange-violet accretion disk and one thin cyan lattice ring | Empty.
Keep silhouettes deliberately different even in monochrome: cylinder, cluster, wheel, mound, shield, dome, rock, star with ring, jets, nested spheres, black disc. Fictional, unbranded hardware.
```

#### Planche 2 : stockage et réseau spatiaux (12)

```text
<bloc de style des icônes>

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a small white boxy satellite whose body is a stack of drive drawers, with one frosty white radiator fin | a thick transparent quartz glass disc with glowing violet dot patterns layered inside it | a heavy round steel vault door set into a block of grey lunar rock | a frosty white cylindrical cryogenic tank half-submerged in dark amber liquid, covered with icy rime.
Row 2: a small white-hot glowing sphere held inside a dark metallic cage-like containment frame | a black sphere whose whole surface is covered by a glowing cyan pixel grid | a large white parabolic ground antenna dish on a sturdy pedestal, pointing upward | a satellite with a telescope-like optical head emitting a thin bright green laser beam.
Row 3: a small grey cratered moon with three tiny relay satellites around it, linked by thin cyan laser lines | a giant lattice-tower radio dish tilted at an angle with violet signal arcs | a glowing toroidal funnel-shaped portal swirling violet and cyan | a miniature spiral galaxy with bright nodes connected by golden lines.
Storage items (row 1 and first two of row 2) must read as data containers; network items as antennas, beams and links. Clearly distinct silhouettes.
```

#### Planche 3 : électricité et refroidissement spatiaux (12)

```text
<bloc de style des icônes>

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a long metal truss carrying four large dark-blue solar panel wings in a cross shape | a huge flat square solar array with a small dish underneath sending a pale orange beam downward | a compact grey dome on a regolith base, a glowing violet fusion ring visible through its open top | a small scorched grey planet encircled by a thin ring of dark-blue solar panels.
Row 2: a bright orange star surrounded by dozens of small blue collector panels orbiting in loose shells | a sphere of interlocking dark hexagonal plates with orange light leaking through the seams | a set of very large folding white radiator fins arranged like a ladder, faintly glowing red at their base | a spacecraft boom emitting a flat sheet of glowing orange droplets towards a collector bar.
Row 3: a deep dark crater bowl with icy blue frost on its rim and one frosted cooling pipe descending into it | a white icy moon with brownish crack lines and cyan light seeping out of the fractures | a loose spherical cloud of tiny pale-blue icy comet nuclei | a white radiator panel facing a disc of mottled orange and blue cosmic background pattern.
Power items glow warm (orange, violet); cooling items look cold (white, ice blue). Clearly distinct silhouettes.
```

#### Planche 4 : commercial et équipe (9)

```text
<bloc de style des icônes>

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a small white passenger space capsule with large round panoramic windows glowing warm | a small blue globe circled by dotted orbit rings carrying tiny satellites and three cyan signal arcs | a small grey lunar mining rover carrying a crate of glowing gold ore | a cluster of three red-tinted domes with tiny warm lights on red Martian soil.
Row 2: two stylized hands touching at the index fingertips with a cyan spark, one human-toned, the other green-violet with three long fingers, no faces or bodies | a floating golden coin-shaped trading station ringed with small docking ports | a curved mission control console desk facing a wall of dark screens showing only glowing orbit arcs | a white inflatable habitat module with an airlock, resting on grey regolith.
Row 3: a glowing violet crystal brain enclosed in a polished dark spaceship-hull capsule | Empty | Empty | Empty.
Commercial items read as customers and markets; team items as places and minds. No real people, no faces, no screens with text.
```

#### Planche 5 : programme spatial (12)

```text
<bloc de style des icônes>

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: an empty steel lattice launch tower with an umbilical arm over a concrete flame trench, no rocket | a slim white rocket booster landing upright on four deployed legs with a small flame below | a very thick, tall brushed stainless steel rocket with large grid fins near its top | a small spacecraft with a wide capture net closing around a tumbling broken satellite.
Row 2: a long electromagnetic rail ramp on grey lunar ground with glowing cyan coils and a small capsule on it | a white observatory dome firing a bright green laser beam straight up | a thin tether cable rising from a small sea platform to a counterweight station, with a climber pod halfway up | a long cargo spaceship made of stacked container modules with a bright blue fusion exhaust.
Row 3: a spider-like probe with mechanical arms 3D-printing a smaller copy of itself | a huge thin shimmering square sail with a tiny probe at its centre, pushed by a red beam | an elongated seed-pod shaped ship with glowing green windows | a glass magnetic containment bottle with metal rings holding a tiny violet-white glowing spark.
Unbranded, fictional vehicles: no flags, no agency insignia, no numbers. Clearly distinct silhouettes.
```

#### Planche 6 : événements (7)

```text
<bloc de style des icônes>

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 2 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a rocket breaking apart in a red (#ff4d6a) and orange explosion cloud | a rocket lifting off cleanly with golden (#ffd166) sparkles around its plume | two satellites colliding with sharp shards scattering, red (#ff4d6a) impact glow | a cracked fragment of grey moon rock split by glowing red (#ff4d6a) fissures.
Row 2: a bright sun disc blocking a dashed signal line between two small planets, red (#ff4d6a) warning glow | a radio dish receiving a glowing green (#3ddc84) wave pattern from above | a star bursting into a supernova with an expanding red (#ff4d6a) shock ring | Empty.
Event icons are displayed at 28 pixels: keep them extremely bold and simple, one strong shape each.
```

#### Icône de catégorie `orbit` (1)

```text
Game UI category icon, flat emblem with minimal shading, 2 to 3 colours only: cyan (#39d0ff), violet (#7c5cff) and off-white. A simple stylized rocket rising diagonally along a thin elliptical orbit line. Bold rounded shapes, clean silhouette readable at 20 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane. Match the style of the attached existing category icons.
```

Joins les 8 icônes de `public/assets/icons/categories/` comme référence.

---

## 6. Post-traitement

1. **Fonds et illustrations** : recadre au 16:9 en gardant les astres aux positions demandées,
   redimensionne en 1600×900, WebP qualité ~80 (`cwebp -q 80`, Pillow ou `sharp`). Si une image
   dépasse 250 Ko, baisse la qualité jusqu'à ~70.
2. **Icônes** : recadre en carré, objet centré, marge transparente de ~8 %, WebP avec alpha
   128×128, qualité ~85 (`cwebp -q 85 -alpha_q 100`). Cible **≤ 12 Ko** par icône.
3. Garde les PNG et planches sources dans `assets-src/` (ignoré par git).
4. Mets à jour la **planche de contrôle** `assets-src/icons-preview.png` avec les 160 icônes à 44 px
   sur fond `#121a27`, id sous chacune.

## 7. Manifeste : compléter `public/assets/manifest.json`

Ajoute les ères 7 à 12 dans `eras` **sans toucher aux ères existantes**, et une clé `victory`.
Mesure les astres **sur l'image finale**, en coordonnées normalisées : `cx` et `r` par rapport à la
largeur (1600), `cy` par rapport à la hauteur (900). Le centre peut sortir du cadre (`cy` > 1 pour
la Terre). Ces valeurs permettront au code de placer satellites, orbites, lumières lunaires et
planètes autour des astres peints.

```json
{
  "eras": {
    "7": {
      "background": "assets/eras/era-7.webp",
      "transition": "assets/transitions/era-7.webp",
      "accent": "#6ec6ff",
      "earth": { "cx": 0.294, "cy": 1.156, "r": 0.375 }
    },
    "9": {
      "background": "assets/eras/era-9.webp",
      "transition": "assets/transitions/era-9.webp",
      "accent": "#b0bec5",
      "earth": { "cx": 0.294, "cy": 1.156, "r": 0.375 },
      "moon": { "cx": 0.819, "cy": 0.278, "r": 0.075 }
    },
    "10": {
      "background": "assets/eras/era-10.webp",
      "transition": "assets/transitions/era-10.webp",
      "accent": "#ffb74d",
      "sun": { "cx": 0.5, "cy": 0.5, "r": 0.022 }
    },
    "11": {
      "background": "assets/eras/era-11.webp",
      "transition": "assets/transitions/era-11.webp",
      "accent": "#c792ff",
      "clearZone": { "x": 0.125, "y": 0.13, "w": 0.75, "h": 0.72 }
    }
  },
  "victory": "assets/transitions/victory.webp"
}
```

(Exemple partiel : l'ère 8 suit le modèle de l'ère 7, l'ère 12 celui de l'ère 11.) Chemins
**relatifs sans `/` initial** (Vite est configuré avec `base: './'`).

## 8. Critères d'acceptation

- [ ] 6 fonds (`eras/era-7.webp` à `era-12.webp`), 7 illustrations (`transitions/era-7.webp` à
      `era-12.webp` et `victory.webp`), 64 icônes (56 dans `buildings/`, 7 dans `events/`,
      `categories/orbit.webp`), noms identiques aux `id`.
- [ ] Fonds : ni vaisseau, ni satellite, ni planète en trop ; Terre au même cadrage sur les ères 7,
      8 et 9 ; aucune galaxie peinte au centre des ères 11 et 12 ; astres mesurés dans le manifeste.
- [ ] Illustrations : tiers inférieur calme (le texte s'y superpose).
- [ ] Icônes : fond réellement transparent, sans halo ; reconnaissables à 44 px (28 px pour les
      événements, 20 px pour la catégorie) ; style homogène avec les 96 icônes existantes.
- [ ] Aucun texte, chiffre, drapeau, insigne d'agence, logo de marque ni visage réaliste.
- [ ] Poids : ≤ 250 Ko par fond ou illustration, ≤ 12 Ko par icône ; `npm run build` passe ;
      aucun fichier de `src/` modifié.
- [ ] `ASSETS.md` complété : tableau des nouveaux fichiers avec leurs poids, et **les prompts
      réellement utilisés** (fonds, illustrations, planches) pour pouvoir régénérer à l'identique.

Si une image ne respecte pas un critère, **régénère-la** plutôt que de la livrer telle quelle.
