import styles from './Badge.module.css';

/**
 * tone: purple | blue | navy | green | yellow - кольори бейджу (default: purple)
 * shape: round | sharp - форма бейджу (default: round)
 * size: sm | md - розмір бейджу (default: md)
 */

export function Badge({ tone = 'purple', shape = 'round', size = 'md', children }) {
  return <span className={`${styles.badge} ${styles[tone]} ${styles[shape]} ${styles[size]}`}>{children}</span>;
}
