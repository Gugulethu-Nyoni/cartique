/**
 * ============================================================
 * @semantq/cartique-engine
 * ============================================================
 *
 * Module: ResolutionEngine
 * Purpose: Orchestrate the resolution pipeline
 * ============================================================
 */

import { ResolutionState } from '../core/ResolutionState.js';
import { CommercialDecision } from '../core/CommercialDecision.js';
import { Diagnostics } from '../core/Diagnostics.js';
import { Money } from '../core/Money.js';

export class ResolutionEngine {
  constructor(options = {}) {
    this.resolvers = options.resolvers || [];
    this.pipeline = options.pipeline || [];
  }

  resolve({ sellable, customer, place, configuration, contexts = [] }) {
    if (!sellable) {
      return this._error('SELLABLE_REQUIRED', 'Sellable is required');
    }
    if (!customer) {
      return this._error('CUSTOMER_REQUIRED', 'Customer is required');
    }

    let state = new ResolutionState({
      sellable,
      customer,
      place,
      configuration: configuration || { quantity: 1 },
      contexts,
      valid: true
    });

    console.log('🔍 RESOLUTION ENGINE — START');
    console.log('Initial state.resolved:', JSON.stringify(state.resolved, null, 2));
    console.log('');

    for (const resolver of this.resolvers) {
      const resolverName = resolver.constructor.name;
      console.log(`📋 Running: ${resolverName}`);

      try {
        const patch = resolver.resolve(state);
        console.log(`  Patch from ${resolverName}:`);
        console.log(`    resolved:`, JSON.stringify(patch.resolved, null, 2));
        console.log(`    items: ${patch.items?.length || 0}`);
        console.log(`    adjustments: ${patch.adjustments?.length || 0}`);

        state = this._applyPatch(state, patch);
        console.log(`  State after ${resolverName}:`);
        console.log(`    state.resolved:`, JSON.stringify(state.resolved, null, 2));
        console.log('');

        if (!state.valid) break;
      } catch (error) {
        console.error(`❌ Error in ${resolverName}:`, error.message);
        state = state.withError('RESOLVER_ERROR', error.message);
        break;
      }
    }

    console.log('🔍 RESOLUTION ENGINE — END');
    console.log('Final state.resolved:', JSON.stringify(state.resolved, null, 2));

    return this._buildDecision(state);
  }

  _applyPatch(state, patch) {
    let newState = state;

    if (patch.items) {
      newState = newState.withItems(patch.items);
    }

    if (patch.adjustments) {
      newState = newState.withAdjustments(patch.adjustments);
    }

    if (patch.resolved) {
      console.log(`  🔧 Applying resolved patch:`, Object.keys(patch.resolved));
      Object.entries(patch.resolved).forEach(([key, value]) => {
        console.log(`    Setting resolved.${key}:`, value);
        newState = newState.withResolved(key, value);
      });
    }

    if (patch.journalEntries) {
      patch.journalEntries.forEach(entry => {
        newState = newState.withJournalEntry(entry);
      });
    }

    if (patch.diagnostics) {
      newState = newState.withDiagnostics(patch.diagnostics);
    }

    if (patch.valid !== undefined) {
      newState = new ResolutionState({ ...newState, valid: patch.valid });
    }

    return newState;
  }

  _buildDecision(state) {
    const items = state.items || [];
    const adjustments = state.adjustments || [];
    const pricing = state.resolved?.pricing || {};
    const tax = state.resolved?.tax || {};
    const shipping = state.resolved?.shipping || {};

    let subtotal;
    if (pricing.subtotal instanceof Money) {
      subtotal = pricing.subtotal;
    } else {
      const itemSubtotal = items.reduce((sum, item) => {
        const sub = item.subtotal;
        return sum + (sub ? sub.amount : 0);
      }, 0);
      subtotal = new Money(itemSubtotal, 'ZAR', 2);
    }

    let taxAmount;
    if (tax.amount instanceof Money) {
      taxAmount = tax.amount;
    } else {
      const taxRate = tax.rate || 0.15;
      const taxValue = subtotal.amount * taxRate;
      taxAmount = new Money(Math.round(taxValue), 'ZAR', 2);
    }

    let shippingAmount;
    if (shipping.amount instanceof Money) {
      shippingAmount = shipping.amount;
    } else {
      shippingAmount = new Money(0, 'ZAR', 2);
    }

    const total = subtotal.add(taxAmount).add(shippingAmount);

    const journal = state.journal;
    const appliedRules = journal.getApplied().map(e => ({
      ruleId: e.ruleId,
      reason: e.reason,
      confidence: e.confidence
    }));

    return new CommercialDecision({
      items: items,
      adjustments: adjustments,
      totals: {
        subtotal,
        tax: taxAmount,
        shipping: shippingAmount,
        total
      },
      journal: journal,
      diagnostics: state.diagnostics,
      valid: state.valid,
      metadata: {
        appliedRules,
        timestamp: new Date().toISOString()
      }
    });
  }

  _error(code, message) {
    const diagnostics = new Diagnostics().addError(code, message);
    return new CommercialDecision({
      items: [],
      adjustments: [],
      totals: { subtotal: new Money(0), tax: new Money(0), shipping: new Money(0), total: new Money(0) },
      journal: null,
      diagnostics,
      valid: false,
      metadata: { error: { code, message } }
    });
  }

  addResolver(resolver) {
    this.resolvers.push(resolver);
    return this;
  }

  addPipelineStep(step) {
    this.pipeline.push(step);
    return this;
  }
}
