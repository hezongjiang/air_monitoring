// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import echarts from 'echarts'
import moment from 'moment'
import toExcel from '@/excel/json2excel'
import router from './router'

// 前端请求默认发送到这个url
axios.defaults.baseURL = 'http://api.aisensing.cn/device'

// 全局注册后，在其他组件通过this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.prototype.$echarts = echarts

Vue.prototype.$moment = moment
// moment.locale('zh-cn')  中文时间

Vue.prototype.$toExcel = toExcel

Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>' // 实例化一个Vue，将组件App.vue挂载到<div id="app"><div/>下面
})
