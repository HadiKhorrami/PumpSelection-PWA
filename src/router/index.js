import Vue from 'vue'
import VueRouter from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import PumpDetail from '../views/PumpDetail.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

export const Routes = [
    {
        path: "/",
        name: "",
    },
    {
        path: '/PumpDetail',
        name: 'PumpDetail',
        component: PumpDetail
    },
    {
        path: '/App',
        name: 'App',
        component: App
    },{
        path: '/Login',
        name: 'Login',
        component: Login
    },
]

const router = new VueRouter({
    mode: 'history',
    template: '<router-view/>',
    base: process.env.BASE_URL,
    Routes
})


