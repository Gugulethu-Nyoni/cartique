/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Variant
 * Purpose: Standard variant type
 * ============================================================
 */

/**
 * Variant type definition
 *
 * @typedef {Object} VariantDefinition
 * @property {string} id - Unique identifier
 * @property {string} productId - Parent product ID
 * @property {string} sku - Stock keeping unit
 * @property {string} title - Variant title
 * @property {Object} attributes - Variant attributes
 */
export const VariantDefinition = Object.freeze({
  type: 'variant',
  required: ['id', 'productId', 'sku', 'title'],
  optional: ['attributes']
});
