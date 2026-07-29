/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: CapabilityRegistry
 * Purpose: Registry of all commerce capabilities
 * ============================================================
 */

export class CapabilityRegistry {
  constructor() {
    this._capabilities = new Map();
    this._initialized = false;
  }

  register(capability) {
    if (!capability.id) throw new Error('Capability must have an id');
    if (!capability.name) throw new Error('Capability must have a name');
    
    this._capabilities.set(capability.id, {
      id: capability.id,
      name: capability.name,
      description: capability.description || '',
      priority: capability.priority || 0,
      enabled: capability.enabled !== false,
      metadata: capability.metadata || {}
    });
    return this;
  }

  registerAll(capabilities) {
    capabilities.forEach(c => this.register(c));
    return this;
  }

  get(id) {
    return this._capabilities.get(id) || null;
  }

  has(id) {
    return this._capabilities.has(id);
  }

  getAll() {
    return Array.from(this._capabilities.values());
  }

  getEnabled() {
    return Array.from(this._capabilities.values()).filter(c => c.enabled);
  }

  getByPriority() {
    return Array.from(this._capabilities.values())
      .filter(c => c.enabled)
      .sort((a, b) => b.priority - a.priority);
  }

  enable(id) {
    const cap = this._capabilities.get(id);
    if (cap) {
      this._capabilities.set(id, { ...cap, enabled: true });
    }
    return this;
  }

  disable(id) {
    const cap = this._capabilities.get(id);
    if (cap) {
      this._capabilities.set(id, { ...cap, enabled: false });
    }
    return this;
  }

  static default() {
    const registry = new CapabilityRegistry();
    registry.registerAll([
      { id: 'variant-selection', name: 'Variant Selection', priority: 10 },
      { id: 'composition-resolution', name: 'Composition Resolution', priority: 20 },
      { id: 'customer-resolution', name: 'Customer Resolution', priority: 30 },
      { id: 'context-resolution', name: 'Context Resolution', priority: 40 },
      { id: 'eligibility-resolution', name: 'Eligibility Resolution', priority: 50 },
      { id: 'pricing-resolution', name: 'Pricing Resolution', priority: 60 },
      { id: 'promotion-resolution', name: 'Promotion Resolution', priority: 70 },
      { id: 'inventory-resolution', name: 'Inventory Resolution', priority: 80 },
      { id: 'shipping-resolution', name: 'Shipping Resolution', priority: 90 },
      { id: 'tax-resolution', name: 'Tax Resolution', priority: 100 },
      { id: 'payment-options-resolution', name: 'Payment Options Resolution', priority: 110 },
      { id: 'fulfillment-resolution', name: 'Fulfillment Resolution', priority: 120 }
    ]);
    return registry;
  }
}
