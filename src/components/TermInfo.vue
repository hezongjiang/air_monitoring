<!--终端信息页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="container-title">
        <span>终端信息</span>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <div class="container-table">
        <el-table
          id= "table"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="tbList"
          highlight-current-row
          border
          :row-class-name="tableRowClassName"
          :height="tableHeight"
          tooltip-effect="dark">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="mac备注" align="center" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="140"></el-table-column>
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
      tbList: [], // 表格数据
      termStateArr: [], // 终端在线状态
      tableHeight: 'calc(100% - 10px)', // 表格高度
      viewLoading: 'hidden' // 加载标志可见性
    }
  },
  methods: {
    searchSth() {
      let that = this // this拷贝，防止后续因层级关系无法调用this
      this.viewLoading = 'visible' // 显示加载标志
      this.$axios
      .all([this.$axios.get('/macAirDeviceList'), this.$axios.get('/macAirList')]) // 获取所有站点的终端信息
      .then(this.$axios.spread(function(madl, mal) {
        if (madl.data.successful && madl.data.data.length) {
          that.tbList = madl.data.data
          for (let i = 0; i < that.tbList.length; i++) {
            that.tbList[i].lon = (parseFloat(that.tbList[i].lon) / 100).toFixed(6)
            that.tbList[i].lat = (parseFloat(that.tbList[i].lat) / 100).toFixed(6)
            that.tbList[i].batteryInfo = parseInt(that.tbList[i].batteryInfo)
          }
        } else {
          that.tbList = []
        }
        if (mal.data.successful && mal.data.data.length) {
          for (let i = 0; i < mal.data.data.length; i++) { // 站点在线状态
            if (new Date().getTime() - Date.parse(mal.data.data[i].beginTime) > 1800000) {
              that.termStateArr.push(mal.data.data[i].macAddress)
            }
          }
        } else {
          that.termStateArr = []
        }
        that.viewLoading = 'hidden' // 隐藏加载标志
      }))
      .catch(error => {
        console.log(error)
      })
    },
    tableRowClassName({row, rowIndex}) { // 根据实际情况调整表格记录背景颜色
      if (this.termStateArr.includes(row.remark)) {
        return 'warning-row'
      }
      return ''
    },
    // 导出为excel
    exportExcel(e) {
      e.currentTarget.blur()
      const th = ['mac备注', 'mac地址', '监测时间', '电量', '经度', '纬度', '固件版本']
      const filterVal = ['remark', 'macAddress', 'beginTime', 'batteryInfo', 'lon', 'lat', 'version']
      const data = this.tbList.map(v => filterVal.map(k => v[k]))
      const fileName = '终端信息' + this.$moment().format('YYYY-MM-DD HH:mm:ss')
      const [fileType, sheetName] = ['xlsx', '终端信息']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted() {
    this.searchSth()
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
  color: black;
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
