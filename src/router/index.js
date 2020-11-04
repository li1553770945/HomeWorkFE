import Vue from 'vue'
import Router from 'vue-router'
import Me from '../pages/Me'
import Details from '../pages/Details'
import MyHomeWork from '../pages/MyHomeWork'
import New from '../pages/New'
import Submit from '../pages/Submit'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'/',
      redirect:'myhomework',
    },
    {
      path:'/myhomework',
      redirect:'/myhomework/1',
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
      path: '/myhomework/:page',
      name: 'MyHomeWork',
      component: MyHomeWork
    },
    {
      path: '/submit/:work_id',
      name: 'Submit',
      component: Submit
    },
  ]
})
