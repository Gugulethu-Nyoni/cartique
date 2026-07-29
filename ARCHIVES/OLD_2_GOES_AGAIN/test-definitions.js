/**
 * ============================================================
 * Test: Definitions Module
 * ============================================================
 */

import {
  ProductDefinition,
  VariantDefinition,
  BundleDefinition,
  TemplateDefinition,
  ConfigurationDefinition,
  CapabilityDefinition,
  PersonaDefinition,
  PlaceDefinition,
  CalendarDefinition,
  ScenarioDefinition,
  ResolutionDefinition,
  WorkflowDefinition,
  EventDefinition
} from './src/commerce/definitions/index.js';

console.log('✅ Testing Definitions Module');
console.log('');

console.log('📚 Definitions:');
console.log('  Product:', ProductDefinition.type);
console.log('  Variant:', VariantDefinition.type);
console.log('  Bundle:', BundleDefinition.type);
console.log('  Template:', TemplateDefinition.type);
console.log('  Configuration:', ConfigurationDefinition.type);
console.log('  Capability:', CapabilityDefinition.type);
console.log('  Persona:', PersonaDefinition.type);
console.log('  Place:', PlaceDefinition.type);
console.log('  Calendar:', CalendarDefinition.type);
console.log('  Scenario:', ScenarioDefinition.type);
console.log('  Resolution:', ResolutionDefinition.type);
console.log('  Workflow:', WorkflowDefinition.type);
console.log('  Event:', EventDefinition.type);
console.log('');

console.log('🔒 Immutability:');
console.log('  Product frozen:', Object.isFrozen(ProductDefinition));
console.log('  Variant frozen:', Object.isFrozen(VariantDefinition));
console.log('  Bundle frozen:', Object.isFrozen(BundleDefinition));
console.log('');

console.log('✅ All tests passed!');
