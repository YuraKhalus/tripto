import { Badge } from "../../../../components/ui/Badge/Badge";
import styles from './BadgesSection.module.css'

const TONES = [
    { tone: 'purple', label: 'Best Value' },
    { tone: 'blue', label: 'Guest Favourite' },
    { tone: 'navy', label: 'Best Location' },
    { tone: 'green', label: 'Getaway Deal' },
    { tone: 'yellow', label: 'New Listing' }
];
const SIZES = ['md', 'sm'];
const SHAPES = ['round', 'sharp'];

export function BadgesSection() {
    return (
        <div className={styles.showcase}>
            <h2>Badge</h2>
            <div className={styles.container}>
                {SIZES.map((size) => (
                    SHAPES.map((shape) => (
                        <div
                            key={`${shape}-${size}`}
                            className={styles.column}
                        >
                            {TONES.map(({ tone, label }) => (
                                <Badge
                                    key={tone}
                                    tone={tone}
                                    shape={shape}
                                    size={size}
                                >
                                    {label}
                                </Badge>
                            ))}
                        </div>
                    ))
                ))}   
            </div>
        </div>
    );
}