import { useState } from 'react';
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
import { useGame } from './game/store';
import { UPGRADES } from './game/data/upgrades';
import { RESEARCH } from './game/data/research';
import { researchAvailable, upgradeAvailable } from './game/engine/actions';

type Tab = 'infra' | 'upgrades' | 'research' | 'achievements' | 'stats' | 'prestige' | 'settings';

function TabBadge({ tab }: { tab: Tab }) {
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

export default function App() {
  const [tab, setTab] = useState<Tab>('infra');
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
    <div className={`app era-${era}`}>
      <TopBar />
      <main className="layout">
        <aside className="col-left">
          <ServerRoom />
          <EraPanel />
          <IncidentsPanel />
          <ResourceGauges />
        </aside>
        <section className="col-center">
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
            {tab === 'infra' && <Shop />}
            {tab === 'upgrades' && <UpgradesGrid />}
            {tab === 'research' && <ResearchTree />}
            {tab === 'achievements' && <Achievements />}
            {tab === 'stats' && <StatsPanel />}
            {tab === 'prestige' && <PrestigePanel />}
            {tab === 'settings' && <Settings />}
          </div>
        </section>
        <aside className="col-right">
          <RequestsPanel />
          <EventLog />
        </aside>
      </main>
      <Toasts />
      <OfflineModal />
    </div>
  );
}
