import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import AppIndex from '@/components/home/AppIndex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login // 路由定义/login指向Login这个组件
    },
    {
      path: '/index',
      name: 'AppIndex',
      component: AppIndex, // 路由定义/index指向AppIndex这个组件
      meta: {
        requireAuth: true // 需要登录才能访问的页面
      }
   }
  ]
})
