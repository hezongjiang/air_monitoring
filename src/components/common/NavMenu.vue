<template>
    <el-menu
      :default-active="this.$route.path"
      router
      active-text-color="rgb(44,148,255)"
      mode="horizontal"
      style="min-width:1360px;height:50px">
      <img src="@/assets/logo.png" alt="logo">
      <span class="title">大气质量智能监控平台</span>
      <!-- <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item> -->
      <el-menu-item index="/index">首页</el-menu-item>
      <el-menu-item index="/quality">空气质量管理</el-menu-item>
      <el-submenu index="1">
        <template slot="title">历史数据</template>
        <el-menu-item index="/historydata">历史数据详情</el-menu-item>
        <el-menu-item index="/terminfo">终端信息</el-menu-item>
        <el-menu-item index="/hourair">小时空气</el-menu-item>
        <el-menu-item index="/hourairall">All站点小时空气</el-menu-item>
        <el-menu-item index="/dayair">每日空气</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">原始数据</template>
        <el-menu-item index="/originaldata">原始数据下载</el-menu-item>
        <el-menu-item index="/originalcurve">原始数据曲线</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">小时报表</template>
        <el-menu-item index="/sitecontrast">站点曲线对比</el-menu-item>
        <el-menu-item index="/temphumidspeed">气温/湿度/风速小时报表</el-menu-item>
        <el-menu-item index="/aircontrast">气体数据小时报表</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">站点监测</template>
        <el-menu-item index="/alarm">异常告警</el-menu-item>
        <el-menu-item index="/battery">终端电量曲线图</el-menu-item>
        <el-menu-item index="/aqi">AQI气体曲线图</el-menu-item>
        <el-menu-item index="/log">Web更新日志</el-menu-item>
        <el-menu-item index="/defend">站点维护记录</el-menu-item>
        <el-menu-item index="/iaqi">站点日均IAQI统计</el-menu-item>
        <el-menu-item index="/rose">风速风向玫瑰图</el-menu-item>
      </el-submenu>
      <!-- <el-menu-item index="/analyse">数据分析</el-menu-item> -->
      <a href="javascript:void(0)" @click="logout">退出登录</a>
      <i class="fa fa-sign-out" aria-hidden="true"></i>
      <a>{{username}}</a>
      <i class="fa fa-user-o" aria-hidden="true"></i>
    </el-menu>
</template>

<script>
  export default {
    name: 'NavMenu',
    data () {
      return {
        navList: [
          {name: '/index', navItem: '首页'},
          {name: '/quality', navItem: '空气质量管理'},
          {name: '/history', navItem: '历史数据'},
          {name: '/original', navItem: '原始数据'},
          {name: '/alarm', navItem: '小时报表'},
          {name: '/analyse', navItem: '站点监测'}
        ],
        username: window.sessionStorage.getItem('username')
      }
    },
    methods: {
      logout () {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
    font-size: 12px;
    color:rgb(88,88,88);
    float: right;
    padding: 0px 6px;
    line-height: 50px;
    margin-right: 12px
  }
  .title {
    pointer-events: none;
    line-height: 50px;
    margin-right: 50px;
    float: left;
    color:rgb(40,40,40);
    font-size: 17px;
    font-weight: bold;
  }
  i {
    float: right;
    font-size: 14px;
    color:rgb(88,88,88);
    line-height: 50px;
  }
  img {
    float: left;
    width: 50px;
    padding:0 12px
  }
  .el-menu-item {
    margin: 0 15px;
    padding: 0px 25px;
    line-height: 50px;
    font-size:15px;
    height:50px;
    color: rgba(88,88,88,0.6);
  }
  .el-menu-item:hover {
    background-color: inherit !important;
    color: rgba(88,88,88,0.8) !important;
  }
</style>
