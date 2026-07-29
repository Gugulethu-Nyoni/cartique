/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: ResolutionJournal
 * Purpose: Immutable audit trail for every resolution decision
 * ============================================================
 */

import { Identifier } from './Identifier.js';

export class ResolutionJournal {
  constructor(entries = []) {
    this.id = Identifier.generate('journal');
    this.timestamp = new Date().toISOString();
    this.entries = Object.freeze(entries.map(e => Object.freeze({
      resolver: e.resolver || '',
      capability: e.capability || '',
      ruleId: e.ruleId || null,
      decision: e.decision || 'applied',
      reason: e.reason || '',
      before: e.before !== undefined ? e.before : null,
      after: e.after !== undefined ? e.after : null,
      confidence: e.confidence || 100,
      duration: e.duration || null,
      correlationId: e.correlationId || null,
      timestamp: e.timestamp || new Date().toISOString()
    })));
    Object.freeze(this);
  }

  addEntry(data) {
    const entry = {
      resolver: data.resolver || '',
      capability: data.capability || '',
      ruleId: data.ruleId || null,
      decision: data.decision || 'applied',
      reason: data.reason || '',
      before: data.before !== undefined ? data.before : null,
      after: data.after !== undefined ? data.after : null,
      confidence: data.confidence || 100,
      duration: data.duration || null,
      correlationId: data.correlationId || null,
      timestamp: new Date().toISOString()
    };
    return new ResolutionJournal([...this.entries, entry]);
  }

  getApplied() {
    return this.entries.filter(e => e.decision === 'applied');
  }

  getRejected() {
    return this.entries.filter(e => e.decision === 'rejected');
  }

  getByResolver(resolverName) {
    return this.entries.filter(e => e.resolver === resolverName);
  }

  getByCapability(capability) {
    return this.entries.filter(e => e.capability === capability);
  }

  getByRuleId(ruleId) {
    return this.entries.filter(e => e.ruleId === ruleId);
  }

  getByCorrelationId(correlationId) {
    return this.entries.filter(e => e.correlationId === correlationId);
  }

  getPricingTrace() {
    return this.entries
      .filter(e => e.capability === 'pricing' || e.resolver === 'PricingResolver')
      .map(e => ({
        step: e.ruleId || e.resolver,
        value: e.after,
        description: e.reason,
        confidence: e.confidence,
        duration: e.duration
      }));
  }

  getTotalDuration() {
    return this.entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  }

  getOutcomeCounts() {
    const counts = { applied: 0, rejected: 0, 'no-change': 0 };
    this.entries.forEach(e => {
      if (counts[e.decision] !== undefined) counts[e.decision]++;
    });
    return counts;
  }

  isEmpty() {
    return this.entries.length === 0;
  }

  format() {
    const lines = [];
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('📋 RESOLUTION JOURNAL');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push(`ID: ${this.id.value}`);
    lines.push(`Timestamp: ${this.timestamp}`);
    lines.push('');

    const applied = this.getApplied();
    const rejected = this.getRejected();

    if (applied.length > 0) {
      lines.push('✅ APPLIED DECISIONS');
      lines.push('───────────────────────────────────────────────────────────────');
      applied.forEach(e => {
        const label = e.ruleId || e.capability || e.resolver;
        lines.push(`  ✓ ${label.padEnd(30)} ${e.reason} (${e.confidence}%)`);
      });
      lines.push('');
    }

    if (rejected.length > 0) {
      lines.push('❌ REJECTED DECISIONS');
      lines.push('───────────────────────────────────────────────────────────────');
      rejected.forEach(e => {
        const label = e.ruleId || e.capability || e.resolver;
        lines.push(`  ✗ ${label.padEnd(30)} ${e.reason}`);
      });
      lines.push('');
    }

    lines.push(`📊 Total: ${this.entries.length} entries, ${this.getTotalDuration().toFixed(2)}ms`);
    lines.push('═══════════════════════════════════════════════════════════════');
    return lines.join('\n');
  }
}
