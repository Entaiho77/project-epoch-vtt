import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { useLibrary } from '../../data/homebrew';
import icoMonster from '../../assets/icons/icon-monster.png';
import { BestiaryPanel } from './BestiaryPanel';
import s from './dmtools.module.css';

/**
 * The DM Tools page — a sibling screen to the lobby (Matthew, voice, 2026-10-09): "a
 * supplementary page... you click a button and it takes you to this section to work in."
 *
 * The paste-parser tool (text/screenshot → creature) was pulled back out (Matthew, voice,
 * 2026-10-09): the parser itself wasn't working, and he has a different design for it planned
 * for later. For now this page is just the universal bestiary — the tool menu comes back once
 * there's a working tool to put in it.
 */
export function DmToolsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { library } = useLibrary(uid);

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
        <div className={s.rightPanel}>
          <BestiaryPanel uid={uid} library={library} />
        </div>
      </main>
    </div>
  );
}
