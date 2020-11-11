import Vue from 'vue'
import Router from 'vue-router'
import Me from '../pages/Me'
import Details from '../pages/Details'
import MyHomeWork from '../pages/MyHomeWork'
import MyHomeWorkCreate from '../pages/MyHomeWorkCreate'
import New from '../pages/New'
import Submit from '../pages/Submit'
import NewGroup from '../pages/NewGroup'
import GroupDetials from '../pages/GroupDetails'
import GroupCreate from '../pages/GroupCreate'
import GroupJoin from '../pages/GroupJoin'
import GroupMembers from '../pages/GroupMembers'
import MyHomeWorkNotDone from '../pages/MyHomeWorkNotDone'
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
    {
      path: '/newgroup',
      name: 'NewGroup',
      component:NewGroup,
      meta:{ title:"创建小组"}
    },
    {
      path: '/groupdetails/:id',
      name: 'GroupDetails',
      component:GroupDetials,
      meta:{ title:"组织信息"} 
    },
    {
      path: '/groupcreate/:page',
      name: 'GroupCreate',
      component:GroupCreate,
      meta:{ title:"我创建的组织"}
    },
    {
      path: '/groupjoin/:page',
      name: 'GroupJoin',
      component:GroupJoin,
      meta:{ title:"我加入的组织"}
    },
    {
      path: '/groupmembers/:id',
      name: 'GroupMembers',
      component:GroupMembers,
      meta:{ title:"成员管理"} 
    },
    {
      path: '/myhomeworknotdone/:page',
      name: 'MyHomeWorkNotDone',
      component: MyHomeWorkNotDone,
      meta:{title:"未完成的作业"}
    },
  ]
})
