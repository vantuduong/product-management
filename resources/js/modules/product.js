import productAction from "../actions/product";
import Vue from 'vue';

const product = {
    state: {
        products: [],
        isLoadingProduct: false,
        productErrors: {},
        product: {},
        productPagination: {},
    },
    getters: {
        products: (state) => state.products,
        isLoadingProduct: (state) => state.isLoadingProduct,
        productErrors: (state) => state.productErrors,
        product: (state) => state.product,
        productPagination: (state) => state.productPagination,
    },
    mutations: {
        setProducts(state, products) {
            state.products = products;
        },

        setLoading(state, isLoadingProduct) {
            state.isLoadingProduct = isLoadingProduct;
        },

        setProduct(state, product) {
            state.product = product;
        },

        setProductPagination(state, productPagination) {
            state.productPagination = productPagination;
        },
    },
    actions: {
        getProducts({ commit }, params) {
            commit('setLoading', true);

            return productAction.getList(params)
                .then((res) => {
                    commit("setProducts", res.data);
                    commit('setLoading', false);
                    commit('setProductPagination', {
                        pageSize: res.meta.per_page,
                        total: res.meta.total
                    });

                    return res;
                });
        },

        createProduct({ commit }, data) {
            return productAction.create(data).then(res => {
                Vue.$toast.success("Create product successfully", {
                    position: "top-right",
                });

                return res;
            })
        },

        updateProduct({ commit }, {id, data}) {
            return productAction.update(id, data).then(res => {
                Vue.$toast.success("Update product successfully", {
                    position: "top-right",
                });

                return res;
            })
        },

        deleteProduct({ commit }, id) {
            return productAction.delete(id).then(res => {
                Vue.$toast.success("Delete product successfully", {
                    position: "top-right",
                });

                return res;
            })
        },

        getProduct({ commit }, id) {
            return productAction.get(id).then(res => {
                commit("setProduct", res.data);

                return res;
            })
        },

        removeProductImage({ commit }, {id, imageId}) {
            return productAction.removeImage(id, imageId).then(res => {

                return res;
            })
        }
    },
};

export default product;
