import type { ReactNode } from 'react';
import { BUILDINGS, CATEGORIES } from '../../game/data/buildings';
import { REQUEST_TYPES } from '../../game/data/requestTypes';
import { EVENTS } from '../../game/data/events';
import type { Category } from '../../game/types';

/**
 * Contenu partagé par le tutoriel et le menu d'aide : les grands principes,
 * les nouveautés de chaque ère et les rubriques de référence.
 */

export interface Page {
  id: string;
  icon: string;
  title: string;
  body: ReactNode;
}

/* ------------------------------------------------------------------------ */
/* Tutoriel d'introduction : les grands principes, dans l'ordre de découverte */
/* ------------------------------------------------------------------------ */

export const INTRO: Page[] = [
  {
    id: 'welcome',
    icon: '👋',
    title: 'Bienvenue chez Uptime Inc.',
    body: (
      <>
        <p>
          Vous démarrez un hébergeur avec un Raspberry Pi dans un garage. Votre but : servir toujours plus de requêtes, de plus en plus
          rentables, jusqu’à faire de la galaxie entière votre datacenter.
        </p>
        <p>
          Le jeu avance tout seul : vos machines servent des requêtes et rapportent de l’argent chaque seconde, même quand vous êtes
          absent. Vous, vous décidez quoi acheter.
        </p>
      </>
    ),
  },
  {
    id: 'requests',
    icon: '📨',
    title: 'Les requêtes font vos revenus',
    body: (
      <>
        <p>
          Des clients envoient des requêtes (sites, blogs, API…). Chaque type de requête consomme des <strong>ressources</strong> : CPU,
          RAM, stockage, bande passante, puis GPU. S’il en manque, une partie des requêtes est <strong>perdue</strong>.
        </p>
        <p>
          Le panneau <em>Requêtes entrantes</em> montre ce qui est servi, ce qui manque et combien chaque type rapporte. Au début, cliquez
          sur <em>Traiter manuellement</em> pour gagner vos premiers dollars.
        </p>
      </>
    ),
  },
  {
    id: 'infra',
    icon: '🏗️',
    title: 'L’infrastructure',
    body: (
      <>
        <p>L’onglet Infrastructure regroupe tout ce que vous pouvez acheter :</p>
        <ul>
          <li>
            🖥️ <strong>Serveurs</strong>, 💾 <strong>stockage</strong>, 🌐 <strong>réseau</strong> : la capacité qui sert les requêtes ;
          </li>
          <li>
            ⚡ <strong>électricité</strong>, ❄️ <strong>refroidissement</strong>, 📐 <strong>espace</strong> : ce qu’il faut pour les faire
            tourner ;
          </li>
          <li>
            📈 <strong>commercial</strong> : de nouveaux clients, donc plus de demande ;
          </li>
          <li>
            👥 <strong>équipe</strong> : clics automatiques, réparations, recherche, efficacité.
          </li>
        </ul>
        <p>Chaque achat fait monter le prix du suivant.</p>
      </>
    ),
  },
  {
    id: 'gauges',
    icon: '📟',
    title: 'Surveillez les jauges',
    body: (
      <>
        <p>
          Le panneau <em>Ressources</em> compare la demande à votre capacité. Vert : tout va bien. Orange : bientôt plein. Rouge : des
          requêtes sont perdues, ou vos machines ralentissent (manque d’électricité, surchauffe).
        </p>
        <p>
          Cliquez sur une jauge pour aller directement aux équipements qui la remplissent. Survolez-la pour le détail.
        </p>
      </>
    ),
  },
  {
    id: 'quality',
    icon: '⭐',
    title: 'Qualité de service, uptime et réputation',
    body: (
      <>
        <p>
          La <strong>qualité de service</strong> est la part des requêtes servies. Elle fait évoluer l’<strong>uptime</strong> (moyenne
          sur une dizaine de minutes) et la <strong>réputation</strong>, qui réagit vite et chute fort quand des requêtes sont perdues.
        </p>
        <p>
          Une bonne réputation attire jusqu’à 50 % de demande en plus ; un bon uptime débloque des bonus de contrat (SLA). Ne vendez donc
          pas plus que ce que vous savez servir.
        </p>
      </>
    ),
  },
  {
    id: 'caps',
    icon: '🔝',
    title: 'Chaque ère a ses maximums',
    body: (
      <>
        <p>
          Chaque équipement a un <strong>maximum par ère</strong>, affiché sous son compteur (« 12/25 ») et sur le bouton (« ✓ MAX ») une
          fois atteint. Il augmente quand vous passez à l’ère suivante.
        </p>
        <p>
          Quand tout est au maximum, votre infrastructure sert toute la demande, et même un pic ×3 (buzz viral, Black Friday), sans gâchis
          d’électricité ni de refroidissement. Si vous avez trop vendu, montez vos serveurs vers leur maximum : la situation se rattrape
          toujours.
        </p>
      </>
    ),
  },
  {
    id: 'progress',
    icon: '⬆️',
    title: 'Améliorations et recherche',
    body: (
      <>
        <p>
          L’onglet <em>Améliorations</em> propose des bonus permanents : posséder 10, 25, 50… exemplaires d’un équipement double sa
          production, d’autres réduisent les besoins ou la consommation.
        </p>
        <p>
          Dès l’ère 2, la <em>Recherche</em> se débloque : vos chercheurs produisent des points de R&amp;D à dépenser dans un arbre de
          technologies.
        </p>
      </>
    ),
  },
  {
    id: 'incidents',
    icon: '🚨',
    title: 'Incidents et bonnes nouvelles',
    body: (
      <>
        <p>
          Pannes de disque, coupures de courant, canicules, attaques DDoS… Les incidents s’affichent à gauche : vous pouvez souvent les
          résoudre tout de suite en payant, ou vous en protéger (onduleur, RAID, anti-DDoS, sysadmins).
        </p>
        <p>Les bonnes nouvelles aussi arrivent : buzz viral, Black Friday, investisseurs…</p>
      </>
    ),
  },
  {
    id: 'eras',
    icon: '🚚',
    title: 'Changer d’ère',
    body: (
      <>
        <p>
          Le panneau de l’ère (en haut à gauche, ou vue État sur mobile) indique la prochaine étape : quand vos gains atteignent le seuil, payez le déménagement pour passer à
          l’ère suivante. Plus de place, d’électricité et de clients, de nouveaux équipements et de nouveaux types de requêtes.
        </p>
        <p>
          À chaque nouvelle ère, une fiche <em>Nouveautés</em> vous présente ce qui change. Vous la retrouverez, comme tout ce tutoriel,
          dans le menu ❓ Aide.
        </p>
      </>
    ),
  },
  {
    id: 'go',
    icon: '🚀',
    title: 'À vous de jouer',
    body: (
      <>
        <p>Pour bien démarrer :</p>
        <ol>
          <li>cliquez sur « Traiter manuellement » pour gagner quelques dollars ;</li>
          <li>achetez des Raspberry Pi et un peu de commercial ;</li>
          <li>gardez un œil sur la bande passante et l’électricité ;</li>
          <li>achetez les améliorations dès qu’elles apparaissent.</li>
        </ol>
        <p>Le menu ❓ Aide, en haut à droite, répond à toutes vos questions.</p>
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Nouveautés de chaque ère                                                   */
/* ------------------------------------------------------------------------ */

interface EraNews {
  /** Ce qui change dans la façon de jouer. */
  mechanics: ReactNode;
  /** Un conseil pour bien démarrer l'ère. */
  tip: string;
}

export const ERA_NEWS: Record<number, EraNews> = {
  2: {
    mechanics: (
      <p>
        🔬 <strong>La recherche est ouverte.</strong> Embauchez des chercheurs (Équipe) pour produire des points de R&amp;D, puis dépensez-les
        dans l’onglet Recherche. Les bases de données arrivent : elles demandent beaucoup de RAM et du stockage.
      </p>
    ),
    tip: 'Vérifiez vite la jauge de stockage : les bases de données en sont gourmandes.',
  },
  3: {
    mechanics: (
      <p>
        🛒 L’e-commerce et les sauvegardes arrivent, avec le <strong>Black Friday</strong> (demande ×2,5). Les groupes électrogènes
        protègent des coupures et les SRE réduisent les pannes.
      </p>
    ),
    tip: 'Les sauvegardes demandent énormément de stockage : prévoyez du SAN Fibre Channel.',
  },
  4: {
    mechanics: (
      <p>
        🎬 Le streaming vidéo consomme une bande passante énorme : CDN et points d’échange deviennent essentiels. La{' '}
        <strong>Bourse</strong> est désormais accessible : introduire votre société en bourse recommence la partie avec des actions qui
        augmentent tous vos revenus.
      </p>
    ),
    tip: 'Les cartes GPU PCIe (amélioration) préparent l’arrivée de l’IA à l’ère suivante.',
  },
  5: {
    mechanics: (
      <p>
        🤖 <strong>L’IA arrive</strong> : l’inférence rapporte énormément par requête mais exige des <strong>GPU</strong>, une nouvelle
        ressource fournie par les nœuds GPU et les pods IA.
      </p>
    ),
    tip: 'Achetez quelques nœuds GPU dès l’arrivée : les requêtes d’IA sont les plus rentables.',
  },
  6: {
    mechanics: (
      <p>
        🧠 L’entraînement d’IA arrive, encore plus gourmand en GPU et en RAM. Câbles sous-marins, réacteurs nucléaires compacts et
        refroidissement par immersion changent d’échelle.
      </p>
    ),
    tip: 'Les superpods occupent beaucoup d’espace : agrandissez vos campus en même temps.',
  },
  7: {
    mechanics: (
      <>
        <p>
          🚀 <strong>Le programme spatial</strong> ouvre l’onglet Spatial. Le matériel en orbite n’occupe pas d’espace mais une{' '}
          <strong>capacité d’emport</strong> : il faut des lanceurs pour l’envoyer.
        </p>
        <p>
          🛰️ Les satellites laissent des <strong>débris orbitaux</strong>. Tant qu’ils restent sous votre capacité de nettoyage, tout va
          bien.
        </p>
      </>
    ),
    tip: 'Surveillez les jauges Emport et Débris : un serveur orbital bloqué faute de lanceur ne rapporte rien.',
  },
  8: {
    mechanics: (
      <p>
        🛰️ Les constellations produisent beaucoup de débris. S’ils dépassent votre capacité de nettoyage, les collisions dégradent tout le
        parc et des <strong>collisions en cascade</strong> peuvent survenir. Remorqueurs, recherche et améliorations de nettoyage
        deviennent indispensables.
      </p>
    ),
    tip: 'Achetez « Désorbitation automatique » et « Lancements groupés » : ils débloquent le matériel spatial.',
  },
  9: {
    mechanics: (
      <p>
        🌕 Datacenters lunaires et points de Lagrange. Tout matériel lancé depuis la Terre laisse des{' '}
        <strong>débris de lancement</strong> ; les lanceurs sans fusée (catapulte, ascenseur spatial) en suppriment l’essentiel.
      </p>
    ),
    tip: 'Plus vos lanceurs sans fusée assurent d’emport, moins vous avez de débris à nettoyer.',
  },
  10: {
    mechanics: (
      <p>
        🪐 <strong>La latence entre en jeu.</strong> Le matériel lointain 🐢 (Mars, astéroïdes) sert surtout les requêtes{' '}
        <strong>tolérantes à la latence</strong> (sauvegardes, simulations). Seule une part « pontée » sert aussi les requêtes ⚡ temps
        réel ; la recherche augmente ce pont.
      </p>
    ),
    tip: 'Gardez du matériel proche pour le temps réel : les jauges ⚡ et 🐢 sont séparées.',
  },
  11: {
    mechanics: (
      <p>
        ✨ <strong>Colonisation stellaire.</strong> Les sondes de von Neumann colonisent les étoiles voisines ; chaque décade d’étoiles
        augmente la demande. Le matériel interstellaire met du temps à arriver (⏳). Le trou de ver supprime la latence.
      </p>
    ),
    tip: 'Les sondes se multiplient toutes seules : achetez-les tôt.',
  },
  12: {
    mechanics: (
      <p>
        🌌 <strong>Dernière ère.</strong> Sphères de Dyson, cerveaux Matriochka et trous noirs. Objectif final : coloniser les 100 milliards
        d’étoiles de la Voie lactée.
      </p>
    ),
    tip: 'Les vaisseaux-graines accélèrent fortement la colonisation.',
  },
};

/** Nouveaux types de requêtes, équipements (par catégorie) et événements d'une ère. */
export function eraNewItems(era: number) {
  const requests = REQUEST_TYPES.filter((r) => r.era === era);
  const byCat = new Map<Category, string[]>();
  for (const b of BUILDINGS) {
    if (b.era !== era) continue;
    const list = byCat.get(b.cat) ?? [];
    list.push(`${b.icon} ${b.name}`);
    byCat.set(b.cat, list);
  }
  const buildings = CATEGORIES.filter((c) => byCat.has(c.id)).map((c) => ({ cat: c, names: byCat.get(c.id)! }));
  const events = EVENTS.filter((e) => e.era === era);
  return { requests, buildings, events };
}

/* ------------------------------------------------------------------------ */
/* Rubriques du menu d'aide                                                   */
/* ------------------------------------------------------------------------ */

export const HELP_TOPICS: Page[] = [
  {
    id: 'goal',
    icon: '🎯',
    title: 'Le but du jeu',
    body: (
      <>
        <p>
          Servir des requêtes rapporte de l’argent. L’argent achète de l’infrastructure, qui sert plus de requêtes. Les gains cumulés
          ouvrent l’ère suivante, du garage à la galaxie entière (12 ères).
        </p>
        <p>La partie se termine quand les 100 milliards d’étoiles de la Voie lactée sont colonisées.</p>
      </>
    ),
  },
  {
    id: 'resources',
    icon: '📟',
    title: 'Ressources et jauges',
    body: (
      <>
        <ul>
          <li>
            <strong>CPU, RAM, stockage, GPU, bande passante</strong> : consommés par les requêtes. Au-delà de 100 %, les requêtes en trop
            sont perdues.
          </li>
          <li>
            <strong>Électricité</strong> : consommation des machines × PUE. Au-delà de la capacité, toutes les machines ralentissent
            d’autant.
          </li>
          <li>
            <strong>Chaleur</strong> : au-delà du refroidissement, les machines brident leurs performances. Un refroidissement sobre baisse
            le PUE, donc la facture.
          </li>
          <li>
            <strong>Espace</strong> : emplacements de baie (U). Plein, plus aucune machine ne peut être installée.
          </li>
        </ul>
        <p>Cliquez sur une jauge pour aller aux équipements qui la remplissent ; survolez-la pour le détail.</p>
      </>
    ),
  },
  {
    id: 'demand',
    icon: '📈',
    title: 'Demande, commercial et réputation',
    body: (
      <>
        <p>
          La demande vient du trafic de base de l’ère, des équipements commerciaux, de la réputation (×0,5 à ×1,5) et des événements (buzz
          viral ×3, Black Friday ×2,5).
        </p>
        <p>
          Chaque requête perdue fait baisser la réputation, vite et fort, puis l’uptime, plus lentement. Une bonne règle : n’ajoutez des
          clients que quand vos jauges sont vertes.
        </p>
      </>
    ),
  },
  {
    id: 'caps',
    icon: '🔝',
    title: 'Les maximums par ère',
    body: (
      <>
        <p>
          Chaque équipement a un maximum pour l’ère en cours (« 12/25 » sous le compteur). Une fois atteint, le bouton affiche « ✓ MAX »
          et son infobulle indique le maximum de l’ère suivante.
        </p>
        <p>
          Les maximums sont calculés pour que, tout au maximum, l’infrastructure serve toute la demande, même pendant un pic ×3, avec juste
          ce qu’il faut d’électricité, de refroidissement, d’espace et d’emport. Si une jauge déborde alors que tout est au maximum,
          cherchez une amélioration ou une recherche (l’infobulle de la jauge le signale).
        </p>
      </>
    ),
  },
  {
    id: 'upgrades',
    icon: '⬆️',
    title: 'Améliorations et recherche',
    body: (
      <>
        <p>
          <strong>Paliers</strong> : 10, 25, 50, 100… exemplaires d’un serveur, d’un stockage, d’un réseau ou d’un commercial doublent sa
          production. Électricité et refroidissement s’améliorent selon vos records de consommation et de chaleur.
        </p>
        <p>
          <strong>Recherche</strong> (dès l’ère 2) : les points de R&amp;D viennent de l’équipe et des requêtes servies. Une recherche
          demande souvent d’en avoir terminé une autre.
        </p>
      </>
    ),
  },
  {
    id: 'incidents',
    icon: '🚨',
    title: 'Incidents',
    body: (
      <>
        <p>
          Un incident apparaît toutes les une à trois minutes environ. Certains se règlent en payant (quelques secondes de revenu) ;
          d’autres causent des dégâts, réparés peu à peu par vos sysadmins ou d’un coup en payant.
        </p>
        <ul>
          <li>🔌 coupure : onduleur (partiel) ou groupe électrogène (total) ;</li>
          <li>💥 panne de disque : le RAID divise les dégâts par deux ;</li>
          <li>☠️ DDoS : pare-feu applicatif ou CDN ;</li>
          <li>💫 collisions en cascade : gardez les débris sous la capacité de nettoyage.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'eras',
    icon: '🚚',
    title: 'Changer d’ère',
    body: (
      <p>
        Il faut atteindre le seuil de gains cumulés de la partie, puis payer le déménagement (environ 30 % du seuil). Vous gardez tout votre
        matériel ; la nouvelle ère apporte plus de capacité de base, de nouveaux équipements, de nouveaux types de requêtes et des
        maximums plus élevés.
      </p>
    ),
  },
  {
    id: 'space',
    icon: '🚀',
    title: 'Espace : emport, débris, latence',
    body: (
      <>
        <ul>
          <li>
            <strong>Emport</strong> (ère 7+) : le matériel spatial consomme la capacité de vos lanceurs, y compris celui en route.
          </li>
          <li>
            <strong>Débris</strong> : satellites et lancements en produisent. Au-delà du nettoyage, l’efficacité chute et les collisions se
            multiplient. Les lanceurs sans fusée réduisent les débris de lancement.
          </li>
          <li>
            <strong>Latence</strong> (ère 10+) : le matériel lointain 🐢 sert les requêtes tolérantes ; une part pontée sert aussi le temps
            réel ⚡.
          </li>
          <li>
            <strong>Voyage</strong> (ère 11+) : le matériel interstellaire met plusieurs minutes à arriver (⏳).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'prestige',
    icon: '🔔',
    title: 'Bourse (prestige)',
    body: (
      <p>
        Dès l’ère 4, vous pouvez introduire votre société en bourse : la partie recommence, mais vous recevez des actions selon vos gains.
        Chaque action augmente tous vos revenus, et elles s’échangent contre des avantages permanents (départ plus rapide, gains hors
        ligne, logistique spatiale…).
      </p>
    ),
  },
  {
    id: 'offline',
    icon: '🌙',
    title: 'Hors ligne et sauvegarde',
    body: (
      <p>
        La partie est sauvegardée automatiquement dans le navigateur. Pendant votre absence, vos serveurs continuent de tourner (jusqu’à 2
        heures, à 50 % d’efficacité ; la Bourse permet d’améliorer les deux). Dans les Options, un code de transfert permet de reprendre la
        partie sur un autre appareil.
      </p>
    ),
  },
];
