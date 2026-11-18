# Mission : générer les icônes du jeu « Uptime Inc. »

Tu travailles dans le dépôt d'**Uptime Inc.**, un idle game web (React + Vite, GitHub Pages) sur
l'hébergement : on part d'un Raspberry Pi dans un garage pour finir en cloud planétaire, en 6 ères.
Les fonds d'écran ont déjà été générés (voir `ASSETS.md` et `public/assets/eras/`) : **les icônes
doivent appartenir au même univers visuel.**

Aujourd'hui, le jeu utilise des emojis (📦 pour un mini-PC, 🗼 pour une tour serveur…) qui sont peu
parlants et s'affichent différemment selon l'OS. Ta tâche : **générer 96 icônes** (76 éléments de
boutique, 12 événements, 8 catégories), les découper, les optimiser et les ranger dans
`public/assets/icons/`. **Ne modifie pas le code du jeu** (`src/`) : l'intégration sera faite
séparément.

---

## 1. Comment les icônes seront affichées

- Boutique : carré de **44 px** (jusqu'à 88 px sur écran Retina), sur fond de carte sombre `#121a27`.
- Événements : **28 px** dans le panneau des incidents et les notifications.
- Catégories : **20 px** dans les sous-onglets de la boutique.

Conséquences :

- **Un seul objet par icône**, silhouette forte et lisible en tout petit. Pas de décor, pas de scène.
- **Fond transparent** obligatoire (PNG/WebP avec canal alpha), pas de carré ni de cercle de fond.
- Objet centré, occupant **~80 % du cadre**, avec une petite marge transparente.
- **Aucun texte, chiffre, lettre, logo de marque réelle** (pas de logo Raspberry Pi, NVIDIA…).
- Contraste suffisant sur fond sombre : un léger liseré clair (rim light cyan) sur les bords.

## 2. Direction artistique commune

Bloc de style à placer **au début de chaque prompt, à l'identique** :

> Game UI icon, single object, stylized semi-flat 3D render with soft painterly shading,
> three-quarter isometric view from slightly above, consistent lighting from top-left,
> subtle cyan (#39d0ff) rim light and small glowing accent lights, muted realistic materials
> (dark metal, matte plastic) with violet (#7c5cff) accents, clean bold silhouette readable at
> 44 pixels, centered, transparent background, no text, no letters, no numbers, no logos,
> no background, no shadow plane.

Règles complémentaires :

- **Même angle (3/4 isométrique), même éclairage, même niveau de détail pour toutes les icônes.**
- Le matériel « grand public » des premières ères peut être plus coloré et bricolé (PC beige,
  carte verte du Raspberry Pi) ; le matériel des ères avancées plus sobre, sombre et lumineux.
- **Équipe** : pas de visages réalistes ni de personnes identifiables. Utilise des personnages
  très stylisés type figurine/chibi sans traits détaillés, ou mieux un **objet emblématique**
  (ex. stagiaire = mug de café + badge « visiteur » sans texte ; sysadmin = clavier + clé à molette).
- **Commercial** et **événements** : métaphores visuelles simples (mégaphone, poignée de main,
  pelleteuse, botnet = essaim de petits robots rouges…).
- Événements négatifs : accent **rouge** `#ff4d6a` ; positifs : accent **vert** `#3ddc84` ou
  **doré** `#ffd166`.
- Catégories : version **plus simple** (emblème quasi plat, 2–3 couleurs), lisible à 20 px.

## 3. Méthode recommandée : planches par catégorie

Pour garantir la cohérence, génère **une planche par catégorie** (grille de 4 × 4 ou 4 × 3 cases
sur 1024 × 1024, une icône par case, fond transparent, cases bien espacées), puis découpe chaque case.
Si une icône d'une planche est ratée, régénère-la seule en reprenant le même bloc de style et en
joignant la planche comme référence de style.

Si l'outil ne gère pas la transparence, génère sur un fond uni `#ff00ff` (magenta) et détoure-le
proprement (pas de halo rose sur les bords).

## 4. Liste des icônes

Les noms de fichiers sont **exactement les `id`** ci-dessous. Les descriptions servent à choisir
l'objet à représenter (ne les écris pas dans l'image).

### A. Éléments de boutique (76) → `public/assets/icons/buildings/<id>.webp`

#### Serveurs (`servers`, 14 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `pi` | Raspberry Pi | 1 | Petit, silencieux, sobre. Parfait pour débuter. |
| `oldpc` | Vieux PC récupéré | 1 | Trouvé sur le trottoir. Bruyant et gourmand, mais il tourne. |
| `nuc` | Mini-PC | 1 | Format compact, processeur moderne, consommation maîtrisée. |
| `tower` | Tour serveur | 2 | Xeon, RAM ECC et disques hot-swap. Le premier « vrai » serveur. |
| `r1u` | Serveur rack 1U | 2 | Dense et rackable. On commence à parler en « U ». |
| `r2u` | Serveur 2U bi-socket | 3 | Deux sockets, des centaines de Go de RAM. |
| `blade` | Châssis blade | 3 | 16 lames dans un châssis 10U partagé. |
| `ocp` | Rack OCP haute densité | 4 | Design Open Compute : rack entier livré prêt à brancher. |
| `arm` | Rack ARM basse conso | 4 | Des centaines de cœurs ARM pour une fraction de l'énergie. |
| `gpunode` | Nœud GPU | 5 | 8 accélérateurs, NVLink et une facture électrique salée. |
| `aipod` | Pod IA | 5 | 32 nœuds GPU interconnectés en InfiniBand. |
| `superpod` | SuperPod | 6 | Des milliers de GPU qui ne forment plus qu’un seul cerveau. |
| `quantum` | Ordinateur quantique | 6 | Refroidi à 15 mK. Personne ne comprend vraiment comment il marche. |
| `orbital` | Datacenter orbital | 6 | En orbite basse : énergie solaire gratuite et refroidissement par le vide. |

#### Stockage (`storage`, 7 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `hdd` | Disque dur externe | 1 | Branché en USB. Prions pour qu’il ne tombe pas. |
| `nas` | NAS 4 baies | 1 | RAID 5 et interface web. Le compagnon du homelab. |
| `raidbay` | Baie RAID | 2 | 24 disques en RAID 6, contrôleur à cache batterie. |
| `san` | SAN Fibre Channel | 3 | Stockage partagé à haute disponibilité. |
| `nvme` | Baie full-NVMe | 4 | Des millions d’IOPS dans 2U. |
| `objstore` | Cluster stockage objet | 5 | Des pétaoctets répliqués sur trois zones. |
| `dna` | Stockage ADN | 6 | Un exaoctet dans un tube à essai. |

#### Réseau (`network`, 11 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `adsl` | Ligne ADSL | 1 | Une ligne de plus sur le vieux cuivre. |
| `vdsl` | Ligne VDSL2 | 1 | Plus de débit si vous êtes près du central. |
| `fiber` | Fibre FTTH | 1 | Le Gigabit à la maison. Enfin. |
| `switch10g` | Switch manageable 10G | 2 | VLAN, LACP, et des LEDs qui clignotent beaucoup. |
| `prolink` | Lien pro 10 Gb/s | 3 | Fibre dédiée, GTR 4h, IP fixes à volonté. |
| `bgp` | Routeur BGP multi-transit | 3 | Votre propre AS, plusieurs transitaires. |
| `ix` | Port de peering IX | 4 | Échange direct avec les autres réseaux au point d’échange. |
| `cdn` | PoP CDN | 4 | Du cache au plus près des utilisateurs. Encaisse aussi les DDoS. |
| `backbone` | Backbone 400G | 5 | Votre propre dorsale optique entre vos sites. |
| `subsea` | Câble sous-marin | 6 | Traverser un océan avec quelques paires de fibres. |
| `laser` | Constellation laser | 6 | Liaisons optiques inter-satellites à la vitesse de la lumière dans le vide. |

#### Électricité (`power`, 11 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `outlet` | Prise supplémentaire | 1 | Un circuit de plus tiré depuis le tableau. |
| `ups` | Onduleur (UPS) | 1 | Tient les coupures de courant. Un seul suffit à protéger le homelab. |
| `line32` | Ligne dédiée 32 A | 1 | Le garage a enfin son propre disjoncteur. |
| `tri` | Tableau triphasé | 2 | Trois phases, 36 kVA. |
| `solar` | Panneaux solaires | 2 | Réduisent la facture d’électricité (−1,5 % chacun, max −45 %). |
| `transfo` | Transformateur HTA | 3 | Raccordement moyenne tension 20 kV. |
| `genset` | Groupe électrogène | 3 | Diesel de secours : plus aucune coupure ne vous fait peur. |
| `substation` | Poste source dédié | 4 | Raccordement haute tension, 20 MW. |
| `solarfarm` | Ferme solaire | 5 | Des hectares de panneaux. Bonus solaire inclus. |
| `smr` | Mini-réacteur SMR | 6 | Un petit réacteur modulaire rien que pour vous. |
| `fusion` | Réacteur à fusion | 6 | Le soleil en bouteille. Enfin opérationnel. |

#### Refroidissement (`cooling`, 8 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `fan` | Ventilateur | 1 | Pointé vers les machines. Ça aide un peu. |
| `portableac` | Clim mobile | 1 | Le tuyau sort par la fenêtre entrouverte. |
| `splitac` | Clim split | 2 | Unité murale avec groupe extérieur. |
| `crac` | Armoire CRAC | 3 | Climatisation de précision, soufflage sous faux plancher. |
| `freecool` | Free cooling | 4 | L’air extérieur fait le travail la majeure partie de l’année. |
| `liquid` | Refroidissement liquide | 5 | Plaques froides directement sur les puces. |
| `immersion` | Immersion diphasique | 6 | Les serveurs baignent dans un fluide diélectrique en ébullition. |
| `seawater` | Eau des abysses | 6 | Pompage d’eau à 4 °C depuis les grands fonds. |

#### Espace (`space`, 6 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `shelf` | Étagère | 1 | De la place pour quelques machines de plus. |
| `rack` | Baie 42U | 2 | La baie standard 19 pouces. |
| `row` | Rangée de baies | 3 | Dix baies alignées, allée froide incluse. |
| `cage` | Cage privative | 4 | Un espace grillagé rien qu’à vous dans le datacenter. |
| `hall` | Salle blanche | 5 | Mille mètres carrés de faux plancher. |
| `campus` | Campus datacenter | 6 | Plusieurs bâtiments, une sous-station, un lac pour refroidir. |

#### Commercial (`sales`, 12 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `ads` | Petites annonces | 1 | « Hébergement pas cher, demandez Kevin. » |
| `forum` | Pub sur les forums | 1 | Signature de forum et messages bien placés. |
| `seo` | Référencement SEO | 1 | Premier sur « hébergeur sympa ». |
| `salesrep` | Commercial | 2 | Il connaît tout le monde et décroche des contrats. |
| `partners` | Partenariat agences web | 2 | Les agences vous confient tous leurs clients. |
| `enterprise` | Contrats grands comptes | 3 | Banques, assurances, collectivités. |
| `marketplace` | Marketplace cloud | 3 | Vos offres en un clic dans les catalogues SaaS. |
| `events` | Salons & conférences | 4 | Votre stand au plus grand salon tech d’Europe. |
| `sovereign` | Cloud souverain | 5 | Les administrations s’arrachent votre certification. |
| `aiplatform` | Plateforme IA | 5 | Les startups IA font la queue pour vos GPU. |
| `globalcampaign` | Campagne mondiale | 6 | Votre logo à la mi-temps de la finale. |
| `interplanet` | Clients interplanétaires | 6 | La colonie martienne a besoin d’un hébergeur. |

#### Équipe (`staff`, 7 icônes)

| id | Nom | Ère | Description |
|---|---|---|---|
| `intern` | Stagiaire | 1 | Traite les requêtes à la main à votre place (1 clic/s). |
| `sysadmin` | Sysadmin | 1 | Répare les pannes plus vite (+0,5 %/s de réparation). |
| `researcher` | Ingénieur R&D | 2 | Produit des points de recherche. |
| `devops` | Ingénieur DevOps | 2 | Automatise tout : +2 % d’efficacité des serveurs. |
| `sre` | SRE | 3 | Réduit la fréquence des incidents (−5 % chacun). |
| `rdlab` | Laboratoire R&D | 4 | Une équipe entière dédiée à la recherche. |
| `aiops` | IA d’exploitation | 5 | Une IA pilote le datacenter : +5 % d’efficacité. |

### B. Événements (12) → `public/assets/icons/events/<id>.webp`

| id | Nom | Positif | Description |
|---|---|---|---|
| `disk` | Panne de disque | non | Un disque rend l’âme : 15 % de capacité perdue jusqu’à réparation (moitié moins avec du RAID). |
| `outage` | Coupure de courant | non | Plus de jus ! Tout s’arrête sans onduleur ni groupe électrogène. |
| `heatwave` | Canicule | non | Il fait 40 °C dehors : refroidissement −35 %. |
| `viral` | Buzz viral | oui | Un de vos clients fait le buzz : demande ×3 ! |
| `ddos` | Attaque DDoS | non | Un botnet sature vos liens : bande passante −70 % (sauf protection anti-DDoS). |
| `acleak` | Fuite de clim | non | De l’eau sous le faux plancher : refroidissement −20 % et 5 % de dégâts. |
| `elecspike` | Flambée du prix de l’électricité | non | Le prix du kWh est multiplié par 3. |
| `investor` | Business angel | oui | Un investisseur croit en vous : +90 s de revenus immédiatement. |
| `blackfriday` | Black Friday | oui | Les boutiques en ligne s’affolent : demande ×2,5 ! |
| `audit` | Audit de sécurité réussi | oui | Le rapport est élogieux : réputation +10. |
| `fiber_cut` | Coup de pelleteuse | non | Une fibre arrachée sur un chantier : bande passante −50 %. |
| `solarflare` | Éruption solaire | non | Des bits flippent partout : 10 % de dégâts. |

### C. Catégories de la boutique (8) → `public/assets/icons/categories/<id>.webp`

| id | Nom | Idée de pictogramme |
|---|---|---|
| `servers` | Serveurs | une unité serveur rack vue de face avec LEDs |
| `storage` | Stockage | une pile de disques / cylindre de données |
| `network` | Réseau | un globe ou trois nœuds reliés |
| `power` | Électricité | un éclair |
| `cooling` | Refroidissement | un flocon / une hélice de ventilateur |
| `space` | Espace | une baie vide vue de face |
| `sales` | Commercial | un graphique en hausse |
| `staff` | Équipe | deux silhouettes stylisées |

## 5. Post-traitement

1. Recadre chaque icône en **carré**, objet centré, marge transparente de ~8 %.
2. Exporte en **WebP avec alpha, 128 × 128**, qualité ~85 (`cwebp -q 85 -alpha_q 100`, Pillow ou
   `sharp`). Cible **≤ 12 Ko** par icône ; poids total de `public/assets/icons/` **≤ 1,2 Mo**.
3. Garde les planches et PNG sources **hors du dépôt** (dossier `assets-src/`, à ajouter au
   `.gitignore` s'il n'y est pas).
4. Produis une **planche de contrôle** `assets-src/icons-preview.png` : toutes les icônes à 44 px
   sur fond `#121a27`, avec l'id sous chacune, pour vérifier la lisibilité et la cohérence d'un
   coup d'œil.

## 6. Critères d'acceptation

- [ ] 96 fichiers présents : 76 dans `buildings/`, 12 dans `events/`, 8 dans `categories/`,
      noms identiques aux `id`.
- [ ] Fond réellement transparent, sans halo ni carré de fond.
- [ ] Style homogène (angle, éclairage, palette) sur l'ensemble, et cohérent avec les fonds d'ère.
- [ ] Chaque icône reconnaissable à 44 px ; les éléments proches restent distinguables
      (`tower` / `oldpc`, `r1u` / `r2u`, `adsl` / `vdsl` / `fiber`, `ocp` / `arm`, `gpunode` / `aipod` / `superpod`).
- [ ] Aucun texte, chiffre, logo de marque ni visage réaliste.
- [ ] Poids respectés ; `npm run build` passe ; aucun fichier de `src/` modifié.
- [ ] Ajoute à `ASSETS.md` une section « Icônes » : méthode, poids total, et les prompts réellement
      utilisés (au moins le prompt de chaque planche) pour pouvoir régénérer à l'identique.

Si une icône ne respecte pas un critère, **régénère-la** plutôt que de la livrer telle quelle.
