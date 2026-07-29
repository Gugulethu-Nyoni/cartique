/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: CommercialDecision
 * Purpose: Immutable output of the commerce resolution engine
 * ============================================================
 */

import { Identifier } from './Identifier.js';
import { Money } from './Money.js';
import { Diagnostics } from './Diagnostics.js';
import { ResolutionJournal } from './ResolutionJournal.js';

export class CommercialDecision {
  constructor(data = {}) {
    this.id = data.id || Identifier.generateEphemeral('decision');
    this.items = Object.freeze(data.items || []);
    this.adjustments = Object.freeze(data.adjustments || []);
    
    // Ensure totals are Money objects
    const subtotal = data.totals?.subtotal instanceof Money 
      ? data.totals.subtotal 
      : Money.fromDecimal(data.totals?.subtotal || 0);
    
    const tax = data.totals?.tax instanceof Money 
      ? data.totals.tax 
      : Money.fromDecimal(data.totals?.tax || 0);
    
    const shipping = data.totals?.shipping instanceof Money 
      ? data.totals.shipping 
      : Money.fromDecimal(data.totals?.shipping || 0);
    
    const total = data.totals?.total instanceof Money 
      ? data.totals.total 
      : Money.fromDecimal(data.totals?.total || 0);

    this.totals = Object.freeze({
      subtotal,
      tax,
      shipping,
      total
    });
    
    this.journal = data.journal instanceof ResolutionJournal ? data.journal : new ResolutionJournal();
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.valid = data.valid !== false;
    this.timestamp = new Date().toISOString();
    Object.freeze(this);
  }

  get total() { return this.totals.total; }
  get subtotal() { return this.totals.subtotal; }
  get taxAmount() { return this.totals.tax; }
  get shippingAmount() { return this.totals.shipping; }
  get isValid() { return this.valid && this.diagnostics.valid; }
  get errors() { return this.diagnostics.errors; }
  get warnings() { return this.diagnostics.warnings; }

  get totalDiscount() {
    const discounts = this.adjustments.filter(a => a.isDiscount());
    if (discounts.length === 0) return Money.zero();
    const total = discounts.reduce((sum, a) => sum.add(a.amount), Money.zero());
    return total.isNegative() ? new Money(-total.amount, total.currency, total.precision) : total;
  }

  get totalSurcharge() {
    const surcharges = this.adjustments.filter(a => a.isSurcharge());
    if (surcharges.length === 0) return Money.zero();
    return surcharges.reduce((sum, a) => sum.add(a.amount), Money.zero());
  }

  getItem(id) {
    return this.items.find(item => item.id === id) || null;
  }

  hasItems() {
    return this.items.length > 0;
  }

  get totalItems() {
    return this.items.reduce((sum, item) => sum + (item.quantity?.value || 1), 0);
  }

  toString() {
    const lines = [];
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('📋 COMMERCIAL DECISION');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push(`ID: ${this.id.value}`);
    lines.push(`Timestamp: ${this.timestamp}`);
    lines.push(`Valid: ${this.valid ? '✅' : '❌'}`);
    lines.push('');
    lines.push(`Items: ${this.items.length} (${this.totalItems} total units)`);
    lines.push(`Adjustments: ${this.adjustments.length}`);
    lines.push('');
    lines.push('💰 TOTALS:');
    lines.push(`  Subtotal:  ${this.subtotal.toFormatted()}`);
    lines.push(`  Tax:       ${this.taxAmount.toFormatted()}`);
    lines.push(`  Shipping:  ${this.shippingAmount.toFormatted()}`);
    lines.push(`  ─────────────────────`);
    lines.push(`  TOTAL:     ${this.total.toFormatted()}`);
    lines.push('');
    if (this.adjustments.length > 0) {
      lines.push('📋 ADJUSTMENTS:');
      this.adjustments.forEach(a => {
        const sign = a.isDiscount() ? '-' : '+';
        lines.push(`  ${sign} ${a.description}: ${a.amount.toFormatted()}`);
      });
      lines.push('');
    }
    lines.push('═══════════════════════════════════════════════════════════════');
    return lines.join('\n');
  }
}
