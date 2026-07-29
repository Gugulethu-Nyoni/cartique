/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Bundle
 * Purpose: Standard bundle type
 * ============================================================
 */

/**
 * Bundle type definition
 *
 * @typedef {Object} BundleDefinition
 * @property {string} id - Unique identifier
 * @property {string} sku - Stock keeping unit
 * @property {string} slug - URL-friendly identifier
 * @property {string} type - 'bundle'
 * @property {Object} metadata - { title, description }
 * @property {Object} media - { images: [], videos: [] }
 * @property {Array} components - [{ productId, quantity }]
 * @property {number} savings - Percentage savings (0-1)
 */
export const BundleDefinition = Object.freeze({
  type: 'bundle',
  required: ['id', 'sku', 'slug', 'metadata', 'components'],
  optional: ['media', 'savings']
});
