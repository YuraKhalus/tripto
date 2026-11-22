import styles from './Spinner.module.css';
// size: sm | md | lg. Колір — currentColor батька
export function Spinner({ size = 'md', label = 'Завантаження' }) {
  return (
    <span
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-label={label}
    />
  );
}