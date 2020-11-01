import Vue from 'vue'
import Router from 'vue-router'
import Me from '../pages/Me'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/me',
      name: 'Me',
      component: Me
    },
  ]
})
