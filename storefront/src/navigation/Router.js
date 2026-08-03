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

        this.storefront.capabilityTrace?.log('ROUTER', 'Route resolved', {
            pathname: route.pathname,
            search: route.params.toString()
        });

        return this.storefront.routeRegistry.resolve(route, this.storefront);
    }
}
