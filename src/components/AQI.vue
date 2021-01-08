<!--AQI气体曲线页面-->
<template>
<div class="container-main">
  <div class="winmain">
    <div class="filter_title">
      <span>AQI气体曲线</span>
    </div>
    <div class="filter_container">
      <span>时间</span>
      <el-date-picker
        type="date"
        v-model="beginT"
        placeholder="开始日期"
        size="mini"
        value-format="yyyy-MM-dd"
        style="width:130px"
        :clearable="false"
        :editable="false">
      </el-date-picker>
      ～
      <el-date-picker
        type="date"
        v-model="endT"
        placeholder="结束日期"
        size="mini"
        value-format="yyyy-MM-dd"
        style="width:130px;margin-right:20px"
        :clearable="false"
        :editable="false">
      </el-date-picker>
      <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
      <el-button type="success" plain size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
    </div>
    <div class="chart-area">
      <div id="aqiAirChart" :style="{ height:chartHeight }"></div>
      <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'AQI',
  data () {
    return {
      airAQIChart: '', // 空气AQI图表
      beginT: '', // 日期选择器上显示的开始日期
      endT: '', // 日期选择器上显示的结束日期
      N: 30, // 默认显示昨天至当天的信息
      listMdiaqi: [], // 存放要导出为excel文件的数据
      // 各个站点的mac地址
      macAddrList: ['440604:000:AAA','440604:001:AAB','440604:002:AAC','440604:003:AAD','440604:004:AAE','440604:005:AAF','440604:006:AAG','440604:007:AAH','440604:008:AAI','440604:009:AAJ','440604:010:AAK'],
      viewLoading: 'hidden',
      chartHeight: 'calc(100% - 10px)',
      optionAirAQI: { // 空气AQI曲线图的设置数据
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
          data: ['绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        },
        grid: {
          left: '33px',
          right: '30px',
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
          name: 'AQI值',
          nameTextStyle: { padding: [0,0,0,20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          name: '绿岛湖',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '南庄实验中学',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '罗南村委',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '南庄水利所',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '吉利小学',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '罗格村委',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '龙津老年活动中心',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '南庄三中',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '吉利社区',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '龙湾大桥',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '污水处理厂',
          data: [],
          type: 'line',
          smooth: true
        }]
      },
    }
  },
  methods: {
    searchSth: function () { // 查询
      let that = this
      this.viewLoading='visible'
      this.listMdiaqi=[]
      this.$axios
      .all([  // 获取各个站点空气AQI数据
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[0],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[1],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[2],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[3],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[4],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[5],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[6],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[7],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[8],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[9],
            beginTime: this.beginT,
            endTime: this.endT
          }
        }),
        this.$axios.get('/macDayIAQI',{
          params: {
            macAddress: this.macAddrList[10],
            beginTime: this.beginT,
            endTime: this.endT
          }
        })
      ])
      .then( this.$axios.spread(function (mdiaqi1,mdiaqi2,mdiaqi3,mdiaqi4,mdiaqi5,mdiaqi6,mdiaqi7,mdiaqi8,mdiaqi9,mdiaqi10,mdiaqi11) {
        if(mdiaqi1.data.successful) {
          that.optionAirAQI.series[0].data = mdiaqi1.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi1.data.data.time
        }
        else { that.optionAirAQI.series[0].data = [] }
        if(mdiaqi2.data.successful) {
          that.optionAirAQI.series[1].data = mdiaqi2.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi2.data.data.time
        }
        else { that.optionAirAQI.series[1].data = [] }
        if(mdiaqi3.data.successful) {
          that.optionAirAQI.series[2].data = mdiaqi3.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi3.data.data.time
        }
        else { that.optionAirAQI.series[2].data = [] }
        if(mdiaqi4.data.successful) {
          that.optionAirAQI.series[3].data = mdiaqi4.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi4.data.data.time
        }
        else { that.optionAirAQI.series[3].data = [] }
        if(mdiaqi5.data.successful) {
          that.optionAirAQI.series[4].data = mdiaqi5.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi5.data.data.time
        }
        else { that.optionAirAQI.series[4].data = [] }
        if(mdiaqi6.data.successful) {
          that.optionAirAQI.series[5].data = mdiaqi6.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi6.data.data.time
        }
        else { that.optionAirAQI.series[5].data = [] }
        if(mdiaqi7.data.successful) {
          that.optionAirAQI.series[6].data = mdiaqi7.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi7.data.data.time
        }
        else { that.optionAirAQI.series[6].data = [] }
        if(mdiaqi8.data.successful) {
          that.optionAirAQI.series[7].data = mdiaqi8.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi8.data.data.time
        }
        else { that.optionAirAQI.series[7].data = [] }
        if(mdiaqi9.data.successful) {
          that.optionAirAQI.series[8].data = mdiaqi9.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi9.data.data.time
        }
        else { that.optionAirAQI.series[8].data = [] }
        if(mdiaqi10.data.successful) {
          that.optionAirAQI.series[9].data = mdiaqi10.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi10.data.data.time
        }
        else { that.optionAirAQI.series[9].data = [] }
        if(mdiaqi11.data.successful) {
          that.optionAirAQI.series[10].data = mdiaqi11.data.data.IAQI
          that.optionAirAQI.xAxis.data = mdiaqi11.data.data.time
        }
        else { that.optionAirAQI.series[10].data = [] }
        that.airAQIChart.setOption(that.optionAirAQI)
        that.viewLoading='hidden'
        for(let i=0;i<mdiaqi1.data.data.IAQI.length;i++) {
          that.listMdiaqi[i]=new Object()
          if(mdiaqi1.data.successful) {
            that.listMdiaqi[i].time=mdiaqi1.data.data.time[i]
          }
          else {
            that.listMdiaqi[i].time=''
          }
          if(mdiaqi1.data.successful) {
            that.listMdiaqi[i].aqi1=mdiaqi1.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi1=0
          }
          if(mdiaqi2.data.successful) {
            that.listMdiaqi[i].aqi2=mdiaqi2.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi2=0
          }
          if(mdiaqi3.data.successful) {
            that.listMdiaqi[i].aqi3=mdiaqi3.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi3=0
          }
          if(mdiaqi4.data.successful) {
            that.listMdiaqi[i].aqi4=mdiaqi4.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi4=0
          }
          if(mdiaqi5.data.successful) {
            that.listMdiaqi[i].aqi5=mdiaqi5.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi5=0
          }
          if(mdiaqi6.data.successful) {
            that.listMdiaqi[i].aqi6=mdiaqi6.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi6=0
          }
          if(mdiaqi7.data.successful) {
            that.listMdiaqi[i].aqi7=mdiaqi7.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi7=0
          }
          if(mdiaqi8.data.successful) {
            that.listMdiaqi[i].aqi8=mdiaqi8.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi8=0
          }
          if(mdiaqi9.data.successful) {
            that.listMdiaqi[i].aqi9=mdiaqi9.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi9=0
          }
          if(mdiaqi10.data.successful) {
            that.listMdiaqi[i].aqi10=mdiaqi10.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi10=0
          }
          if(mdiaqi11.data.successful) {
            that.listMdiaqi[i].aqi11=mdiaqi11.data.data.IAQI[i]
          }
          else {
            that.listMdiaqi[i].aqi11=0
          }
        }
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
    zoomChange: function (e) { // 图表缩放模式改变
      e.currentTarget.blur()
      if(this.optionAirAQI.dataZoom.type=='inside') { this.optionAirAQI.dataZoom.type='slider' }
      else { this.optionAirAQI.dataZoom.type='inside' }
      this.airAQIChart.clear()
      this.airAQIChart.setOption(this.optionAirAQI)
    },
    exportExcel:function (e) { // 导出excel文件
      e.currentTarget.blur()
      let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
      let filterVal = ['time', 'aqi1', 'aqi2', 'aqi3', 'aqi4', 'aqi5', 'aqi6', 'aqi7', 'aqi8', 'aqi9', 'aqi10', 'aqi11']
      let data = this.listMdiaqi.map(v => filterVal.map(k => v[k]))
      let fileName = this.beginT + '至' + this.endT + '数据分析AQI气体分析'
      let [fileType, sheetName] = ['xlsx', '数据分析AQI气体分析']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  created () {
    if(document.body.clientWidth<618) {
      this.chartHeight="calc(100% - 60px)"
    }
    else if(document.body.clientWidth<1055) {
      this.chartHeight="calc(100% - 30px)"
    }
    console.log(this.chartHeight)
  },
  mounted () {
    // 创建charts实例
    this.airAQIChart = this.$echarts.init(document.getElementById('aqiAirChart'))
    // 设置默认开始日期和结束日期
    this.beginT = this.$moment().subtract(this.N,'days').format("YYYY-MM-DD")
    this.endT = this.$moment().format("YYYY-MM-DD")
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
  /* padding: 10px 10px; */
  position: absolute;
}
.winmain {
  margin: 10px 10px;
  background: white;
  border-radius: 4px;
  padding: 10px 20px;
  /* height: 549px; */
  /* width: 100%; */
  height: calc(100% - 105px);
  box-shadow: 0 0 2px 1px #ddd;
}
.filter_title {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.filter_title i {
  font-size: 25px;
  padding-right: 10px;
}
.filter_title span {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.filter_container {
  margin-top: 10px;
  font-size: 15px;
}
.filter_container span {
  padding-right: 10px;
}
.el-select {
  padding-right: 20px;
  width: 150px;
}
.chart-area {
  position: relative;
  margin-top: 4px;
  /* height: 450px; */
  height: calc(100% - 60px);
}
#aqiAirChart {
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
.sth-gone {
  display: none;
}
</style>
