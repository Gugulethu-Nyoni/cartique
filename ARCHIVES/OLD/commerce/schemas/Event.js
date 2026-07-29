/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Event
 * Purpose: Standard event type
 * ============================================================
 */

/**
 * Event type definition
 *
 * @typedef {Object} EventDefinition
 * @property {string} type - Event type
 * @property {Object} payload - Event payload
 * @property {string} timestamp - ISO timestamp
 * @property {Object} metadata - Additional metadata
 */
export const EventDefinition = Object.freeze({
  type: 'event',
  required: ['type', 'payload', 'timestamp'],
  optional: ['metadata']
});
