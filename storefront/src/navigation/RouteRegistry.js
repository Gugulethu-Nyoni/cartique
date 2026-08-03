export default class RouteRegistry {
    constructor(routes = []) {
        this.routes = [...routes];
    }

    register(route) {
        this.routes.push(route);
    }

    resolve(route, context) {
        for (const handler of this.routes) {
            if (handler.match(route)) {
                context.capabilityTrace?.log('ROUTER', `Matched route: ${handler.name}`);
                handler.execute(context, route);
                return handler.name;
            }
        }

        context.capabilityTrace?.log('ROUTER', 'No route matched');
        return null;
    }
}
