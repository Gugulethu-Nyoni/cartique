/**
 * ============================================================
 * @semantq/cartique/commerce/contexts
 * ============================================================
 */

export function createContext(config) {
  const context = {
    id: config.id,
    name: config.name,
    activation: config.activation,
    injects: Object.freeze(config.injects || []),
    metadata: Object.freeze(config.metadata || {})
  };

  return Object.freeze(context);
}
