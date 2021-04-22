import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import AppIndex from '@/components/home/AppIndex'
import Home from '@/components/Home'
import Analyse from '@/components/Analyse'
import Detail from '@/components/Detail'
import AirQuality from '@/components/AirQuality'
import HistoryData from '@/components/HistoryData'
import TermInfo from '@/components/TermInfo'
import HourAir from '@/components/HourAir'
import HourAirAll from '@/components/HourAirAll'
import DayAir from '@/components/DayAir'
import OriginalData from '@/components/OriginalData'
import OriginalCurve from '@/components/OriginalCurve'
import SiteContrast from '@/components/SiteContrast'
import TempHumidSpeed from '@/components/TempHumidSpeed'
import AirContrast from '@/components/AirContrast'
import Alarm from '@/components/Alarm'
import Battery from '@/components/Battery'
import AQI from '@/components/AQI'
import Log from '@/components/Log'
import Defend from '@/components/Defend'
import IAQI from '@/components/IAQI'
import Rose from '@/components/Rose'

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
          component: AppIndex // 路由定义/index指向AppIndex这个组件
        },
        {
          path: '/detail',
          name: 'Detail',
          component: Detail
        },
        {
          path: '/quality',
          name: 'AirQuality',
          component: AirQuality
        },
        {
          path: '/historydata',
          name: 'HistoryData',
          component: HistoryData
        },
        {
          path: '/terminfo',
          name: 'TermInfo',
          component: TermInfo
        },
        {
          path: '/hourair',
          name: 'HourAir',
          component: HourAir
        },
        {
          path: '/hourairall',
          name: 'HourAirAll',
          component: HourAirAll
        },
        {
          path: '/dayair',
          name: 'DayAir',
          component: DayAir
        },
        {
          path: '/originaldata',
          name: 'OriginalData',
          component: OriginalData
        },
        {
          path: '/originalcurve',
          name: 'OriginalCurve',
          component: OriginalCurve
        },
        {
          path: '/sitecontrast',
          name: 'SiteContrast',
          component: SiteContrast
        },
        {
          path: '/temphumidspeed',
          name: 'TempHumidSpeed',
          component: TempHumidSpeed
        },
        {
          path: '/aircontrast',
          name: 'AirContrast',
          component: AirContrast
        },
        {
          path: '/alarm',
          name: 'Alarm',
          component: Alarm
        },
        {
          path: '/battery',
          name: 'Battery',
          component: Battery
        },
        {
          path: '/aqi',
          name: 'AQI',
          component: AQI
        },
        {
          path: '/log',
          name: 'Log',
          component: Log
        },
        {
          path: '/defend',
          name: 'Defend',
          component: Defend
        },
        {
          path: '/iaqi',
          name: 'IAQI',
          component: IAQI
        },
        {
          path: '/rose',
          name: 'Rose',
          component: Rose
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
