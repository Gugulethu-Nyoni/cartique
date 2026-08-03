export default {
    name: 'product',

    match(route) {
        return (
            route.params?.has('product') ||
            (
                route.segments &&
                route.segments[0] === 'product' &&
                route.segments.length >= 2
            )
        );
    },

    execute(context, route) {
        const slug =
            route.params?.get('product') ||
            route.segments?.[1];

        context.capabilityTrace?.log('PRODUCT', 'Product slug extracted', slug);

        if (!slug) return;

        context.product(slug);
    }
};
