export default {
    name: 'wishlist',

    match(route) {
        return (
            route.segments &&
            route.segments[0] === 'wishlist'
        );
    },

    execute(context, route) {
        console.log('[TRACE][WISHLIST ROUTE] execute() called');
        console.log('[TRACE][WISHLIST ROUTE] context.wishlistRenderer:', context.wishlistRenderer);

        context.capabilityTrace?.log('WISHLIST', 'Wishlist route matched');

        if (context.wishlistRenderer && typeof context.wishlistRenderer.render === 'function') {
            console.log('[TRACE][WISHLIST ROUTE] Calling wishlistRenderer.render()');

            const result = context.wishlistRenderer.render();

            if (result && typeof result.then === 'function') {
                result
                    .then(() => {
                        console.log('[TRACE][WISHLIST ROUTE] wishlistRenderer.render() completed');
                    })
                    .catch((error) => {
                        console.error('[TRACE][WISHLIST ROUTE] wishlistRenderer.render() failed:', error);
                    });
            }
        } else {
            console.warn('[TRACE][WISHLIST ROUTE] WishlistRenderer not available');
        }
    }
};
