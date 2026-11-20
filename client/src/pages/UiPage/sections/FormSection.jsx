import { useState } from 'react';
import { useFormik } from 'formik';
import { TextField } from '../../../components/ui/TextField/TextField.jsx';
import { Checkbox } from '../../../components/ui/Checkbox/Checkbox.jsx';
import { Radio } from '../../../components/ui/Radio/Radio.jsx';
import { Toggle } from '../../../components/ui/Toggle/Toggle.jsx';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import {
    SearchIcon,
    EyeIcon,
    EyeOffIcon,
    CheckCircleIcon,
    ChevronRight,
} from '../../../components/icons/index.js';
import styles from './FormSection.module.css';

/**
 * Валідація значень міні-форми Formik
 */
const validateFormik = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "Ім'я обов'язкове для заповнення";
    } else if (values.name.length < 2) {
        errors.name = "Ім'я повинно містити мінімум 2 символи";
    }

    if (!values.email) {
        errors.email = "Email обов'язковий";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Некоректний формат email адреси';
    }

    if (!values.password) {
        errors.password = "Пароль обов'язковий";
    } else if (values.password.length < 6) {
        errors.password = 'Пароль має містити мінімум 6 символів';
    }

    if (!values.terms) {
        errors.terms = 'Необхідно погодитися з правилами сервісу';
    }

    return errors;
};

/**
 * Вітрина FormSection - демонструє всі UI-компоненти блоку FORM:
 * TextField, Checkbox, Radio, Toggle, Tabs у всіх станах і конфігураціях,
 * а також інтерактивну Formik міні-форму для тестування їх взаємодії.
 */
