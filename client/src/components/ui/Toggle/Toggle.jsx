import { useId } from 'react';
import styles from './Toggle.module.css';

/**
 * @typedef {'sm' | 'md'} ToggleSize
 */

/**
 * Toggle - доступний компонент перемикача (switch toggle), сумісний із boolean-полями Formik,
 * побудований поверх нативного input[type="checkbox" role="switch"] з плавною анімацією повзунка.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.label] - Текстовий підпис перемикача
 * @param {string} [props.name] - Назва поля форми
 * @param {boolean} [props.checked] - Керований стан перемикача (true - on, false - off)
 * @param {boolean} [props.defaultChecked] - Початковий стан (некерований режим)
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} [props.onChange] - Обробник зміни стану
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onBlur] - Обробник втрати фокусу
 * @param {boolean} [props.disabled=false] - Чи відключено перемикач
 * @param {ToggleSize} [props.size='md'] - Розмір: 'sm' | 'md'
 * @param {string} [props.className] - Додатковий CSS-клас контейнера
 * @param {string} [props.id] - Унікальний ідентифікатор поля (генерується за замовчуванням через useId)
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} [props.rest] - Нативні атрибути input
 *
 * Стани:
 * - off (вимкнений: background: var(--color-border), повзунок зліва)
 * - hover (border-color / фонове затемнення)
 * - focus-visible (outline: 2px solid var(--color-primary); outline-offset: 2px)
 * - on (увімкнений: background: var(--color-primary), повзунок справа)
 * - disabled off / on (cursor: not-allowed, opacity: 0.5)
 */
export function Toggle({
    label,
    name,
    checked,
    defaultChecked,
    onChange,
    onBlur,
    disabled = false,
    size = 'md',
    className,
    id,
    ...rest
}) {
    const generatedId = useId();
    const toggleId = id || generatedId;

    const labelClasses = [
        styles.labelWrapper,
        styles[`size_${size}`],
        disabled && styles.disabled,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <label htmlFor={toggleId} className={labelClasses}>
            <input
                type="checkbox"
                role="switch"
                id={toggleId}
                name={name}
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                aria-checked={checked}
                className={styles.nativeInput}
                {...rest}
            />
            <span className={styles.track} aria-hidden="true">
                <span className={styles.thumb} />
            </span>
            {label && <span className={styles.labelText}>{label}</span>}
        </label>
    );
}
