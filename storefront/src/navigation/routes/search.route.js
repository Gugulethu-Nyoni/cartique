export default {
    name: 'search',

    match(route) {
        return (
            route.params?.has('search') ||
            (
                route.segments &&
                route.segments[0] === 'search' &&
                route.segments.length >= 2
            )
        );
    },

    execute(context, route) {

        const query =
            route.params?.get('search') ||
            route.segments?.[1];

        context.capabilityTrace?.log(
            'SEARCH',
            'Search input received',
            query
        );

        if (!query) {
            return;
        }

        context.search(query);
    }
};