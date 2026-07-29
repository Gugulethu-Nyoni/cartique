/**
 * ============================================================
 * Examples: Botaniq Places
 * ============================================================
 */

import { createPlace } from '../../../src/commerce/places/Place.js';

export const SouthAfrica = createPlace({
  id: 'za',
  name: 'South Africa',
  country: 'ZA',
  currency: 'ZAR',
  timezone: 'Africa/Johannesburg'
});
