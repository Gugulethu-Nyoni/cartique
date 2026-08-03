export default {
    name: 'product',

    match(route) {
        return route.params.has('product');
    },

    execute(context, route) {
        const slug = route.params.get('product');

        context.capabilityTrace?.log(
            'PRODUCT',
            'URL product extracted',
            slug
        );

        if (!slug) {
            return;
        }

        context.product(slug);
    }
};
