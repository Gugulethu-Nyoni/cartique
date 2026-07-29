/**
 * ============================================================
 * @semantq/cartique/resolution
 * ============================================================
 *
 * Module: ResolutionEngine
 * Purpose: Orchestrate resolution pipeline
 * ============================================================
 */

import { Resolution } from './Resolution.js';
import { Normalize } from './pipeline/Normalize.js';
import { Validate } from './pipeline/Validate.js';
import { Resolve } from './pipeline/Resolve.js';
import { Finalize } from './pipeline/Finalize.js';

export class ResolutionEngine {
  constructor(options = {}) {
    this.resolvers = options.resolvers || [];
    this.pipeline = options.pipeline || [
      new Normalize(),
      new Validate(),
      new Resolve(this.resolvers),
      new Finalize()
    ];
  }

  resolve(input) {
    let state = {
      input: Object.freeze({ ...input }),
      product: input.product,
      customer: input.customer,
      place: input.place,
      configuration: input.configuration || { quantity: 1 },
      contexts: input.contexts || [],
      metadata: input.metadata || {},
      resolved: {},
      errors: [],
      warnings: [],
      valid: true
    };

    for (const step of this.pipeline) {
      state = step.process(state);
      if (!state.valid && step.haltOnError !== false) {
        break;
      }
    }

    // Extract pricing from resolved state
    const pricing = state.resolved?.pricing || {};
    const tax = state.resolved?.tax || {};
    const shipping = state.resolved?.shipping || {};
    const selections = state.resolved?.selections || {};
    const variant = selections.variant || null;

    console.log('📦 ResolutionEngine finalizing:');
    console.log('  Pricing from state:', JSON.stringify(pricing));

    // Build items array
    const items = [{
      product: state.product,
      variant: variant,
      quantity: state.configuration?.quantity || 1,
      pricing: pricing,
      tax: tax,
      shipping: shipping
    }];

    // Calculate totals
    const subtotal = pricing.subtotal || 0;
    const taxAmount = tax.amount || 0;
    const shippingAmount = shipping.amount || 0;
    const total = subtotal + taxAmount + shippingAmount;

    console.log('  Totals - subtotal:', subtotal, 'tax:', taxAmount, 'shipping:', shippingAmount, 'total:', total);

    const resolution = new Resolution({
      items: items,
      customer: state.customer,
      contexts: state.contexts,
      activeCapabilities: state.resolved?.capabilities || [],
      totals: {
        subtotal: subtotal,
        tax: taxAmount,
        shipping: shippingAmount,
        total: total
      },
      trace: {
        pricing: pricing.trace || [],
        tax: tax.trace || [],
        shipping: shipping.trace || []
      },
      diagnostics: {
        errors: state.errors,
        warnings: state.warnings
      },
      valid: state.valid,
      metadata: state.metadata
    });

    console.log('  Resolution created with total:', resolution.total);
    return resolution;
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
