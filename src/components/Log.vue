<!--Web更新日志页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="container-title">
        <span>Web更新日志</span>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <div class="container-table">
        <el-table
          id= "detailData"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="tbList"
          stripe
          highlight-current-row
          border
          :height="tableHeight"
          tooltip-effect="dark">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="更新时间" align="center" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="更新日志" align="center"></el-table-column>
        </el-table>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Log',
  data() {
    return {
      tbList: [], // 表格数据
      tableHeight: 'calc(100% - 10px)', // 表格高度
      viewLoading: 'hidden', // 加载标志可见性
      timer: null // 定时器
    }
  },
  methods: {
    searchSth() { // 查询数据
      this.viewLoading = 'visible' // 显示加载标志
      this.$axios
      .get('/webUpdateList')
      .then(wul => {
        if (wul.data.successful && wul.data.data.length) {
          this.tbList = wul.data.data
        } else {
          this.tbList = []
        }
        this.viewLoading = 'hidden' // 隐藏加载标志
      })
      .catch(error => {
        console.log(error)
      })
    },
    exportExcel(e) { // 导出为excel
      e.currentTarget.blur()
      const th = ['更新时间', '更新日志']
      const filterVal = ['createTime', 'remark']
      const data = this.tbList.map(v => filterVal.map(k => v[k]))
      const fileName = this.$moment().format('YYYY-MM-DD HH-mm-ss') + 'Web更新日志'
      const [fileType, sheetName] = ['xlsx', 'Web更新日志']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted() {
    this.timer = setInterval(this.searchSth, 60000) // 周期查询表格
    this.searchSth() // 首次需要手动查询
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style scoped>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.container-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  position: absolute;
}
.winmain {
  margin: 10px 10px;
  background: white;
  border-radius: 4px;
  padding: 10px 20px;
  /* min-height: 549px; */
  height: calc(100% - 70px);
  box-shadow: 0 0 2px 1px #ddd;
}
.container-title {
  /* margin-top: 10px; */
  font-size: 15px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.el-select {
  padding-right: 15px;
}
.container-table {
  position: relative;
  margin-top: 15px;
  /* height: 460px; */
  height: calc(100% - 40px);
}
.container-title span {
  font-size: 18px;
  font-weight: bold;
  color:black;
}
#detailData {
  width: 100%;
  /* height: 432px; */
  position: absolute;
}
.loading {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 100px;
  width: 100px;
  margin: auto;
  border-radius: 4px;
  background-color: rgb(70,70,70);
  z-index: 1002;
  padding: 20px 0;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 25px;
}
</style>
