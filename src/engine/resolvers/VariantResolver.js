/**
 * ============================================================
 * @semantq/cartique-engine/resolvers
 * ============================================================
 *
 * Resolver: Variant
 * Purpose: Find the matching variant from selections
 * ============================================================
 */

import { ResolutionPatch } from '../../core/ResolutionPatch.js';
import { ResolutionItem } from '../../core/ResolutionItem.js';
import { Quantity } from '../../core/Quantity.js';

export class VariantResolver {
  resolve(state) {
    const sellable = state.sellable;
    const configuration = state.configuration || {};
    const selections = configuration.selections || {};
    const quantity = configuration.quantity || 1;

    // If no variants, use the sellable itself
    if (!sellable.hasVariants) {
      const item = new ResolutionItem({
        sellable: sellable,
        quantity: Quantity.each(quantity),
        origin: { type: 'direct', id: sellable.id.value }
      });

      return ResolutionPatch.success({
        items: [item],
        journalEntries: [{
          resolver: 'VariantResolver',
          capability: 'variant-selection',
          decision: 'applied',
          reason: 'Single product, no variant selection needed',
          confidence: 100
        }]
      });
    }

    // Find matching variant
    const variants = sellable.variants || [];
    let selectedVariant = null;

    if (Object.keys(selections).length > 0) {
      selectedVariant = variants.find(v => {
        const attrs = v.attributes || {};
        return Object.entries(selections).every(([key, value]) => attrs[key] === value);
      });
    }

    // Use default variant if no match
    if (!selectedVariant) {
      selectedVariant = variants.find(v => v.isDefault) || variants[0] || null;
    }

    if (!selectedVariant) {
      return ResolutionPatch.reject('No matching variant found', 'VARIANT_NOT_FOUND');
    }

    // Create resolution item
    const item = new ResolutionItem({
      sellable: sellable,
      variant: selectedVariant,
      quantity: Quantity.each(quantity),
      unitPrice: selectedVariant.basePrice,
      origin: { type: 'direct', id: sellable.id.value }
    });

    return ResolutionPatch.success({
      items: [item],
      resolved: {
        selections: {
          variant: selectedVariant,
          options: selections
        }
      },
      journalEntries: [{
        resolver: 'VariantResolver',
        capability: 'variant-selection',
        ruleId: 'variant.default',
        decision: 'applied',
        reason: `Selected variant: ${selectedVariant.title}`,
        confidence: 100,
        after: selectedVariant.id
      }]
    });
  }
}
