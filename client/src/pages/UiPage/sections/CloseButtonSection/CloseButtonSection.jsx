import styles from './CloseButtonSection.module.css';
import { CloseButton } from '../../../../components/ui/CloseButton/CloseButton';

const SIZES = ['sm', 'md', 'lg'];

const STATES = [
  { name: 'Default', isHover: false },
  { name: 'Hover', isHover: true },
];

export function CloseButtonSection() {
  return (
    <div className={styles.showcase}>
      <h2>Close Button</h2>
      <div className={styles.container}>
        {STATES.map(({ name, isHover }) => (
          <div key={name} className={`${styles.column} ${isHover ? styles.hover : ''}`}>
            <h3>{name}</h3>

            {SIZES.map((size) => (
              <CloseButton key={size} size={size} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
