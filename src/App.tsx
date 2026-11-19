import { useRef, useState, type CSSProperties } from 'react';
import { TopBar } from './ui/components/TopBar';
import { ServerRoom } from './ui/components/ServerRoom';
import { EraPanel } from './ui/components/EraPanel';
import { ResourceGauges } from './ui/components/ResourceGauges';
import { RequestsPanel } from './ui/components/RequestsPanel';
import { IncidentsPanel } from './ui/components/IncidentsPanel';
import { EventLog } from './ui/components/EventLog';
import { Shop } from './ui/components/Shop';
import { UpgradesGrid } from './ui/components/UpgradesGrid';
import { ResearchTree } from './ui/components/ResearchTree';
import { Achievements } from './ui/components/Achievements';
import { StatsPanel } from './ui/components/StatsPanel';
import { PrestigePanel } from './ui/components/PrestigePanel';
import { Settings } from './ui/components/Settings';
import { Toasts } from './ui/components/Toasts';
import { OfflineModal } from './ui/components/OfflineModal';
import { EraTransition } from './ui/components/EraTransition';
import { ImportConfirm } from './ui/components/ImportConfirm';
import { EVENT_BY_ID } from './game/data/events';
import { useGame } from './game/store';
import { UPGRADES } from './game/data/upgrades';
import { RESEARCH } from './game/data/research';
import { researchAvailable, upgradeAvailable } from './game/engine/actions';
import { MOBILE_QUERY, WIDE_MOBILE_QUERY, useMediaQuery } from './ui/useMediaQuery';
import { useFoldHinge, type Hinge } from './ui/useFoldPosture';
import { useUi, type DesktopTab, type MobileView } from './ui/uiStore';

type Tab = DesktopTab;

function TabBadge({ tab }: { tab: string }) {
  const n = useGame((g) => {
    const s = g.state;
    if (tab === 'upgrades') {
      return UPGRADES.filter((u) => upgradeAvailable(s, u.id) && u.cost * g.mods.cost <= s.money).length;
    }
    if (tab === 'research') {
      return RESEARCH.filter((r) => researchAvailable(s, r.id) && r.cost <= s.rd).length;
    }
    return 0;
  });
  return n > 0 ? <span className="badge">{n}</span> : null;
}

function useAlert() {
  return useGame((g) => g.state.events.some((e) => !EVENT_BY_ID[e.defId]?.good));
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'infra':
      return <Shop />;
    case 'upgrades':
      return <UpgradesGrid />;
    case 'research':
      return <ResearchTree />;
    case 'achievements':
      return <Achievements />;
    case 'stats':
      return <StatsPanel />;
    case 'prestige':
      return <PrestigePanel />;
    case 'settings':
      return <Settings />;
  }
}

function DesktopLayout() {
  const tab = useUi((u) => u.desktopTab);
  const setTab = useUi((u) => u.setDesktopTab);
  const era = useGame((g) => g.state.era);
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: 'infra', label: '🏗️ Infrastructure', show: true },
    { id: 'upgrades', label: '⬆️ Améliorations', show: true },
    { id: 'research', label: '🔬 Recherche', show: era >= 2 },
    { id: 'achievements', label: '🏆 Succès', show: true },
    { id: 'stats', label: '📊 Statistiques', show: true },
    { id: 'prestige', label: '🔔 Bourse', show: true },
    { id: 'settings', label: '⚙️ Options', show: true },
  ];

  return (
    <main className="layout">
      <aside className="col-left">
        <EraPanel />
        <IncidentsPanel />
        <ResourceGauges />
      </aside>
      <section className="col-center">
        <ServerRoom />
        <nav className="tabs">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
                <TabBadge tab={t.id} />
              </button>
            ))}
        </nav>
        <div className="tab-body">
          <TabContent tab={tab} />
        </div>
      </section>
      <aside className="col-right">
        <RequestsPanel />
        <EventLog />
      </aside>
    </main>
  );
}

/* ---------------- Mobile : une vue à la fois + barre de navigation en bas ---------------- */

type MView = MobileView;
type MoreTab = 'achievements' | 'stats' | 'prestige' | 'settings';

const MORE_TABS: { id: MoreTab; label: string }[] = [
  { id: 'achievements', label: '🏆 Succès' },
  { id: 'stats', label: '📊 Stats' },
  { id: 'prestige', label: '🔔 Bourse' },
  { id: 'settings', label: '⚙️ Options' },
];

/** Mode d'affichage mobile :
 *  - phone : une colonne, la page défile ;
 *  - wide  : écran large et presque carré (pliable déplié, petite tablette) → scène à gauche, vue à droite ;
 *  - flex  : pliable à moitié plié (charnière horizontale) → scène au-dessus du pli, commandes en dessous. */
type MobileMode = { kind: 'phone' } | { kind: 'wide' } | { kind: 'flex'; hinge: Hinge };

