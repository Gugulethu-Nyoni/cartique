/**
 * ============================================================
 * @semantq/cartique-engine/resolvers
 * ============================================================
 *
 * Resolver: Variant
 * Purpose: Select the appropriate variant for the sellable
 * ============================================================
 */

import { ResolutionPatch } from '../../core/ResolutionPatch.js';
import { ResolutionItem } from '../../core/ResolutionItem.js';

export class VariantResolver {
    resolve(state) {
        const sellable = state.sellable;
        const configuration = state.configuration || {};
        const selections = configuration.selections || {};

        if (!sellable) {
            return ResolutionPatch.error('No sellable provided');
        }

        // Get variants
        const variants = sellable.variants || [];
        if (variants.length === 0) {
            return ResolutionPatch.error('No variants available');
        }

        // Find matching variant
        let selectedVariant = null;
        let selectedVariantId = 'default';

        // If a specific variant ID is provided
        if (selections.variantId) {
            selectedVariant = variants.find(v => String(v.id) === String(selections.variantId));
            if (selectedVariant) {
                selectedVariantId = String(selectedVariant.id);
            }
        }

        // If no variant found by ID, use the first one
        if (!selectedVariant) {
            selectedVariant = variants[0];
            selectedVariantId = String(selectedVariant.id);
        }

        // Create resolution item
        const item = new ResolutionItem({
            sellable: sellable,
            variant: selectedVariant,
            quantity: configuration.quantity || 1,
            origin: { type: 'direct' },
            metadata: {}
        });

        // Build resolved data with the selected variant
        const resolvedData = {
            selections: {
                variant: selectedVariant,
                variantId: selectedVariantId,
                options: selections
            }
        };

        // Return patch with journal entry
        return ResolutionPatch.success({
            items: [item],
            resolved: resolvedData,
            journalEntries: [{
                resolver: 'VariantResolver',
                capability: 'variant-selection',
                ruleId: 'variant.default',
                decision: 'applied',
                reason: `Selected variant: ${selectedVariantId}`,
                confidence: 100
            }]
        });
    }
}

export default VariantResolver;
