import Vue from 'vue'
import App from './App.vue'
import Login from './views/Login.vue'
import './registerServiceWorker'
import VueRouter from 'vue-router'
import {Routes} from './router/index.js'
import vuetify from './plugins/vuetify'
import './assets/leaflet/leaflet.css';
import vSelect from 'vue-select'
import VueResource from 'vue-resource'
import axios from 'axios';
import VueAxios from 'vue-axios';
import AxiosPlugin from 'vue-axios-cors';
import './bootstrap/css/bootstrap.css';
import VueI18n from 'vue-i18n';
import i18n from './i18n';
import VueGeolocation from 'vue-browser-geolocation';
import VueGeolocationApi from 'vue-geolocation-api'
import ajax from "vuejs-ajax";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueSession from 'vue-session'

Vue.use(VueSession)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(ajax);
Vue.use(VueGeolocationApi/*, { ...options } */)
Vue.use(VueGeolocation);
Vue.use(VueI18n);
Vue.use(AxiosPlugin);
Vue.use(axios);
Vue.use(VueResource);
Vue.component('v-select', vSelect);
Vue.use(VueRouter);
Vue.config.productionTip = false;
window.$ = require('jquery');
window.JQuery = require('jquery');

const router=new VueRouter({
routes:Routes
});

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(Login)
}).$mount('#app')
