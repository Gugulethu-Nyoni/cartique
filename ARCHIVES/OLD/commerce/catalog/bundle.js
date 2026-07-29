/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createBundle(config) {
  const bundle = {
    id: config.id,
    sku: config.sku,
    slug: config.slug,
    type: 'bundle',
    metadata: Object.freeze({
      title: config.metadata.title,
      description: config.metadata.description || ''
    }),
    media: Object.freeze({
      images: config.media?.images || [],
      videos: config.media?.videos || []
    }),
    components: Object.freeze(
      (config.components || []).map(c => Object.freeze({
        productId: c.productId,
        quantity: c.quantity || 1
      }))
    ),
    savings: config.savings || 0
  };

  return Object.freeze(bundle);
}
