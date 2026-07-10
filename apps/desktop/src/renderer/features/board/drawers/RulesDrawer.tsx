import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Role } from '@solryn/shared-types';
import { resolveRules, type CampaignRules, type CritFormula } from '../../../data/homebrew';
import s from './drawers.module.css';

/** One collapsible reference entry: name-only until clicked, then its description. */
function RuleItem({
  name,
  description,
  details,
  open,
  onToggle,
}: {
  name: string;
  description: string;
  details?: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={s.ruleRow}>
      <button type="button" className={s.ruleHead} onClick={onToggle} aria-expanded={open}>
        <span className={s.itemName}>{name}</span>
        <span className={s.caret} aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div className={s.preview}>
          <p className={s.hint} style={{ margin: 0 }}>
            {description}
          </p>
          {details && (
            <p className={s.hint} style={{ opacity: 0.8, margin: 'var(--space-1) 0 0' }}>
              {details}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const CRIT_FORMULA_LABELS: Record<CritFormula, string> = {
  double_dice: 'Double dice',
  max_plus_roll: 'Max die + roll',
  roll_then_double: 'Roll then double',
  max_then_double: 'Max then double',
  custom: 'Custom formula',
};
const STARTING_HP_LABELS: Record<CampaignRules['startingHp'], string> = {
  max: 'Maximum',
  average: 'Average',
  rolled: 'Rolled',
};
const onOff = (b: boolean) => (b ? 'On' : 'Off');

/** A single "Label: value" line in the campaign-rules summary. */
function RuleLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
      <span className={s.itemMeta}>{label}</span>
      <strong style={{ textAlign: 'right' }}>{value}</strong>
    </div>
  );
}

/**
 * Read-only quick reference: the DM's campaign rules (mechanized + display-only) and house rules,
 * plus the system's rules cards and conditions. Everyone at the table sees the house rules; the GM
 * gets an "Edit in Library" shortcut to the Customization page.
 */
export function RulesDrawer({
  system,
  rules,
  role,
  gameId,
}: {
  system: SystemDefinition;
  rules?: CampaignRules;
  role?: Role;
  gameId?: string;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  // Manually-expanded entry ids. An active search expands every shown match on top of these
  // so you can read why it matched — the search filter itself is unchanged.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const query = q.trim().toLowerCase();

  const r = resolveRules(rules);
  const houseRules = Object.values(r.houseRules ?? {});
  const critsOn = r.critThreshold >= 20 ? '20 (natural)' : `${r.critThreshold}–20`;

  const cards = system.rulesReference.filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query),
  );
  const conditions = system.conditions.filter(
    (c) => !query || c.name.toLowerCase().includes(query),
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const isOpen = (id: string) => query !== '' || expanded.has(id);

  return (
    <div className={s.section}>
      {/* Campaign rules — the DM's homebrew rule configuration (read-only for the table). */}
      <div className={s.section} style={{ gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={s.label}>Campaign rules</span>
          {role === 'gm' && gameId && (
            <button className={s.place} onClick={() => navigate(`/game/${gameId}/customize`)}>Edit in Library</button>
          )}
        </div>
        <RuleLine label="Crits on" value={critsOn} />
        <RuleLine label="Crit damage" value={CRIT_FORMULA_LABELS[r.critFormula]} />
        <RuleLine label="Death saves" value={`${r.deathSaveFailures} failures`} />
        <RuleLine label="Starting HP" value={STARTING_HP_LABELS[r.startingHp]} />
        <RuleLine label="Flanking" value={onOff(r.flanking)} />
        <RuleLine label="Multiclassing" value={onOff(r.multiclassing)} />
        <RuleLine label="Feats" value={onOff(r.feats)} />
        <RuleLine label="Inspiration" value={onOff(r.inspiration)} />
        <RuleLine label="Encumbrance" value={onOff(r.encumbrance)} />
      </div>

      {houseRules.length > 0 && (
        <>
          <span className={s.label}>House rules</span>
          <div className={s.list}>
            {houseRules.map((h, i) => (
              <div key={i} className={s.ruleRow} style={{ padding: 'var(--space-1) 0' }}>
                <span className={s.itemName}>{h.title}</span>
                {h.description && (
                  <p className={s.hint} style={{ margin: 'var(--space-1) 0 0' }}>{h.description}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <span className={s.label}>{system.name} reference</span>
      <input
        className={s.input}
        placeholder={`Search ${system.name} rules…`}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={s.list}>
        {cards.map((c) => (
          <RuleItem
            key={c.id}
            name={c.name}
            description={c.description}
            details={c.details}
            open={isOpen(`card:${c.id}`)}
            onToggle={() => toggle(`card:${c.id}`)}
          />
        ))}
      </div>

      {conditions.length > 0 && (
        <>
          <span className={s.label}>Conditions</span>
          <div className={s.list}>
            {conditions.map((c) => (
              <RuleItem
                key={c.id}
                name={c.name}
                description={c.description}
                open={isOpen(`cond:${c.id}`)}
                onToggle={() => toggle(`cond:${c.id}`)}
              />
            ))}
          </div>
        </>
      )}

      {cards.length === 0 && conditions.length === 0 && (
        <p className={s.hint}>Nothing matches “{q}”.</p>
      )}
    </div>
  );
}
