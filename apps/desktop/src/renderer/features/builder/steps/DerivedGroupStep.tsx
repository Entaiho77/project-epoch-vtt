import type { ReactNode } from 'react';
import { StepFrame } from '../StepFrame';
import type { StepProps } from '../stepTypes';
import { computeDerived } from '@solryn/engine';
import { effectiveScores, equipmentContext, type InfoCard } from '../builderModel';
import s from './steps.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

/**
 * Consolidated "show, don't ask" page: up to four read-only stat cards (derived stats, plus
 * reputation), each with its computed value and the full explanation of how it's worked out.
 * No Solryn special-casing — it just renders whatever cards the step plan hands it.
 */
export function DerivedGroupStep({
  system,
  draft,
  nav,
  cards,
}: StepProps & { cards: InfoCard[] }) {
  const results = computeDerived(
    system,
    effectiveScores(system, draft),
    equipmentContext(system, draft),
  );

  const teaching = (
    <p className={s.teachText}>
      Every one of these is worked out from your rolled stats — there’s nothing to choose.
      Each card shows its value and the formula behind it.
    </p>
  );

  return (
    <StepFrame {...nav} teaching={teaching}>
      <div className={s.infoStack}>
        {cards.map((card) => {
          if (card.type === 'reputation') {
            return (
              <InfoStatCard key="reputation" name="Reputation" value={String(system.creation.startingReputation)}>
                <p className={s.note}>
                  Solryn has <strong>no alignment system</strong> — everyone begins here, and
                  your standing grows from what you do in play. The GM tracks it, and it can
                  vary by faction or region: a hero to one town may be a villain to another.
                </p>
              </InfoStatCard>
            );
          }

          const ds = system.derivedStats.find((d) => d.id === card.derivedId)!;
          const r = results.find((x) => x.id === card.derivedId)!;
          const colorClass =
            r.color === 'purple' ? s.purple : r.color === 'amber' ? s.amber : '';

          if (r.isRoll) {
            return (
              <InfoStatCard
                key={card.derivedId}
                name={ds.name}
                value={sign(r.value)}
                valueClass={colorClass}
                tag="modifier"
              >
                <span className={s.formula}>
                  {r.die} + {sign(r.value)} · rolled at the start of every combat
                </span>
                <p className={s.note}>{ds.description} Players win ties against monsters.</p>
              </InfoStatCard>
            );
          }

          return (
            <InfoStatCard
              key={card.derivedId}
              name={ds.name}
              value={String(r.value)}
              valueClass={colorClass}
              unit={ds.unit}
              tag={r.pending ? 'so far' : undefined}
            >
              <span className={s.formula}>{r.breakdown}</span>
              <p className={s.note}>{ds.description}</p>
              {r.pending && (
                <p className={s.pendingNote}>
                  The armor piece is added at the end — your {ds.name} finalizes when you pick
                  starting gear.
                </p>
              )}
            </InfoStatCard>
          );
        })}
      </div>
    </StepFrame>
  );
}

function InfoStatCard({
  name,
  value,
  valueClass = '',
  unit,
  tag,
  children,
}: {
  name: string;
  value: string;
  valueClass?: string;
  unit?: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <div className={s.infoCard}>
      <div className={s.infoCardHead}>
        <span className={s.infoCardName}>{name}</span>
        <span className={s.infoCardValueWrap}>
          <span className={`${s.infoCardValue} ${valueClass}`.trim()}>{value}</span>
          {unit && <span className={s.infoCardUnit}>{unit}</span>}
          {tag && <span className={s.infoCardUnit}>{tag}</span>}
        </span>
      </div>
      <div className={s.infoCardBody}>{children}</div>
    </div>
  );
}
