export default {
    name: 'category',

    match(route) {
        return (
            route.params?.has('category') ||
            (
                route.segments &&
                route.segments[0] === 'category' &&
                route.segments.length >= 2
            )
        );
    },

    execute(context, route) {
        const categoryInput =
            route.params?.get('category') ||
            route.segments?.[1];

        context.capabilityTrace?.log('CATEGORY', 'Category input received', categoryInput);

        if (!categoryInput) return;

        context.category(categoryInput);
    }
};
