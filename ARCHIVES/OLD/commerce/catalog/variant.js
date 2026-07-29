/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createVariant(config) {
  const variant = {
    id: config.id,
    productId: config.productId,
    sku: config.sku,
    title: config.title,
    attributes: Object.freeze(config.attributes || {})
  };

  return Object.freeze(variant);
}
