export default {
    name: 'search',

    match(route) {
        return route.params.has('search');
    },

    execute(context, route) {
        const query = route.params.get('search');

        if (!query) {
            return;
        }

        if (context.features?.debug) {
            console.log(`[SearchRoute] Executing: "${query}"`);
        }

        context.search(query);
    }
};
