/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createRental(config) {
  const rental = {
    id: config.id,
    sku: config.sku,
    slug: config.slug,
    type: 'rental',
    metadata: Object.freeze({
      title: config.metadata.title,
      description: config.metadata.description || ''
    }),
    media: Object.freeze({
      images: config.media?.images || [],
      videos: config.media?.videos || []
    }),
    rentalPeriods: Object.freeze(
      (config.rentalPeriods || []).map(p => Object.freeze({
        label: p.label,
        duration: p.duration,
        unit: p.unit || 'day'
      }))
    ),
    deposit: config.deposit || 0,
    requiresInsurance: config.requiresInsurance || false
  };

  return Object.freeze(rental);
}
