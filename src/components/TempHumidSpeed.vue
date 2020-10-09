<!--气温/湿度/风速小时报表页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_title">
        <span>气温/湿度/风速小时报表</span>
      </div>
      <!--筛选条件-->
      <div class="filter_container">
        <span>时间</span>
        <el-date-picker
          style="width:300px;margin-right:50px"
          size="mini"
          v-model="value1"
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
        <el-select size="mini" v-model="value2" placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>温度/湿度/风速</span>
        <el-select size="mini" v-model="chartSign" placeholder="请选择参数">
          <el-option v-for="item in paraOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="getTable">查询</el-button>
        <el-button size="mini" style="float: right" @click="zoomChange($event)">切换缩放模式</el-button>
      </div>
      <!--表格-->
      <div class="table-container">
        <div id="TempHour" :style="{ visibility:(chartSign===1?'visible':'hidden'), height:chartHeight }"></div>
        <div id="HumidityHour" :style="{ visibility:(chartSign===2?'visible':'hidden'), height:chartHeight }"></div>
        <div id="SpeedHour" :style="{ visibility:(chartSign===3?'visible':'hidden'), height:chartHeight }"></div>
        <div class="loading-background" :style="{visibility: viewLoading}"></div>
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
      pickerOptions: {
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
      tempChart: '', // 温度小时报表
      humidityChart: '', // 湿度小时报表
      speedChart: '', // 风速小时报表
      addrOptions: [],
      value1: '',
      value2: '绿岛湖',
      N: 2,
      chartSign: 1,
      chartHeight: '100%',
      viewLoading: 'hidden',
      paraOptions: [
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
      siteMap: { // mac地址与站点名称的对应关系
        '龙湾大桥': '440604:009:AAJ',
        '罗南村委': '440604:002:AAC',
        '绿岛湖': '440604:000:AAA',
        '龙津老年活动中心': '440604:006:AAG',
        '南庄三中': '440604:007:AAH',
        '吉利小学': '440604:004:AAE',
        '罗格村委': '440604:005:AAF',
        '吉利社区': '440604:008:AAI',
        '南庄实验中学': '440604:001:AAB',
        '南庄水利所': '440604:003:AAD',
        '南庄污水处理厂': '440604:010:AAK'
      },
      optionTemp: {
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
          nameTextStyle: { padding: [10,0,0,0] },
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          name: '温度（℃）',
          nameTextStyle: { padding: [0,0,0,20] },
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
      optionHumidity: {
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
          nameTextStyle: { padding: [10,0,0,0] },
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          name: '湿度（%R.H.）',
          nameTextStyle: { padding: [0,0,0,20] },
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
      optionSpeed: {
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
          nameTextStyle: { padding: [10,0,0,0] },
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          name: '风速（m/s）',
          nameTextStyle: { padding: [0,0,0,20] },
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
  created () {
    if(document.body.clientWidth<891) {
      this.tableHeight="calc(100% - 30px)"
    }
    console.log(this.tableHeight)
  },
  mounted() {
    // 创建charts实例
    this.tempChart = this.$echarts.init(document.getElementById('TempHour'))
    this.humidityChart = this.$echarts.init(document.getElementById('HumidityHour'))
    this.speedChart = this.$echarts.init(document.getElementById('SpeedHour'))
    this.getAddr() // 获取站点选择下拉列表的选项
    this.defaultDate() // 默认日期选择昨天零点到今天
    this.getTable() // 默认获取昨天零点到今天的数据
  },
  methods: {
    getAddr() { // 获取下拉列表选项
      this.$axios.get('/macAirDeviceList')
      .then(res => {
        let addrArray = res.data.data
        for (let i = 0; i < addrArray.length; i++) {
          this.addrOptions.push({
            value: addrArray[i].remark,
            label: addrArray[i].remark
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    defaultDate() {
      let end = new Date()
      let start = new Date()
      start.setTime(end.getTime() - (this.N-1) * 3600 * 1000 * 24)
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
      this.value1 = [start, end]
    },
    zoomChange: function (e) { // 图表缩放模式改变
      e.currentTarget.blur()
      if(this.optionTemp.dataZoom.type=='inside') {
        this.optionTemp.dataZoom.type='slider'
        this.optionHumidity.dataZoom.type='slider'
        this.optionSpeed.dataZoom.type='slider'
      }
      else {
        this.optionTemp.dataZoom.type='inside'
        this.optionHumidity.dataZoom.type='inside'
        this.optionSpeed.dataZoom.type='inside'
      }
      this.tempChart.clear()
      this.humidityChart.clear()
      this.speedChart.clear()
      this.tempChart.setOption(this.optionTemp)
      this.humidityChart.setOption(this.optionHumidity)
      this.speedChart.setOption(this.optionSpeed)
    },
    // 获取表格数据后并筛选
    getTable() {
      let date = this.value1 // 日期
      let filter = this.value2 // 站点
      // 定义字典
      this.viewLoading='visible'
      this.$axios.get('/macOldFourAir',
        {params: {
            beginTime: date[0],
            endTime: date[1],
            macAddress: this.siteMap[this.value2],
          }}
      ).then(mofa => {
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
        }
        else {
          this.optionTemp.xAxis.data = []
          this.optionTemp.series[0].data = []
          this.optionTemp.series[1].data = []
          this.optionTemp.series[2].data = []

          this.optionHumidity.series[0].data = []
          this.optionHumidity.series[1].data = []
          this.optionHumidity.series[2].data = []

          this.optionSpeed.series[0].data = []
        }
        // 作图
        this.tempChart.setOption(this.optionTemp)
        this.humidityChart.setOption(this.optionHumidity)
        this.speedChart.setOption(this.optionSpeed)
        this.viewLoading='hidden'
      }).catch(error => {
        console.log(error)
      })
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
  height: calc(100% - 105px);
}
.filter_title i {
  font-size: 25px;
  padding-right: 10px;
}
.filter_title span {
  font-weight: bold;
  font-size: 18px;
}
.filter_container {
  margin-top: 10px;
  font-size: 15px;
}
.filter_container span {
  padding-right: 10px;
}
.el-select {
  padding-right: 15px;
}
.table-container {
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
