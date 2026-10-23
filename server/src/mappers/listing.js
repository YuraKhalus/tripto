// Prisma повертає Decimal як об'єкт, а в JSON він перетворюється на рядок "120".
// Фронту зручніше число, тому перетворюємо тут — в одному місці.
const toNumber = (decimal) => (decimal === null || decimal === undefined ? null : Number(decimal));

/** Коротка картка для списку (результати пошуку) */
export function toListingCard(listing) {
  return {
    id: listing.id,
    name: listing.name,
    pictureUrl: listing.pictureUrl,
    neighbourhood: listing.neighbourhood,
    roomType: listing.roomType,
    accommodates: listing.accommodates,
    price: toNumber(listing.price),
    rating: listing.rating,
    reviewsCount: listing.reviewsCount,
    location: { lat: listing.latitude, lng: listing.longitude },
  };
}

/** Повна сторінка житла */
export function toListingDetails(listing) {
  return {
    ...toListingCard(listing),
    description: listing.description,
    neighbourhoodGroup: listing.neighbourhoodGroup,
    propertyType: listing.propertyType,
    bathroomsText: listing.bathroomsText,
    bedrooms: listing.bedrooms,
    beds: listing.beds,
    amenities: listing.amenities,
    minimumNights: listing.minimumNights,
    host: listing.host
      ? {
          id: listing.host.id,
          name: listing.host.name,
          pictureUrl: listing.host.pictureUrl,
          isSuperhost: listing.host.isSuperhost,
          since: listing.host.since,
        }
      : null,
  };
}
