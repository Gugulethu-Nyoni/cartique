/**
 * ============================================================
 * @semantq/cartique/commerce/definitions
 * ============================================================
 *
 * Definition: Calendar
 * Purpose: Standard calendar type
 * ============================================================
 */

/**
 * Calendar type definition
 *
 * @typedef {Object} CalendarDefinition
 * @property {string} id - Unique identifier
 * @property {string} name - Calendar name
 * @property {string} description - Calendar description
 * @property {Array} events - Array of events
 * @property {Object} metadata - Additional metadata
 */
export const CalendarDefinition = Object.freeze({
  type: 'calendar',
  required: ['id', 'name'],
  optional: ['description', 'events', 'metadata']
});
