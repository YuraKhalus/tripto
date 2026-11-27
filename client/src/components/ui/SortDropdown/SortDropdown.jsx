import { useState, useEffect, useRef } from 'react'

import styles from './SortDropdown.module.css'

import ChevronDownSmall from '../../icons/ChevronDownSmall'

export default function SortDropdown({options}) {
    const [disable, setDisable] = useState(false)
    const [selected, setSelected] = useState(options[0])
    const menuRef = useRef(null)

    const selectSort = (e) => {
        setSelected({value: e.target.dataset.value, label: e.target.textContent})
        setDisable(false)
    }

    const lists = options.map((list, i) => {
       return (
            <li 
                key={i}
                className={`${styles['dropdown-item']} ${selected.label === list.label ? styles['active__select'] : ''}`} 
                onClick={selectSort}
                data-value={list.value}
            >
                {list.label}
            </li>
       )
    })

    useEffect(() => {
        if (!disable) return

        const closeMenu = (e) => {       
            if (!menuRef.current.contains(e.target)) {
                setDisable(false)
            }
        }

        document.addEventListener('mousedown', closeMenu)

        return () => {
            document.removeEventListener('mousedown', closeMenu)
        }
    }, [disable])

    useEffect(() => {
        if (!disable) return
        
        const closeMenu = (e) => {
            if (e.type === 'keydown' && e.code === 'Escape') {
                setDisable(false)
            }
        }

        document.addEventListener('keydown', closeMenu)

        return () => {
            document.removeEventListener('keydown', closeMenu)
        }
    }, [disable])

    return (
        <div className={styles['dropdown']}>
            <button className={`${styles['dropdown-button']} ${disable ? styles['active__button'] : ''}`} onClick={() => setDisable(disable => !disable)}>Sort by: {selected.label} <ChevronDownSmall/></button>

            <ul className={`${styles['dropdown-menu']} ${disable ? styles.disable : ''}`}  ref={menuRef}>
               {lists}
            </ul>
        </div>
    )
}
// style={{display: disable ? '' : 'none'}}