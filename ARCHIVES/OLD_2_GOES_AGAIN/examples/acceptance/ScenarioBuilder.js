/**
 * ============================================================
 * ScenarioBuilder — Fluent builder for commercial acceptance tests
 * ============================================================
 */

export class ScenarioBuilder {
  constructor() {
    this._name = '';
    this._given = {};
    this._expect = {};
    this._decisions = {};
    this._category = 'uncategorized';
    this._tags = [];
  }

  static named(name) {
    const builder = new ScenarioBuilder();
    builder._name = name;
    return builder;
  }

  category(category) {
    this._category = category;
    return this;
  }

  tags(tags) {
    this._tags = tags;
    return this;
  }

  given(config) {
    this._given = { ...this._given, ...config };
    return this;
  }

  product(product) {
    this._given.product = product;
    return this;
  }

  customer(customer) {
    this._given.customer = customer;
    return this;
  }

  quantity(qty) {
    this._given.quantity = qty;
    return this;
  }

  variant(weight) {
    this._given.variant = weight;
    return this;
  }

  selections(selections) {
    this._given.selections = selections;
    return this;
  }

  context(context) {
    if (Array.isArray(context)) {
      this._given.contexts = [...(this._given.contexts || []), ...context];
    } else {
      this._given.contexts = [...(this._given.contexts || []), context];
    }
    return this;
  }

  expectPrice(price) {
    this._expect.unitPrice = price;
    return this;
  }

  expectSubtotal(subtotal) {
    this._expect.subtotal = subtotal;
    return this;
  }

  expectTotal(total) {
    this._expect.total = total;
    return this;
  }

  expectRule(rule) {
    if (!this._expect.rules) this._expect.rules = [];
    this._expect.rules.push(rule);
    return this;
  }

  expectRules(rules) {
    this._expect.rules = rules;
    return this;
  }

  expectVariant(variantId) {
    this._expect.variant = variantId;
    return this;
  }

  expectValid(valid) {
    this._expect.valid = valid;
    return this;
  }

  expectError(error) {
    if (!this._expect.errors) this._expect.errors = [];
    this._expect.errors.push(error);
    return this;
  }

  build() {
    if (!this._given.product) throw new Error('ScenarioBuilder: product is required');
    if (!this._given.customer) throw new Error('ScenarioBuilder: customer is required');

    return {
      name: this._name || 'Unnamed Scenario',
      category: this._category,
      tags: this._tags,
      given: this._given,
      expect: this._expect,
      decisions: this._decisions
    };
  }
}
