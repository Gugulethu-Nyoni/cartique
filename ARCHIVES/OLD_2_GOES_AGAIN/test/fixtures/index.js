/**
 * ============================================================
 * Test: Fixtures
 * ============================================================
 */

import { createProduct } from '../../src/commerce/catalog/product.js';
import { createPersona } from '../../src/commerce/personas/Persona.js';
import { createPlace } from '../../src/commerce/places/Place.js';
import { createContext } from '../../src/commerce/contexts/Context.js';

export const TestProduct = createProduct({
  id: 'test-product',
  sku: 'TEST-001',
  slug: 'test-product',
  metadata: { title: 'Test Product', description: 'A test product' },
  media: { images: [], videos: [] },
  dimensions: { weight: 1, length: 10, width: 10, height: 10 },
  attributes: {},
  variants: [],
  relationships: { related: [], upsells: [], crossSells: [] }
});

export const TestPersona = createPersona({
  id: 'test-persona',
  name: 'Test Persona',
  group: 'test'
});

export const TestPlace = createPlace({
  id: 'test-place',
  name: 'Test Place',
  country: 'XX',
  currency: 'XXX',
  timezone: 'UTC'
});

export const TestContext = createContext({
  id: 'test-context',
  name: 'Test Context',
  activation: { type: 'test' },
  injects: ['test.inject']
});
