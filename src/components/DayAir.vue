<!--每日空气页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>每日空气</span>
      </div>
      <div class="container-filter">
        <span>时间</span>
        <el-date-picker
          style="width:250px;margin-right:20px"
          size="mini"
          v-model="beginEndT"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="left"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :clearable="false"
          :editable="false">
        </el-date-picker>
        <span>站点</span>
        <el-select size="mini" v-model="addrChoose" placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
        <el-button-group style="float: right;">
          <el-button size="mini" :type="isChart()" @click="toChart($event)"><i class="fa fa-line-chart"></i>&nbsp;图表</el-button>
          <el-button size="mini" :type="isTable()" @click="toTable($event)"><i class="fa fa-table"></i>&nbsp;表格</el-button>
        </el-button-group>
      </div>
      <div class="container-table">
        <div id="DayAir" :style="{ visibility:(chartSign===1?'visible':'hidden'), height:chartHeight }"></div>
        <el-table
          id="table"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="tbList.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          :style="{ visibility:(chartSign===0?'visible':'hidden')}"
          tooltip-effect="dark">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="130"></el-table-column>
          <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center" width="90"></el-table-column>
          <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center" width="120"></el-table-column>
        </el-table>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
    <el-pagination
      align="center"
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page="currentPage"
      :page-size="pageSize"
      :style="{ visibility:(chartSign===0?'visible':'hidden')}"
      layout="total, sizes, prev, pager, next"
      :total="tbList.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'DayAir',
  data() {
    return {
      pickerOptions: { // 日期快捷选项
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      airChart: '', // 气体数据图表
      addrChoose: '', // 站点选择
      addrChooseState: '', // 站点选择状态，主要用于excel导出，因为这时站点选择器可能人为动过
      addrOptions: [], // 站点选项
      beginEndT: [], // 开始结束日期
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      N: 30, // 默认显示N天前至当天的信息
      tbList: [], // 表格数据
      currentPage: 1, // 当前页
      pageSize: 30, // 单页数
      chartHeight: 'calc(100% - 10px)', // 图表高度
      chartSign: 1, // 图表和表格的标志
      viewLoading: 'hidden', // 加载标志可见性
      tableHeight: 'calc(100% - 10px)', // 表格高度
      optionAir: { // 气体图表配置
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: {
          type: 'inside',
          filterMode: 'none'
        },
        legend: {
          top: 10,
          right: 0,
          data: ['SO2', 'NO2', 'PM10', 'PM2.5', '温度', '湿度']
        },
        grid: {
          left: '40px',
          right: '39px',
          bottom: '40px',
          top: '40px'
        },
        xAxis: {
          name: '时间',
          nameLocation: 'middle',
          nameTextStyle: { padding: [10, 0, 0, 0] },
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          name: '浓度（μg/m³）',
          nameTextStyle: { padding: [0, 0, 0, 20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          name: 'SO2',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: 'NO2',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: 'PM10',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: 'PM2.5',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '温度',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '湿度',
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  methods: {
    // 获取表格数据后并筛选
    searchSth() {
      this.viewLoading = 'visible' // 显示加载标志
      this.currentPage = 1 // 每次查询都回到第一页
      this.addrChooseState = this.addrChoose // 主要用于excel导出，因为这时站点选择器可能人为动过
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.$axios
      .get('/macAirDayHistory', {
        params: {
          macAddress: this.addrChoose,
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1]
        }}
      )
      .then(madh => {
        // 由于后续数据是逐个索引赋值的，所以先清空，提前清空，if后面就无需else
        this.tbList = []
        this.optionAir.xAxis.data = []
        this.optionAir.series[0].data = []
        this.optionAir.series[1].data = []
        this.optionAir.series[2].data = []
        this.optionAir.series[3].data = []
        this.optionAir.series[4].data = []
        this.optionAir.series[5].data = []
        if (madh.data.successful && madh.data.data.length) {
          this.tbList = madh.data.data
          for (let i = 0; i < this.tbList.length; i++) {
            this.optionAir.xAxis.data[i] = madh.data.data[this.tbList.length - 1 - i].beginTime
            this.optionAir.series[0].data[i] = madh.data.data[this.tbList.length - 1 - i].SO2
            this.optionAir.series[1].data[i] = madh.data.data[this.tbList.length - 1 - i].NO2
            this.optionAir.series[2].data[i] = madh.data.data[this.tbList.length - 1 - i].PM10
            this.optionAir.series[3].data[i] = madh.data.data[this.tbList.length - 1 - i].PM25
            this.optionAir.series[4].data[i] = madh.data.data[this.tbList.length - 1 - i].temp
            this.optionAir.series[5].data[i] = madh.data.data[this.tbList.length - 1 - i].humidity
          }
          for (let i = 0; i < this.tbList.length; i++) {
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
        }
        // 作图
        this.airChart.setOption(this.optionAir)
        this.viewLoading = 'hidden'
      }).catch(error => {
        console.log(error)
      })
    },
    isChart() { // 图表切换
      if (this.chartSign === 1) return 'success'
    },
    isTable() { // 表格切换
      if (this.chartSign === 0) return 'success'
    },
    toChart: function (e) { // 图表切换
      e.currentTarget.blur()
      this.chartSign = 1
    },
    toTable: function (e) { // 表格切换
      e.currentTarget.blur()
      this.chartSign = 0
    },
    handleSizeChange(val) { // 分页器
      this.pageSize = val
    },
    handleCurrentChange(val) { // 分页器
      this.currentPage = val
    },
    exportExcel(e) { // 导出为excel
      e.currentTarget.blur()
      const th = ['监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'speed', 'direct']
      const data = this.tbList.map(v => filterVal.map(k => v[k]))
      const fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.addrChooseState + '每日空气'
      const [fileType, sheetName] = ['xlsx', '每日空气']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted() {
    this.viewLoading = 'visible' // 因为初次自动查询在axios回调里有等待时间，所以这里先手动显示加载标志
    // 开始日期和结束日期初始化
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
    // 创建图表实例
    this.airChart = this.$echarts.init(document.getElementById('DayAir'))
    // 其它初始化
    this.$axios
    .get('/macAirDeviceList')
    .then(madl => {
      if (madl.data.successful && madl.data.data.length) {
        this.addrChoose = madl.data.data[0].macAddress // 初始化站点选择
        for (let i = 0; i < madl.data.data.length; i++) { // 初始化站点选项
          this.addrOptions.push({
            value: madl.data.data[i].macAddress,
            label: madl.data.data[i].remark
          })
        }
        this.searchSth() // 查询数据
      }
    })
    .catch(error => {
      console.log(error)
    })
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
  height: calc(100% - 105px);
  box-shadow: 0 0 2px 1px #ddd;
}
.title-filter {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.title-filter i {
  font-size: 25px;
  padding-right: 10px;
}
.title-filter span {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.container-filter {
  margin-top: 10px;
  font-size: 15px;
}
.container-filter span {
  padding-right: 10px;
}
.el-select {
  padding-right: 20px;
  width: 150px;
}
.container-table {
  position: relative;
  margin-top: 10px;
  /* height: 460px; */
  height: calc(100% - 70px);
}
#DayAir {
  width: 100%;
  /* height: 468px; */
  position: absolute;
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
