export default class CapabilityTrace {
    constructor(enabled = false) {
        this.enabled = enabled;
    }

    log(scope, message, data = null) {
        if (!this.enabled) return;

        if (data !== null) {
            console.log(`[CAPABILITY:${scope}] ${message}`, data);
        } else {
            console.log(`[CAPABILITY:${scope}] ${message}`);
        }
    }

    error(scope, message, error) {
        console.error(`[CAPABILITY:${scope}] ${message}`, error);
    }
}
