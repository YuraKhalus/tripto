import { useId } from 'react';
import styles from './Radio.module.css';

/**
 * Radio - доступний компонент радіокнопки (повністю сумісний із Formik та радіогрупами),
 * побудований поверх нативного прихованого input[type="radio"].
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.label] - Текстовий підпис радіокнопки
 * @param {string} [props.name] - Назва радіогрупи (однакова для всіх опцій групи)
 * @param {any} [props.value] - Значення цієї конкретної опції
 * @param {boolean} [props.checked] - Керований стан вибору
 * @param {boolean} [props.defaultChecked] - Початковий стан вибору (некерований)
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} [props.onChange] - Обробник зміни стану
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onBlur] - Обробник втрати фокусу
 * @param {boolean} [props.disabled=false] - Чи відключена кнопка
 * @param {string|boolean} [props.error] - Помилка валідації (рядок або boolean)
 * @param {string} [props.className] - Додатковий CSS-клас контейнера
 * @param {string} [props.id] - Унікальний ідентифікатор поля (генерується за замовчуванням через useId)
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} [props.rest] - Нативні атрибути input
 *
 * Стани:
 * - unchecked (невибраний: border: var(--color-border), background: var(--color-bg))
 * - hover (border-color: var(--color-primary))
 * - focus-visible (outline: 2px solid var(--color-primary); outline-offset: 2px)
 * - checked (вибраний: border-color: var(--color-primary), активна точка всередині)
 * - disabled unchecked / checked (cursor: not-allowed, opacity: 0.6)
 * - error (border-color: var(--color-error), повідомлення про помилку знизу)
 */
export function Radio({
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
    const radioId = id || generatedId;
    const errorId = typeof error === 'string' && error ? `${radioId}-error` : undefined;

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

    const circleClasses = [
        styles.customCircle,
        hasError && styles.circleError,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses}>
            <label htmlFor={radioId} className={labelClasses}>
                <input
                    type="radio"
                    id={radioId}
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
                <span className={circleClasses} aria-hidden="true">
                    <span className={styles.dot} />
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
