/**
 * ============================================================
 * Example: Botaniq — Contexts
 * ============================================================
 */

import { createContext } from '../../../src/commerce/contexts/Context.js';

export const BlackFriday = createContext({
  id: 'black-friday',
  name: 'Black Friday',
  activation: {
    type: 'date-range',
    startsAt: '2026-11-24',
    endsAt: '2026-11-30'
  },
  injects: ['pricing.blackFriday', 'shipping.free'],
  metadata: {
    discount: 0.20,
    description: 'Black Friday promotional period'
  }
});

export const WellnessWednesday = createContext({
  id: 'wellness-wednesday',
  name: 'Wellness Wednesday',
  activation: {
    type: 'recurring',
    weekday: 'Wednesday'
  },
  injects: ['pricing.wellnessDiscount'],
  metadata: {
    discount: 0.10,
    description: 'Wellness Wednesday discount'
  }
});

export const EmployeeDiscount = createContext({
  id: 'employee-discount',
  name: 'Employee Discount',
  activation: {
    type: 'customer-group',
    group: 'employee'
  },
  injects: ['pricing.employee'],
  metadata: {
    discount: 0.20,
    description: 'Employee discount'
  }
});
