export default {
    name: 'wishlist',

    match(route) {
        return (
            route.segments &&
            route.segments[0] === 'wishlist'
        );
    },

    execute(context, route) {
        context.capabilityTrace?.log('WISHLIST', 'Wishlist route matched');

        if (
            context.wishlistRenderer &&
            typeof context.wishlistRenderer.render === 'function'
        ) {
            context.wishlistRenderer.render();
        }
    }
};
