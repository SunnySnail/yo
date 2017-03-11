import '../sass/base.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

import indexPage from '../pages/indexPage.vue';


Vue.use(VueRouter);

var router = new VueRouter({
    routes: [{
        path: '/index',
        name: 'index',
        component: indexPage
    },
    {
        path: '*',
        name: '*',
        component: indexPage
    }]
})

window.app = new Vue({
    el: '#app',
    store,
    router: router,
    template: '<router-view></router-view>'
});

