<!--终端信息页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_container">
        <span>终端信息</span>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <!--表格-->
      <div class="table-container">
        <el-table
          id= "table"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="list"
          stripe
          highlight-current-row
          border
          :height="tableHeight"
          tooltip-effect="dark">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="mac备注" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="batteryInfo" label="电量" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="lon" label="经度" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="lat" label="纬度" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="version" label="固件版本" align="center"></el-table-column>
        </el-table>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermInfo',
  data() {
    return {
      list: [],
      tableHeight: 'calc(100% - 10px)',
      viewLoading: 'hidden'
    }
  },
  mounted() {
    setInterval(this.getList, 60000)
    this.getList()
  },
  methods: {
    getList() {
      this.viewLoading = 'visible' // 显示加载标志
      this.$axios.get('/macAirDeviceList')
      .then(res => {
        this.list = res.data.data
        for(var i=0;i<this.list.length;i++) {
            this.list[i].lon = parseFloat(this.list[i].lon/100).toFixed(6)
            this.list[i].lat = parseFloat(this.list[i].lat/100).toFixed(6)
            this.list[i].batteryInfo = parseInt(this.list[i].batteryInfo)
        }
        this.viewLoading = 'hidden' // 隐藏加载标志
      })
      .catch(error => {
        console.log(error)
      })
    },
    // 导出为excel
    exportExcel(e) {
      e.currentTarget.blur()
      const th = ['mac备注','mac地址', '监测时间', '电量', '经度', '纬度', '固件版本']
      const filterVal = ['remark', 'macAddress', 'beginTime', 'batteryInfo', 'lon', 'lat', 'version']
      const data = this.list.map(v => filterVal.map(k => v[k]))
      const fileName = '终端信息' + this.$moment().format("YYYY-MM-DD HH:mm:ss")
      const [fileType, sheetName] = ['xlsx', '终端信息']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
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
.filter_container {
  /* margin-top: 10px; */
  font-size: 15px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.el-select {
  padding-right: 15px;
}
.table-container {
  position: relative;
  margin-top: 15px;
  /* height: 460px; */
  height: calc(100% - 40px);
}
.filter_container span {
  font-size: 18px;
  font-weight: bold;
  color:black;
}
#table {
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
