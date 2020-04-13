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
body {
  margin: 0;
  background-color:rgb(245,245,255);
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
/* 解决element-ui表格表头和内容对不齐的问题*/
/* .el-table th.gutter{
  display: table-cell!important;
} */
/* 修改分页器的样式 */
.el-pager li,.el-pager li.active,.el-pager li:hover,
.el-pagination .btn-prev,.el-pagination .btn-next,
.el-pagination .btn-prev:disabled,.el-pagination .btn-next:disabled {
  background-color: transparent;
}
</style>
