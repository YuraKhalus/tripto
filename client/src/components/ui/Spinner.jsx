import styles from './Spinner.module.css';

export function Spinner({ size = 'md', label = "Завантаження"}){
    return(
        <span className={`${styles.spinner} ${styles[size]}`} role='status' aria-label={label}></span>
    )
}