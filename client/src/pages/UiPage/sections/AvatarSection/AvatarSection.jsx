import { Avatar } from '../../../../components/ui/Avatar/Avatar';
import styles from './AvatarSection.module.css';

const SIZES = ['xl', 'lg', 'md', 'sm'];
const URL = 'https://reqres.in/img/faces/2-image.jpg';
const NAME = 'Alyssa Whiteford';

const VARIANTS = [{ type: 'image', src: URL }, { type: 'icon' }, { type: 'letter', name: NAME }];

export function AvatarSection() {
  return (
    <div className={styles.showcase}>
      <h2>Avatar</h2>
      <div className={styles.container}>
        {VARIANTS.map((variant) => (
          <div className={styles.row} key={variant.type}>
            {SIZES.map((size) => (
              <Avatar key={size} size={size} name={variant.name} src={variant.src} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
