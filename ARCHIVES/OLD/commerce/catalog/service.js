/**
 * ============================================================
 * @semantq/cartique/commerce/catalog
 * ============================================================
 */

export function createService(config) {
  const service = {
    id: config.id,
    sku: config.sku,
    slug: config.slug,
    type: 'service',
    metadata: Object.freeze({
      title: config.metadata.title,
      description: config.metadata.description || ''
    }),
    duration: config.duration || 60,
    delivery: config.delivery || 'virtual',
    requiresAppointment: config.requiresAppointment || false
  };

  return Object.freeze(service);
}
