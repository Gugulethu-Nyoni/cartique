/**
 * ============================================================
 * Runner — Acceptance test execution engine
 * ============================================================
 */

import { CommerceResolver } from '../../src/resolution/CommerceResolver.js';
import { 
  SelectionResolver,
  ContextResolver,
  PricingResolver,
  TaxResolver,
  ShippingResolver 
} from '../../src/resolution/resolvers/index.js';

import { southAfrica } from './utils/setup.js';
import { runAssertions } from './assertions.js';
import { 
  printScenarioHeader, 
  printResolutionTree, 
  printAssertionResults 
} from './reporter.js';

export function createRunner(options = {}) {
  const verbose = options.verbose !== false;

  const resolver = new CommerceResolver({
    resolvers: [
      new SelectionResolver(),
      new ContextResolver(),
      new PricingResolver(),
      new TaxResolver(),
      new ShippingResolver()
    ]
  });

  const results = [];

  return {
    resolver,

    run(scenario) {
      if (verbose) {
        printScenarioHeader(scenario);
      }

      const input = scenario.given;
      const resolution = resolver.resolve({
        product: input.product,
        customer: input.customer,
        place: southAfrica,
        configuration: {
          quantity: input.quantity || 1,
          selections: input.variant ? { weight: input.variant } : (input.selections || {})
        },
        contexts: input.contexts || [],
        metadata: { now: new Date() }
      });

      if (verbose) {
        printResolutionTree(resolution);
      }

      const assertionResults = runAssertions(resolution, scenario.expect);

      if (verbose) {
        printAssertionResults(assertionResults);
      }

      const scenarioResult = {
        name: scenario.name,
        category: scenario.category || 'uncategorized',
        passed: assertionResults.every(r => r.passed),
        assertions: assertionResults
      };

      results.push(scenarioResult);
      return scenarioResult;
    },

    getResults() {
      return results;
    },

    getSummary() {
      const total = results.length;
      const passed = results.filter(r => r.passed).length;
      const failed = total - passed;

      const categories = {};
      results.forEach(r => {
        const cat = r.category || 'uncategorized';
        if (!categories[cat]) categories[cat] = { name: cat, total: 0, passed: 0, failed: 0 };
        categories[cat].total++;
        if (r.passed) categories[cat].passed++;
        else categories[cat].failed++;
      });

      return {
        total,
        passed,
        failed,
        categories: Object.values(categories)
      };
    }
  };
}
