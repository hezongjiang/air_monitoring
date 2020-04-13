import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import AppIndex from '@/components/home/AppIndex'
import Home from '@/components/Home'
import Alarm from '@/components/Alarm'
import Analyse from '@/components/Analyse'
import Detail from '@/components/Detail'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      //  home页面并不需要被访问
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex, // 路由定义/index指向AppIndex这个组件
        },
        {
          path: '/detail',
          name: 'Detail',
          component: Detail,
        },
        {
          path: '/alarm',
          name: 'Alarm',
          component: Alarm,
        },
        {
          path: '/analyse',
          name: 'Analyse',
          component: Analyse,
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login // 路由定义/login指向Login这个组件
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('username')
  if(!tokenStr) return next({
    path: 'login',
    query: {redirect: to.fullPath}
  })
  next()
})

export default router