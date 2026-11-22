import ButtonLike from '../ButtonLike/ButtonLike'
import RatingScore from '../RatingScore/RatingScore'

import styles from './PropertyCard.module.css'
import {Link} from 'react-router-dom'

import Product from '../assets/product.png'

export default function PropertyCard({listing, layout, badge, isFavorite}) {
    
    return (
        <Link className={styles.card}>
            <div className={styles.card__img}>
                <img src={Product} alt="" />
                <ButtonLike active={false}/>
            </div>
            <div className='product__details'>
                <div>
                    <div className={styles['location-info']}>
                        <span className={`${styles.location} ${styles.place} ${styles['icon-place']}`}>Barcelona, Spain</span>
                        <span className={`${styles.location}`}>0.6 km from centre</span>
                        <span className={`${styles.location} ${styles['icon-metro']}`}>Metro access </span>
                        <span className={`${styles.location} ${styles['icon-beach']}`}>100 m from beach</span>
                    </div>
                    <div className={`${styles['property-info']}`}>
                        <span className={`${styles.property}`}>Entire Apartment</span>
                        <span className={`${styles.property}`}>2 Bedroom</span>
                        <span className={`${styles.property}`}>2 Single beds</span>
                        <span className={`${styles.property}`}>65 m&#178;</span>
                    </div>
                    <div className={`${styles.chips}`}>
                        <span className={`${styles.chip}`}>Breakfast included</span>
                        <span className={`${styles.chip}`}>No prepayment needed</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}