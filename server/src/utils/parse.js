// Перетворення "сирих" рядків із CSV Inside Airbnb у нормальні типи.
// Чисті функції: на вході рядок, на виході значення. Ідеальні для юніт-тестів.

/** "$1,234.00" -> 1234, "" / undefined -> null */
export function parsePrice(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).replace(/[$,\s]/g, '');
  if (cleaned === '') return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

/** "t" -> true, "f" -> false (так Inside Airbnb кодує булеві значення) */
export function parseBool(value) {
  return value === 't' || value === 'true';
}

/** "3" -> 3, "" -> null, "2.0" -> 2 */
export function parseIntOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : null;
}

/** "4.85" -> 4.85, "" -> null */
export function parseFloatOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** '["Wifi", "Kitchen"]' -> ["Wifi", "Kitchen"], зіпсований рядок -> [] */
export function parseAmenities(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** "2024-03-15" -> Date, "" / сміття -> null */
export function parseDateOrNull(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Line 1<br /><br />Line 2" -> "Line 1\n\nLine 2" (Inside Airbnb зберігає переноси як HTML) */
export function htmlBreaksToNewlines(value) {
  if (!value) return null;
  return String(value).replace(/<br\s*\/?>/gi, '\n').trim() || null;
}
