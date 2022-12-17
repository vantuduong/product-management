import ListProduct from "./components/Product/List";
import ProductForm from "./components/Product/Form";

const routes = [
    { path: "", component: ListProduct, name: "ListProduct" },
    {
        path: "/products",
        component: ListProduct,
        name: "ListProduct",
    },
    {
        path: "/products/:id",
        component: ProductForm,
        name: "ProductForm",
    },
];

export default routes;
