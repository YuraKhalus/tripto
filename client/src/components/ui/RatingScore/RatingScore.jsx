import styles from './RatingScore.module.css'
import getRatingLabel from "../../../utils/rating";

export default function RatingScore({score, reviewsCount, layout}) {
    const label = getRatingLabel(+score);

    const classRating = label === 'Excellent' ? styles.excellent : ''

    return (
        <div className={`${styles.guestRatingBadge} ${layout === 'inline' ? styles.guestRatingBadgeInline : ''}`}>
            <div className={`${layout === 'inline' ? styles.reviews : ''}`}>
                <p className={`${styles.ratingLabel} ${classRating}`}>{label}</p>
                <p className={`${styles.reviewText}`}>{reviewsCount} reviews </p>
            </div>
            <div className={`${styles.rating} ${classRating}`}>
                {(+score).toFixed(1)}
            </div>
        </div>
    )
}