/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Capability
 * Purpose: Standard capability type
 * ============================================================
 */

/**
 * Capability type definition
 *
 * @typedef {Object} CapabilityDefinition
 * @property {string} id - Unique identifier
 * @property {string} name - Capability name
 * @property {string} description - Capability description
 * @property {Object} parameters - Required parameters
 * @property {Object} metadata - Additional metadata
 */
export const CapabilityDefinition = Object.freeze({
  type: 'capability',
  required: ['id', 'name'],
  optional: ['description', 'parameters', 'metadata']
});
