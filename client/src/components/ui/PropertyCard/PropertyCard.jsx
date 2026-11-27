import ButtonLike from '../ButtonLike/ButtonLike'
import RatingScore from '../RatingScore/RatingScore'
import RatingStars from '../RatingStars/RatingStars'
import Star from '../../icons/Star'


import styles from './PropertyCard.module.css'
import {Link} from 'react-router-dom'

import Product from '../../../assets/product.png'

export default function PropertyCard({listing, layout = 'horizontal', badge, isFavorite, starType = 'full'}) {
    


    if (layout === 'vertical') {
        return (
            <Link className={`${styles.card} ${styles.cardVertical}`}>
                <div className={styles.cardImg}>
                    <img src='https://a0.muscache.com/pictures/hosting/Hosting-18572961/original/5835b5ce-67b0-42ee-a57f-a1cb9d62f493.jpeg' alt="" />
                    <ButtonLike active={false}/>
                </div>
                <div className={styles.cardDetails}>
                    <div>
                        <div className={styles.title}>
                            <h2>Modern City Apartment</h2>

                            {starType === 'full' ? <RatingStars value={5}/> : <p>5<Star/></p>}
                            
                        </div>

                        <RatingScore score={5} reviewsCount={160} layout='inline'/>
                        <div className={`${styles.propertyInfo}`}>
                            <span className={`${styles.property}`}>Entire Apartment</span>
                            <span className={`${styles.property}`}>2 Bedroom</span>
                            <span className={`${styles.property}`}>2 Single beds</span>
                        </div>
                        <p className={styles.price}>$175</p>
                        <p className={styles.lengthOfStayNumberOfGuests}>5 nights, 2 adults</p>
                    </div>
                </div>
            </Link>
        )
    }








    return (
        <Link className={styles.card}>
            <div className={styles.cardImg}>
                <img src={Product} alt="" />
                <ButtonLike active={false}/>
            </div>
            <div className={styles.cardDetails}>
                <div>
                    <div className={styles.hotelTitleRating}>
                        <div className={styles.hotelInfo}>
                            <div className={styles.title}>
                                <h2>Modern City Apartment</h2>
                                <RatingStars value={5}/>
                            </div>
                            <p className={styles.privateHost}>Managed by a private host</p>
                            <div className={styles.locationInfo}>
                                <span className={`${styles.location} ${styles.place} ${styles.iconPlace}`}>Barcelona, Spain</span>
                                <span className={`${styles.location}`}>0.6 km from centre</span>
                                <span className={`${styles.location} ${styles.iconMetro}`}>Metro access </span>
                                <span className={`${styles.location} ${styles.iconBeach}`}>100 m from beach</span>
                            </div>
                        </div>

                        <RatingScore score={5} reviewsCount={160}/>
                    </div>

                    <div className={styles.hotelDetails}>

                        <div className={styles.hotelDescription}>
                             <div className={`${styles.propertyInfo}`}>
                                <span className={`${styles.property}`}>Entire Apartment</span>
                                <span className={`${styles.property}`}>2 Bedroom</span>
                                <span className={`${styles.property}`}>2 Single beds</span>
                                <span className={`${styles.property}`}>65 m&#178;</span>
                            </div>
                            <div className={`${styles.chips}`}>
                                <span className={`${styles.chip} ${styles.iconBread}`}>Breakfast included</span>
                                <span className={`${styles.chip} ${styles.iconCard}`}>No prepayment needed</span>
                            </div>

                        </div>

                        <div className=''>
                            <p className={styles.price}>$175</p>
                            <p className={styles.lengthOfStayNumberOfGuests}>5 nights, 2 adults</p>
                        </div>

                    </div>

                   
                </div>
            </div>
        </Link>
    )
}