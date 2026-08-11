export default class MockTransport {
    constructor(config = {}) {
        this.debug = config.debug || false;
        this.events = [];
        this.shouldFail = false;
    }

    async send(events = []) {
        if (this.shouldFail) {
            throw new Error('Simulated transport failure');
        }

        this.events.push(...events);

        if (this.debug) {
            console.log(`[MockTransport] Received ${events.length} events`);
        }

        return { success: true, count: events.length };
    }

    getEvents() {
        return [...this.events];
    }

    clear() {
        this.events = [];
    }

    fail(enabled = true) {
        this.shouldFail = enabled;
    }
}
