/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import Vue from 'vue';
import Antd from 'ant-design-vue';
import Vuex from 'vuex';
import App from './components/App';
import 'ant-design-vue/dist/antd.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueRouter from 'vue-router'
import routes from './routers'
import {product} from './modules'


require('./bootstrap');

window.Vue = require('vue').default;

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('app', require('./components/App.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.use(Antd);
Vue.use(Vuex);
Vue.use(VueToast);
Vue.use(VueRouter);

const store = new Vuex.Store({
    modules: {
        product
    },
    state: {}
});

const router = new VueRouter({
    mode: 'history',
    routes
});

const app = new Vue({
    store,
    router,
    el: '#app',
    components: { App },
    template: '<App/>',
});
