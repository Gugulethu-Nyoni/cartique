/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: Diagnostics
 * Purpose: Immutable diagnostic collection
 * ============================================================
 */

export class Diagnostics {
  constructor(data = {}) {
    this.errors = Object.freeze(data.errors || []);
    this.warnings = Object.freeze(data.warnings || []);
    this.notices = Object.freeze(data.notices || []);
    this.infos = Object.freeze(data.infos || []);
    Object.freeze(this);
  }

  get valid() { return this.errors.length === 0; }
  get empty() {
    return this.errors.length === 0 &&
      this.warnings.length === 0 &&
      this.notices.length === 0 &&
      this.infos.length === 0;
  }

  addError(code, message, details = {}) {
    const entry = { code, message, details, timestamp: new Date().toISOString() };
    return new Diagnostics({
      errors: [...this.errors, entry],
      warnings: this.warnings,
      notices: this.notices,
      infos: this.infos
    });
  }

  addWarning(code, message, details = {}) {
    const entry = { code, message, details, timestamp: new Date().toISOString() };
    return new Diagnostics({
      errors: this.errors,
      warnings: [...this.warnings, entry],
      notices: this.notices,
      infos: this.infos
    });
  }

  addNotice(code, message, details = {}) {
    const entry = { code, message, details, timestamp: new Date().toISOString() };
    return new Diagnostics({
      errors: this.errors,
      warnings: this.warnings,
      notices: [...this.notices, entry],
      infos: this.infos
    });
  }

  addInfo(code, message, details = {}) {
    const entry = { code, message, details, timestamp: new Date().toISOString() };
    return new Diagnostics({
      errors: this.errors,
      warnings: this.warnings,
      notices: this.notices,
      infos: [...this.infos, entry]
    });
  }

  static empty() { return new Diagnostics(); }
  static error(code, message, details = {}) {
    return new Diagnostics().addError(code, message, details);
  }
  static warning(code, message, details = {}) {
    return new Diagnostics().addWarning(code, message, details);
  }
  static notice(code, message, details = {}) {
    return new Diagnostics().addNotice(code, message, details);
  }

  static combine(...diagnosticsList) {
    const combined = { errors: [], warnings: [], notices: [], infos: [] };
    diagnosticsList.forEach(d => {
      if (d instanceof Diagnostics) {
        combined.errors.push(...d.errors);
        combined.warnings.push(...d.warnings);
        combined.notices.push(...d.notices);
        combined.infos.push(...d.infos);
      }
    });
    return new Diagnostics(combined);
  }
}
