<!--终端电量曲线页面-->
<template>
<div class="container-main">
  <div class="winmain">
    <div class="filter_title">
      <span>终端电量曲线</span>
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
      <span>站点</span>
      <el-select @input="termBatteryInfo" size="mini" v-model="termChoose" placeholder="请选择站点" style="width:150px">
        <el-option v-for="item in termOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
      <el-button type="success" plain size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
    </div>
    <div class="chart-area">
      <div id="termBatteryChart" :style="{ height:chartHeight }"></div>
      <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'Analyse',
  data () {
    return {
      batteryChart: '', // 终端电量图表
      beginT: '', // 日期选择器上显示的开始日期
      endT: '', // 日期选择器上显示的结束日期
      N: 1, // 默认显示昨天至当天的信息
      listBl: [], // 存放要导出为excel文件的数据
      // 各个站点的mac地址
      macAddrList: ['440604:000:AAA','440604:001:AAB','440604:002:AAC','440604:003:AAD','440604:004:AAE','440604:005:AAF','440604:006:AAG','440604:007:AAH','440604:008:AAI','440604:009:AAJ','440604:010:AAK'],
      blData: [],
      viewLoading: 'hidden',
      loadingSign: false,
      chartHeight: 'calc(100% - 10px)',
      termChoose: '吉利社区', // 站点选择器默认选定绿岛湖
      termOptions: [{
        value: '绿岛湖',
        label: '绿岛湖'
      },
      {
        value: '南庄实验中学',
        label: '南庄实验中学'
      },
      {
        value: '罗南村委',
        label: '罗南村委'
      },
      {
        value: '南庄水利所',
        label: '南庄水利所'
      },
      {
        value: '吉利小学',
        label: '吉利小学'
      },
      {
        value: '罗格村委',
        label: '罗格村委'
      },
      {
        value: '龙津老年活动中心',
        label: '龙津老年活动中心'
      },
      {
        value: '南庄三中',
        label: '南庄三中'
      },
      {
        value: '吉利社区',
        label: '吉利社区'
      },
      {
        value: '龙湾大桥',
        label: '龙湾大桥'
      },
      {
        value: '污水处理厂',
        label: '污水处理厂'
      }],
      optionBattery: { // 终端电量曲线图的设置数据
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: {
          type: 'inside',
          filterMode: 'none'
        },
        // legend: {
        //   top: 10,
        //   right: 0,
        //   data: ['绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        // },
        grid: {
          left: '48px',
          right: '46px',
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
          name: '电量（%）',
          nameTextStyle: { padding: [0,0,0,20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          // name: '绿岛湖',
          data: [],
          type: 'line',
          smooth: true
        }]
        // {
        //   name: '南庄实验中学',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '罗南村委',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '南庄水利所',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '吉利小学',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '罗格村委',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '龙津老年活动中心',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '南庄三中',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '吉利社区',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '龙湾大桥',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // },
        // {
        //   name: '污水处理厂',
        //   data: [],
        //   type: 'line',
        //   smooth: true
        // }]
      }
    }
  },
  methods: {
    searchSth: function () { // 查询
      let that = this
      this.viewLoading='visible'
      this.listBl=[]
      this.$axios
      .all([ // 获取各个站点电池电量数据
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[0]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[1]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[2]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[3]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[4]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[5]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[6]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[7]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[8]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[9]
          }
        }),
        this.$axios.get('/batteryList',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            macAddress: this.macAddrList[10]
          }
        })
      ])
      .then( this.$axios.spread(function (bl1,bl2,bl3,bl4,bl5,bl6,bl7,bl8,bl9,bl10,bl11) {
        if(bl1.data.successful) {
          that.blData[0] = bl1.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl1.data.data.beginTime
        }
        else { that.blData[0] = [] }
        if(bl2.data.successful) {
          that.blData[1] = bl2.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl2.data.data.beginTime
        }
        else { that.blData[1] = [] }
        if(bl3.data.successful) {
          that.blData[2] = bl3.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl3.data.data.beginTime
        }
        else { that.blData[2] = [] }
        if(bl4.data.successful) {
          that.blData[3] = bl4.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl4.data.data.beginTime
        }
        else { that.blData[3] = [] }
        if(bl5.data.successful) {
          that.blData[4] = bl5.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl5.data.data.beginTime
        }
        else { that.blData[4] = [] }
        if(bl6.data.successful) {
          that.blData[5] = bl6.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl6.data.data.beginTime
        }
        else { that.blData[5] = [] }
        if(bl7.data.successful) {
          that.blData[6] = bl7.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl7.data.data.beginTime
        }
        else { that.blData[6] = [] }
        if(bl8.data.successful) {
          that.blData[7] = bl8.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl8.data.data.beginTime
        }
        else { that.blData[7] = [] }
        if(bl9.data.successful) {
          that.blData[8] = bl9.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl9.data.data.beginTime
        }
        else { that.blData[8] = [] }
        if(bl10.data.successful) {
          that.blData[9] = bl10.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl10.data.data.beginTime
        }
        else { that.blData[9] = [] }
        if(bl11.data.successful) {
          that.blData[10] = bl11.data.data.batteryInfo
          that.optionBattery.xAxis.data = bl11.data.data.beginTime
        }
        else { that.blData[10] = [] }
        that.termBatteryInfo()
        that.viewLoading='hidden'
        for(let i=0;i<bl1.data.data.batteryInfo.length;i++) {
          that.listBl[i]=new Object()
          if(bl1.data.successful) {
            that.listBl[i].time=bl1.data.data.beginTime[i]
          }
          else {
            that.listBl[i].time=''
          }
          if(bl1.data.successful) {
            that.listBl[i].batt1=bl1.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt1=0
          }
          if(bl2.data.successful) {
            that.listBl[i].batt2=bl2.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt2=0
          }
          if(bl3.data.successful) {
            that.listBl[i].batt3=bl3.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt3=0
          }
          if(bl4.data.successful) {
            that.listBl[i].batt4=bl4.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt4=0
          }
          if(bl5.data.successful) {
            that.listBl[i].batt5=bl5.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt5=0
          }
          if(bl6.data.successful) {
            that.listBl[i].batt6=bl6.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt6=0
          }
          if(bl7.data.successful) {
            that.listBl[i].batt7=bl7.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt7=0
          }
          if(bl8.data.successful) {
            that.listBl[i].batt8=bl8.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt8=0
          }
          if(bl9.data.successful) {
            that.listBl[i].batt9=bl9.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt9=0
          }
          if(bl10.data.successful) {
            that.listBl[i].batt10=bl10.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt10=0
          }
          if(bl11.data.successful) {
            that.listBl[i].batt11=bl11.data.data.batteryInfo[i]
          }
          else {
            that.listBl[i].batt11=0
          }
        }
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
    zoomChange: function (e) { // 图表缩放模式改变
      e.currentTarget.blur()
      if(this.optionBattery.dataZoom.type=='inside') { this.optionBattery.dataZoom.type='slider' }
      else { this.optionBattery.dataZoom.type='inside' }
      this.batteryChart.clear()
      this.batteryChart.setOption(this.optionBattery)
    },
    termBatteryInfo:function () {
      switch (this.termChoose) {
        case '绿岛湖':
          this.optionBattery.series[0].data = this.blData[0]
          break
        case '南庄实验中学':
          this.optionBattery.series[0].data = this.blData[1]
          break
        case '罗南村委':
          this.optionBattery.series[0].data = this.blData[2]
          break
        case '南庄水利所':
          this.optionBattery.series[0].data = this.blData[3]
          break
        case '吉利小学':
          this.optionBattery.series[0].data = this.blData[4]
          break
        case '罗格村委':
          this.optionBattery.series[0].data = this.blData[5]
          break
        case '龙津老年活动中心':
          this.optionBattery.series[0].data = this.blData[6]
          break
        case '南庄三中':
          this.optionBattery.series[0].data = this.blData[7]
          break
        case '吉利社区':
          this.optionBattery.series[0].data = this.blData[8]
          break
        case '龙湾大桥':
          this.optionBattery.series[0].data = this.blData[9]
          break
        case '污水处理厂':
          this.optionBattery.series[0].data = this.blData[10]
          break
      }
      this.batteryChart.setOption(this.optionBattery)
    },
    exportExcel:function (e) { // 导出excel文件
      e.currentTarget.blur()
      let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
      let filterVal = ['time', 'batt1', 'batt2', 'batt3', 'batt4', 'batt5', 'batt6', 'batt7', 'batt8', 'batt9', 'batt10', 'batt11']
      let data = this.listBl.map(v => filterVal.map(k => v[k]))
      let fileName = this.beginT + '至' + this.endT + '数据分析终端电量'
      let [fileType, sheetName] = ['xlsx', '数据分析终端电量']
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
    this.batteryChart = this.$echarts.init(document.getElementById('termBatteryChart'))
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
#termBatteryChart {
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
