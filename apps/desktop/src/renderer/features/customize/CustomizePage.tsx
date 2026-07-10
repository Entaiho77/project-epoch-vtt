import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import {
  backgroundOptionList,
  classOptionList,
  deleteHomebrewBackground,
  deleteHomebrewClass,
  deleteHomebrewEquipment,
  deleteHomebrewFeat,
  deleteHomebrewMonster,
  deleteHomebrewRace,
  equipmentList,
  featOptionList,
  homebrewList,
  raceOptionList,
  useLibrary,
  type HomebrewBackground,
  type HomebrewClass,
  type HomebrewEquipment,
  type HomebrewFeat,
  type HomebrewMonster,
  type HomebrewRace,
} from '../../data/homebrew';
import { dnd5eSystem } from '@solryn/systems/dnd5e/index';
import { Button } from '../../components/ui/Button';
import { HomebrewMonsterForm } from '../board/drawers/HomebrewMonsterForm';
import { HomebrewEquipmentForm } from '../board/drawers/HomebrewEquipmentForm';
import { HomebrewBackgroundForm } from '../board/drawers/HomebrewBackgroundForm';
import { HomebrewFeatForm } from '../board/drawers/HomebrewFeatForm';
import { HomebrewRaceForm } from '../board/drawers/HomebrewRaceForm';
import { HomebrewClassForm } from '../board/drawers/HomebrewClassForm';
import { RulesEditor } from './RulesEditor';
import d from '../board/drawers/drawers.module.css';
import s from './CustomizePage.module.css';

type Tab = 'monsters' | 'equipment' | 'options' | 'rules';

const TABS: { id: Tab; label: string }[] = [
  { id: 'monsters', label: 'Monsters' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'options', label: 'Player Options' },
  { id: 'rules', label: 'Rules' },
];

/**
 * The DM Customization page — a full-page editor for the DM's account-wide library
 * (users/$uid/library), shared across all their games. Reachable at /library (from the lobby) and
 * /game/:gameId/customize (from the board's GM toolbar). All content is account-scoped; the
 * optional gameId is only used for the "back to game" link.
 */
