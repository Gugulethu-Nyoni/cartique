export default class Logger {
    constructor(enabled = false) {
        this.enabled = enabled;
    }

    log(...args) {
        if (!this.enabled) return;
        console.log(...args);
    }

    warn(...args) {
        if (!this.enabled) return;
        console.warn(...args);
    }

    error(...args) {
        if (!this.enabled) return;
        console.error(...args);
    }

    trace(...args) {
        if (!this.enabled) return;
        console.trace(...args);
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }
}
