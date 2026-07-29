/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Place
 * Purpose: Standard place/region type
 * ============================================================
 */

/**
 * Place type definition
 *
 * @typedef {Object} PlaceDefinition
 * @property {string} id - Unique identifier
 * @property {string} country - Country code
 * @property {string} currency - Currency code
 * @property {string} timezone - Timezone
 * @property {Object} shipping - Shipping zones
 * @property {Object} tax - Tax identifiers
 * @property {Object} metadata - Additional metadata
 */
export const PlaceDefinition = Object.freeze({
  type: 'place',
  required: ['id', 'country', 'currency'],
  optional: ['timezone', 'shipping', 'tax', 'metadata']
});
