/**
 * ============================================================
 * @semantq/cartique/resolution/resolvers
 * ============================================================
 *
 * Resolver: Pricing
 * Purpose: Resolve pricing based on product, variant, customer, and quantity
 * ============================================================
 */

export class PricingResolver {
  resolve(state) {
    console.log('💰 PricingResolver running...');

    const product = state.product;
    const customer = state.customer || {};
    const configuration = state.configuration || {};
    const quantity = configuration.quantity || 1;

    console.log('  Product ID:', product?.id);
    console.log('  Customer group:', customer.group || 'none');
    console.log('  Quantity:', quantity);
    console.log('  Selections:', JSON.stringify(configuration.selections || {}));

    // Get pricing from selected variant
    let pricing = null;
    let selectedVariant = state.selectedVariant || state.resolved?.selections?.variant;

    if (selectedVariant && selectedVariant.pricing) {
      pricing = selectedVariant.pricing;
      console.log('  Using selected variant pricing:', JSON.stringify(pricing));
    } else if (product.pricing) {
      pricing = product.pricing;
      console.log('  Using product pricing:', JSON.stringify(pricing));
    } else if (product.variants && product.variants.length > 0) {
      // Try to find variant from selections
      const selections = configuration.selections || {};
      const variant = product.variants.find(v => {
        const attrs = v.attributes || {};
        return Object.entries(selections).every(([key, value]) => attrs[key] === value);
      });
      
      if (variant) {
        selectedVariant = variant;
        pricing = variant.pricing;
        state.resolved.selections = state.resolved.selections || {};
        state.resolved.selections.variant = variant;
        console.log('  Found variant from product:', variant.id, 'pricing:', JSON.stringify(pricing));
      } else {
        // Use first variant as fallback
        const fallback = product.variants[0];
        pricing = fallback.pricing;
        console.log('  Using fallback variant:', fallback.id, 'pricing:', JSON.stringify(pricing));
      }
    }

    // If no pricing found, return error
    if (!pricing) {
      console.log('  ❌ No pricing found!');
      state.errors.push({
        code: 'MISSING_PRICING',
        message: 'No pricing found for product or variant',
        productId: product.id
      });
      state.valid = false;
      return state;
    }

    let unitPrice = pricing.base || 0;
    const appliedRules = [];

    console.log('  Base price:', unitPrice);

    // Check for customer group pricing
    const customerGroup = customer.group || customer.metadata?.group;
    if (customerGroup === 'wholesale' && pricing.wholesale) {
      unitPrice = pricing.wholesale;
      appliedRules.push({ type: 'customer_group', group: 'wholesale' });
      console.log('  Applied wholesale pricing:', unitPrice);
    } else if (customerGroup === 'vip' && pricing.vip) {
      unitPrice = pricing.vip;
      appliedRules.push({ type: 'customer_group', group: 'vip' });
    } else if (customerGroup === 'employee' && pricing.employee) {
      unitPrice = pricing.employee;
      appliedRules.push({ type: 'customer_group', group: 'employee' });
    }

    // Check for bulk pricing
    if (pricing.bulk && pricing.bulk.length > 0) {
      const tiers = pricing.bulk;
      const sortedTiers = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);
      const matchingTier = sortedTiers.find(t => quantity >= t.minQuantity);

      if (matchingTier) {
        unitPrice = matchingTier.price;
        appliedRules.push({ type: 'bulk', minQuantity: matchingTier.minQuantity });
        console.log('  Applied bulk pricing:', unitPrice, 'for quantity', quantity);
      }
    }

    console.log('  Final unit price:', unitPrice);
    console.log('  Subtotal:', unitPrice * quantity);
    console.log('  Applied rules:', appliedRules.map(r => r.type).join(', ') || 'none');

    state.resolved.pricing = {
      unitPrice: unitPrice,
      quantity: quantity,
      subtotal: unitPrice * quantity,
      basePrice: pricing.base || 0,
      appliedRules: appliedRules,
      trace: [
        { step: 'basePrice', value: pricing.base, description: `Base price` },
        ...appliedRules.map(rule => ({
          step: rule.type,
          value: unitPrice,
          description: `${rule.type} discount applied`
        })),
        { step: 'final', value: unitPrice, description: 'Final unit price' }
      ]
    };

    return state;
  }
}
