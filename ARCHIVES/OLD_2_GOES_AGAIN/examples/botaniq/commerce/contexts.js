/**
 * ============================================================
 * Examples: Botaniq Contexts
 * ============================================================
 */

import { createContext } from '../../../src/commerce/contexts/Context.js';

export const BlackFriday = createContext({
  id: 'black-friday',
  name: 'Black Friday',
  activation: { type: 'date-range', startsAt: '2026-11-24', endsAt: '2026-11-30' },
  injects: ['pricing.blackFriday'],
  metadata: { discount: 0.20 }
});
