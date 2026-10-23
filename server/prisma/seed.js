// Наповнює базу обрізаним датасетом Inside Airbnb (Барселона).
// Запуск:  docker compose exec api npx prisma db seed
//
// Скрипт ідемпотентний: спочатку все видаляє, потім створює заново,
// тож його можна запускати скільки завгодно разів.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import {
  parsePrice,
  parseBool,
  parseIntOrNull,
  parseFloatOrNull,
  parseAmenities,
  parseDateOrNull,
  htmlBreaksToNewlines,
} from '../src/utils/parse.js';

const prisma = new PrismaClient();
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), 'data');
const BATCH_SIZE = 5000;

function readCsv(fileName) {
  const text = readFileSync(join(DATA_DIR, fileName), 'utf8');
  // columns: true -> кожен рядок стає об'єктом { назва_колонки: значення }
  return parse(text, { columns: true, skip_empty_lines: true, relax_quotes: true });
}

async function insertInBatches(model, rows) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    await model.createMany({ data: rows.slice(i, i + BATCH_SIZE), skipDuplicates: true });
  }
}

async function main() {
  console.time('seed');

  const listingRows = readCsv('listings.csv');
  const reviewRows = readCsv('reviews.csv');
  const calendarRows = readCsv('calendar.csv');

  // 1. Чистимо таблиці. TRUNCATE ... RESTART IDENTITY ще й скидає лічильники id,
  //    тож після кожного сіду перше житло знову має id = 1.
  //    (deleteMany видалив би рядки, але нові id продовжились би з 201, 202...)
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "calendar_days", "reviews", "listings", "hosts" RESTART IDENTITY CASCADE',
  );

  // 2. Хости (один хост може мати кілька оголошень, тому прибираємо дублікати)
  const hostsByAirbnbId = new Map();
  for (const row of listingRows) {
    if (hostsByAirbnbId.has(row.host_id)) continue;
    hostsByAirbnbId.set(row.host_id, {
      airbnbId: row.host_id,
      name: row.host_name || 'Unknown host',
      pictureUrl: row.host_picture_url || null,
      isSuperhost: parseBool(row.host_is_superhost),
      since: parseDateOrNull(row.host_since),
    });
  }
  await prisma.host.createMany({ data: [...hostsByAirbnbId.values()] });

  // Нам потрібні наші внутрішні id хостів, щоб прив'язати оголошення
  const hostIdMap = new Map(
    (await prisma.host.findMany({ select: { id: true, airbnbId: true } })).map((h) => [h.airbnbId, h.id]),
  );

  // 3. Оголошення
  const listingPrices = new Map();
  const listings = listingRows.map((row) => {
    const price = parsePrice(row.price);
    listingPrices.set(row.id, price);
    return {
      airbnbId: row.id,
      name: row.name,
      description: htmlBreaksToNewlines(row.description),
      pictureUrl: row.picture_url || null,
      neighbourhood: row.neighbourhood_cleansed || null,
      neighbourhoodGroup: row.neighbourhood_group_cleansed || null,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      propertyType: row.property_type,
      roomType: row.room_type,
      accommodates: parseIntOrNull(row.accommodates) ?? 1,
      bathroomsText: row.bathrooms_text || null,
      bedrooms: parseIntOrNull(row.bedrooms),
      beds: parseIntOrNull(row.beds),
      amenities: parseAmenities(row.amenities),
      price,
      minimumNights: parseIntOrNull(row.minimum_nights) ?? 1,
      rating: parseFloatOrNull(row.review_scores_rating),
      reviewsCount: parseIntOrNull(row.number_of_reviews) ?? 0,
      hostId: hostIdMap.get(row.host_id),
    };
  });
  await prisma.listing.createMany({ data: listings });

  const listingIdMap = new Map(
    (await prisma.listing.findMany({ select: { id: true, airbnbId: true } })).map((l) => [l.airbnbId, l.id]),
  );

  // 4. Відгуки
  const reviews = reviewRows
    .filter((row) => listingIdMap.has(row.listing_id))
    .map((row) => ({
      airbnbId: row.id,
      listingId: listingIdMap.get(row.listing_id),
      date: parseDateOrNull(row.date),
      reviewerName: row.reviewer_name || 'Guest',
      comments: htmlBreaksToNewlines(row.comments),
    }))
    .filter((review) => review.date);
  await insertInBatches(prisma.review, reviews);

  // 5. Календар. У свіжих вивантаженнях ціни в calendar.csv немає —
  //    тоді беремо ціну з оголошення.
  const calendar = calendarRows
    .filter((row) => listingIdMap.has(row.listing_id))
    .map((row) => ({
      listingId: listingIdMap.get(row.listing_id),
      date: parseDateOrNull(row.date),
      available: parseBool(row.available),
      price: parsePrice(row.price) ?? listingPrices.get(row.listing_id) ?? null,
    }))
    .filter((day) => day.date);
  await insertInBatches(prisma.calendarDay, calendar);

  console.log(
    `✅ hosts: ${hostsByAirbnbId.size}, listings: ${listings.length}, reviews: ${reviews.length}, calendar days: ${calendar.length}`,
  );
  console.timeEnd('seed');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
