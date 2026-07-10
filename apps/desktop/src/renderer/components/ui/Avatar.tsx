import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 32 }: AvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() || '?';
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
