import { useState, useRef, useId } from 'react';
import styles from './Tabs.module.css';

/**
 * @typedef {Object} TabItem
 * @property {string} value - Унікальне значення вкладки
 * @property {import('react').ReactNode} label - Назва або вміст вкладки
 * @property {boolean} [disabled=false] - Чи відключена вкладка
 * @property {import('react').ReactNode} [icon] - Опціональна іконка вкладки
 */

/**
 * Tabs - доступний компонент вкладок (tablist), що підтримує як керований (через value + onChange або formik.setFieldValue),
 * так і некерований режим (defaultValue), а також повну клавіатурну навігацію (стрілки, Home, End).
 *
 * @param {Object} props
 * @param {TabItem[]} props.items - Список вкладок
 * @param {string} [props.value] - Значення активної вкладки (керований режим)
 * @param {string} [props.defaultValue] - Початкове значення активної вкладки (некерований режим)
 * @param {(value: string) => void} [props.onChange] - Колбек при зміні активної вкладки
 * @param {boolean} [props.fullWidth=false] - Розтягнути вкладки на всю ширину контейнера
 * @param {string} [props.className] - Додатковий CSS-клас контейнера
 * @param {import('react').HTMLAttributes<HTMLDivElement>} [props.rest] - Додаткові атрибути контейнера
 *
 * Стани вкладки:
 * - default (color: var(--color-text-muted), transparent bottom border)
 * - hover (color: var(--color-primary-hover), border-color: var(--color-border))
 * - focus-visible (outline: 2px solid var(--color-primary); outline-offset: 2px)
 * - active (selected: color: var(--color-primary), border-bottom: 2px solid var(--color-primary))
 * - disabled (color: var(--color-disabled), cursor: not-allowed, opacity: 0.5)
 */
export function Tabs({
    items = [],
    value,
    defaultValue,
    onChange,
    fullWidth = false,
    className,
    ...rest
}) {
    const tabListId = useId();
    const isControlled = value !== undefined;
    const firstEnabledValue = items.find((item) => !item.disabled)?.value;
    const [internalValue, setInternalValue] = useState(defaultValue || firstEnabledValue || '');

    const activeValue = isControlled ? value : internalValue;
    const tabRefs = useRef([]);

    const enabledItems = items.filter((item) => !item.disabled);

    const handleSelect = (tabValue, disabled) => {
        if (disabled) return;
        if (!isControlled) {
            setInternalValue(tabValue);
        }
        onChange?.(tabValue);
    };

    const handleKeyDown = (event, currentIndex) => {
        if (enabledItems.length === 0) return;

        let targetIndex = -1;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown': {
                event.preventDefault();
                let nextIdx = (currentIndex + 1) % items.length;
                while (items[nextIdx]?.disabled && nextIdx !== currentIndex) {
                    nextIdx = (nextIdx + 1) % items.length;
                }
                targetIndex = nextIdx;
                break;
            }
            case 'ArrowLeft':
            case 'ArrowUp': {
                event.preventDefault();
                let prevIdx = (currentIndex - 1 + items.length) % items.length;
                while (items[prevIdx]?.disabled && prevIdx !== currentIndex) {
                    prevIdx = (prevIdx - 1 + items.length) % items.length;
                }
                targetIndex = prevIdx;
                break;
            }
            case 'Home': {
                event.preventDefault();
                targetIndex = items.findIndex((item) => !item.disabled);
                break;
            }
            case 'End': {
                event.preventDefault();
                for (let i = items.length - 1; i >= 0; i--) {
                    if (!items[i].disabled) {
                        targetIndex = i;
                        break;
                    }
                }
                break;
            }
            default:
                break;
        }

        if (targetIndex >= 0 && targetIndex < items.length && !items[targetIndex].disabled) {
            const nextTab = items[targetIndex];
            handleSelect(nextTab.value, false);
            tabRefs.current[targetIndex]?.focus();
        }
    };

    const containerClasses = [
        styles.tablist,
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="tablist"
            aria-orientation="horizontal"
            className={containerClasses}
            {...rest}
        >
            {items.map((item, index) => {
                const isSelected = item.value === activeValue;
                const tabId = `${tabListId}-tab-${item.value}`;

                const tabClasses = [
                    styles.tab,
                    isSelected && styles.active,
                    item.disabled && styles.disabled,
                    fullWidth && styles.tabFullWidth,
                ]
                    .filter(Boolean)
                    .join(' ');

                return (
                    <button
                        key={item.value}
                        ref={(el) => {
                            tabRefs.current[index] = el;
                        }}
                        id={tabId}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-disabled={item.disabled}
                        disabled={item.disabled}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => handleSelect(item.value, item.disabled)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={tabClasses}
                    >
                        {item.icon && <span className={styles.icon}>{item.icon}</span>}
                        <span className={styles.label}>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
