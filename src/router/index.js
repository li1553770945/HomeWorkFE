import Vue from 'vue'
import Router from 'vue-router'
import Me from '../pages/Me'
import Details from '../pages/Details'
import MyHomeWork from '../pages/MyHomeWork'
import MyHomeWorkCreate from '../pages/MyHomeWorkCreate'
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
      component: Me,
      meta:{title:"我"}
    },
    {
      path: '/new',
      name: 'New',
      component: New,
      meta:{title:"新建作业"}
    },
    {
      path: '/details/:id',
      name: 'Details',
      component: Details,
      meta:{title:"作业详情"}
    },
    {
      path: '/myhomework/:page',
      name: 'MyHomeWork',
      component: MyHomeWork,
      meta:{title:"我的作业"}
    },
    {
      path: '/myhomeworkcreate/:page',
      name: 'MyHomeWorkCreate',
      component: MyHomeWorkCreate,
      meta:{title:"我发布的作业"}
    },
    {
      path: '/submit/:work_id',
      name: 'Submit',
      component: Submit,
      meta:{ title:"提交作业"}
     
    },
  ]
})
