/**
 * ============================================================
 * @semantq/cartique/resolution
 * ============================================================
 *
 * Module: CommerceResolver
 * Purpose: Main resolver entry point
 * ============================================================
 */

import { ResolutionEngine } from './ResolutionEngine.js';
import { SelectionResolver } from './resolvers/SelectionResolver.js';
import { ContextResolver } from './resolvers/ContextResolver.js';
import { PricingResolver } from './resolvers/PricingResolver.js';
import { TaxResolver } from './resolvers/TaxResolver.js';
import { ShippingResolver } from './resolvers/ShippingResolver.js';

export class CommerceResolver {
  constructor(options = {}) {
    console.log('🏗️ CommerceResolver constructor');
    console.log('  Options resolvers:', options.resolvers?.length || 0);
    
    const resolvers = options.resolvers || [
      new SelectionResolver(),
      new ContextResolver(),
      new PricingResolver(),
      new TaxResolver(),
      new ShippingResolver()
    ];

    console.log('  Final resolvers count:', resolvers.length);
    console.log('  Resolver names:', resolvers.map(r => r.constructor.name).join(', '));

    this.engine = new ResolutionEngine({
      resolvers: resolvers,
      pipeline: options.pipeline
    });
  }

  resolve(input) {
    console.log('🔍 CommerceResolver.resolve() called');
    return this.engine.resolve(input);
  }

  use(plugin) {
    if (plugin.resolvers) {
      plugin.resolvers.forEach(resolver => this.engine.addResolver(resolver));
    }
    if (plugin.pipeline) {
      plugin.pipeline.forEach(step => this.engine.addPipelineStep(step));
    }
    return this;
  }
}
