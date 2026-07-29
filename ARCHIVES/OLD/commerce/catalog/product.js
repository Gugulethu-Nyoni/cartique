/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createProduct(config) {
  const product = {
    id: config.id,
    sku: config.sku,
    slug: config.slug,
    type: 'product',
    metadata: Object.freeze({
      title: config.metadata.title,
      description: config.metadata.description || '',
      brand: config.metadata.brand || ''
    }),
    media: Object.freeze({
      images: config.media?.images || [],
      videos: config.media?.videos || []
    }),
    dimensions: Object.freeze({
      weight: config.dimensions?.weight || 0,
      length: config.dimensions?.length || 0,
      width: config.dimensions?.width || 0,
      height: config.dimensions?.height || 0
    }),
    attributes: Object.freeze(config.attributes || {}),
    variants: Object.freeze(config.variants || []),
    relationships: Object.freeze({
      related: config.relationships?.related || [],
      upsells: config.relationships?.upsells || [],
      crossSells: config.relationships?.crossSells || []
    })
  };

  return Object.freeze(product);
}
