/**
 * ============================================================
 * Acceptance Utils — Setup
 * ============================================================
 */

import { CommerceResolver } from '../../../src/resolution/CommerceResolver.js';
import { 
  SelectionResolver,
  ContextResolver,
  PricingResolver,
  TaxResolver,
  ShippingResolver 
} from '../../../src/resolution/resolvers/index.js';

import { createPersona } from '../../../src/commerce/personas/Persona.js';
import { createPlace } from '../../../src/commerce/places/Place.js';
import { createContext } from '../../../src/commerce/contexts/Context.js';
import { createProduct } from '../../../src/commerce/catalog/Product.js';

export function createTestResolver() {
  return new CommerceResolver({
    resolvers: [
      new SelectionResolver(),
      new ContextResolver(),
      new PricingResolver(),
      new TaxResolver(),
      new ShippingResolver()
    ]
  });
}

export const southAfrica = createPlace({
  id: 'za',
  name: 'South Africa',
  country: 'ZA',
  currency: 'ZAR',
  timezone: 'Africa/Johannesburg',
  tax: { vatRate: 0.15 },
  shipping: { defaultCost: 50 },
  metadata: { region: 'Southern Africa' }
});

export const retailCustomer = createPersona({
  id: 'retail',
  name: 'Retail Customer',
  group: 'retail',
  metadata: { tier: 'standard' }
});

export const wholesaleCustomer = createPersona({
  id: 'wholesale',
  name: 'Wholesale Customer',
  group: 'wholesale',
  metadata: { tier: 'wholesale', requiresApproval: true }
});

export const vipCustomer = createPersona({
  id: 'vip',
  name: 'VIP Customer',
  group: 'vip',
  metadata: { tier: 'gold' }
});

export const distributorCustomer = createPersona({
  id: 'distributor',
  name: 'Distributor',
  group: 'distributor',
  metadata: { tier: 'distributor', requiresApproval: true }
});

export const blackFriday = createContext({
  id: 'black-friday',
  name: 'Black Friday',
  activation: { type: 'date-range', startsAt: '2026-11-24', endsAt: '2026-11-30' },
  injects: ['pricing.blackFriday', 'shipping.free']
});

export const christmas = createContext({
  id: 'christmas',
  name: 'Christmas',
  activation: { type: 'date-range', startsAt: '2026-12-01', endsAt: '2026-12-31' },
  injects: ['pricing.christmas']
});

export const freeShipping = createContext({
  id: 'free-shipping',
  name: 'Free Shipping',
  activation: { type: 'always' },
  injects: ['shipping.free']
});
