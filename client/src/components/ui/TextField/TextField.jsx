import { useId } from 'react';
import styles from './TextField.module.css';

/**
 * @typedef {'sm' | 'md' | 'lg'} TextFieldSize
 */

/**
 * TextField - базовий компонент текстового поля вводу з підтримкою лейблів, іконок,
 * статусних станів (error, success) та валідації (сумісний із Formik).
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.label] - Підпис до поля
 * @param {string} [props.name] - Назва поля (для Formik та нативних форм)
 * @param {string} [props.type='text'] - Тип поля (text, email, password, number тощо)
 * @param {string|number} [props.value] - Значення поля (керований режим)
 * @param {string|number} [props.defaultValue] - Початкове значення (некерований режим)
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} [props.onChange] - Обробник зміни значення
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onBlur] - Обробник втрати фокусу
 * @param {string} [props.placeholder] - Текст-підказка всередині поля
 * @param {string} [props.helperText] - Текст-підказка під полем (відображається, якщо немає помилки)
 * @param {string|boolean} [props.error] - Помилка: рядок із текстом помилки або boolean-флаг
 * @param {boolean} [props.success=false] - Флаг успішної валідації поля
 * @param {boolean} [props.disabled=false] - Відключений стан поля
 * @param {boolean} [props.required=false] - Обов'язкове поле (додає позначку *)
 * @param {import('react').ReactNode} [props.leftIcon] - Іконка зліва всередині поля
 * @param {import('react').ReactNode} [props.rightIcon] - Іконка справа всередині поля (наприклад, кнопка показу пароля)
 * @param {TextFieldSize} [props.size='md'] - Розмір поля: 'sm' | 'md' | 'lg'
 * @param {string} [props.className] - Додатковий CSS-клас контейнера
 * @param {string} [props.id] - Унікальний ідентифікатор поля (за замовчуванням генерується через useId)
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} [props.rest] - Додаткові нативні атрибути input
 *
 * Стани:
 * - default (звичайний, border: var(--color-border))
 * - hover (border-color: var(--color-border-hover))
 * - focus (border-color: var(--color-primary), focus-visible ring)
 * - filled (із введеним текстом)
 * - success (border-color: var(--color-success), background-color: var(--color-success-soft))
 * - error (border-color: var(--color-error), background-color: var(--color-error-soft), повідомлення про помилку знизу)
 * - disabled (cursor: not-allowed, background-color: var(--color-disabled-bg), color: var(--color-disabled))
 */
export function TextField({
    label,
    name,
    type = 'text',
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    helperText,
    error,
    success = false,
    disabled = false,
    required = false,
    leftIcon,
    rightIcon,
    size = 'md',
    className,
    id,
    ...rest
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = typeof error === 'string' && error ? `${inputId}-error` : undefined;
    const describedBy = errorId || helperId;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : null;

    const wrapperClasses = [
        styles.inputWrapper,
        styles[`size_${size}`],
        hasError && styles.error,
        !hasError && success && styles.success,
        disabled && styles.disabled,
    ]
        .filter(Boolean)
        .join(' ');

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {required && (
                        <span className={styles.requiredAsterisk} aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className={wrapperClasses}>
                {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    aria-describedby={describedBy}
                    className={styles.input}
                    {...rest}
                />

                {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
            </div>

            {hasError && errorMessage && (
                <span id={errorId} className={styles.errorText} role="alert">
                    {errorMessage}
                </span>
            )}

            {!hasError && helperText && (
                <span id={helperId} className={styles.helperText}>
                    {helperText}
                </span>
            )}
        </div>
    );
}
