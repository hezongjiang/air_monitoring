<!--空气质量管理页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="container-title">
        <span>实时空气数据<span style = "font-size:12px;font-weight:normal">（每30秒自动刷新）</span></span>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <div class="container-table">
        <el-table
          id= "detailData"
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
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="140"></el-table-column>
          <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center" width="110"></el-table-column>
        </el-table>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AirQuality',
  data() {
    return {
      tbList: [], // 存放数据的表格
      tableHeight: 'calc(100% - 10px)', // 表格高度
      viewLoading: 'hidden', // 加载标志可见性
      timer: null // 定时器
    }
  },
  methods: {
    searchSth() { // 查询表格
      this.viewLoading = 'visible' // 显示加载标志
      this.$axios
      .get('/macAirList') // 查询空气数据并进行格式调整
      .then(mal => {
        if (mal.data.successful && mal.data.data.length) {
          this.tbList = mal.data.data // 所查数据
          for (let i = 0; i < this.tbList.length; i++) { // 对每条记录都要进行格式调整
            // 气体浓度值保留两位小数
            this.tbList[i].SO2 = parseFloat(this.tbList[i].SO2).toFixed(2)
            this.tbList[i].NO2 = parseFloat(this.tbList[i].NO2).toFixed(2)
            this.tbList[i].PM10 = parseFloat(this.tbList[i].PM10).toFixed(2)
            this.tbList[i].PM25 = parseFloat(this.tbList[i].PM25).toFixed(2)
            // 根据风速值选择不同强度的风
            if (this.tbList[i].speed >= 10) {
              this.tbList[i].speed = this.tbList[i].speed + '（强风）'
            } else if (this.tbList[i].speed >= 6) {
              this.tbList[i].speed = this.tbList[i].speed + '（和风）'
            } else if (this.tbList[i].speed > 0) {
              this.tbList[i].speed = this.tbList[i].speed + '（微风）'
            } else {
              this.tbList[i].speed = this.tbList[i].speed + '（无风）'
            }
            // 根据风向值选择不同的风向
            if (this.tbList[i].direct >= 348) {
              this.tbList[i].direct = this.tbList[i].direct + '（北风）'
            } else if (this.tbList[i].direct >= 282) {
              this.tbList[i].direct = this.tbList[i].direct + '（西北风）'
            } else if (this.tbList[i].direct >= 258) {
              this.tbList[i].direct = this.tbList[i].direct + '（西风）'
            } else if (this.tbList[i].direct >= 192) {
              this.tbList[i].direct = this.tbList[i].direct + '（西南风）'
            } else if (this.tbList[i].direct >= 168) {
              this.tbList[i].direct = this.tbList[i].direct + '（南风）'
            } else if (this.tbList[i].direct >= 102) {
              this.tbList[i].direct = this.tbList[i].direct + '（东南风）'
            } else if (this.tbList[i].direct >= 78) {
              this.tbList[i].direct = this.tbList[i].direct + '（东风）'
            } else if (this.tbList[i].direct >= 12) {
              this.tbList[i].direct = this.tbList[i].direct + '（东北风）'
            } else {
              this.tbList[i].direct = this.tbList[i].direct + '（北风）'
            }
          }
        } else {
          this.tbList = []
        }
        this.viewLoading = 'hidden' // 隐藏加载标志
      })
      .catch(error => {
        console.log(error)
      })
    },
    // 根据情况改变表格记录背景颜色
    tableRowClassName({row, rowIndex}) {
      if (new Date().getTime() - Date.parse(row.beginTime) > 1800000) {
        return 'warning-row'
      }
      return ''
    },
    // 导出为excel
    exportExcel(e) {
      e.currentTarget.blur()
      const th = ['mac地址', '监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['macAddress', 'beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'speed', 'direct']
      const data = this.tbList.map(v => filterVal.map(k => v[k]))
      const fileName = '实时空气数据' + this.$moment().format('YYYY-MM-DD HH:mm:ss')
      const [fileType, sheetName] = ['xlsx', '实时空气数据']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted() {
    this.timer = setInterval(this.searchSth, 30000) // 周期查询表格
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
  color: black;
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
