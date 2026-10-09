import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { useLibrary } from '../../data/homebrew';
import icoMonster from '../../assets/icons/icon-monster.png';
import { PasteParserFlow } from './PasteParserFlow';
import { BestiaryPanel } from './BestiaryPanel';
import s from './dmtools.module.css';

type Tool = 'paste-parser';

const TOOLS: { id: Tool; label: string; description: string }[] = [
  { id: 'paste-parser', label: 'Paste a stat block', description: 'Turn a pasted or uploaded stat block into a creature in your library.' },
];

/**
 * The DM Tools page — a sibling screen to the lobby (Matthew, voice, 2026-10-09): "a
 * supplementary page... you click a button and it takes you to this section to work in."
 * Left side is a menu of tools (just paste-parser for now); right side is the universal
 * bestiary, always visible so the DM can confirm a save landed.
 */
export function DmToolsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { library } = useLibrary(uid);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [justSaved, setJustSaved] = useState<string | null>(null);

  if (!uid) return null;

  return (
    <div className={s.page}>
      <header className={s.topbar}>
        <div className={s.titleBlock}>
          <img className={s.glyph} src={icoMonster} alt="" aria-hidden="true" width={20} height={20} />
          <span className={s.title}>DM Tools</span>
        </div>
        <button className={s.back} onClick={() => navigate('/')}>‹ Lobby</button>
      </header>

      <main className={s.body}>
        <div className={s.leftPanel}>
          {activeTool === 'paste-parser' ? (
            <>
              <button className={s.back} onClick={() => setActiveTool(null)}>‹ Tools</button>
              <PasteParserFlow uid={uid} onSaved={(name) => setJustSaved(name)} />
            </>
          ) : (
            <div className={s.toolMenu}>
              <h3 className={s.stepTitle}>Tools</h3>
              {TOOLS.map((t) => (
                <button key={t.id} className={s.toolMenuItem} onClick={() => setActiveTool(t.id)}>
                  <span className={s.toolMenuItemLabel}>{t.label}</span>
                  <span className={s.toolMenuItemDesc}>{t.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={s.rightPanel}>
          <BestiaryPanel uid={uid} library={library} highlightName={justSaved} />
        </div>
      </main>
    </div>
  );
}
