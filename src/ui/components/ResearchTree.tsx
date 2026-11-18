import { useGame } from '../../game/store';
import { BRANCHES, RESEARCH, RESEARCH_BY_ID } from '../../game/data/research';
import { researchAvailable } from '../../game/engine/actions';
import { duration, fmt } from '../format';

export function ResearchTree() {
  const s = useGame((g) => g.state);
  const rdRate = useGame((g) => g.snap.rdRate);
  const buy = useGame((g) => g.buyResearch);
  return (
    <div className="research">
      <p className="muted">
        Points R&amp;D : <strong>{fmt(s.rd)}</strong> (+{fmt(rdRate)}/s). Embauchez des ingénieurs R&amp;D (onglet Équipe) pour en produire.
      </p>
      <div className="branches">
        {BRANCHES.map((br) => (
          <div key={br.id} className="branch">
            <h4>
              {br.icon} {br.name}
            </h4>
            {RESEARCH.filter((r) => r.branch === br.id).map((r) => {
              const done = !!s.research[r.id];
              const avail = researchAvailable(s, r.id);
              const affordable = avail && s.rd >= r.cost;
              const lockedEra = r.era > s.era;
              const missing = r.prereq.filter((p) => !s.research[p]);
              return (
                <button
                  key={r.id}
                  className={`node ${done ? 'done' : affordable ? 'ready' : avail ? 'avail' : 'locked'}`}
                  disabled={!affordable}
                  onClick={() => buy(r.id)}
                >
                  <span className="node-title">
                    {r.icon} {r.name}
                  </span>
                  <span className="node-desc">{r.desc}</span>
                  <span className="node-cost">
                    {done
                      ? '✔ Terminée'
                      : lockedEra
                        ? `🔒 Ère ${r.era}`
                        : missing.length
                          ? `Requiert : ${missing.map((p) => RESEARCH_BY_ID[p].name).join(', ')}`
                          : `${fmt(r.cost)} R&D${!affordable && rdRate > 0 ? ` · ${duration((r.cost - s.rd) / rdRate)}` : ''}`}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
