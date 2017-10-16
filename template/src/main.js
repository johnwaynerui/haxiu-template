import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import routes from './routes.js';
import App from './app.vue';
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    hashbang: false,
    routes
});
const app = Vue.extend(App);
new app({
    router
}).$mount('#app');
