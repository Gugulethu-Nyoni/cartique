import FetchTransport from './transports/FetchTransport.js';
import SemantqTransport from './transports/SemantqTransport.js';
import MockTransport from './transports/MockTransport.js';

export default class BehaviorTracker {
    constructor(config = {}) {
        this.config = config;
        this.enabled = config.enabled !== false;
        this.debug = config.debug || false;

        this.queue = [];
        this.batchSize = config.batchSize || 10;
        this.batchInterval = config.batchInterval || 5000;
        this.timer = null;
        this.isSending = false;

        this.visitorId = this._getOrCreateVisitorId();
        this.sessionId = this._getOrCreateSessionId();
        this.customerId = null;

        this.transport = this._createTransport(config);

        this._startTimer();

        if (typeof window !== 'undefined') {
            this._trackPageView({ landingPage: true });
        }

        if (this.debug) {
            console.log('[BehaviorTracker] Initialized', {
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                enabled: this.enabled,
                transport: config.transport || 'fetch'
            });
        }
    }

    _getOrCreateVisitorId() {
        const key = 'storefront_visitor_id';
        let visitorId = null;
        try {
            if (typeof localStorage !== 'undefined') {
                visitorId = localStorage.getItem(key);
            }
        } catch (_) {}
        if (!visitorId) {
            visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(key, visitorId);
                }
            } catch (_) {}
        }
        return visitorId;
    }

    _getOrCreateSessionId() {
        const key = 'storefront_session_id';
        let sessionId = null;
        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionId = sessionStorage.getItem(key);
            }
        } catch (_) {}
        if (!sessionId) {
            sessionId = 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            try {
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.setItem(key, sessionId);
                }
            } catch (_) {}
        }
        return sessionId;
    }

    _createTransport(config) {
        if (config.transport === 'semantq' && config.apiHandler) {
            return new SemantqTransport({ apiHandler: config.apiHandler, debug: this.debug });
        }
        return new FetchTransport({
            baseUrl: config.baseUrl || '/api',
            endpoint: config.endpoint || '/storefront/events',
            debug: this.debug
        });
    }

    track(eventType, data = {}) {
        if (!this.enabled) return;

        const allowedEvents = [
            'page_view', 'category_view', 'search', 'product_view',
            'add_to_cart', 'wishlist_add'
        ];
        if (!allowedEvents.includes(eventType)) return;

        const event = {
            eventType,
            sessionId: this.sessionId,
            visitorId: this.visitorId,
            customerId: this.customerId,
            pathname: data.pathname || (typeof window !== 'undefined' ? window.location.pathname : null),
            productId: data.productId || null,
            categoryId: data.categoryId || null,
            searchTerm: data.searchTerm || null,
            metadata: data.metadata || {},
            timestamp: new Date().toISOString()
        };

        this.queue.push(event);

        if (this.debug) {
            console.log('[Behavior] Event:', eventType, event);
        }

        if (eventType === 'add_to_cart') {
            this._flush();
        }

        if (this.queue.length >= this.batchSize) {
            this._flush();
        }
    }

    identify(customerId) {
        this.customerId = customerId;
    }

    pageView(data = {}) { this.track('page_view', data); }
    categoryView(categoryId, data = {}) { this.track('category_view', { categoryId, ...data }); }
    search(searchTerm, data = {}) { this.track('search', { searchTerm, ...data }); }
    productView(productId, data = {}) { this.track('product_view', { productId, ...data }); }
    addToCart(productId, data = {}) { this.track('add_to_cart', { productId, ...data }); }
    wishlistAdd(productId, data = {}) { this.track('wishlist_add', { productId, ...data }); }

    _flush() {
        if (this.isSending || this.queue.length === 0) return;

        this.isSending = true;
        const events = [...this.queue];
        this.queue = [];

        this.transport.send(events)
            .then(() => {
                if (this.debug) {
                    console.log('[Behavior] Sent', events.length, 'events');
                }
            })
            .catch((error) => {
                console.error('[Behavior] Failed to send events:', error);
                this.queue = [...events, ...this.queue];
            })
            .finally(() => {
                this.isSending = false;
            });
    }

    _startTimer() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            if (this.queue.length > 0) this._flush();
        }, this.batchInterval);

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => this._flush());
        }
    }

    _stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    _trackPageView(data = {}) {
        this.pageView(data);
    }

    destroy() {
        this._stopTimer();
        this._flush();
    }
}
