/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createSubscription(config) {
  const subscription = {
    id: config.id,
    sku: config.sku,
    slug: config.slug,
    type: 'subscription',
    metadata: Object.freeze({
      title: config.metadata.title,
      description: config.metadata.description || ''
    }),
    intervals: Object.freeze(
      (config.intervals || []).map(i => Object.freeze({
        label: i.label,
        months: i.months
      }))
    ),
    includes: Object.freeze(
      (config.includes || []).map(i => Object.freeze({
        productId: i.productId,
        quantity: i.quantity || 1
      }))
    )
  };

  return Object.freeze(subscription);
}
