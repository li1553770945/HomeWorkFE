import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import Api from './api/index.js';
import 'view-design/dist/styles/iview.css';
import router from './router'
import VueRouter from 'vue-router';
import VueWechatTitle from'vue-wechat-title';

Vue.use(VueWechatTitle);
Vue.prototype.$api = Api;
Vue.use(ViewUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})