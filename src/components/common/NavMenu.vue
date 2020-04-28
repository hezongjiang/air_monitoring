<template>
    <el-menu
      :default-active="this.$route.path"
      router
      mode="horizontal"
      background-color=rgb(52,58,64)
      active-text-color="white"
      style="min-width:1100px;height:50px">
      <img src="@/assets/logo.png" alt="logo">
      <span>大气质量智能监控平台</span>
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>
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
          {name: '/index', navItem: '站点概览'},
          {name: '/alarm', navItem: '告警功能'},
          {name: '/analyse', navItem: '数据分析'}
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
    color:white;
    float: right;
    padding: 0px 6px;
    line-height: 50px;
    margin-right: 12px
  }
  span {
    pointer-events: none;
    line-height: 50px;
    margin-right: 180px;
    float: left;
    color:white;
    font-size: 17px;
    font-weight: bold;
  }
  i {
    float: right;
    font-size: 14px;
    color:white;
    line-height: 50px;
  }
  img {
    float: left;
    width: 50px;
    padding:0 12px
  }
  .el-menu-item {
    margin: 0 16px;
    padding: 0px 30px;
    line-height: 50px;
    font-size:15px;
    height:50px;
    color: rgba(255,255,255,0.6);
  }
  .el-menu-item:hover {
    background-color: inherit !important;
    color: rgba(255,255,255,0.8) !important;
  }
</style>
