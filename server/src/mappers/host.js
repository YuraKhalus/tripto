export function toHostDetails(host) {
  return {
    id: host.id,
    name: host.name,
    pictureUrl: host.pictureUrl,
    isSuperhost: host.isSuperhost,
    since: host.since,
    listingsCount: host._count.listings,
  };
}
