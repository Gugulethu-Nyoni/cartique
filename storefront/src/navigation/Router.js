export default class Router {
    constructor({ storefront, basePath = '/shop' }) {
        this.storefront = storefront;
        this.basePath = basePath;
    }

    getCurrentRoute() {
        if (typeof window === 'undefined') {
            return { pathname: '', hash: '', params: new URLSearchParams(), segments: [] };
        }

        let pathname = window.location.pathname;

        if (pathname.startsWith(this.basePath)) {
            pathname = pathname.slice(this.basePath.length) || '/';
        }

        const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

        return {
            pathname,
            hash: window.location.hash.toLowerCase(),
            params: new URLSearchParams(window.location.search),
            segments
        };
    }

    handle() {
        const route = this.getCurrentRoute();

        this.storefront.capabilityTrace?.log('ROUTER', 'Route resolved', {
            pathname: route.pathname,
            segments: route.segments,
            search: route.params.toString()
        });

        return this.storefront.routeRegistry.resolve(route, this.storefront);
    }
}
