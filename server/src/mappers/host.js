const toNumber = (decimal) => (decimal === null || decimal === undefined ? null : Number(decimal));

export function toHostCard(host) {
  return {
    id: host.id,
    name: host.name,
    pictureUrl: host.pictureUrl,
    isSuperhost: host.isSuperhost,
    since: host.since,
    listingsCount: host._count?.listings ?? 0,
  };
}

export function toHostDetails(host) {
  return {
    id: host.id,
    airbnbId: host.airbnbId,
    name: host.name,
    pictureUrl: host.pictureUrl,
    isSuperhost: host.isSuperhost,
    since: host.since,
    listingsCount: host._count?.listings ?? 0,
  };
}
