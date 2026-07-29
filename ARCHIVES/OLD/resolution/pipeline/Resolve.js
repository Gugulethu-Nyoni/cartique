/**
 * ============================================================
 * @semantq/cartique/resolution/pipeline
 * ============================================================
 *
 * Step: Resolve
 * Purpose: Run all resolvers on the state
 * ============================================================
 */

export class Resolve {
  constructor(resolvers = []) {
    this.resolvers = resolvers;
  }

  haltOnError = false;

  process(state) {
    console.log('⚡ Resolve pipeline step:');
    console.log('  Total resolvers:', this.resolvers.length);
    
    for (const resolver of this.resolvers) {
      console.log(`  Running: ${resolver.constructor.name}`);
      try {
        state = resolver.resolve(state);
      } catch (error) {
        console.error(`  ❌ Error in ${resolver.constructor.name}:`, error.message);
        state.errors.push({
          code: 'RESOLVER_ERROR',
          message: error.message,
          resolver: resolver.constructor.name
        });
        state.valid = false;
      }
    }

    return state;
  }
}
