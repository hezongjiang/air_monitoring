import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import AppIndex from '@/components/home/AppIndex'
import Home from '@/components/Home'
import Alarm from '@/components/Alarm'
import Analyse from '@/components/Analyse'
import Detail from '@/components/Detail'

Vue.use(Router)

export default new Router({
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
          meta: {
            requireAuth: true // 需要登录才能访问的页面
          }
        },
        {
          path: '/detail',
          name: 'Detail',
          component: Detail,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/alarm',
          name: 'Alarm',
          component: Alarm,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/analyse',
          name: 'Analyse',
          component: Analyse,
          meta: {
            requireAuth: true
          }
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
