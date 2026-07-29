/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Configuration
 * Purpose: Standard configuration type
 * ============================================================
 */

/**
 * Configuration type definition
 *
 * @typedef {Object} ConfigurationDefinition
 * @property {string} templateId - Template ID
 * @property {number} quantity - Quantity
 * @property {Object} selections - { key: value }
 * @property {Object} extensions - Custom extensions
 */
export const ConfigurationDefinition = Object.freeze({
  type: 'configuration',
  required: ['templateId', 'quantity'],
  optional: ['selections', 'extensions']
});
