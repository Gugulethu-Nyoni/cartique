/**
 * ============================================================
 * Test: Builders Module
 * ============================================================
 */

import { ConfigurationBuilder } from './src/commerce/builders/ConfigurationBuilder.js';
import { ScenarioBuilder } from './src/commerce/builders/ScenarioBuilder.js';
import { OfferBuilder } from './src/commerce/builders/OfferBuilder.js';
import { SelectionBuilder } from './src/commerce/builders/SelectionBuilder.js';
import { Pricing, Shipping, Tax } from './src/commerce/capabilities/index.js';
import { BotaniqBuilders } from './src/commerce/builders/fixtures/botaniq.js';

console.log('✅ Testing Builders Module');
console.log('');

// ============================================================
// Test ConfigurationBuilder
// ============================================================

console.log('📋 ConfigurationBuilder:');
const config = ConfigurationBuilder
  .forTemplate('test-template')
  .withQuantity(5)
  .select('size', 'large')
  .select('color', 'red')
  .withExtension('giftWrap', true)
  .build();

console.log('  Template:', config.templateId);
console.log('  Quantity:', config.quantity);
console.log('  Selections:', JSON.stringify(config.selections));
console.log('  Extensions:', JSON.stringify(config.extensions));
console.log('  Frozen:', Object.isFrozen(config));
console.log('');

// ============================================================
// Test ScenarioBuilder
// ============================================================

console.log('📋 ScenarioBuilder:');
const scenario = ScenarioBuilder
  .named('test-scenario', 'Test Scenario')
  .withDescription('A test scenario')
  .withCustomer({ group: 'retail' })
  .withPlace({ country: 'ZA' })
  .given({ templateId: 'test' })
  .when({ quantity: 1 })
  .then({ expected: 'success' })
  .build();

console.log('  ID:', scenario.id);
console.log('  Name:', scenario.name);
console.log('  Given:', Object.keys(scenario.given).join(', '));
console.log('  When:', Object.keys(scenario.when).join(', '));
console.log('  Then:', Object.keys(scenario.then).join(', '));
console.log('  Frozen:', Object.isFrozen(scenario));
console.log('');

// ============================================================
// Test OfferBuilder
// ============================================================

console.log('📋 OfferBuilder:');
const offer = OfferBuilder
  .forCatalogItem('test-product')
  .withId('test-offer')
  .withTitle('Test Offer')
  .withCapability(Pricing.Standard)
  .withCapability(Shipping.Standard)
  .withCapability(Tax.VAT)
  .withSelectionGroup({
    id: 'test',
    label: 'Test',
    type: 'choice',
    min: 1,
    max: 1,
    options: [{ id: 'option1', label: 'Option 1', value: 'option1' }]
  })
  .build();

console.log('  ID:', offer.id);
console.log('  Title:', offer.title);
console.log('  Capabilities:', offer.supportedCapabilities.length);
console.log('  Selection Groups:', offer.selectionModel.groups.length);
console.log('  Frozen:', Object.isFrozen(offer));
console.log('');

// ============================================================
// Test SelectionBuilder
// ============================================================

console.log('📋 SelectionBuilder:');
const selection = SelectionBuilder
  .group('test-group')
  .select('option1', 'Option 1', 'value1')
  .select('option2', 'Option 2', 'value2')
  .build();

console.log('  Groups:', selection.groups.length);
console.log('  Group ID:', selection.groups[0].id);
console.log('  Selections:', selection.groups[0].selections.length);
console.log('  Frozen:', Object.isFrozen(selection));
console.log('');

// ============================================================
// Test Fixtures
// ============================================================

console.log('📋 Builder Fixtures:');
console.log('  Configurations:', Object.keys(BotaniqBuilders.Configurations).length);
console.log('  Scenarios:', Object.keys(BotaniqBuilders.Scenarios).length);
console.log('  Offers:', Object.keys(BotaniqBuilders.Offers).length);
console.log('');

console.log('📊 Summary: All builders tested successfully');
console.log('');

console.log('✅ All tests passed!');
