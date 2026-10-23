// Обрізає повний датасет Inside Airbnb до невеликого навчального набору.
//
// 1. Скачай з https://insideairbnb.com/get-the-data/ (Barcelona):
//    listings.csv.gz (detailed), reviews.csv.gz (detailed), calendar.csv.gz
// 2. Поклади їх у папку, наприклад ../raw-data (вона в .gitignore)
// 3. node scripts/trim-dataset.js ../raw-data 200
//
// Результат: prisma/data/{listings,reviews,calendar}.csv — їх і комітимо.
// Дані: Inside Airbnb, ліцензія CC BY 4.0 — атрибуція в README.

import { createReadStream, createWriteStream, mkdirSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { parsePrice, parseIntOrNull } from '../src/utils/parse.js';

const [rawDir = '../raw-data', countArg = '200'] = process.argv.slice(2);
const LISTINGS_COUNT = Number(countArg);
const REVIEWS_PER_LISTING = 20;
const CALENDAR_DAYS = 180;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'prisma', 'data');

const LISTING_COLUMNS = [
  'id', 'name', 'description', 'picture_url',
  'host_id', 'host_name', 'host_since', 'host_is_superhost', 'host_picture_url',
  'neighbourhood_cleansed', 'neighbourhood_group_cleansed', 'latitude', 'longitude',
  'property_type', 'room_type', 'accommodates', 'bathrooms_text', 'bedrooms', 'beds',
  'amenities', 'price', 'minimum_nights', 'number_of_reviews', 'review_scores_rating',
];
const REVIEW_COLUMNS = ['listing_id', 'id', 'date', 'reviewer_name', 'comments'];
// У свіжих вивантаженнях колонки price у calendar.csv вже немає — ціну бере сід з оголошення
const CALENDAR_COLUMNS = ['listing_id', 'date', 'available'];

function readCsvGz(fileName) {
  return createReadStream(join(rawDir, fileName))
    .pipe(createGunzip())
    .pipe(parse({ columns: true, relax_quotes: true, skip_empty_lines: true }));
}

function writeCsv(fileName, columns, rows) {
  return new Promise((resolve, reject) => {
    const out = createWriteStream(join(OUT_DIR, fileName));
    const stringifier = stringify({ header: true, columns });
    stringifier.pipe(out);
    out.on('finish', resolve);
    out.on('error', reject);
    for (const row of rows) stringifier.write(row);
    stringifier.end();
  });
}

function isGoodListing(row) {
  return (
    row.picture_url &&
    row.description &&
    parsePrice(row.price) !== null &&
    (parseIntOrNull(row.number_of_reviews) ?? 0) >= 5 &&
    row.review_scores_rating
  );
}

async function pickListings() {
  // Групуємо за районами, щоб вибірка покривала все місто, а не лише центр
  const byGroup = new Map();
  for await (const row of readCsvGz('listings.csv.gz')) {
    if (!isGoodListing(row)) continue;
    const group = row.neighbourhood_group_cleansed || 'other';
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group).push(row);
  }
  for (const rows of byGroup.values()) {
    rows.sort((a, b) => Number(b.number_of_reviews) - Number(a.number_of_reviews));
  }
  // Round-robin по районах
  const picked = [];
  const queues = [...byGroup.values()];
  while (picked.length < LISTINGS_COUNT && queues.some((q) => q.length)) {
    for (const queue of queues) {
      if (queue.length && picked.length < LISTINGS_COUNT) picked.push(queue.shift());
    }
  }
  return picked;
}

async function pickReviews(listingIds) {
  const byListing = new Map();
  for await (const row of readCsvGz('reviews.csv.gz')) {
    if (!listingIds.has(row.listing_id)) continue;
    if (!byListing.has(row.listing_id)) byListing.set(row.listing_id, []);
    byListing.get(row.listing_id).push(row);
  }
  const result = [];
  for (const rows of byListing.values()) {
    rows.sort((a, b) => b.date.localeCompare(a.date));
    result.push(...rows.slice(0, REVIEWS_PER_LISTING));
  }
  return result;
}

async function pickCalendar(listingIds) {
  const rows = [];
  let firstDate = null;
  for await (const row of readCsvGz('calendar.csv.gz')) {
    if (!listingIds.has(row.listing_id)) continue;
    if (!firstDate || row.date < firstDate) firstDate = row.date;
    rows.push(row);
  }
  const limit = new Date(`${firstDate}T00:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + CALENDAR_DAYS);
  const lastDate = limit.toISOString().slice(0, 10);
  return rows.filter((row) => row.date < lastDate);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const listings = await pickListings();
  const ids = new Set(listings.map((l) => l.id));
  console.log(`listings: ${listings.length}`);
  await writeCsv('listings.csv', LISTING_COLUMNS, listings);

  const reviews = await pickReviews(ids);
  console.log(`reviews: ${reviews.length}`);
  await writeCsv('reviews.csv', REVIEW_COLUMNS, reviews);

  const calendar = await pickCalendar(ids);
  console.log(`calendar days: ${calendar.length}`);
  await writeCsv('calendar.csv', CALENDAR_COLUMNS, calendar);

  console.log(`✅ Saved to ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
