import Vue from 'vue'
import Router from 'vue-router'
import Me from '../pages/Me'
import Details from '../pages/Details'
import MyHomeWork from '../pages/MyHomeWork'
import New from '../pages/New'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'/',
      redirect:'myhomework',
    },
    {
      path: '/me',
      name: 'Me',
      component: Me
    },
    {
      path: '/new',
      name: 'New',
      component: New
    },
    {
      path: '/details/:id',
      name: 'Details',
      component: Details
    },
    {
      path: '/myhomework',
      name: 'MyHomeWork',
      component: MyHomeWork
    },
  ]
})