export function FormSection() {
    // Стан для інтерактивного показу/приховування пароля у вітрині
    const [showPassword, setShowPassword] = useState(false);
    const [sampleRadio, setSampleRadio] = useState('option2');
    const [sampleToggle, setSampleToggle] = useState(true);
    const [sampleCheckbox, setSampleCheckbox] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [formSubmittedData, setFormSubmittedData] = useState(null);

    // Formik форма
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            accountType: 'traveler',
            bookingType: 'apartments',
            notifications: true,
            terms: false,
        },
        validate: validateFormik,
        onSubmit: (values) => {
            setFormSubmittedData(values);
        },
    });

    const tabItems = [
        { value: 'all', label: 'Усі житла' },
        { value: 'apartments', label: 'Апартаменти' },
        { value: 'houses', label: 'Будинки' },
        { value: 'villas', label: 'Вілли (disabled)', disabled: true },
    ];

    const tabItemsWithIcons = [
        { value: 'search', label: 'Пошук', icon: <SearchIcon size={16} /> },
        { value: 'verified', label: 'Перевірені', icon: <CheckCircleIcon size={16} /> },
        { value: 'next', label: 'Далі', icon: <ChevronRight size={16} /> },
    ];

    return (
        <section className={styles.section}>
            <header className={styles.header}>
                <h2 className={styles.sectionTitle}>Блок FORM — UI Компоненти</h2>
                <p className={styles.sectionSubtitle}>
                    Повна матриця станів для TextField, Checkbox, Radio, Toggle, Tabs та жива валідація на Formik.
                </p>
            </header>

            {/* 1. TEXTFIELD SHOWCASE */}
            <article className={styles.card}>
                <h3 className={styles.cardTitle}>1. TextField (Поле вводу тексту)</h3>
                <p className={styles.cardDesc}>
                    Підтримка лейблів, підказок, станів hover, focus, error, success, disabled та іконок зліва/справа.
                </p>

                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Default / Idle</span>
                        <TextField label="Звичайне поле" placeholder="Введіть значення..." />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Required & Filled</span>
                        <TextField
                            label="Ім'я користувача"
                            required
                            defaultValue="Олександр Шевченко"
                            helperText="Ваше публічне ім'я у системі"
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Left Icon (Search)</span>
                        <TextField
                            label="Пошук житла"
                            placeholder="Місто, курорт чи локація..."
                            leftIcon={<SearchIcon size={18} />}
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Right Icon (Password Toggle)</span>
                        <TextField
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            defaultValue="SecretPass123"
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className={styles.iconButton}
                                    aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
                                >
                                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            }
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Success State</span>
                        <TextField
                            label="Промокод"
                            defaultValue="TRIPTO2026"
                            success
                            helperText="Промокод успішно застосовано (-15%)"
                            rightIcon={<CheckCircleIcon size={18} />}
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Error State</span>
                        <TextField
                            label="Електронна пошта"
                            defaultValue="invalid-email@"
                            error="Введіть коректну адресу електронної пошти"
                            required
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Disabled (Empty)</span>
                        <TextField
                            label="Код країни (disabled)"
                            placeholder="Недоступно"
                            disabled
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Disabled (Filled)</span>
                        <TextField
                            label="Ідентифікатор користувача"
                            defaultValue="USR-994821"
                            disabled
                            helperText="Цей ідентифікатор призначено автоматично"
                        />
                    </div>
                </div>

                <div className={styles.sizesRow}>
                    <h4 className={styles.subTitle}>Розміри TextField (sm, md, lg):</h4>
                    <div className={styles.sizesGrid}>
                        <TextField size="sm" placeholder="Розмір sm (36px)" />
                        <TextField size="md" placeholder="Розмір md (44px, базовий)" />
                        <TextField size="lg" placeholder="Розмір lg (52px)" />
                    </div>
                </div>
            </article>

            {/* 2. CHECKBOX SHOWCASE */}
            <article className={styles.card}>
                <h3 className={styles.cardTitle}>2. Checkbox (Прапорець)</h3>
                <p className={styles.cardDesc}>
                    Кастомний стилізований прапорець поверх нативного доступного input із підтримкою Space/Tab та Formik.
                </p>

                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Unchecked</span>
                        <Checkbox label="Знятий прапорець" />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Checked</span>
                        <Checkbox label="Вибраний прапорець" defaultChecked />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Interactive</span>
                        <Checkbox
                            label={`Інтерактивний стан: ${sampleCheckbox ? 'Вибрано' : 'Знято'}`}
                            checked={sampleCheckbox}
                            onChange={(e) => setSampleCheckbox(e.target.checked)}
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Error State</span>
                        <Checkbox
                            label="Я погоджуюся з політикою конфіденційності"
                            error="Обов'язкове підтвердження для реєстрації"
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Disabled Unchecked</span>
                        <Checkbox label="Недоступна опція (знято)" disabled />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Disabled Checked</span>
                        <Checkbox label="Зафіксована опція (вибрано)" defaultChecked disabled />
                    </div>
                </div>
            </article>

            {/* 3. RADIO SHOWCASE */}
            <article className={styles.card}>
                <h3 className={styles.cardTitle}>3. Radio (Радіокнопка)</h3>
                <p className={styles.cardDesc}>
                    Доступна радіокнопка з нативною навігацією стрілками клавіатури, підтримкою групування за назвою та Formik.
                </p>

                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Інтерактивна група (Разом)</span>
                        <div className={styles.radioGroup}>
                            <Radio
                                name="showcase_group"
                                value="option1"
                                label="Опція 1 (Готелі)"
                                checked={sampleRadio === 'option1'}
                                onChange={(e) => setSampleRadio(e.target.value)}
                            />
                            <Radio
                                name="showcase_group"
                                value="option2"
                                label="Опція 2 (Апартаменти — вибрано)"
                                checked={sampleRadio === 'option2'}
                                onChange={(e) => setSampleRadio(e.target.value)}
                            />
                            <Radio
                                name="showcase_group"
                                value="option3"
                                label="Опція 3 (Вілли)"
                                checked={sampleRadio === 'option3'}
                                onChange={(e) => setSampleRadio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Unchecked & Checked</span>
                        <div className={styles.radioGroup}>
                            <Radio name="demo_static_1" label="Невибраний стан" defaultChecked={false} />
                            <Radio name="demo_static_2" label="Вибраний стан" defaultChecked={true} />
                        </div>
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Error State</span>
                        <Radio
                            name="demo_error"
                            label="Обов'язковий вибір типу облікового запису"
                            error="Будь ласка, оберіть один із варіантів"
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Disabled (Unchecked & Checked)</span>
                        <div className={styles.radioGroup}>
                            <Radio name="demo_disabled_1" label="Відключена (невибрана)" disabled />
                            <Radio
                                name="demo_disabled_2"
                                label="Відключена (вибрана)"
                                defaultChecked
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </article>

            {/* 4. TOGGLE SHOWCASE */}
            <article className={styles.card}>
                <h3 className={styles.cardTitle}>4. Toggle (Перемикач)</h3>
                <p className={styles.cardDesc}>
                    Стильний перемикач на role="switch" з плавною анімацією повзунка та підтримкою розмірів sm/md.
                </p>

                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Off & On</span>
                        <div className={styles.togglesList}>
                            <Toggle label="Вимкнений (Off)" defaultChecked={false} />
                            <Toggle label="Увімкнений (On)" defaultChecked={true} />
                        </div>
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Interactive</span>
                        <Toggle
                            label={`Стан перемикача: ${sampleToggle ? 'Увімкнено' : 'Вимкнено'}`}
                            checked={sampleToggle}
                            onChange={(e) => setSampleToggle(e.target.checked)}
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Sizes (sm та md)</span>
                        <div className={styles.togglesList}>
                            <Toggle size="sm" label="Малий перемикач (sm, 36px)" defaultChecked />
                            <Toggle size="md" label="Звичайний перемикач (md, 44px)" defaultChecked />
                        </div>
                    </div>

                    <div className={styles.gridItem}>
                        <span className={styles.stateBadge}>Disabled (Off & On)</span>
                        <div className={styles.togglesList}>
                            <Toggle label="Недоступний вимкнений" disabled defaultChecked={false} />
                            <Toggle label="Недоступний увімкнений" disabled defaultChecked={true} />
                        </div>
                    </div>
                </div>
            </article>

            {/* 5. TABS SHOWCASE */}
            <article className={styles.card}>
                <h3 className={styles.cardTitle}>5. Tabs (Вкладки)</h3>
                <p className={styles.cardDesc}>
                    Доступний tablist з навігацією з клавіатури (стрілки, Home, End), підтримкою іконок, fullWidth та disabled.
                </p>

                <div className={styles.tabsWrapper}>
                    <div>
                        <span className={styles.stateBadge}>Базові вкладки з disabled елементом</span>
                        <Tabs
                            items={tabItems}
                            value={activeTab}
                            onChange={(newVal) => setActiveTab(newVal)}
                        />
                        <div className={styles.tabContent}>
                            Поточна активна вкладка: <strong>{activeTab}</strong>
                        </div>
                    </div>

                    <div>
                        <span className={styles.stateBadge}>Вкладки з іконками</span>
                        <Tabs items={tabItemsWithIcons} defaultValue="search" />
                    </div>

                    <div>
                        <span className={styles.stateBadge}>Вкладки на всю ширину (fullWidth)</span>
                        <Tabs items={tabItems.slice(0, 3)} fullWidth defaultValue="apartments" />
                    </div>
                </div>
            </article>

            {/* 6. FORMIK INTERACTIVE FORM */}
            <article className={[styles.card, styles.formikCard].join(' ')}>
                <h3 className={styles.cardTitle}>6. Інтерактивна міні-форма на Formik</h3>
                <p className={styles.cardDesc}>
                    Живий приклад синхронізації всіх 5 компонентів (TextField, Checkbox, Radio, Toggle, Tabs) із
                    валідацією форми Formik у реальному часі.
                </p>

                <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
                    <div className={styles.formRow}>
                        <TextField
                            label="Повне ім'я"
                            name="name"
                            required
                            placeholder="Тарас Шевченко"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && formik.errors.name}
                            success={Boolean(formik.touched.name && !formik.errors.name && formik.values.name)}
                        />

                        <TextField
                            label="Електронна пошта"
                            name="email"
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && formik.errors.email}
                            success={Boolean(formik.touched.email && !formik.errors.email && formik.values.email)}
                        />
                    </div>

                    <TextField
                        label="Пароль"
                        name="password"
                        type="password"
                        required
                        placeholder="Мінімум 6 символів"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password}
                        helperText="Надійний пароль захищає ваші бронювання"
                    />

                    <div className={styles.formFieldGroup}>
                        <span className={styles.groupLabel}>Тип облікового запису (Radio):</span>
                        <div className={styles.radioInline}>
                            <Radio
                                name="accountType"
                                value="traveler"
                                label="Мандрівник (шукаю житло)"
                                checked={formik.values.accountType === 'traveler'}
                                onChange={formik.handleChange}
                            />
                            <Radio
                                name="accountType"
                                value="host"
                                label="Орендар (здаю помешкання)"
                                checked={formik.values.accountType === 'host'}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formFieldGroup}>
                        <span className={styles.groupLabel}>Тип переважного помешкання (Tabs):</span>
                        <Tabs
                            items={[
                                { value: 'apartments', label: 'Апартаменти' },
                                { value: 'houses', label: 'Приватні будинки' },
                                { value: 'villas', label: 'Вілли біля моря' },
                            ]}
                            value={formik.values.bookingType}
                            onChange={(val) => formik.setFieldValue('bookingType', val)}
                        />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <Toggle
                            name="notifications"
                            label="Отримувати сповіщення про знижки та нові пропозиції (Toggle)"
                            checked={formik.values.notifications}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <Checkbox
                            name="terms"
                            label="Я погоджуюся з правилами використання сервісу Tripto (Checkbox)"
                            checked={formik.values.terms}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.terms && formik.errors.terms}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitBtn}>
                            Зареєструватися через Formik
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                formik.resetForm();
                                setFormSubmittedData(null);
                            }}
                            className={styles.resetBtn}
                        >
                            Скинути форму
                        </button>
                    </div>

                    {formSubmittedData && (
                        <div className={styles.submitSuccessBox} role="status">
                            <h4 className={styles.submitSuccessTitle}>Форма успішно валідована та надіслана!</h4>
                            <pre className={styles.jsonPreview}>
                                {JSON.stringify(formSubmittedData, null, 2)}
                            </pre>
                        </div>
                    )}
                </form>
            </article>
        </section>
    );
}
