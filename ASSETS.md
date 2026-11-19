# Ressources visuelles d’Uptime Inc.

Les six fonds, les cinq transitions et le logo ont été générés avec l’outil intégré ImageGen. Le générateur a livré les paysages en 1672 × 941 malgré la demande de 1536 × 1024. Les images finales ont été ajustées en 1600 × 900 et encodées en WebP qualité 80. Le logo a été généré en 1254 × 1254, puis réduit en 1024 × 1024 pour le PNG final. Les PNG intermédiaires sont conservés hors du dépôt.

Pour la première livraison, les ressources d’ère et de marque dans `public/assets/` pèsent 1 439 793 octets, manifeste inclus. Avec les deux icônes de marque dans `public/`, le total est de 1 457 479 octets.

| Fichier | Octets |
| --- | ---: |
| `public/apple-touch-icon.png` | 13 778 |
| `public/assets/brand/logo.png` | 311 335 |
| `public/assets/brand/logo.webp` | 28 206 |
| `public/assets/eras/era-1.webp` | 123 380 |
| `public/assets/eras/era-2.webp` | 57 290 |
| `public/assets/eras/era-3.webp` | 79 252 |
| `public/assets/eras/era-4.webp` | 122 892 |
| `public/assets/eras/era-5.webp` | 79 870 |
| `public/assets/eras/era-6.webp` | 88 452 |
| `public/assets/manifest.json` | 1 752 |
| `public/assets/transitions/era-2.webp` | 105 028 |
| `public/assets/transitions/era-3.webp` | 73 718 |
| `public/assets/transitions/era-4.webp` | 126 426 |
| `public/assets/transitions/era-5.webp` | 115 140 |
| `public/assets/transitions/era-6.webp` | 127 052 |
| `public/favicon.png` | 3 908 |

Dans le manifeste, `floorY` place les machines sur l’établi à l’ère 1, sur la base du cadre vide à l’ère 2 et sur le sol ou la plateforme à partir de l’ère 3. Les coordonnées sont normalisées par rapport aux WebP livrés.

## Prompts envoyés à ImageGen pour les images retenues

Les variantes du logo et les deux icônes dérivent de la même génération.

### `eras/era-1.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the center of the frame reserved for equipment, 16:9 composition.

A cluttered suburban home garage at night: wooden shelves with cardboard boxes, tools on a pegboard, a bicycle and paint cans on the sides, a consumer internet router with blinking lights on a shelf, tangled power strips and cables. In the center, an empty sturdy wooden workbench lit by a hanging bulb, clear and empty, ready to hold small computers. Warm tungsten light mixed with cool cyan glow.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. Empty tabletop must be broad, front-facing and unobstructed; equipment will be overlaid by the game. Moderate contrast, no written marks anywhere.
```

### `eras/era-2.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the center of the frame reserved for equipment, 16:9 composition.

A small converted storage closet in a startup office, with matte dark-painted drywall, a low drop ceiling, a side ventilation grille, a wall-mounted fiber optic box with yellow cables, a cheap air conditioner unit and cable trays overhead. At one side, glimpse a modern office through an open door, with a completely blank whiteboard and unwritten sticky notes. The center is an empty floor area occupied only by a single bare, open 19-inch black rack frame with no equipment, no doors, no shelves and a broad unbroken view of the blank wall through it. A few plain office archive boxes to the side. Cool fluorescent light, cyan accents.
Generate one landscape image at 1536x1024. Keep essential content within the central 16:9 crop. Render the rack and floor from eye level. This is a modest office closet with a washable tile floor and drywall. No bicycle, workshop tools, timber rafters or household objects. Moderate contrast, matte illustration, no written marks, logos or people.
```

### `eras/era-3.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the center of the frame reserved for equipment, 16:9 composition.

A proper small server room: raised perforated floor tiles, a precision air-conditioning cabinet at the far left, a UPS battery cabinet at the far right, overhead cable ladders and fire suppression pipes. Several dim background racks are recessed in the extreme sides. The broad center is an empty row of floor space with some marked tiles, ready for racks. Cool white lighting and cyan accents.
Generate one landscape image at 1536x1024. Keep essential content within the central 16:9 crop. Eye-level view with a low detail central backdrop and unobstructed floor in the middle half of the scene for the game's future rack silhouettes. Deep navy midtones, matte painted detail and moderate contrast. No labels, pictograms, or people.
```

### `eras/era-4.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the center of the frame reserved for equipment, 16:9 composition.

