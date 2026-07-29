/**
 * ============================================================
 * @semantq/cartique/resolution/resolvers
 * ============================================================
 *
 * Resolver: Selection
 * Purpose: Resolve product selections and variants
 * ============================================================
 */

export class SelectionResolver {
  resolve(state) {
    const product = state.product;
    const selections = state.configuration?.selections || {};

    console.log('🔍 SelectionResolver:');
    console.log('  Product variants:', product.variants?.length || 0);
    console.log('  Selections:', JSON.stringify(selections));

    let selectedVariant = null;
    let selectedOptions = {};

    // Find matching variant
    if (product.variants && product.variants.length > 0) {
      // Try to find variant matching selections
      if (Object.keys(selections).length > 0) {
        selectedVariant = product.variants.find(variant => {
          const attrs = variant.attributes || {};
          return Object.entries(selections).every(([key, value]) => attrs[key] === value);
        });
        
        console.log('  Matched variant:', selectedVariant?.id || 'none');
      }

      // If no match, use first variant as fallback
      if (!selectedVariant) {
        selectedVariant = product.variants[0];
        console.log('  Using fallback variant:', selectedVariant.id);
      }
      
      if (selectedVariant) {
        selectedOptions = selections;
        
        // Attach the selected variant to the state
        state.selectedVariant = selectedVariant;
        
        // Store selection results
        state.resolved.selections = {
          variant: selectedVariant,
          options: selectedOptions,
          matched: !!selectedVariant
        };
        
        console.log('  Selected variant pricing:', selectedVariant.pricing);
      }
    }

    return state;
  }
}
