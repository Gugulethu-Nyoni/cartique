/**
 * ============================================================
 * @semantq/cartique/compiler
 * ============================================================
 *
 * Module: Compiler
 * Purpose: Main compiler class
 * ============================================================
 */

import { Normalize } from './pipeline/Normalize.js';
import { Validate } from './pipeline/Validate.js';
import { Resolve } from './pipeline/Resolve.js';
import { Finalize } from './pipeline/Finalize.js';

export class Compiler {
  constructor(options = {}) {
    this.resolvers = options.resolvers || [];
    this.pipeline = options.pipeline || [
      new Normalize(),
      new Validate(),
      new Resolve(this.resolvers),
      new Finalize()
    ];
  }

  /**
   * Compile commerce input into resolved state
   *
   * @param {Object} input - Commerce input
   * @param {Object} input.product - Product entity
   * @param {Object} input.customer - Customer entity
   * @param {Object} input.place - Place entity
   * @param {Object} input.configuration - Configuration
   * @param {Array} input.contexts - Active contexts
   * @param {Object} input.metadata - Additional metadata
   * @returns {Object} Immutable resolved commerce state
   */
  compile(input) {
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
      valid: true
    };

    for (const step of this.pipeline) {
      state = step.process(state);
      if (!state.valid && step.haltOnError !== false) {
        break;
      }
    }

    return Object.freeze(state);
  }

  /**
   * Add a resolver to the compiler
   */
  addResolver(resolver) {
    this.resolvers.push(resolver);
    return this;
  }

  /**
   * Add a pipeline step
   */
  addPipelineStep(step) {
    this.pipeline.push(step);
    return this;
  }
}
