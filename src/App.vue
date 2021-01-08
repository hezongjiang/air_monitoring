<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>     <!--路由容器，可嵌套，这里显示的是App.vue下的路由容器-->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body,html {
	width: 100%;
  height: 100%;
	overflow-y: hidden;
	margin: 0;
	position: absolute;
}
body {
  margin: 0;
  background-color:rgb(245,250,255);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
/* 隐藏百度地图左下角的版权logo和文字*/
.anchorBL {
  display: none;
}
/* 修改分页器的样式 */
.el-pager li,.el-pager li.active,.el-pager li:hover,
.el-pagination .btn-prev,.el-pagination .btn-next,
.el-pagination .btn-prev:disabled,.el-pagination .btn-next:disabled {
  background-color: transparent !important;
}
/*导航栏el-submenu的样式*/
.el-menu--horizontal>.el-submenu .el-submenu__title {
  margin: 0 12px !important;
  padding: 0 15px 0 25px !important;
  height: 50px !important;
  line-height: 50px !important;
  font-size: 15px !important;
  color: rgb(88,88,88) !important;
}
.el-menu--horizontal>.el-submenu:focus .el-submenu__title,
.el-menu--horizontal>.el-submenu:hover .el-submenu__title {
  color: #409EFF !important;
  background-color: rgb(245,250,255) !important;
}
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  color: #409EFF !important;
  background-color: rgb(245,250,255) !important;
}
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title i {
  color: #409EFF !important;
}
</style>
