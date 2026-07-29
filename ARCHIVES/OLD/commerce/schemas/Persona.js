/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Persona
 * Purpose: Standard customer persona type
 * ============================================================
 */

/**
 * Persona type definition
 *
 * @typedef {Object} PersonaDefinition
 * @property {string} id - Unique identifier
 * @property {string} name - Persona name
 * @property {string} group - Customer group
 * @property {number} discount - Discount percentage (0-1)
 * @property {Object} metadata - Additional metadata
 */
export const PersonaDefinition = Object.freeze({
  type: 'persona',
  required: ['id', 'name', 'group'],
  optional: ['discount', 'metadata']
});