Inside a large Tier III colocation datacenter: rows of chain-link mesh cages receding into the distance at both edges, yellow floor safety markings, overhead cable trays and busways, hot aisle containment doors. In the foreground center, an open empty cage with its mesh door swung ajar fully to one edge, floor clear. Teal-green (#4dd4ac) accent lighting.
Generate one landscape image at 1536x1024. Keep essential content within the central 16:9 crop. Broad empty unobstructed cage interior flanked by mesh, with no cage mesh or equipment across the front opening. Eye-level camera, muted teal over deep navy, moderate contrast and matte painterly finish. No labels or people.
```

### `eras/era-5.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the center of the frame reserved for equipment, 16:9 composition.

Exterior-interior cutaway feel of a huge modern datacenter hall: very long clean white aisles, massive cooling units to the sides, glimpse through tall windows of diesel generators and free-cooling towers outside under a night sky. Center foreground: wide empty polished floor reserved for new rows. Light blue (#8ab4ff) accents.
Generate one landscape image at 1536x1024. Keep essential content within the central 16:9 crop. Eye-level gallery-like view, large industrial scale, open central platform of uninterrupted floor in the foreground. Keep the background cool, dark and moderately contrasted despite the pale architecture. No labels, pictograms, interfaces or people.
```

### `eras/era-6.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, empty well-lit space in the center of the frame reserved for equipment, 16:9 composition.

A futuristic hyperscale control vista: a vast datacenter campus seen from a high glass gallery, and beyond it a stylized night view of the Earth's curvature with glowing submarine cable lines and region nodes connecting continents. Center: an empty illuminated platform in the foreground. Lavender (#c792ea) and violet accents, epic scale.
Generate one landscape image at 1536x1024. Keep essential content within the central 16:9 crop. The low-detail matte platform occupies the entire lower third and has enough width and depth to put server racks on it later. Put the Earth and subtle network lights in the upper half, architecturally framed, with no rails or interface in front of the platform. Moderate contrast, no labels, no people.
```

### `transitions/era-2.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition.

A moving van being loaded with a few small servers in front of a modest startup office building at dawn. The open van and portable loading ramp show compact servers midway to the cargo bay, with the move conveyed through staging alone. Navy shadows, cyan highlights, restrained dawn glow. Use dark reflective office windows so no screens, whiteboards or interiors are visible. Keep every van panel and case blank, plates out of view, with no badges or markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Full-screen era transition for the hosting game Uptime Inc., with cinematic depth, clear silhouettes and moderate contrast. All surfaces and equipment are unbranded and unlabeled. No visible people.
```

### `transitions/era-3.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition.

A low pallet of boxed and unboxed new rack servers on a small wheeled pallet jack being rolled into a professional server room through wide-open double doors, viewed diagonally from the entrance. One stack is the focal point. Raised metal tiles and dim server racks frame the room in the distance. Cool white and cyan accent lights. Closed cases and all walls are plain and blank.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Full-screen era transition for the hosting game Uptime Inc., with cinematic depth, clear silhouettes and moderate contrast. All surfaces and equipment are unbranded and unlabeled. No visible people.
```

### `transitions/era-4.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition.

A full-size unbranded freight truck delivering full-height loaded server racks at a large Tier III colocation datacenter's loading dock, seen from a slightly elevated eye-level three-quarter front viewpoint. The trailer and dock open onto tall cabinets secured upright on transport skids, with orderly industrial dock architecture and simple yellow safety stripes. Teal-green (#4dd4ac) lighting and navy shadows at dusk. No plates, signs, lettering, or decals.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Full-screen era transition for the hosting game Uptime Inc., with cinematic depth, clear silhouettes and moderate contrast. All surfaces and equipment are unbranded and unlabeled. No visible people.
```

### `transitions/era-5.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition.

A brand-new modern datacenter building at sunrise, seen from the site entrance in a wide three-quarter view. New generator units and air-cooling towers flank the large white-and-navy industrial hall, and distant mobile construction cranes with lowered booms are departing on the access road. Light blue (#8ab4ff) site accents, subtle warm sunrise against deep cool shadows. Bare facade and completely blank, unmarked equipment and vehicles.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Full-screen era transition for the hosting game Uptime Inc., with cinematic depth, clear silhouettes and moderate contrast. All surfaces and equipment are unbranded and unlabeled. No visible people.
```

### `transitions/era-6.webp`

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, slightly isometric three-quarter front view from eye level, consistent camera angle, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by deep navy (#0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition.

The Earth seen from orbit at night, filling most of the image with its curved atmospheric rim across the upper third. Distinct continental coastlines and a handful of bright datacenter campuses glow across their dark landmasses; fine sweeping intercontinental fiber routes connect their subtle lavender (#c792ea), violet and cyan nodes. Deep-blue oceans, faint clouds, restrained star field. Orbital point of view appropriate to this scene. Clean painted game illustration with no legend, chart framing, text or overlays apart from the network links.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Full-screen era transition for the hosting game Uptime Inc., with cinematic depth, clear silhouettes and moderate contrast. All surfaces and equipment are unbranded and unlabeled. No visible people.
```

### `brand/logo.png`

```text
Use case: logo-brand. Generate a square 1024×1024 flat two-color icon on a genuine transparent RGBA background, centered with generous margins. For the hosting game Uptime Inc., create a crisp silhouette of a cyan (#39d0ff) open rectangular server rack with two cyan horizontal rack units evenly spaced inside, paired with one distinct violet (#7c5cff) bold ascending heartbeat stroke with an arrow tip. Keep the negative spaces broad, smooth and actually empty. Use the full, solid two colors, with bold rounded outlines and completely untextured color fills. Treat this like a high quality exported vector pictogram with few clean geometric forms, suitable as a 64 pixel favicon. Clean binary alpha silhouette with antialiasing limited to the edges, no debris or glow whatsoever, no gradient, no shadows, no backing tile, no letters or numbers.
```

## Icônes

Les 96 icônes ont été générées avec l’outil intégré ImageGen, sur dix planches RGBA de 4 colonnes et 3 ou 4 rangées. L’outil a livré des planches en 1254 × 1254 malgré la demande de 1024 × 1024. Chaque objet a été recadré autour de sa silhouette alpha, centré avec une marge d’environ 8 %, puis exporté en WebP de 128 × 128 avec transparence, qualité cible 85. La première planche commerciale a été écartée suite au contrôle des halos. La version retenue utilise la planche Réseau comme référence de rendu et de découpe.

Les planches sources et la [planche de contrôle](assets-src/icons-preview.png) restent dans le dossier local ignoré `assets-src/`. La planche de contrôle montre les 96 icônes à 44 px sur `#121a27` avec leurs identifiants. Les catégories et les événements ont également été inspectés à leurs tailles d’affichage de 20 et 28 px.

| Dossier sous `public/assets/icons/` | Icônes | Octets |
| --- | ---: | ---: |
| `buildings/` | 76 | 302 416 |
| `events/` | 12 | 47 726 |
| `categories/` | 8 | 26 092 |
| Total | 96 | 376 234 |

L’icône la plus lourde pèse 8 178 octets.

### Prompts des dix planches retenues

#### Serveurs

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 4 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: small exposed green hobby computer board with a black chip and silver sockets | cream vintage desktop PC tower with horizontal disk slot and round power button | compact square charcoal mini PC puck with rounded corners and one LED | tall black modern server tower with four chunky silver hot-swap drive bays.
Row 2: one extremely thin wide black 1U rack server tray with two ends and one cyan slot | a single much thicker wide dark blue 2U server with two large circular vent groups | wide cube shaped blade chassis with numerous tall thin vertical purple slots | tall broad dark open server rack packed with horizontally stacked cyan lit modules.
Row 3: tall narrow olive black low power rack, banks of small square modules with green LEDs | one squat thick black compute node dominated by three large round purple fans | three uniformly sized cyan edged GPU cabinets tightly joined onto one shared housing | large low wide hexagonal dark compute array with a bright violet central core.
Row 4: suspended gold cylindrical quantum computer with layered discs and no stand | compact dark orbital data station with a central server cube and two blue solar wings | Empty | Empty.
Keep hardware silhouettes deliberately different even in monochrome. These are collectible item cutouts for a dark navy datacenter game with painted materials, deep navy shadows, and crisp cyan edges. Do not put separate symbols next to the objects.
```

#### Stockage

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: one flat portable silver external hard drive with a subtle circular spinning-platter impression and short integral connector | one compact black desktop NAS cube with four prominent vertical violet drive trays | one wide beige-grey rackmount disk array with three rows of chunky hot-swap handles | one large deep charcoal fibre storage cabinet with twin violet fibre patch blocks on its face.
Row 2: one thin graphite flash storage array with a neat row of tiny narrow cyan-lit slots | one fused cluster pictogram formed by three bright blue data cylinders tightly joined as one object | one upright laboratory sample vial with a purple DNA helix visible through blue glass | Empty.
Row 3: Empty | Empty | Empty | Empty.
Focus on the different heights, proportions and front panel patterns. Leave the bottom row entirely empty; the two active rows still sit at the first and second row centers of the four-column three-row grid.
```

#### Réseau

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: beige vintage wedge shaped telephone modem with a short integral coiled copper DSL cable and amber LEDs, no antenna | upright charcoal broadband router with two vertical antenna rods and green LEDs | small white square wall mounted optical terminal with a bent yellow fibre pigtail and cyan socket | slim wide dark metal Ethernet switch with a single row of RJ45 ports and cyan LEDs.
Row 2: single chunky professional blue duplex fibre connector with two bright cylindrical tips | thick purple graphite carrier router with multiple large grouped ports and an abstract triangular group of three blue LEDs | dense silver network patch panel with two rows of large violet and yellow optical sockets | single floating cyan cloud emblem with three short navy cache slots recessed across its front.
Row 3: a coiled braided violet and cyan fibre trunk with one large exposed multi-fibre connector | thick dark ocean cable segment with a cross section showing concentric yellow armouring and a cyan optical core | small low-orbit optical relay satellite, shallow indigo dish with a short bright violet beam and no solar wings | Empty.
Use clearly differentiated silhouettes and one solid item per cell. The early access icons must read as beige sloped modem, tall black antenna router, and white optical wall terminal, respectively.
```

#### Électricité

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: single off white European recessed electrical wall socket plate, circular socket centered | small upright graphite battery backup box with a violet battery motif etched on the front and one cyan light | compact white breaker module with one chunky red toggle and copper screw terminals | wide grey three-phase breaker module with three chunky linked violet toggles.
Row 2: one tilted rectangular dark-blue solar panel framed by aluminium, no pole and no separate stand | large dark ribbed electrical transformer with three ceramic insulator caps mounted directly on top | single mustard yellow enclosed industrial diesel generator with bold black louvres and a dark skid | compact industrial electrical substation switching gantry with pale ceramic insulators and a dark steel frame fused to one assembly.
Row 3: compact miniature photovoltaic array of three blue panel rows joined by an unobtrusive navy mounting rail, no ground | one compact small modular reactor vessel, white industrial cylinder with a domed steel cap and amber trim, no symbols | single donut-shaped metallic futuristic fusion reactor with a bright violet plasma ring, cyan piping fixed to its shell | Empty.
Use the same moderately shaded dark metal and cyan edge light as the server equipment. Solar panel is a single rectangle; the farm is a low, distinct terraced array. These are fictional game item cutouts.
```

#### Refroidissement

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: small freestanding desk fan with a bold visible three blade blue rotor inside a round dark grille | tall narrow cream portable air conditioner with a short ribbed flexible exhaust hose attached at the side | slim white wall-mounted split air conditioning unit with one long open cyan louvre, only the indoor unit | tall floorstanding blue grey industrial precision cooling cabinet with deep dark vents and violet trim.
Row 2: wide industrial dry cooler with two large cyan axial fan circles visible on top, a grey radiator frame | single square copper cold plate with two short cyan coolant tubes attached like a loop | rugged open rectangular immersion cooling tank with blue liquid and two small server blades visible inside, contained to its silhouette | single squat marine pump with an exposed blue impeller intake, curved navy pipe and a small cyan accent.
Row 3: Empty | Empty | Empty | Empty.
Feature straightforward shapes with no ambient effects. Keep steam, loose droplets, and bubble particles inside their associated object; no floor or disconnected objects. Leave the last row blank.
```

#### Espace

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: one empty light brown wooden utility shelving unit with three shelves in a thin dark metal frame | one completely empty tall black rectangular open server rack frame, hollow see-through center, with cyan front edges | one long connected row of four dark server cabinets of alternating cyan front details, receding diagonally, no ground slab | one square industrial mesh server cage enclosure, open mesh door and transparent empty interior, subtle teal trim, no surrounding room.
Row 2: one clean white industrial data hall module with a removable wall visually exposing a small white raised floor within its silhouette | one compact architectural massing model of three large connected navy data center buildings with blue roofs and pale blue rim lights, joined by a central connector, no landscape | Empty | Empty.
Row 3: Empty | Empty | Empty | Empty.
Treat the large buildings as simple isolated architectural objects at the same angle as the hardware icons. Avoid scenic tiles, terrain, roads, and separate props. The blank cells must stay empty.
```

#### Commercial

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: single handheld navy megaphone with a wide cyan metallic rim and violet grip | one simple violet speech bubble emblem containing two small cyan circular recesses, no letters or writing | single tilted cyan-rimmed magnifying glass with a clear blue lens and a subtle violet handle | one compact closed caramel leather sales briefcase with two dark clasps and a cyan rim light.
Row 2: one stylized handshake emblem formed by two joined simplified blue and purple hands in cuffs | single closed navy contract folder with a small octagonal gold seal attached, no paper visible and absolutely no writing | one small violet and navy storefront icon with a bright cyan striped awning and a plain window, no sign | one compact exhibition booth with three walls, cyan header rail and violet demo counter, no sign or text.
Row 3: one heraldic metallic shield with a raised cyan cloud symbol and narrow gold edging | one dark square microchip carrying a bold embossed cyan brain shape and violet connector pins | one glossy dark blue terrestrial globe encircled by a single thick sweeping gold broadcast ring | one stylized burnt orange Mars sphere encircled by a single cyan orbital ring with an embedded satellite silhouette.
Bold easily understood metaphor icons, made from the same materials and light as the equipment. The alpha matte must be exactly zero next to all silhouettes and all the way across the gutters. Cut out every shape crisply like a transparent hardware sticker. Absolutely no cast shadow, glow outside its silhouette, fog, blur, haze, white lift, scenery, or visible floor. Keep all highlights confined to each solid object. Reduce the size of every object slightly to create visibly wide and completely clear gutters between all objects. In the last row make the Earth vivid blue and the Mars planet strongly orange. All props are physically integrated into their respective icons. No characters, readable markings, or fonts.
Image 1 is only a reference for rendering and the clean separate alpha cutouts. Follow exactly the three rows of new commercial icons described in the text.
```

#### Équipe

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: single warm ivory coffee mug with a tiny attached blank violet visitor tag hanging directly from its handle | one dark compact computer keyboard with a large tilted silver wrench clipped directly across a corner, blank keys | one small laboratory microscope in violet and brushed metal, with a cyan lens accent | one bold three-dimensional cyan and violet infinity loop made of two broad arrows, continuous fused symbol of automation.
Row 2: one rounded sturdy blue shield with one bold bright cyan heartbeat waveform engraved in its center | one sturdy rack of three glass test tubes with teal, blue and violet fluids placed in a shared dark holder | one small stylized dark datacenter automation robot head with a cyan visor and two square lights, no human face | Empty.
Row 3: Empty | Empty | Empty | Empty.
Maintain distinct readable silhouettes. No detailed figures, real people, or writing on the badge or keyboard. Hold the alpha cutouts close to the objects: no glow, shadow, fog, or haze in transparent gutters. Last row completely blank.
```

#### Événements

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: NEGATIVE: broken exposed dark hard drive with a strongly visible jagged red crack across its single platter | NEGATIVE: one chunky disconnected power plug with bent prongs and red insulation, no cable trails or separate objects | NEGATIVE: one stout red thermometer with high red fluid and bold round bulb, no scale markings or figures | POSITIVE: one stylized emerald green speech bubble with a thick rising green and gold burst embossed inside.
Row 2: NEGATIVE: compact emblem of three red glowing bot heads directly joined as one cluster, dark graphite cases, evil abstract red rectangular visors | NEGATIVE: one white cooling vent with a single big red-edged blue droplet physically attached underneath | NEGATIVE: one wide red rising arrow combined as a single silhouette with a bright amber lightning bolt at the bottom | POSITIVE: one gold stack of plain blank coins with a distinct emerald green upright coin at the front, no currency markings.
Row 3: POSITIVE: one green and dark navy shopping bag with a big gold price tag attached, blank tag and bag | POSITIVE: one green metallic security shield with a thick lime checkmark embossed on the front | NEGATIVE: one orange excavator bucket with a short red severed fiber cable caught under its teeth, fixed together as a single silhouette | NEGATIVE: one dark red-orange sun disc with a thick bright red curved flare breaking out from a single edge.
Red #ff4d6a dominates every negative icon. Green #3ddc84 or gold #ffd166 dominates each positive icon. Slightly simplify silhouettes to read at 28 pixels. No loose particles. Keep all glows inside the opaque silhouette. Fully clear zero-alpha gutters around each icon, no glow, cast shadow or haze outside the object.
```

#### Catégories

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a cyan wide front facing single server tray with two obvious small violet LEDs, thick and rounded silhouette | a short violet cylindrical database stack with two thick cyan bands, clear round top | a triangular cluster of three bright cyan round nodes connected by thick violet lines | one bold angular gold lightning bolt with a subtle bright cyan edge.
Row 2: one simple thick light-blue six arm snowflake emblem, plain hollow gaps between branches | a cyan outline of an empty tall server rack with two thick corner posts, front view, empty interior | one gold ascending three bar chart with a thick violet upwards arrow visually merged with the bars | one cyan and violet team pictogram with two rounded generic profile silhouettes, no facial features.
Row 3: Empty | Empty | Empty | Empty.
These eight sub-tab icons must remain recognizable at 20 pixels. Use almost flat graphic symbols with thick simple geometry, two or three solid colors, restrained bevel and minimal shading. No tile, plaque, medallion, glow, outline box, cast shadow, or haze surrounding any icon. Leave the last row entirely empty and truly transparent.
```

## Conquête spatiale

Les 77 nouvelles images générées avec ImageGen occupent 1 229 108 octets. Les six fonds et les sept illustrations plein écran ont été recadrés en 1600 × 900. Les six planches et le pictogramme Spatial ont fourni 64 icônes WebP de 128 × 128 avec transparence et une marge d’environ 8 %. Les PNG sources sont conservés dans `assets-src/space/`. La planche de contrôle réunit les 160 icônes à 44 px dans `assets-src/icons-preview.png`.

La Terre conserve le même cadrage aux ères 7 à 9. Les coordonnées du manifeste proviennent de mesures sur les WebP finaux. Le rayon de la Terre a été estimé à partir de l’arc atmosphérique visible. Le fond de l’ère 10 a été recadré autour du disque solaire.

| Fichier | Octets |
| --- | ---: |
| `public/assets/eras/era-10.webp` | 20 036 |
| `public/assets/eras/era-11.webp` | 30 496 |
| `public/assets/eras/era-12.webp` | 47 772 |
| `public/assets/eras/era-7.webp` | 35 126 |
| `public/assets/eras/era-8.webp` | 41 018 |
| `public/assets/eras/era-9.webp` | 46 472 |
| `public/assets/icons/buildings/antimatter.webp` | 4 848 |
| `public/assets/icons/buildings/asteroidcore.webp` | 5 858 |
| `public/assets/icons/buildings/blackholecpu.webp` | 6 648 |
| `public/assets/icons/buildings/cmb.webp` | 6 684 |
| `public/assets/icons/buildings/crystal5d.webp` | 6 764 |
| `public/assets/icons/buildings/debristug.webp` | 8 360 |
| `public/assets/icons/buildings/deepnet.webp` | 7 056 |
| `public/assets/icons/buildings/degenerate.webp` | 8 116 |
| `public/assets/icons/buildings/deorbitlaser.webp` | 3 534 |
| `public/assets/icons/buildings/droplet.webp` | 5 774 |
| `public/assets/icons/buildings/dysonsphere.webp` | 6 222 |
| `public/assets/icons/buildings/dysonswarm.webp` | 10 370 |
| `public/assets/icons/buildings/elevator.webp` | 3 106 |
| `public/assets/icons/buildings/europa.webp` | 6 548 |
| `public/assets/icons/buildings/firstcontact.webp` | 4 332 |
| `public/assets/icons/buildings/fusionfreighter.webp` | 4 260 |
| `public/assets/icons/buildings/galacticmarket.webp` | 6 310 |
| `public/assets/icons/buildings/galacticnet.webp` | 6 616 |
| `public/assets/icons/buildings/geostation.webp` | 7 642 |
| `public/assets/icons/buildings/he3.webp` | 5 624 |
| `public/assets/icons/buildings/heatpipes.webp` | 5 704 |
| `public/assets/icons/buildings/holohorizon.webp` | 6 852 |
| `public/assets/icons/buildings/kaground.webp` | 5 896 |
| `public/assets/icons/buildings/l2hub.webp` | 5 730 |
| `public/assets/icons/buildings/lasersail.webp` | 6 358 |
| `public/assets/icons/buildings/launchpad.webp` | 5 898 |
| `public/assets/icons/buildings/lavatube.webp` | 5 824 |
| `public/assets/icons/buildings/leoarchive.webp` | 6 018 |
| `public/assets/icons/buildings/lunareco.webp` | 5 518 |
| `public/assets/icons/buildings/lunarrelay.webp` | 6 200 |
| `public/assets/icons/buildings/lunarvault.webp` | 6 944 |
| `public/assets/icons/buildings/marscolonies.webp` | 4 960 |
| `public/assets/icons/buildings/marsdc.webp` | 5 508 |
| `public/assets/icons/buildings/massdriver.webp` | 5 840 |
| `public/assets/icons/buildings/matrioshka.webp` | 7 152 |
| `public/assets/icons/buildings/mercuryring.webp` | 6 904 |
| `public/assets/icons/buildings/missioncontrol.webp` | 5 310 |
| `public/assets/icons/buildings/moonbase.webp` | 5 452 |
| `public/assets/icons/buildings/neutroncore.webp` | 4 466 |
| `public/assets/icons/buildings/oortcloud.webp` | 11 650 |
| `public/assets/icons/buildings/optsat.webp` | 5 186 |
| `public/assets/icons/buildings/orbitalsolar.webp` | 6 058 |
| `public/assets/icons/buildings/orbmodule.webp` | 5 212 |
| `public/assets/icons/buildings/polarcrater.webp` | 6 006 |
| `public/assets/icons/buildings/reusable.webp` | 2 988 |
| `public/assets/icons/buildings/satinternet.webp` | 8 614 |
| `public/assets/icons/buildings/sbsp.webp` | 5 026 |
| `public/assets/icons/buildings/seedship.webp` | 4 412 |
| `public/assets/icons/buildings/shipmind.webp` | 5 250 |
| `public/assets/icons/buildings/spacetourism.webp` | 6 136 |
| `public/assets/icons/buildings/stellarnode.webp` | 5 836 |
| `public/assets/icons/buildings/superheavy.webp` | 3 408 |
| `public/assets/icons/buildings/swarm.webp` | 9 004 |
| `public/assets/icons/buildings/titancryo.webp` | 5 588 |
| `public/assets/icons/buildings/vonneumann.webp` | 7 376 |
| `public/assets/icons/buildings/wormhole.webp` | 5 950 |
| `public/assets/icons/categories/orbit.webp` | 5 696 |
| `public/assets/icons/events/conjunction.webp` | 4 592 |
| `public/assets/icons/events/kessler.webp` | 6 602 |
| `public/assets/icons/events/launchfail.webp` | 8 274 |
| `public/assets/icons/events/launchwindow.webp` | 5 414 |
| `public/assets/icons/events/moonquake.webp` | 6 286 |
| `public/assets/icons/events/supernova.webp` | 6 612 |
| `public/assets/icons/events/xenosignal.webp` | 5 630 |
| `public/assets/transitions/era-10.webp` | 68 778 |
| `public/assets/transitions/era-11.webp` | 63 502 |
| `public/assets/transitions/era-12.webp` | 80 168 |
| `public/assets/transitions/era-7.webp` | 80 250 |
| `public/assets/transitions/era-8.webp` | 82 012 |
| `public/assets/transitions/era-9.webp` | 107 128 |
| `public/assets/transitions/victory.webp` | 136 338 |

### Prompts envoyés à ImageGen

#### background-7-reference

Références fournies dans l’ordre. `public/assets/eras/era-6.webp`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

Low Earth orbit viewpoint at the edge of night and day. A huge Earth curve fills the lower-left of the frame: only the upper arc of the planet is visible, its highest point at mid-height slightly left of centre, the arc running down to the bottom edge around two thirds of the width. Deep blue oceans, soft white cloud bands, a few warm city light clusters on the night side, and a thin glowing cyan-blue atmospheric rim. Above the horizon: a calm black sky with a fine, sparse star field and a very faint violet airglow. The upper half and the right side stay dark, empty and uncluttered. Sky blue (#6ec6ff) accent lighting.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No spacecraft, satellites, debris, rockets, Moon or Sun disc in view. Moderate contrast, matte painterly finish, no written marks.

Use the attached existing game background as a painting and palette reference only, with the outer-space subject specified above. In the final 16:9 crop, keep the apex of Earth's arc at roughly (29%, 49%) from the top left. Earth's visible limb must cross the left edge and the bottom edge, with no second arc.
```

#### `eras/era-7.webp`

Références fournies dans l’ordre. `assets-src/space/background-7-reference.png`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

Low Earth orbit viewpoint at the edge of night and day. A huge Earth curve fills the lower-left of the frame: only the upper arc of the planet is visible, its highest point at mid-height slightly left of centre, the arc running down to the bottom edge around two thirds of the width. Deep blue oceans, soft white cloud bands, a few warm city light clusters on the night side, and a thin glowing cyan-blue atmospheric rim. Above the horizon: a calm black sky with a fine, sparse star field and a very faint violet airglow. The upper half and the right side stay dark, empty and uncluttered. Sky blue (#6ec6ff) accent lighting.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No spacecraft, satellites, debris, rockets, Moon or Sun disc in view. Moderate contrast, matte painterly finish, no written marks.

Use the reference as the art and surface-texture reference. Reframe for a smaller, much more strongly curved Earth, while keeping its apex around halfway down the screen. On the final canvas, treat its diameter as three quarters of the canvas width. The center of the circular silhouette is at (29.4% of width, 115.6% of height), just below the bottom; the apex is at (29.4% of width, 48.9% of height). The arc must cross the left edge at 74% of canvas height and the bottom edge at 66% of canvas width. The right third of the image is entirely dark sparse sky (including the bottom right). The bottom left is also dark sky up to the limb intersecting the left edge. Match this circular silhouette closely. Wide 16:9.
```

#### `eras/era-8.webp`

Références fournies dans l’ordre. `assets-src/space/background-7.png`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

The same Earth framing as the reference image: the upper arc of the planet in the lower-left, highest point at mid-height slightly left of centre. Now mostly on the night side: dense networks of warm city lights across the continents, a brighter cyan atmospheric rim, and a faint violet aurora near the horizon. High above the planet, a very subtle, wide, pale band of scattered light suggests the busy geostationary belt, without any visible object. Black sky with a fine star field, upper half and right side calm and empty. Sky blue (#6ec6ff) and violet (#9575ff) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. Match the camera, horizon position and Earth size of the reference image exactly. No spacecraft, satellites, debris or rockets. Moderate contrast, no written marks.

The attached era 7 image is the composition reference. Keep the same exact outline and position of the Earth's atmospheric rim, matching its pixel silhouette throughout. Keep the image in the same wide aspect ratio. Make the violet aurora faint and close to the limb.

The Earth in the reference is strongly curved and sits primarily in the bottom left. Preserve its position and exact bright atmospheric limb along the entire visible contour. Its highest point is just below the halfway line and its rim exits the bottom edge at about 61% of the canvas width. Treat the reference as the actual canvas for an edit, with the same camera and crop. Make city lights denser and dim the continents, while retaining details.
```

#### `eras/era-9.webp`

Références fournies dans l’ordre. `assets-src/space/background-7.png`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

The same Earth framing as the reference image: the upper arc of the planet in the lower-left, highest point at mid-height slightly left of centre, daylight side with blue oceans and white clouds. In the upper-right, the full Moon as a crisp grey disc about one sixth of the image height wide, with clearly readable maria and a few large craters, lit from the left, its south polar region slightly shadowed. A faint silvery haze between the Earth and the Moon. Black sky with a fine star field; the space between the two bodies stays dark and empty. Silver-grey (#b0bec5) and cyan accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. Match the camera, horizon position and Earth size of the reference image. No bases, domes, lights or structures on the Moon, no spacecraft. Moderate contrast, no written marks.

The attached era 7 image is the composition reference. Keep the same exact outline and position of the Earth's atmospheric rim, matching its pixel silhouette throughout. Keep the image in the same wide aspect ratio. In the final crop put the Moon's center 82% from the left and 28% from the top, with a true circular diameter of 15% of the frame width.

The Earth in the reference is strongly curved and sits primarily in the bottom left. Preserve its position and exact bright atmospheric limb along the entire visible contour. Its highest point is just below the halfway line and its rim exits the bottom edge at about 61% of the canvas width. Treat the reference as the actual canvas for an edit, with the same camera and crop. Place the Moon higher in the upper right, with its center at 28 percent of image height.
```

#### background-10-reference

Références fournies dans l’ordre. `public/assets/eras/era-6.webp`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

Top-down oblique view of the inner solar system plane, seen from far above. A small, intensely bright white-yellow Sun sits exactly at the centre of the frame, with a soft warm amber corona. A very faint, flat horizontal band of zodiacal dust light passes through the Sun, slightly tilted like an ellipse seen at a low angle. Distant deep-space background with a sparse star field and a subtle, dim amber and blue nebula only near the left and right edges. The whole wide horizontal area around the Sun stays dark and clear for the game's planets and orbits. Solar amber (#ffb74d) and sky blue (#6ec6ff) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No planets, moons, asteroids, orbit lines, rings or spacecraft. Moderate contrast, no written marks.

Use the attached existing game background as a painting and palette reference only, with the outer-space subject specified above.
```

#### `eras/era-10.webp`

Références fournies dans l’ordre. `assets-src/space/background-10-reference.png`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

Top-down oblique view of the inner solar system plane, seen from far above. A small, intensely bright white-yellow Sun sits exactly at the centre of the frame, with a soft warm amber corona. A very faint, flat horizontal band of zodiacal dust light passes through the Sun, slightly tilted like an ellipse seen at a low angle. Distant deep-space background with a sparse star field and a subtle, dim amber and blue nebula only near the left and right edges. The whole wide horizontal area around the Sun stays dark and clear for the game's planets and orbits. Solar amber (#ffb74d) and sky blue (#6ec6ff) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No planets, moons, asteroids, orbit lines, rings or spacecraft. Moderate contrast, no written marks.

Use attached image 1 as a composition and style reference. Enlarge the Sun substantially. Its sharply defined, filled white-yellow disc (the body itself, excluding all flare, corona and halo) must span 4.4% of the entire 16:9 canvas width and be centered at precisely 50% horizontally and 50% vertically. Let the corona broaden softly around it. Keep the central orbital field dark and clear.
```

#### `eras/era-11.webp`

Références fournies dans l’ordre. `public/assets/eras/era-6.webp`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

Deep interstellar space between neighbouring stars. A rich but calm star field with a few brighter nearby stars of different colours (white, pale blue, warm orange) placed near the corners. Wispy lavender and amber nebula clouds frame the image along the left, right and top edges, fading out towards the middle. The broad centre of the frame is a dark, low-detail, slightly darker oval area, kept free for the game's galaxy drawing. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No galaxy, spiral, planets or spacecraft. Moderate contrast, matte painterly finish, no written marks.

Use the attached existing game background as a painting and palette reference only, with the outer-space subject specified above.
```

#### `eras/era-12.webp`

Références fournies dans l’ordre. `public/assets/eras/era-6.webp`.

```text
Stylized digital illustration for a video game background, clean semi-flat style with soft painterly lighting, cinematic wide view of outer space, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, no spacecraft, no satellites, no rockets, large calm dark areas reserved for game elements, 16:9 composition.

Intergalactic deep field seen from outside our galaxy. Faint, tiny distant galaxies scattered across a black background, and the delicate filaments of the cosmic web glowing in lavender and warm amber along the edges and corners of the frame. The broad centre of the frame is a dark, low-detail, slightly darker oval area, kept free for the game's own spiral galaxy drawing. Majestic, quiet, enormous scale. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Keep all essential content within the central 16:9 crop. No large galaxy, no spiral in the centre, no planets or spacecraft. Moderate contrast, no written marks.

Use the attached existing game background as a painting and palette reference only, with the outer-space subject specified above.
```

#### `transitions/era-7.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

A sleek unbranded reusable rocket lifting off from a coastal launch pad at night, seen from a low three-quarter angle. A blazing white-orange exhaust plume and billowing clouds of steam light up the launch tower. A cutaway window in the payload fairing reveals stacked server modules with tiny cyan status lights. The sea reflects the flame, a faint dawn glow on the horizon. Sky blue (#6ec6ff) accents. All hulls and structures are blank, with no flags, numbers or markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, rocket and plume in the upper two thirds. Cinematic depth, clear silhouettes, moderate contrast. No visible people.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### `transitions/era-8.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

In low Earth orbit, an open upper stage releases a long glittering string of dozens of small flat satellites that unfold their blue solar wings one after another, stretching into the distance like a necklace of light. Below, the night side of the Earth with city lights and a thin cyan atmospheric rim. A larger ring-shaped station shines far away on a higher orbit. Sky blue (#6ec6ff) and violet (#9575ff) accents. Unbranded, unmarked hardware.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop. Cinematic depth, clear silhouettes, moderate contrast. No visible people.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### `transitions/era-9.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

On the grey lunar surface, the glowing entrance of an underground lava tube datacenter: a reinforced arch carved into a crater wall, rows of cyan-lit server racks visible deep inside the tunnel. A long electromagnetic launch rail runs across the plain towards the horizon. In the black sky, the blue Earth rises above the horizon. Hard, low sunlight with long shadows. Silver-grey (#b0bec5) and cyan accents. No flags, signs or markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, Earth and tunnel entrance in the upper two thirds. Cinematic depth, moderate contrast. No visible people, no astronauts.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### `transitions/era-10.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

A long fusion-powered cargo ship with stacked container modules and a bright blue-white exhaust approaches Mars. On the rusty planet below, a cluster of glowing domed habitats and large antenna dishes sits at the edge of a canyon. Far in the background, Jupiter appears as a small striped disc and the Sun as a bright point. Solar amber (#ffb74d) and sky blue (#6ec6ff) accents. Unbranded hull, no markings.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, ship and Mars in the upper two thirds. Cinematic depth, moderate contrast. No visible people.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### `transitions/era-11.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

A huge, paper-thin, shimmering square light sail carrying a tiny probe at its centre is pushed away from the solar system by a powerful red-violet laser beam coming from a distant ring of collectors around the Sun. Ahead, a bright binary star system, one white and one orange star, glows against a lavender nebula. Sense of an immense journey. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, sail and stars in the upper two thirds. Cinematic depth, moderate contrast. No text, no people.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### `transitions/era-12.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

A completed Dyson sphere enclosing a star: a colossal sphere made of interlocking dark hexagonal plates, warm orange light leaking through thin seams and a few open panels, thin cyan data lines running across its surface. Beyond it, the Milky Way spiral glows across the black sky. Epic, quiet scale. Lavender (#c792ff) and amber (#ffab40) accents.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, sphere in the upper two thirds. Cinematic depth, moderate contrast. No text, no people.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### `transitions/victory.webp`

Références fournies dans l’ordre. `public/assets/transitions/era-6.webp`.

```text
Stylized digital illustration for a video game cinematic, clean semi-flat style with soft painterly lighting, dramatic three-quarter view, dark moody ambience with cool blue-cyan rim lights and small glowing accent lights, palette dominated by near-black and deep navy (#02040a, #0a0e14, #121a27) with cyan (#39d0ff) and violet (#7c5cff) accents, no text, no letters, no logos, no watermark, no people, 16:9 composition, calm and dark lower third.

The entire Milky Way seen from outside, a majestic barred spiral galaxy tilted three-quarters towards the viewer, its arms sparkling with countless tiny golden and cyan lights as if every star system were lit by a datacenter. A gentle web of faint luminous lines links the arms. The galactic core glows warm amber; the black intergalactic space around is calm, with a few distant galaxies. Triumphant, serene, awe-inspiring. Lavender (#c792ff), gold (#ffd166) and cyan accents.
Generate one landscape image at 1536x1024. Protect the main action in the central 16:9 crop, galaxy in the upper two thirds. Cinematic depth, moderate contrast. No text, no people.

Use the attached existing game transition as a style reference only. Keep the lower third dark and visually quiet after the 16:9 crop.
```

#### Planche 1

Références fournies dans l’ordre. `public/assets/icons/buildings/orbital.webp`, `assets-src/icons-sheets/servers.png`.

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: one white cylindrical pressurized space station module with a docking ring at one end and a row of small cyan-lit portholes | a tight formation of seven tiny cube satellites with miniature dark-blue solar wings, flying together as one compact cluster | a large wheel-shaped space station with a central hub, four spokes and a dish antenna | a cutaway grey lunar rock mound revealing a glowing cyan tunnel lined with server racks inside.
Row 2: a dark hexagonal space hub sitting on a large layered gold and violet sunshield | a rust-red Martian dome habitat with dim server rack silhouettes inside and red dust heaped at its base | a grey metallic asteroid covered with glowing cyan circuit traces | a small blazing white-yellow star with a slim dark ring-shaped station orbiting around it.
Row 3: a tiny intensely bright blue-white sphere with two thin violet jets from its poles, wrapped by one thin metallic ring | three nested translucent spheres made of hexagonal panels with a glowing orange core | a pure black disc surrounded by a bright orange-violet accretion disk and one thin cyan lattice ring | Empty.
Keep silhouettes deliberately different even in monochrome: cylinder, cluster, wheel, mound, shield, dome, rock, star with ring, jets, nested spheres, black disc. Fictional, unbranded hardware.

Use attached image 1 (existing orbital datacenter icon) and image 2 (existing server icon sheet) solely as style references. Follow the layout and new subjects in this prompt. Leave the gutters and specified empty cells truly transparent. Preserve the specified object order.
```

#### Planche 2

Références fournies dans l’ordre. `public/assets/icons/buildings/orbital.webp`, `assets-src/icons-sheets/servers.png`.

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a small white boxy satellite whose body is a stack of drive drawers, with one frosty white radiator fin | a thick transparent quartz glass disc with glowing violet dot patterns layered inside it | a heavy round steel vault door set into a block of grey lunar rock | a frosty white cylindrical cryogenic tank half-submerged in dark amber liquid, covered with icy rime.
Row 2: a small white-hot glowing sphere held inside a dark metallic cage-like containment frame | a black sphere whose whole surface is covered by a glowing cyan pixel grid | a large white parabolic ground antenna dish on a sturdy pedestal, pointing upward | a satellite with a telescope-like optical head emitting a thin bright green laser beam.
Row 3: a small grey cratered moon with three tiny relay satellites around it, linked by thin cyan laser lines | a giant lattice-tower radio dish tilted at an angle with violet signal arcs | a glowing toroidal funnel-shaped portal swirling violet and cyan | a miniature spiral galaxy with bright nodes connected by golden lines.
Storage items (row 1 and first two of row 2) must read as data containers; network items as antennas, beams and links. Clearly distinct silhouettes.

Use attached image 1 (existing orbital datacenter icon) and image 2 (existing server icon sheet) solely as style references. Follow the layout and new subjects in this prompt. Leave the gutters and specified empty cells truly transparent. Preserve the specified object order.
```

#### Planche 3

Références fournies dans l’ordre. `public/assets/icons/buildings/orbital.webp`, `assets-src/icons-sheets/servers.png`.

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a long metal truss carrying four large dark-blue solar panel wings in a cross shape | a huge flat square solar array with a small dish underneath sending a pale orange beam downward | a compact grey dome on a regolith base, a glowing violet fusion ring visible through its open top | a small scorched grey planet encircled by a thin ring of dark-blue solar panels.
Row 2: a bright orange star surrounded by dozens of small blue collector panels orbiting in loose shells | a sphere of interlocking dark hexagonal plates with orange light leaking through the seams | a set of very large folding white radiator fins arranged like a ladder, faintly glowing red at their base | a spacecraft boom emitting a flat sheet of glowing orange droplets towards a collector bar.
Row 3: a deep dark crater bowl with icy blue frost on its rim and one frosted cooling pipe descending into it | a white icy moon with brownish crack lines and cyan light seeping out of the fractures | a loose spherical cloud of tiny pale-blue icy comet nuclei | a white radiator panel facing a disc of mottled orange and blue cosmic background pattern.
Power items glow warm (orange, violet); cooling items look cold (white, ice blue). Clearly distinct silhouettes.

Use attached image 1 (existing orbital datacenter icon) and image 2 (existing server icon sheet) solely as style references. Follow the layout and new subjects in this prompt. Leave the gutters and specified empty cells truly transparent. Preserve the specified object order.
```

#### Planche 4

Références fournies dans l’ordre. `public/assets/icons/buildings/orbital.webp`, `assets-src/icons-sheets/servers.png`.

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a small white passenger space capsule with large round panoramic windows glowing warm | a small blue globe circled by dotted orbit rings carrying tiny satellites and three cyan signal arcs | a small grey lunar mining rover carrying a crate of glowing gold ore | a cluster of three red-tinted domes with tiny warm lights on red Martian soil.
Row 2: two stylized hands touching at the index fingertips with a cyan spark, one human-toned, the other green-violet with three long fingers, no faces or bodies | a floating golden coin-shaped trading station ringed with small docking ports | a curved mission control console desk facing a wall of dark screens showing only glowing orbit arcs | a white inflatable habitat module with an airlock, resting on grey regolith.
Row 3: a glowing violet crystal brain enclosed in a polished dark spaceship-hull capsule | Empty | Empty | Empty.
Commercial items read as customers and markets; team items as places and minds. No real people, no faces, no screens with text.

Use attached image 1 (existing orbital datacenter icon) and image 2 (existing server icon sheet) solely as style references. Follow the layout and new subjects in this prompt. Leave the gutters and specified empty cells truly transparent. Preserve the specified object order.
```

#### Planche 5

Références fournies dans l’ordre. `public/assets/icons/buildings/orbital.webp`, `assets-src/icons-sheets/servers.png`.

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 3 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: an empty steel lattice launch tower with an umbilical arm over a concrete flame trench, no rocket | a slim white rocket booster landing upright on four deployed legs with a small flame below | a very thick, tall brushed stainless steel rocket with large grid fins near its top | a small spacecraft with a wide capture net closing around a tumbling broken satellite.
Row 2: a long electromagnetic rail ramp on grey lunar ground with glowing cyan coils and a small capsule on it | a white observatory dome firing a bright green laser beam straight up | a thin tether cable rising from a small sea platform to a counterweight station, with a climber pod halfway up | a long cargo spaceship made of stacked container modules with a bright blue fusion exhaust.
Row 3: a spider-like probe with mechanical arms 3D-printing a smaller copy of itself | a huge thin shimmering square sail with a tiny probe at its centre, pushed by a red beam | an elongated seed-pod shaped ship with glowing green windows | a glass magnetic containment bottle with metal rings holding a tiny violet-white glowing spark.
Unbranded, fictional vehicles: no flags, no agency insignia, no numbers. Clearly distinct silhouettes.

Use attached image 1 (existing orbital datacenter icon) and image 2 (existing server icon sheet) solely as style references. Follow the layout and new subjects in this prompt. Leave the gutters and specified empty cells truly transparent. Preserve the specified object order.
```

#### Planche 6

Références fournies dans l’ordre. `public/assets/icons/buildings/orbital.webp`, `assets-src/icons-sheets/servers.png`.

```text
Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading, three-quarter isometric view from slightly above, consistent lighting from top-left, subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane.

Game asset sprite sheet for Uptime Inc. Generate one 1024 × 1024 square transparent RGBA canvas arranged into exactly four evenly spaced columns and 2 evenly spaced rows. Each cell has one independent icon centered in its cell, with generous completely transparent gutters and a large outer margin. No visible grid, frames, bases, tiles, shadows outside the objects, lettering, numerals, labels, UI, or brands. Left to right in each row, top to bottom, follow this exact order. 'Empty' means truly blank transparent space.
Row 1: a rocket breaking apart in a red (#ff4d6a) and orange explosion cloud | a rocket lifting off cleanly with golden (#ffd166) sparkles around its plume | two satellites colliding with sharp shards scattering, red (#ff4d6a) impact glow | a cracked fragment of grey moon rock split by glowing red (#ff4d6a) fissures.
Row 2: a bright sun disc blocking a dashed signal line between two small planets, red (#ff4d6a) warning glow | a radio dish receiving a glowing green (#3ddc84) wave pattern from above | a star bursting into a supernova with an expanding red (#ff4d6a) shock ring | Empty.
Event icons are displayed at 28 pixels: keep them extremely bold and simple, one strong shape each.

Use attached image 1 (existing orbital datacenter icon) and image 2 (existing server icon sheet) solely as style references. Follow the layout and new subjects in this prompt. Leave the gutters and specified empty cells truly transparent. Preserve the specified object order.
```

#### `icons/categories/orbit.webp`

Références fournies dans l’ordre. `assets-src/space/category-reference.png`.

```text
Game UI category icon, flat emblem with minimal shading, 2 to 3 colours only: cyan (#39d0ff), violet (#7c5cff) and off-white. A simple stylized rocket rising diagonally along a thin elliptical orbit line. Bold rounded shapes, clean silhouette readable at 20 pixels, centered, transparent background, no text, no letters, no numbers, no logos, no background, no shadow plane. Match the style of the attached existing category icons.

The attached transparent reference sheet shows all eight existing shop category icons in a 4-by-2 grid. Match their graphic weight and restrained shading. Output only a single new space category emblem on transparent alpha, not a sheet. Give the rocket a chunky silhouette and keep its orbit line thick enough to remain legible at 20 pixels.
```
