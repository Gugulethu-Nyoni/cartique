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
                if (context.features?.debug) {
                    console.log(`[RouteRegistry] Matched: ${handler.name}`);
                }
                handler.execute(context, route);
                return handler.name;
            }
        }
        return null;
    }
}
