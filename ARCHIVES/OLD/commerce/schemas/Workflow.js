/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Workflow
 * Purpose: Standard workflow type
 * ============================================================
 */

/**
 * Workflow type definition
 *
 * @typedef {Object} WorkflowDefinition
 * @property {string} id - Unique identifier
 * @property {string} name - Workflow name
 * @property {Array} steps - Array of steps
 * @property {Object} metadata - Additional metadata
 */
export const WorkflowDefinition = Object.freeze({
  type: 'workflow',
  required: ['id', 'name', 'steps'],
  optional: ['metadata']
});
