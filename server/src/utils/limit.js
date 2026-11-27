/**
 * Строга перевірка limit для коротких списків: на відміну від пагінації, сміття → помилка.
 * Повертає число, defaultValue (якщо параметра немає) або null (якщо значення невалідне).
 */
export function parseLimit(value, { defaultValue, max }) {
  if (value === undefined) return defaultValue;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) return null;
  return n;
}