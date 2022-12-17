<template>
    <a-card>
        <a-row>
            <a-form :form="form" @submit="handleSubmit">
                    <a-row type="flex">
                        <a-col :xs="12" class="card-user-info">
                            <a-icon slot="extra" type="user" />
                            <a-form-item
                                label="Product Name"
                                :class="productErrors.name ? 'ant-form-item-with-help' : ''"
                            >
                                <a-input
                                    size="large"
                                    :class="
                                        productErrors.name ? 'has-error' : 'has-success'
                                    "
                                    placeholder="Enter Product Name"
                                    v-decorator="[
                                        'name',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'The Product Name field is required',
                                                },
                                            ],
                                        },
                                    ]"
                                />
                            </a-form-item>
                            <a-form-item label="Images" v-if="productId !== 'create'">
                                <div class="clearfix">
                                    <a-upload
                                        list-type="picture-card"
                                        @preview="handlePreview"
                                        @change="handleChange"
                                        :remove="handleRemove"
                                        :beforeUpload="beforeUpload"
                                        :multiple="true"
                                        v-decorator="[
                                          'images',
                                          {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: normFile,
                                          },
                                        ]"
                                        name="image"
                                    >
                                        <div v-if="fileList.length < 5">
                                            <a-icon type="plus" />
                                            <div class="ant-upload-text">
                                                Upload
                                            </div>
                                        </div>
                                    </a-upload>
                                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreview">
                                        <img alt="example" style="width: 100%" :src="previewImage" />
                                    </a-modal>
                                </div>
                            </a-form-item>
                            <a-form-item label="Stock Quantity">
                                <a-input-number
                                    size="large"
                                    class="w-100"
                                    placeholder="Enter stock quantity"
                                    v-decorator="[
                                        'stock_quantity',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'The Stock Quantity field is required',
                                                }
                                            ]
                                        },
                                    ]"
                                />
                            </a-form-item>
                            <a-form-item label="Price">
                                <a-input-number
                                    size="large"
                                    class="w-100"
                                    :min="1"
                                    placeholder="Enter Price"
                                    v-decorator="[
                                        'price',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'The Price field is required',
                                                },
                                            ]
                                        },
                                    ]"
                                />
                            </a-form-item>
                            <a-form-item label="Description">
                                <a-textarea
                                    placeholder="Description"
                                    v-decorator="['description']"
                                    allow-clear
                                >
                                </a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row justify="center" type="flex">
                        <a-button @click="handleCancel" style="margin-right: 10px" type="danger">
                            Cancel
                        </a-button>
                        <a-button type="primary" html-type="submit">Submit</a-button>
                    </a-row>
                </a-form>

        </a-row>
    </a-card>
</template>

<script>
import { mapGetters } from "vuex";
import {getBase64} from "../../helpers/fileHepler";

export default {
    data() {
        return {
            productId: '',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            uploadList: [],
        }
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: "edit_product" });
    },
    created() {
        this.productId = this.$route.params.id;

        if (this.productId !== 'create') {
            this.$store.dispatch('getProduct', this.productId);
        }
    },
    computed: {
        ...mapGetters([
            "productErrors",
            "product"
        ]),
    },
    watch: {
        product() {
            this.fileList = this.product.images.map(item => {
                return {
                    uid: item.id,
                    name: item.name,
                    status: 'done',
                    url: item.full_url,
                }
            });
            this.form.setFieldsValue({
                name: this.product.name,
                description: this.product.description,
                stock_quantity: this.product.stock_quantity,
                price: this.product.price,
                images: this.fileList
            });
        }
    },
    methods: {
        handleCancel(e) {
            this.$router.push("/products");
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (this.productId === 'create') {
                        this.$store.dispatch('createProduct', values).then((res) => {
                            this.$router.push("/products");
                        });
                    } else {
                        const formData = new FormData();
                        formData.append('_method', 'PUT');

                        Object.keys(values).map(key => {
                            if(key !== 'images') {
                                formData.append(key, values[key]);
                            }
                        });

                        this.uploadList.map(file => {
                            formData.append('images[]', file)
                        });

                        this.$store.dispatch('updateProduct', {id: this.productId, data: formData}).then((res) => {
                            this.uploadList = [];
                            this.$router.push("/products");
                        });
                    }
                }
            });
        },
        normFile(e) {
            return [...this.fileList];
        },
        handleCancelPreview() {
            this.previewVisible = false;
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },
        handleChange({file, fileList}) {
            if (fileList.length > 5) {
                fileList.splice(5 - fileList.length);
            }
            this.fileList = fileList;
        },

        handleRemove(file) {
            if (!isNaN(file.uid)) {
                this.$store.dispatch('removeProductImage', {id: this.productId, imageId: file.uid})
            } else {
                this.uploadList = this.uploadList.filter(uploadFile => uploadFile.uid !== file.uid);
            }
        },

        beforeUpload(file, selectedFile) {
            const totalAdd = 5 - this.fileList.length;
            if (totalAdd) {
                if (selectedFile.length > totalAdd) {
                    selectedFile.splice(totalAdd - selectedFile.length);
                }
                this.uploadList = this.uploadList.concat(selectedFile);
            }

            return false;
        }
    },
};
</script>
<style scoped></style>
