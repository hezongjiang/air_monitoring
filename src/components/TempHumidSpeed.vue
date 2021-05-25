<!--气温/湿度/风速小时报表页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>气温/湿度/风速小时报表</span>
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
        <span>温度/湿度/风速</span>
        <el-select size="mini" v-model="chartSign" placeholder="请选择参数">
          <el-option v-for="item in paraOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
      </div>
      <div class="container-chart">
        <div id="TempHour" :style="{ visibility:(chartSign===1?'visible':'hidden'), height:chartHeight }"></div>
        <div id="HumidityHour" :style="{ visibility:(chartSign===2?'visible':'hidden'), height:chartHeight }"></div>
        <div id="SpeedHour" :style="{ visibility:(chartSign===3?'visible':'hidden'), height:chartHeight }"></div>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TempHumidSpeed',
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tempChart: '', // 温度图表
      humidityChart: '', // 湿度图表
      speedChart: '', // 风速图表
      addrOptions: [], // 站点选项
      addrChoose: '', // 站点选择
      beginEndT: '', // 开始结束日期
      N: 1, // 默认显示N天前至当天的信息
      chartSign: 1, // 图表标志
      chartHeight: 'calc(100% - 10px)', // 图表高度
      viewLoading: 'hidden', // 加载标志可见性
      paraOptions: [ // 参数选项
        {
          value: 1,
          label: '温度'
        },
        {
          value: 2,
          label: '湿度'
        },
        {
          value: 3,
          label: '风速'
        }
      ],
      optionTemp: { // 温度图表配置
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
          data: ['环境温度小时走势', '气腔温度小时走势', '原始温度小时走势']
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
          name: '温度（℃）',
          nameTextStyle: { padding: [0, 0, 0, 20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          name: '环境温度小时走势',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '气腔温度小时走势',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '原始温度小时走势',
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionHumidity: { // 湿度图表配置
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
          data: ['环境湿度小时走势', '气腔湿度小时走势', '原始湿度小时走势']
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
          name: '湿度（%R.H.）',
          nameTextStyle: { padding: [0, 0, 0, 20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          name: '环境湿度小时走势',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '气腔湿度小时走势',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '原始湿度小时走势',
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionSpeed: { // 风速图表配置
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
          data: ['风速小时走势']
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
          name: '风速（m/s）',
          nameTextStyle: { padding: [0, 0, 0, 20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          name: '风速小时走势',
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  methods: {
    searchSth() { // 查询数据
      this.viewLoading = 'visible' // 显示加载标志
      this.$axios
      .get('/macOldFourAir', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          macAddress: this.addrChoose
        }
      })
      .then(mofa => {
        if (mofa.data.successful) {
          this.optionTemp.xAxis.data = mofa.data.data.time
          this.optionTemp.series[0].data = mofa.data.data.temp
          this.optionTemp.series[1].data = mofa.data.data.newTemps
          this.optionTemp.series[2].data = mofa.data.data.OldTemp
          this.optionHumidity.xAxis.data = mofa.data.data.time
          this.optionHumidity.series[0].data = mofa.data.data.humidity
          this.optionHumidity.series[1].data = mofa.data.data.newHumiditys
          this.optionHumidity.series[2].data = mofa.data.data.OldHumidity
          this.optionSpeed.xAxis.data = mofa.data.data.time
          this.optionSpeed.series[0].data = mofa.data.data.speed
        } else {
          this.optionTemp.xAxis.data = []
          this.optionTemp.series[0].data = []
          this.optionTemp.series[1].data = []
          this.optionTemp.series[2].data = []
          this.optionHumidity.xAxis.data = []
          this.optionHumidity.series[0].data = []
          this.optionHumidity.series[1].data = []
          this.optionHumidity.series[2].data = []
          this.optionSpeed.xAxis.data = []
          this.optionSpeed.series[0].data = []
        }
        // 作图
        this.tempChart.setOption(this.optionTemp)
        this.humidityChart.setOption(this.optionHumidity)
        this.speedChart.setOption(this.optionSpeed)
        this.viewLoading = 'hidden' // 显示加载标志
      }).catch(error => {
        console.log(error)
      })
    }
  },
  mounted() {
    // 创建charts实例
    this.tempChart = this.$echarts.init(document.getElementById('TempHour'))
    this.humidityChart = this.$echarts.init(document.getElementById('HumidityHour'))
    this.speedChart = this.$echarts.init(document.getElementById('SpeedHour'))
    this.viewLoading = 'visible' // 因为初次自动查询在axios回调里有等待时间，所以这里先手动显示加载标志
    // 开始日期和结束日期初始化
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
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
.container-chart {
  position: relative;
  margin-top: 10px;
  /* height: 460px; */
  height: calc(100% - 70px);
}
#TempHour, #HumidityHour, #SpeedHour {
  width: 100%;
  /* height: 468px; */
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
