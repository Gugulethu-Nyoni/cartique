/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Resolution
 * Purpose: Standard resolution type
 * ============================================================
 */

/**
 * Resolution type definition
 *
 * @typedef {Object} ResolutionDefinition
 * @property {string} id - Unique identifier
 * @property {string} templateId - Template ID
 * @property {Object} pricing - Pricing result
 * @property {Object} inventory - Inventory result
 * @property {Object} validation - Validation result
 * @property {Object} shipping - Shipping result
 * @property {Object} tax - Tax result
 * @property {Object} fulfillment - Fulfillment result
 * @property {number} total - Grand total
 * @property {boolean} valid - Is valid
 * @property {Array} errors - Errors
 * @property {Object} audit - Audit trail
 */
export const ResolutionDefinition = Object.freeze({
  type: 'resolution',
  required: ['id', 'templateId', 'valid'],
  optional: ['pricing', 'inventory', 'validation', 'shipping', 'tax', 'fulfillment', 'total', 'errors', 'audit']
});
