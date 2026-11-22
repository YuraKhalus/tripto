import Star from "../../layout/icons/Star";
import styles from './RatingStars.module.css'

export default function RatingStars({value, size}) {
    
    const stars = Math.round(value)
    const starsElements = []

    for (let i = 0; i < 5; i++) {
        starsElements.push(<Star/>)
    }

    return (
        <div className={`${styles.stars} ${styles[`stars-${stars}`]}`}>
            {starsElements}
        </div>
    )
}