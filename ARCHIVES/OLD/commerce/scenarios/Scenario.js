/**
 * ============================================================
 * @semantq/cartique/commerce/scenarios
 * ============================================================
 */

export function createScenario(config) {
  const scenario = {
    id: config.id,
    name: config.name,
    description: config.description || '',
    given: Object.freeze(config.given || {}),
    when: Object.freeze(config.when || {}),
    expect: Object.freeze(config.expect || {})
  };

  return Object.freeze(scenario);
}
