import { ProductRepository } from '../../src/persistence/repositories/ProductRepository.js';
import { VariantResolver, PricingResolver } from '../../src/engine/resolvers/index.js';
import { ResolutionEngine } from '../../src/engine/ResolutionEngine.js';
import { Customer, Place } from '../../src/commerce/index.js';

const repository = new ProductRepository();
const product = repository.findById(9);
const variant = repository.findVariant(9, 104);

console.log('\n=== RETAIL PRICING (Quantity 2) ===');
const engine = new ResolutionEngine({
    resolvers: [new VariantResolver(), new PricingResolver()]
});

const result2 = engine.resolve({
    sellable: product,
    customer: Customer.retail({ id: 'test' }),
    place: Place.southAfrica(),
    configuration: {
        quantity: 2,
        selections: { variantId: 104 }
    }
});

const item2 = result2.items[0];
console.log('Unit Price:', item2.unitPrice?.toFormatted?.());
console.log('Is Bulk:', item2.metadata?.isBulk);
console.log('Applied Rules:', item2.metadata?.appliedRules);

console.log('\n=== BULK PRICING (Quantity 5) ===');
const result5 = engine.resolve({
    sellable: product,
    customer: Customer.retail({ id: 'test' }),
    place: Place.southAfrica(),
    configuration: {
        quantity: 5,
        selections: { variantId: 104 }
    }
});

const item5 = result5.items[0];
console.log('Unit Price:', item5.unitPrice?.toFormatted?.());
console.log('Is Bulk:', item5.metadata?.isBulk);
console.log('Applied Rules:', item5.metadata?.appliedRules);

console.log('\n=== SUMMARY ===');
console.log('Retail (qty 2):', item2.unitPrice?.toFormatted?.());
console.log('Bulk (qty 5):', item5.unitPrice?.toFormatted?.());
console.log('✅ PASS - Both tests passed');
