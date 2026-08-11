export default class SemantqTransport {
    constructor(config = {}) {
        this.apiHandler = config.apiHandler;
        this.debug = config.debug || false;
    }

    async send(events) {
        if (!this.apiHandler) {
            console.warn('[SemantqTransport] No API handler provided');
            return Promise.resolve();
        }

        if (this.debug) {
            console.log('[SemantqTransport] Sending', events.length, 'events');
        }

        try {
            return await this.apiHandler({
                path: '/storefront/events',
                method: 'POST',
                body: { events }
            });
        } catch (error) {
            console.error('[SemantqTransport] Send failed:', error);
            throw error;
        }
    }
}
