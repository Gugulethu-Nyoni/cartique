export default {
    name: 'search',

    match(route) {
        return route.params.has('search');
    },

    execute(context, route) {
        const query = route.params.get('search');

        context.capabilityTrace?.log('SEARCH', 'URL search extracted', query);

        if (!query) {
            return;
        }

        context.search(query);
    }
};
