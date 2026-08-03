export default class Router {
    constructor({ storefront }) {
        this.storefront = storefront;
    }

    getCurrentRoute() {
        if (typeof window === 'undefined') {
            return { pathname: '', hash: '', params: new URLSearchParams() };
        }

        return {
            pathname: window.location.pathname,
            hash: window.location.hash.toLowerCase(),
            params: new URLSearchParams(window.location.search)
        };
    }

    handle() {
        const route = this.getCurrentRoute();

        if (this.storefront.features?.debug) {
            console.log('[Router] Handling route:', {
                pathname: route.pathname,
                hash: route.hash,
                search: route.params.toString()
            });
        }

        return this.storefront.routeRegistry.resolve(route, this.storefront);
    }
}