export function CustomizePage() {
  const { gameId } = useParams<{ gameId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { library } = useLibrary(uid);
  const [tab, setTab] = useState<Tab>('monsters');

  // Form modals: undefined = closed, null = new, item = editing that one.
  const [monsterForm, setMonsterForm] = useState<HomebrewMonster | null | undefined>(undefined);
  const [eqForm, setEqForm] = useState<HomebrewEquipment | null | undefined>(undefined);
  const [bgForm, setBgForm] = useState<HomebrewBackground | null | undefined>(undefined);
  const [featForm, setFeatForm] = useState<HomebrewFeat | null | undefined>(undefined);
  const [raceForm, setRaceForm] = useState<HomebrewRace | null | undefined>(undefined);
  const [classForm, setClassForm] = useState<HomebrewClass | null | undefined>(undefined);

  const monsters = homebrewList(library?.monsters);
  const equipment = equipmentList(library?.equipment);
  const backgrounds = backgroundOptionList(library?.playerOptions?.backgrounds);
  const feats = featOptionList(library?.playerOptions?.feats);
  const races = raceOptionList(library?.playerOptions?.races);
  const classes = classOptionList(library?.playerOptions?.classes);
  const skillOptions = dnd5eSystem.skills.map((sk) => ({ id: sk.id, name: sk.name }));
  const skillName = (id: string) => skillOptions.find((sk) => sk.id === id)?.name ?? id;

  if (!uid) return null;

  // One create/edit/delete list block, shared by every section.
  function listBlock<T extends { id: string; name: string }>(
    title: string,
    newLabel: string,
    items: T[],
    meta: (it: T) => string,
    onNew: () => void,
    onEdit: (it: T) => void,
    onDelete: (id: string) => void,
    emptyHint: string,
  ) {
    return (
      <div className={s.section}>
        <div className={s.sectionHead}>
          <span className={s.sectionTitle}>{title}</span>
          <Button size="sm" onClick={onNew}>{newLabel}</Button>
        </div>
        <div className={d.list}>
          {items.length === 0 && <p className={d.hint}>{emptyHint}</p>}
          {items.map((it) => (
            <div key={it.id} className={d.item}>
              <span className={d.itemMain}>
                <span className={d.itemName}>{it.name}</span>
                <span className={d.itemMeta}>{meta(it)}</span>
              </span>
              <button className={d.place} onClick={() => onEdit(it)}>Edit</button>
              <button
                className={d.place}
                style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
                onClick={() => onDelete(it.id)}
                aria-label={`Delete ${it.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <header className={s.topbar}>
        <div className={s.titleBlock}>
          <button
            className={s.back}
            onClick={() => navigate(gameId ? `/game/${gameId}` : '/')}
          >
            {gameId ? '‹ Back to game' : '‹ Lobby'}
          </button>
          <span className={s.glyph} aria-hidden="true">📖</span>
          <span className={s.title}>My Library</span>
        </div>
      </header>

      <main className={s.body}>
        <div className={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${s.tab} ${tab === t.id ? s.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'monsters' &&
          listBlock(
            'Monsters',
            '+ New Monster',
            monsters,
            (m) => `${m.size} ${m.type} · HP ${m.hp} · AC ${m.ac} · CR ${m.cr}`,
            () => setMonsterForm(null),
            (m) => setMonsterForm(m),
            (id) => void deleteHomebrewMonster(uid, id),
            'No monsters yet. Create one, then spawn it from any of your games.',
          )}

        {tab === 'equipment' &&
          listBlock(
            'Equipment',
            '+ New Equipment',
            equipment,
            (e) =>
              `${e.category}` +
              (e.category === 'weapon' && e.damageDice ? ` · ${e.damageDice} ${e.damageType ?? ''}` : '') +
              (e.category === 'armor' && e.baseAc !== undefined ? ` · AC ${e.baseAc}` : ''),
            () => setEqForm(null),
            (e) => setEqForm(e),
            (id) => void deleteHomebrewEquipment(uid, id),
            'No equipment yet. Create items, then attach them to monsters as loot.',
          )}

        {tab === 'options' && (
          <>
            <p className={d.hint}>Player options appear in the character builder and level-up alongside SRD content.</p>
            {listBlock(
              'Backgrounds',
              '+ New',
              backgrounds,
              (b) => b.skillProficiencies.map(skillName).join(', '),
              () => setBgForm(null),
              (b) => setBgForm(b),
              (id) => void deleteHomebrewBackground(uid, id),
              'None yet.',
            )}
            {listBlock(
              'Feats',
              '+ New',
              feats,
              (f) =>
                f.displayOnly
                  ? 'narrative'
                  : f.prerequisiteAbility
                    ? `requires ${f.prerequisiteAbility} ${f.prerequisiteScore ?? ''}`.trim()
                    : 'feat',
              () => setFeatForm(null),
              (f) => setFeatForm(f),
              (id) => void deleteHomebrewFeat(uid, id),
              'None yet.',
            )}
            {listBlock(
              'Races',
              '+ New',
              races,
              (r) => `${r.size} · ${r.speed} ft${r.darkvision ? ` · darkvision ${r.darkvision}` : ''}`,
              () => setRaceForm(null),
              (r) => setRaceForm(r),
              (id) => void deleteHomebrewRace(uid, id),
              'None yet.',
            )}
            {listBlock(
              'Classes',
              '+ New',
              classes,
              (c) => `d${c.hitDie} · saves ${c.savingThrows.join('/')}${c.spellcasting ? ` · ${c.spellcasting.casterType} caster` : ''}`,
              () => setClassForm(null),
              (c) => setClassForm(c),
              (id) => void deleteHomebrewClass(uid, id),
              'None yet.',
            )}
          </>
        )}

        {tab === 'rules' && <RulesEditor uid={uid} />}
      </main>

      {monsterForm !== undefined && (
        <HomebrewMonsterForm uid={uid} equipment={equipment} existing={monsterForm ?? undefined} onClose={() => setMonsterForm(undefined)} />
      )}
      {eqForm !== undefined && (
        <HomebrewEquipmentForm uid={uid} existing={eqForm ?? undefined} onClose={() => setEqForm(undefined)} />
      )}
      {bgForm !== undefined && (
        <HomebrewBackgroundForm uid={uid} skills={skillOptions} existing={bgForm ?? undefined} onClose={() => setBgForm(undefined)} />
      )}
      {featForm !== undefined && (
        <HomebrewFeatForm uid={uid} existing={featForm ?? undefined} onClose={() => setFeatForm(undefined)} />
      )}
      {raceForm !== undefined && (
        <HomebrewRaceForm uid={uid} existing={raceForm ?? undefined} onClose={() => setRaceForm(undefined)} />
      )}
      {classForm !== undefined && (
        <HomebrewClassForm uid={uid} skills={skillOptions} existing={classForm ?? undefined} onClose={() => setClassForm(undefined)} />
      )}
    </div>
  );
}
