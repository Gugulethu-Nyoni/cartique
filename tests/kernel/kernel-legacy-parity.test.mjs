/**
 * Kernel/Legacy Parity Test
 *
 * Compares legacy and kernel commercial decisions for the same cart inputs.
 * Verifies the kernel can reproduce the complete commercial decision
 * that the existing cart path produces.
 *
 * Run: node tests/kernel/kernel-legacy-parity.test.mjs
 */

import CartiqueAdapter from '../../storefront/src/adapters/CartiqueAdapter.js';
import { ResolutionEngine } from '../../src/engine/ResolutionEngine.js';
import {
    VariantResolver,
    PricingResolver,
    PromotionResolver,
    TaxResolver,
    ShippingResolver
} from '../../src/engine/resolvers/index.js';
import { Customer, Place } from '../../src/commerce/index.js';
import { products } from '../../src/persistence/fixtures/botaniq/products.js';

// ==========================================================
// TEST DATA
// ==========================================================

const PRODUCT_ID = 9;
const VARIANT_ID = 104;

const baseProduct = products.find(p => p.id === PRODUCT_ID);
const productVariants = variants.filter(v => v.productId === baseProduct.id);

const product = {
    ...baseProduct,
    variants: productVariants
};

const place = Place.southAfrica();

// ==========================================================
// TEST CASES
// ==========================================================

const testCases = [
    { customerGroup: 'retail', quantity: 2, expected: 140 },
    { customerGroup: 'retail', quantity: 5, expected: 110 },
    { customerGroup: 'retail', quantity: 9, expected: 110 },
    { customerGroup: 'retail', quantity: 10, expected: 100 },
    { customerGroup: 'wholesale', quantity: 2, expected: 120 },
    { customerGroup: 'wholesale', quantity: 5, expected: 110 },
    { customerGroup: 'wholesale', quantity: 9, expected: 110 },
    { customerGroup: 'wholesale', quantity: 10, expected: 100 },
];

// ==========================================================
// HELPERS
// ==========================================================

function getCustomer(group) {
    if (group === 'wholesale') {
        return Customer.wholesale({ id: 'wholesale-test' });
    }
    return Customer.retail({ id: 'retail-test' });
}

// ==========================================================
// LEGACY RESOLVER
// ==========================================================

function resolveLegacy(product, variant, quantity, customer) {
    const adapter = new CartiqueAdapter(null, { legacyMode: true });
    
    const request = {
        items: [{
            productId: product.id,
            variantId: variant.id,
            quantity: quantity,
            sellable: product
        }],
        customer: customer,
        place: place
    };

    return adapter._resolveCartLegacyToDecision(request);
}

// ==========================================================
// KERNEL RESOLVER
// ==========================================================

function resolveKernel(product, variant, quantity, customer) {
    const engine = new ResolutionEngine({
        resolvers: [
            new VariantResolver(),
            new PricingResolver(),
            new PromotionResolver(),
            new TaxResolver(),
            new ShippingResolver()
        ]
    });

    return engine.resolve({
        sellable: product,
        customer: customer,
        place: place,
        configuration: {
            quantity: quantity,
            selections: {
                variantId: variant.id
            }
        }
    });
}

// ==========================================================
// PARITY TEST
// ==========================================================

function compareCommercialValues(legacy, kernel) {
    const errors = [];

    const legacyItem = legacy.items[0];
    const kernelItem = kernel.items[0];

    if (!legacyItem || !kernelItem) {
        errors.push('Missing item in legacy or kernel decision');
        return errors;
    }

    // Compare quantities
    if (legacyItem.quantity !== kernelItem.quantity?.value) {
        errors.push(`Quantity mismatch: legacy=${legacyItem.quantity}, kernel=${kernelItem.quantity?.value}`);
    }

    // Compare unit prices (at decimal level)
    const legacyUnitPrice = legacyItem.unitPrice || 0;
    const kernelUnitPrice = kernelItem.unitPrice?.decimal || 0;

    if (Math.abs(legacyUnitPrice - kernelUnitPrice) > 0.01) {
        errors.push(`Unit price mismatch: legacy=${legacyUnitPrice}, kernel=${kernelUnitPrice}`);
    }

    // Compare subtotals (at decimal level)
    const legacySubtotal = legacyItem.total || 0;
    const kernelSubtotal = kernelItem.total?.decimal || 0;

    if (Math.abs(legacySubtotal - kernelSubtotal) > 0.01) {
        errors.push(`Subtotal mismatch: legacy=${legacySubtotal}, kernel=${kernelSubtotal}`);
    }

    // Compare total cart subtotal
    const legacyTotal = legacy.totals?.subtotal || 0;
    const kernelTotal = kernel.totals?.subtotal?.decimal || 0;

    if (Math.abs(legacyTotal - kernelTotal) > 0.01) {
        errors.push(`Cart subtotal mismatch: legacy=${legacyTotal}, kernel=${kernelTotal}`);
    }

    return errors;
}

// ==========================================================
// RUN TESTS
// ==========================================================

console.log('\n===== KERNEL / LEGACY PARITY =====\n');
// DIAGNOSTIC: Inspect one legacy result
console.log('\n===== DIAGNOSTIC: LEGACY RESULT SHAPE =====');
const diagCustomer = getCustomer('retail');
const diagVariant = productVariants.find(v => v.id === VARIANT_ID);
const diagLegacy = resolveLegacy(product, diagVariant, 2, diagCustomer);
console.dir(diagLegacy, { depth: 5 });
console.log('\n===== END DIAGNOSTIC =====\n');


let passed = 0;
let failed = 0;

for (const test of testCases) {
    const customer = getCustomer(test.customerGroup);
    const variant = productVariants.find(v => v.id === VARIANT_ID);

    try {
        const legacy = resolveLegacy(product, variant, test.quantity, customer);
        const kernel = resolveKernel(product, variant, test.quantity, customer);

        const errors = compareCommercialValues(legacy, kernel);

        if (errors.length === 0) {
            console.log(
                `${test.customerGroup.padEnd(10)} ${String(test.quantity).padEnd(3)} -> R${test.expected} PASS`
            );
            passed++;
        } else {
            console.log(
                `${test.customerGroup.padEnd(10)} ${String(test.quantity).padEnd(3)} -> R${test.expected} FAIL`
            );
            errors.forEach(e => console.log(`  ${e}`));
            failed++;
        }
    } catch (error) {
        console.log(
            `${test.customerGroup.padEnd(10)} ${String(test.quantity).padEnd(3)} -> R${test.expected} FAIL`
        );
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

console.log('\n========================================');
console.log(`PASSED: ${passed}/${passed + failed}`);
console.log(`FAILED: ${failed}/${passed + failed}`);

if (failed === 0) {
    console.log('\nPASS — Kernel and legacy commercial decisions are equivalent.');
    console.log('\nReady to switch CartiqueAdapter.resolveCart() to kernel path.');
} else {
    console.log('\nFAIL — Parity issues found. Fix before switching adapter.');
    process.exit(1);
}
