/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createGiftCard(config) {
  const giftCard = {
    id: config.id,
    sku: config.sku,
    slug: config.slug,
    type: 'giftCard',
    metadata: Object.freeze({
      title: config.metadata.title,
      description: config.metadata.description || ''
    }),
    denominations: Object.freeze(
      (config.denominations || []).map(d => Object.freeze({
        value: d.value,
        label: d.label || `${d.value}`
      }))
    ),
    digital: config.digital || false,
    expiresIn: config.expiresIn || 365
  };

  return Object.freeze(giftCard);
}
