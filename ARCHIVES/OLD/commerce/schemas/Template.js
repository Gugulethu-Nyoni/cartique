/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Template
 * Purpose: Standard offer template type
 * ============================================================
 */

/**
 * Template type definition
 *
 * @typedef {Object} TemplateDefinition
 * @property {string} id - Unique identifier
 * @property {string} catalogItemId - Parent catalog item
 * @property {string} sku - Stock keeping unit
 * @property {string} title - Template title
 * @property {Object} selectionModel - { groups: [] }
 * @property {Object} configuration - { defaults: {}, constraints: {} }
 * @property {Array} capabilities - Array of capability IDs
 * @property {string[]} variants - Array of variant IDs
 */
export const TemplateDefinition = Object.freeze({
  type: 'template',
  required: ['id', 'catalogItemId', 'sku', 'title'],
  optional: ['selectionModel', 'configuration', 'capabilities', 'variants']
});
