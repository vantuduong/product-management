export const API = {
    products: {
        index: '/products',
        create: '/products',
        get: productId => `/products/${productId}`,
        update: productId => `/products/${productId}`,
        delete: productId => `/products/${productId}`,
        removeImage: (productId, imageId) => `/products/${productId}/remove-image/${imageId}`,
    },
};
