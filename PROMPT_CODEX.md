# Mission : générer les images du jeu « Uptime Inc. »

Tu travailles dans le dépôt d'**Uptime Inc.**, un idle game web (React + Vite, déployé sur GitHub Pages)
sur l'hébergement : le joueur part d'un Raspberry Pi dans son garage et bâtit un cloud planétaire,
en 6 ères successives.

Ta tâche : **générer les images listées ci-dessous** avec ton outil de génération d'images, les
optimiser et les ranger dans `public/assets/`, puis produire un fichier manifeste. **Ne modifie pas
le code du jeu** (`src/`) : l'intégration sera faite séparément.

---

## 1. Comment les images seront utilisées (important)

Les fonds d'ère servent de **décor statique**. Par-dessus, le jeu dessine en SVG/CSS les éléments
dynamiques : baies serveur qui se remplissent machine par machine, LEDs qui clignotent selon la
charge, voile rouge en surchauffe, paquets réseau animés.

Conséquences pour les fonds d'ère :

- **Pas de baies serveur remplies au premier plan ni au centre.** Le décor doit laisser une
  **zone centrale dégagée** (sol, mur ou emplacement vide bien éclairé) où le code posera les baies.
  Des équipements peuvent exister en arrière-plan ou sur les côtés, flous ou sombres.
- **Pas de texte, logo, interface, filigrane ni personnage** dans l'image.
- Contraste modéré et image plutôt sombre : l'UI du jeu (thème sombre) se superpose.

## 2. Direction artistique commune (à répéter dans CHAQUE prompt)

Pour garantir la cohérence entre les ères, chaque prompt d'image commence par ce bloc de style,
**à l'identique** :

> Stylized digital illustration for a video game background, clean semi-flat style with soft
> painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera
> angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights,
> palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff)
> accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the
> center of the frame reserved for equipment, 16:9 composition.

Palette de référence du jeu (`src/ui/styles/global.css`) : fond `#0a0e14`, panneaux `#121a27`,
accent `#39d0ff`, accent secondaire `#7c5cff`, OK `#3ddc84`, alerte `#ffb020`, erreur `#ff4d6a`,
argent `#ffd166`.

Chaque ère a une **teinte d'accent** qui doit dominer légèrement ses lumières :

| Ère | Accent |
|-----|--------|
| 1–3 | cyan `#39d0ff` |
| 4   | vert d'eau `#4dd4ac` |
| 5   | bleu clair `#8ab4ff` |
| 6   | lavande `#c792ea` |

La progression doit se sentir : **bricolé, chaleureux et encombré** (ère 1) → **industriel, propre et
immense** (ère 6).

---

## 3. Images à générer

### A. Fonds d'ère (priorité 1) : 6 images

- Génération : **1536×1024** (paysage), puis recadrage/redimensionnement en **1600×900**.
- Sortie : `public/assets/eras/era-<n>.webp` (qualité ~80, **≤ 250 Ko** chacune).

