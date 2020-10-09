<!--空气质量管理页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_container">
        <span>实时空气数据<span style = "font-size:12px;font-weight:normal">（每分钟自动刷新）</span></span>
        <el-button v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <!--表格-->
      <div class="table-container">
        <el-table
          id= "detailData"
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
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="130"></el-table-column>
          <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center" width="90"></el-table-column>
          <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center" width="110"></el-table-column>
        </el-table>
        <div class="loading-background" :style="{visibility: viewLoading}"></div>
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
      list: [],
      tableHeight: '100%',
      viewLoading: 'hidden'
    }
  },
  mounted() {
    setInterval(this.getList, 60000)
    this.getList()
  },
  methods: {
    getList() {
      this.$axios.get('/macAirList')
      .then(res => {
        this.list = res.data.data
        for(var i=0;i<this.list.length;i++) {
          this.list[i].SO2 = parseFloat(this.list[i].SO2).toFixed(2)
          this.list[i].NO2 = parseFloat(this.list[i].NO2).toFixed(2)
          this.list[i].PM10 = parseFloat(this.list[i].PM10).toFixed(2)
          this.list[i].PM25 = parseFloat(this.list[i].PM25).toFixed(2)
          // 根据风速值选择不同强度的风
          if(this.list[i].speed >= 10) { this.list[i].speed = this.list[i].speed + '（强风）' }
          else if(this.list[i].speed >= 6) { this.list[i].speed = this.list[i].speed + '（和风）' }
          else if(this.list[i].speed > 0) { this.list[i].speed = this.list[i].speed + '（微风）' }
          else { this.list[i].speed = this.list[i].speed + '（无风）' }
          // 根据风向值选择不同的风向
          if(this.list[i].direct >= 348) { this.list[i].direct = this.list[i].direct + '（北风）' }
          else if(this.list[i].direct >= 282) { this.list[i].direct = this.list[i].direct + '（西北风）' }
          else if(this.list[i].direct >= 258) { this.list[i].direct = this.list[i].direct + '（西风）' }
          else if(this.list[i].direct >= 192) { this.list[i].direct = this.list[i].direct + '（西南风）' }
          else if(this.list[i].direct >= 168) { this.list[i].direct = this.list[i].direct + '（南风）' }
          else if(this.list[i].direct >= 102) { this.list[i].direct = this.list[i].direct + '（东南风）' }
          else if(this.list[i].direct >= 78) { this.list[i].direct = this.list[i].direct + '（东风）' }
          else if(this.list[i].direct >= 12) { this.list[i].direct = this.list[i].direct + '（东北风）' }
          else { this.list[i].direct = this.list[i].direct + '（北风）' }
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    // 导出为excel
    exportExcel(e) {
      e.currentTarget.blur()
      const th = ['mac地址','监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['macAddress','beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'speed', 'direct']
      const data = this.list.map(v => filterVal.map(k => v[k]))
      const fileName = '实时空气数据' + this.$moment().format("YYYY-MM-DD HH:mm:ss")
      const [fileType, sheetName] = ['xlsx', '实时空气数据']
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
  border-radius: 6px;
  padding: 10px 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  /* min-height: 549px; */
  height: calc(100% - 70px);
}
.filter_container {
  margin-top: 10px;
  font-size: 15px;
}
.el-select {
  padding-right: 15px;
}
.table-container {
  position: relative;
  margin-top: 15px;
  /* height: 460px; */
  height: calc(100% - 50px);
}
.filter_container span {
  font-size: 18px;
  font-weight: bold;
  color:black;
}
#detailData {
  width: 100%;
  /* height: 432px; */
  position: absolute;
}
.loading-background {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 465px;
  border-radius: 6px;
  background-color: rgb(255,255,255,0.5);
  z-index: 1001;
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
  border-radius: 6px;
  background-color: rgb(70,70,70);
  z-index: 1002;
  padding: 20px 0;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 25px;
}
</style>