function MobileLayout({ mode }: { mode: MobileMode }) {
  const view = useUi((u) => u.mobileView);
  const setView = useUi((u) => u.setMobileView);
  const [more, setMore] = useState<MoreTab>('achievements');
  const era = useGame((g) => g.state.era);
  const alert = useAlert();
  const scroller = useRef<HTMLDivElement>(null);
  const current: MView = view === 'research' && era < 2 ? 'salle' : view;

  const views: { id: MView; icon: string; label: string; show: boolean }[] = [
    { id: 'salle', icon: '🖥️', label: 'Salle', show: true },
    { id: 'infra', icon: '🏗️', label: 'Infra', show: true },
    { id: 'upgrades', icon: '⬆️', label: 'Amélio.', show: true },
    { id: 'research', icon: '🔬', label: 'R&D', show: era >= 2 },
    { id: 'etat', icon: '📟', label: 'État', show: true },
    { id: 'plus', icon: '☰', label: 'Plus', show: true },
  ];

  const go = (v: MView) => {
    if (v !== current) {
      window.scrollTo({ top: 0 });
      scroller.current?.scrollTo({ top: 0 });
    }
    setView(v);
  };

  // En mode wide/flex la scène a sa place fixe ; sinon elle reste visible (en compact)
  // là où on dépense, pour pouvoir cliquer entre deux achats.
  const docked = mode.kind !== 'phone';
  const sceneCompact = !docked && (current === 'infra' || current === 'upgrades');
  const showScene = !docked && (current === 'salle' || sceneCompact);

  const content = (
    <>
      {showScene && <ServerRoom compact={sceneCompact} />}
      {current === 'salle' && (
        <>
          {mode.kind !== 'wide' && <IncidentsPanel />}
          <ResourceGauges />
        </>
      )}
      {current === 'infra' && <Shop />}
      {current === 'upgrades' && <UpgradesGrid />}
      {current === 'research' && <ResearchTree />}
      {current === 'etat' && (
        <>
          <EraPanel />
          <RequestsPanel />
          <EventLog />
        </>
      )}
      {current === 'plus' && (
        <>
          <nav className="m-subtabs">
            {MORE_TABS.map((t) => (
              <button key={t.id} className={`tab ${more === t.id ? 'active' : ''}`} onClick={() => setMore(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          <TabContent tab={more} />
        </>
      )}
    </>
  );

  const nav = (
    <nav className="bottom-nav" aria-label="Navigation">
      {views
        .filter((v) => v.show)
        .map((v) => (
          <button
            key={v.id}
            className={`bottom-nav-item ${current === v.id ? 'active' : ''}`}
            onClick={() => go(v.id)}
            aria-current={current === v.id ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">
              {v.icon}
              {v.id === 'salle' && alert && <span className="badge alert">!</span>}
              <TabBadge tab={v.id} />
            </span>
            <span className="bottom-nav-label">{v.label}</span>
          </button>
        ))}
    </nav>
  );

  if (mode.kind === 'flex') {
    const { top, bottom } = mode.hinge;
    return (
      <div className="m-shell m-flex" style={{ '--hinge-top': `${top}px`, '--hinge-bottom': `${bottom}px` } as CSSProperties}>
        <div className="m-flex-top">
          <TopBar />
          <ServerRoom />
        </div>
        <div className="m-flex-bottom">
          <main className="m-scroll m-layout" ref={scroller}>
            {content}
          </main>
          {nav}
        </div>
      </div>
    );
  }

  if (mode.kind === 'wide') {
    return (
      <div className="m-shell m-wide">
        <TopBar />
        <div className="m-wide-cols">
          <aside className="m-scroll m-wide-side">
            <ServerRoom />
            <IncidentsPanel />
          </aside>
          <main className="m-scroll m-layout" ref={scroller}>
            {content}
          </main>
        </div>
        {nav}
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <main className="m-layout">{content}</main>
      {nav}
    </>
  );
}

export default function App() {
  const era = useGame((g) => g.state.era);
  const alert = useAlert();
  const narrow = useMediaQuery(MOBILE_QUERY);
  const wide = useMediaQuery(WIDE_MOBILE_QUERY);
  const hinge = useFoldHinge();

  const mode: MobileMode | null = hinge ? { kind: 'flex', hinge } : !narrow ? null : wide ? { kind: 'wide' } : { kind: 'phone' };

  return (
    <div className={`app era-${era} ${mode ? `is-mobile m-${mode.kind}` : ''}`}>
      {mode ? (
        <MobileLayout mode={mode} />
      ) : (
        <>
          <TopBar />
          <DesktopLayout />
        </>
      )}
      {alert && <div className="alert-vignette" aria-hidden="true" />}
      <Toasts />
      <OfflineModal />
      <EraTransition />
      <ImportConfirm />
    </div>
  );
}
