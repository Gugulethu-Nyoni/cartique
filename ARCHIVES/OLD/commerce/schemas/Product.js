/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Product
 * Purpose: Standard product type
 * ============================================================
 */

/**
 * Product type definition
 *
 * @typedef {Object} ProductDefinition
 * @property {string} id - Unique identifier
 * @property {string} sku - Stock keeping unit
 * @property {string} slug - URL-friendly identifier
 * @property {string} type - 'product'
 * @property {Object} metadata - { title, description, brand }
 * @property {Object} media - { images: [], videos: [] }
 * @property {Object} dimensions - { weight, length, width, height }
 * @property {Object} attributes - Product attributes
 * @property {string[]} variants - Array of variant IDs
 * @property {Object} relationships - { related, upsells, crossSells }
 */
export const ProductDefinition = Object.freeze({
  type: 'product',
  required: ['id', 'sku', 'slug', 'metadata'],
  optional: ['media', 'dimensions', 'attributes', 'variants', 'relationships']
});
