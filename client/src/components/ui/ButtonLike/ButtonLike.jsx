import { useState } from "react";
import Heart from "../../layout/icons/Heart";
import styles from './ButtonLike.module.css'

export default function ButtonLike(props) {
    const [active, setActive] = useState(props.active)

    // const colorIcon = active ? {color: '#FF3B3B', border: '#00000000'} : {color: '#00000000', border: '#1F2226'}

    const colorIcon = active ? styles.active : ''
    return (
        <button 
            className={`${styles.button} ${colorIcon}`} 
            aria-pressed={active} 
            aria-label="Додати в обране" 
            onClick={(e) => {
                e.preventDefault()
                setActive(active => !active)
            }}
        >
            <Heart/>
        </button>
    )
}