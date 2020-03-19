// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import store from './store'
import echarts from 'echarts'
// 前端请求默认发送到这个url
axios.defaults.baseURL = 'http://api.aisensing.cn'

// 全局注册后，在其他组件通过this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user.username) { // 如果浏览器本地储存里有用户名，那么就可以进入
      next()
    } else { // 如果本地储存里没有，那么重定位到login
      next({
        path: 'login',
        query: {redirect: to.fullPath}
        })
    }
  } else {
    next()
  }
  }

)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>' // 实例化一个Vue，将组件App.vue挂载到<div id="app"><div/>下面
})
