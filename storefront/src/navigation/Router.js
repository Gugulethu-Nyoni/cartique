export default class Router {

    constructor({ storefront }) {
        this.storefront = storefront;
    }


    getCurrentRoute() {

        if (typeof window === 'undefined') {
            return {
                pathname: '',
                hash: '',
                params: new URLSearchParams(),
                segments: []
            };
        }


        const pathname = window.location.pathname;

        const segments = pathname
            .replace(/^\/+|\/+$/g, '')
            .split('/')
            .filter(Boolean);


        return {
            pathname,
            hash: window.location.hash.toLowerCase(),
            params: new URLSearchParams(window.location.search),
            segments
        };
    }


    handle() {

        const route = this.getCurrentRoute();


        this.storefront.capabilityTrace?.log(
            'ROUTER',
            'Route resolved',
            {
                pathname: route.pathname,
                segments: route.segments,
                search: route.params.toString()
            }
        );


        return this.storefront.routeRegistry.resolve(
            route,
            this.storefront
        );
    }
}