| Fichier | Ère | Scène à décrire (après le bloc de style) |
|---|---|---|
| `era-1.webp` | **Homelab** (« Garage ») | A cluttered suburban home garage at night: wooden shelves with cardboard boxes, tools on a pegboard, a bicycle and paint cans on the sides, a consumer internet router with blinking lights on a shelf, tangled power strips and cables. In the center, an empty sturdy wooden workbench lit by a hanging bulb, clear and empty, ready to hold small computers. Warm tungsten light mixed with cool cyan glow. |
| `era-2.webp` | **Placard serveur** (« Startup ») | A small converted storage closet in a startup office: a ventilation grille, a wall-mounted fiber optic box with yellow cables, a cheap air conditioner unit, cable trays on the ceiling, sticky notes and a whiteboard partly visible through the open door. In the center, an empty floor area with a bare open 19-inch rack frame (empty, no equipment). Fluorescent light, cyan accents. |
| `era-3.webp` | **Salle serveur** (« PME hébergeur ») | A proper small server room: raised perforated floor tiles, a precision air-conditioning cabinet on one side, a UPS battery cabinet on the other, overhead cable ladders, fire suppression pipes. Background racks dim and out of focus. In the center, an empty row of floor space with marked tiles, ready for racks. Cool white light with cyan accents. |
| `era-4.webp` | **Colocation** (« Cages en datacenter ») | Inside a large Tier III colocation datacenter: rows of chain-link mesh cages receding into the distance, yellow floor safety markings, overhead cable trays and busways, hot aisle containment doors. In the foreground center, an open empty cage with its mesh door ajar, floor clear. Teal-green (#4dd4ac) accent lighting. |
| `era-5.webp` | **Datacenter régional** (« Votre propre DC ») | Exterior-interior cutaway feel of a huge modern datacenter hall: very long clean white aisles, massive cooling units, glimpse through tall windows of diesel generators and free-cooling towers outside under a night sky. Center foreground: wide empty polished floor reserved for new rows. Light blue (#8ab4ff) accents. |
| `era-6.webp` | **Hyperscale mondial** (« Cloud planétaire ») | A futuristic hyperscale control vista: a vast datacenter campus seen from a high glass gallery, and beyond it a stylized night view of the Earth's curvature with glowing submarine cable lines and region nodes connecting continents. Center: an empty illuminated platform in the foreground. Lavender (#c792ea) and violet accents, epic scale. |

### B. Illustrations de transition d'ère (priorité 2) : 5 images

Affichées en plein écran lors du déménagement vers l'ère suivante (« Vous déménagez dans… »).
Ici, **des équipements et une mise en scène sont autorisés**. La zone centrale vide n'est plus
requise, mais il faut toujours **ni texte ni personnage reconnaissable**.

- Génération : 1536×1024, sortie **1600×900**, `public/assets/transitions/era-<n>.webp` pour n = 2…6
  (**≤ 250 Ko**).
- Même bloc de style (sans la phrase « empty well-lit space in the center… »), plus :
  - `era-2` : a moving van being loaded with a few small servers in front of a small office building at dawn.
  - `era-3` : a pallet of new rack servers being rolled into a server room through double doors.
  - `era-4` : a truck delivering full racks at the loading dock of a large colocation datacenter.
  - `era-5` : a brand-new datacenter building at sunrise, with generators and cooling towers, construction cranes leaving.
  - `era-6` : the Earth from orbit at night, glowing network links and datacenter campuses lighting up across continents.

### C. Identité (priorité 3)

| Fichier | Taille | Description |
|---|---|---|
| `public/assets/brand/logo.png` | 1024×1024, **fond transparent** | Emblem logo for a hosting company called Uptime Inc.: a stylized server rack combined with an upward pulse/heartbeat line, flat vector style, cyan #39d0ff and violet #7c5cff on transparent background, no text. |
| `public/assets/brand/logo.webp` | 512×512 | Version optimisée de l'image ci-dessus. |
| `public/favicon.png` | 64×64 | Réduction du logo, lisible à petite taille (simplifier si nécessaire). |
| `public/apple-touch-icon.png` | 180×180 | Logo sur fond `#0a0e14`. |

---

## 4. Post-traitement

1. Recadre au **16:9** en centrant la zone vide, puis redimensionne (1600×900).
2. Convertis en WebP qualité ~80 (`cwebp -q 80`, ou Pillow / `sharp` selon ce qui est disponible).
   Si une image dépasse 250 Ko, baisse la qualité jusqu'à ~70.
3. Garde les PNG sources **hors du dépôt** (ou dans un dossier ignoré, ex. `assets-src/` ajouté au
   `.gitignore`) : seuls les fichiers optimisés vont dans `public/`.

## 5. Manifeste à produire : `public/assets/manifest.json`

Pour chaque fond d'ère, **regarde l'image finale** et indique la zone vide où le code posera les
baies, en coordonnées **normalisées (0–1)** par rapport à l'image 1600×900, ainsi que la ligne de sol
(y où les baies « touchent » le sol) :

```json
{
  "eras": {
    "1": {
      "background": "assets/eras/era-1.webp",
      "transition": null,
      "rackZone": { "x": 0.30, "y": 0.35, "w": 0.40, "h": 0.40 },
      "floorY": 0.75,
      "accent": "#39d0ff"
    }
  },
  "brand": {
    "logo": "assets/brand/logo.webp",
    "favicon": "favicon.png",
    "appleTouchIcon": "apple-touch-icon.png"
  }
}
```

Chemins **relatifs sans `/` initial** : Vite est configuré avec `base: './'` (déploiement GitHub
Pages dans un sous-dossier).

## 6. Critères d'acceptation

- [ ] 6 fonds d'ère + 5 transitions + logo/favicons présents aux chemins indiqués.
- [ ] Style visiblement cohérent d'une ère à l'autre (même angle, même rendu, même palette de base).
- [ ] Aucun texte, logo de marque réelle, filigrane ni personnage dans les images.
- [ ] Zone centrale réellement vide sur les fonds d'ère, et correctement décrite dans le manifeste.
- [ ] Chaque WebP ≤ 250 Ko ; poids total de `public/assets/` ≤ 3 Mo.
- [ ] `npm run build` passe toujours, et aucun fichier de `src/` n'est modifié.
- [ ] Un court récapitulatif à la fin : liste des fichiers, poids, et prompts finaux réellement utilisés
      (pour pouvoir régénérer une image à l'identique plus tard).

Si une image ne respecte pas un critère (texte parasite, zone centrale encombrée, style divergent),
**régénère-la** plutôt que de la livrer telle quelle.
