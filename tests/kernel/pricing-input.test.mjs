import { ProductRepository } from '../../src/persistence/repositories/ProductRepository.js';
import { VariantResolver, PricingResolver } from '../../src/engine/resolvers/index.js';
import { ResolutionEngine } from '../../src/engine/ResolutionEngine.js';
import { Customer, Place } from '../../src/commerce/index.js';

const PRODUCT_ID = 9;
const VARIANT_ID = 104;

const repository = new ProductRepository();

const product = repository.findById(PRODUCT_ID);
const variant = repository.findVariant(PRODUCT_ID, VARIANT_ID);

if (!product) {
    throw new Error(`Product ${PRODUCT_ID} not found`);
}

if (!variant) {
    throw new Error(`Variant ${VARIANT_ID} not found`);
}

console.log('\n=== PRODUCT VARIANT ===');
console.dir(variant, { depth: null });

const engine = new ResolutionEngine({
    resolvers: [
        new VariantResolver(),
        new PricingResolver()
    ]
});

console.log('\n=== RESOLVING ===');

const result = engine.resolve({
    sellable: product,
    customer: Customer.retail({ id: 'test' }),
    place: Place.southAfrica(),
    configuration: {
        quantity: 2,
        selections: {
            variantId: VARIANT_ID
        }
    }
});

console.log('\n=== PRICING RESULT ===');
console.dir(result.items[0], { depth: 3 });
