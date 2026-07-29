/**
 * ============================================================
 * @semantq/cartique/commerce/places
 * ============================================================
 */

export function createPlace(config) {
  const place = {
    id: config.id,
    name: config.name,
    country: config.country,
    currency: config.currency,
    timezone: config.timezone || 'UTC',
    metadata: Object.freeze(config.metadata || {})
  };

  return Object.freeze(place);
}
