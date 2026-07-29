/**
 * ============================================================
 * @semantq/cartique/commerce/personas
 * ============================================================
 */

export function createPersona(config) {
  const persona = {
    id: config.id,
    name: config.name,
    group: config.group || 'default',
    metadata: Object.freeze(config.metadata || {})
  };

  return Object.freeze(persona);
}
