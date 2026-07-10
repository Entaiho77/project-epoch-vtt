import type { ReactNode } from 'react';
import type { Role } from '@solryn/shared-types';
import styles from './Badge.module.css';

type Tone = 'teal' | 'gray' | 'amber' | 'purple';

export function Badge({
  tone = 'gray',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

/** GM teal / Player gray, per §4.2. */
export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge tone={role === 'gm' ? 'teal' : 'gray'}>
      {role === 'gm' ? 'GM' : 'Player'}
    </Badge>
  );
}
