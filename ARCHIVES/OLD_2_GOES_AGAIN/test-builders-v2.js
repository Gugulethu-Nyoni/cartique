/**
 * ============================================================
 * Test: Builders Module (v2)
 * ============================================================
 */

import { ConfigurationBuilder } from './src/commerce/builders/ConfigurationBuilder.js';
import { ScenarioBuilder } from './src/commerce/builders/ScenarioBuilder.js';
import { OfferBuilder } from './src/commerce/builders/OfferBuilder.js';
import { SelectionModelBuilder } from './src/commerce/builders/SelectionModelBuilder.js';
import { Pricing, Shipping, Tax } from './src/commerce/capabilities/index.js';

console.log('✅ Testing Builders Module (v2)');
console.log('');

// ============================================================
// Test ConfigurationBuilder (v2)
// ============================================================

console.log('📋 ConfigurationBuilder:');
const config = ConfigurationBuilder
  .forTemplate('bot-chia-wholesale')
  .quantity(12)
  .select('weight', '1kg')
  .select('quantity', 'case-12')
  .withCapability('pricing.bulk', { minimumQuantity: 10 })
  .build();

console.log('  Template:', config.templateId);
console.log('  Quantity:', config.quantity);
console.log('  Selections:', JSON.stringify(config.selections));
console.log('  Capabilities:', JSON.stringify(config.capabilities));
console.log('  Frozen:', Object.isFrozen(config));
console.log('');

// ============================================================
// Test ScenarioBuilder (v2) — BDD style
// ============================================================

console.log('📋 ScenarioBuilder (BDD):');
const scenario = ScenarioBuilder
  .story('wholesale-purchase', 'Wholesale Chia Purchase')
  .withDescription('A wholesale customer purchases 12 x 1kg chia seeds')
  .withCustomer({ group: 'wholesale', country: 'ZA' })
  .withPlace({ country: 'ZA', currency: 'ZAR' })
  .given({ templateId: 'bot-chia-wholesale' })
  .when({ quantity: 12, selections: { weight: '1kg', quantity: 'case-12' } })
  .expect({ price: 320, tax: 48, total: 368 })
  .build();

console.log('  Story:', scenario.id);
console.log('  Given:', Object.keys(scenario.given).join(', '));
console.log('  When:', Object.keys(scenario.when).join(', '));
console.log('  Expect:', Object.keys(scenario.expect).join(', '));
console.log('  Frozen:', Object.isFrozen(scenario));
console.log('');

// ============================================================
// Test OfferBuilder (v2) — English-like syntax
// ============================================================

console.log('📋 OfferBuilder:');
const offer = OfferBuilder
  .for('bot-chia-1kg')
  .called('Wholesale Chia')
  .supports(Pricing.Wholesale)
  .supports(Pricing.Bulk)
  .supports(Shipping.Freight)
  .supports(Tax.VAT)
  .withSelectionGroup({
    id: 'weight',
    label: 'Weight',
    type: 'choice',
    min: 1,
    max: 1,
    options: [
      { id: '1kg', label: '1kg', value: '1kg' },
      { id: '500g', label: '500g', value: '500g' }
    ]
  })
  .build();

console.log('  ID:', offer.id);
console.log('  Title:', offer.title);
console.log('  Catalog Item:', offer.catalogItemId);
console.log('  Capabilities:', offer.supportedCapabilities.length);
console.log('  Selection Groups:', offer.selectionModel.groups.length);
console.log('  Frozen:', Object.isFrozen(offer));
console.log('');

// ============================================================
// Test SelectionModelBuilder
// ============================================================

console.log('📋 SelectionModelBuilder:');
const selectionModel = SelectionModelBuilder
  .model()
  .addGroup('drink', 'choice', 1, 1)
  .select('coke', 'Coca-Cola', 'coke')
  .select('sprite', 'Sprite', 'sprite')
  .addGroup('toppings', 'optional', 0, 3)
  .select('cheese', 'Extra Cheese', 'cheese')
  .select('bacon', 'Bacon', 'bacon')
  .build();

console.log('  Groups:', selectionModel.groups.length);
console.log('  Group 1:', selectionModel.groups[0].id, `(${selectionModel.groups[0].selections.length} options)`);
console.log('  Group 2:', selectionModel.groups[1].id, `(${selectionModel.groups[1].selections.length} options)`);
console.log('  Frozen:', Object.isFrozen(selectionModel));
console.log('');

console.log('✅ All tests passed!');
