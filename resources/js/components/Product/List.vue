<template>
    <a-card :bordered="false">
        <a-row class="mb-3">
            <a-col span="12">
                <a-input-search  placeholder="Search Product Name" enter-button @search="onSearch" />
            </a-col>
            <a-col span="12" style="text-align: right">
                <a-button icon="plus" @click="$router.push(`/products/create`)" type="primary">New</a-button>
            </a-col>
        </a-row>

        <a-row>
            <a-col span="24">
                <a-table
                    :loading="isLoadingProduct"
                    :columns="columns"
                    :data-source="products"
                    :pagination="productPagination"
                    rowKey="id"
                    @change="handleTableChange"
                    :bordered="true">
                    <template slot="image" slot-scope="text, record, index">
                        <img :src="record.images[0].full_url" alt="" width="100" v-if="record.images.length">
                        <img src="/images/default.png" alt="" width="100" v-else>
                    </template>

                    <template slot="action" slot-scope="text, record, index">
                        <a-button type="primary" @click="$router.push(`/products/${record.id}`)" icon="edit"></a-button>
                        <a-button type="danger" icon="delete" @click="deleteProduct(record.id)"></a-button>
                    </template>
                </a-table>
            </a-col>
        </a-row>
    </a-card>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        created() {
            this.$store.dispatch('getProducts');
        },
        computed: {
            ...mapGetters([
                'products',
                'isLoadingProduct',
                'productPagination'
            ])
        },
        data() {
            return {
                columns: [
                    {
                        title: "Product Name",
                        dataIndex: "name",
                    },
                    {
                        title: "Image",
                        dataIndex: "image",
                        scopedSlots: { customRender: 'image' },
                    },
                    {
                        title: "Product Description",
                        dataIndex: "description",
                    },
                    {
                        title: "Stock quantity",
                        dataIndex: "stock_quantity",
                    },
                    {
                        title: "Price",
                        dataIndex: "price",
                    },
                    {
                        title: "Action",
                        dataIndex: "action",
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                params: {
                    page: 1
                }
            }
        },
        methods: {
            onSearch(value) {
                this.params = {
                    page: 1,
                    name: value
                };
                this.$store.dispatch('getProducts', this.params)
            },
            handleTableChange(pagination, filters, sorter) {
                this.params.page = pagination.current;
                this.$store.dispatch('getProducts', this.params);
            },

            deleteProduct(id) {
                if (!confirm('Are you sure?')) {
                    return;
                }
                this.$store.dispatch('deleteProduct', id).then(res => {
                    this.$store.dispatch('getProducts', this.params)
                });
            }
        }
    };
</script>

<style scoped>
    #filter-option {
        margin-bottom: 20px;
    }
</style>
