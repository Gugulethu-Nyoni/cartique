export default class FetchTransport {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || '/api';
        this.endpoint = config.endpoint || '/storefront/events';
        this.debug = config.debug || false;
    }

    get url() {
        return `${this.baseUrl}${this.endpoint}`;
    }

    async send(events) {
        if (this.debug) {
            console.log('[FetchTransport] Sending', events.length, 'events to', this.url);
        }

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events }),
                keepalive: true
            });

            if (!response.ok) {
                throw new Error(`Behavior API returned ${response.status}`);
            }

            if (this.debug) {
                console.log('[FetchTransport] Response status:', response.status);
            }

            return response;
        } catch (error) {
            console.error('[FetchTransport] Send failed:', error);
            throw error;
        }
    }
}
