/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Scenario
 * Purpose: Standard scenario type
 * ============================================================
 */

/**
 * Scenario type definition
 *
 * @typedef {Object} ScenarioDefinition
 * @property {string} id - Unique identifier
 * @property {string} name - Scenario name
 * @property {string} description - Scenario description
 * @property {Object} given - Preconditions
 * @property {Object} when - Actions
 * @property {Object} then - Expectations
 */
export const ScenarioDefinition = Object.freeze({
  type: 'scenario',
  required: ['id', 'name', 'given', 'when', 'then'],
  optional: ['description']
});
