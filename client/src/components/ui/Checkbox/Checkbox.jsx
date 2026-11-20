import { useId } from 'react';
import { CheckIcon } from '../../icons/CheckIcon.jsx';
import styles from './Checkbox.module.css';

/**
 * Checkbox - доступний компонент прапорця (сумісний із Formik),
 * побудований поверх нативного прихованого input[type="checkbox"].
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.label] - Текстовий підпис прапорця
 * @param {string} [props.name] - Назва поля форми
 * @param {any} [props.value] - Значення чекбокса
 * @param {boolean} [props.checked] - Керований стан вибору
 * @param {boolean} [props.defaultChecked] - Початковий стан вибору (некерований)
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} [props.onChange] - Обробник зміни стану
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onBlur] - Обробник втрати фокусу
 * @param {boolean} [props.disabled=false] - Чи відключено елемент
 * @param {string|boolean} [props.error] - Помилка валідації (рядок або boolean)
 * @param {string} [props.className] - Додатковий CSS-клас контейнера
 * @param {string} [props.id] - Унікальний ідентифікатор поля (генерується за замовчуванням через useId)
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} [props.rest] - Нативні атрибути input
 *
 * Стани:
 * - unchecked (знятий: border: var(--color-border), background: var(--color-bg))
 * - hover (border-color: var(--color-primary))
 * - focus-visible (outline: 2px solid var(--color-primary); outline-offset: 2px)
 * - checked (вибраний: background: var(--color-primary), border-color: var(--color-primary), іконка галочки)
 * - disabled unchecked / checked (cursor: not-allowed, opacity: 0.6)
 * - error (border-color: var(--color-error), повідомлення про помилку знизу)
 */
export function Checkbox({
    label,
    name,
    value,
    checked,
    defaultChecked,
    onChange,
    onBlur,
    disabled = false,
    error,
    className,
    id,
    ...rest
}) {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = typeof error === 'string' && error ? `${checkboxId}-error` : undefined;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : null;

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    const labelClasses = [
        styles.labelWrapper,
        disabled && styles.disabled,
        hasError && styles.hasError,
    ]
        .filter(Boolean)
        .join(' ');

    const boxClasses = [
        styles.customBox,
        hasError && styles.boxError,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses}>
            <label htmlFor={checkboxId} className={labelClasses}>
                <input
                    type="checkbox"
                    id={checkboxId}
                    name={name}
                    value={value}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    aria-invalid={hasError}
                    aria-describedby={errorId}
                    className={styles.nativeInput}
                    {...rest}
                />
                <span className={boxClasses} aria-hidden="true">
                    <CheckIcon size={12} className={styles.icon} />
                </span>
                {label && <span className={styles.labelText}>{label}</span>}
            </label>

            {hasError && errorMessage && (
                <span id={errorId} className={styles.errorText} role="alert">
                    {errorMessage}
                </span>
            )}
        </div>
    );
}
