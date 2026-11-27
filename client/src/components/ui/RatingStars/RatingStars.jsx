import Star from "../../icons/Star";
import styles from './RatingStars.module.css'

export default function RatingStars({value, size, starsFiling = 'classic'}) {
    const stars = Math.round(+value)
    const starsElements = []

    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starsElements.push(<Star key={i} className={styles.active}/>)
            continue;
        }

        if (starsFiling === 'full') {
            starsElements.push(<Star key={i}/>)
        }
    }

    return (
        <div className={`${styles.stars}`} aria-label={`Рейтинг ${stars} з 5`}>
            {starsElements}
        </div>
    )
}