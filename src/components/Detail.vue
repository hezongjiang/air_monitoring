<template>
  <div class="container-main">
    <div class="navleft">
      <div class="li-head">站点总数：{{ countSite }}个</div>
      <div class="li-head1">
        <span style="color:rgb(7,193,96)">在线：</span>
        <span style="color:white;background-color:rgb(7,193,96);padding:0 4px;border-radius: 4px;">{{ countOL }}个</span><br/>
        <span style="color:#999">离线：</span>
        <span style="color:white;background-color:#999;padding:0 4px;border-radius: 4px;">{{ countSite - countOL }}个</span>
        <br/>
        <span style="font-size:14px;font-weight:bold;">上次更新时间：</span>
        <br/>
        <span style="font-size:14px;">{{ refreshTime }}</span>
      </div>
      <div class="li-head2">
        站点列表
      </div>
      <ul>
        <li v-for='item in liList' :class="{active: termInfo.macAddress === item.macAddress}"><a href="javascript:void(0)" v-on:click="focusInfo(item.macAddress, item.remark)">&nbsp;&nbsp;<span :style="{color:(termStateObj[item.remark] === '在线' ? 'greenyellow' : '#999' )}">●</span>&nbsp;{{ item.remark }}</a></li>
      </ul>
    </div>
    <div class="winmain">
      <div>
        <el-row type="flex" align="bottom">
          <el-col :span="14" class="term-name">{{ termInfo.remark }}<span :style="{color:(termState === '在线' ? '#11aa11' : '#999' )}" style="font-size:13px;color:green;font-weight:normal">&nbsp;&nbsp;{{ termState }}</span></el-col>
          <el-col :span="10" class="back-home"><router-link to="/index"><i class="fa fa-reply" aria-hidden="true"></i>&nbsp;返回首页</router-link></el-col>
        </el-row>
      </div>
      <div class="term-info">
        <el-row type="flex" align="bottom">
          <el-col :span="8">经度&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ parseFloat(termInfo.lon/100).toFixed(6) }}</span></el-col>
          <el-col :span="8">设备编号&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ termInfo.macAddress }}</span></el-col>
          <el-col :span="8">设备电量&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ parseInt(termInfo.batteryInfo) }}%&nbsp;<i :class="batteryIcon" aria-hidden="true" style="font-size:15px"></i></span></el-col>
        </el-row>
        <el-row type="flex" align="bottom">
          <el-col :span="8">纬度&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ parseFloat(termInfo.lat/100).toFixed(6) }}</span></el-col>
          <el-col :span="8">站点名称&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ termInfo.remark }}</span></el-col>
          <el-col :span="8">固件版本&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ termInfo.version }}</span></el-col>
        </el-row>
      </div>
      <div class="chart-table">
        <a href="javascript:void(0)" :class="{active:activeSign==1}" v-on:click="chooseData(1)">详细数据</a>
        <a href="javascript:void(0)" :class="{active:activeSign==2}" v-on:click="chooseData(2)">气体浓度</a>
        <a href="javascript:void(0)" :class="{active:activeSign==3}" v-on:click="chooseData(3)">气温</a>
        <a href="javascript:void(0)" :class="{active:activeSign==4}" v-on:click="chooseData(4)" style="margin-right:60px">湿度</a>
        时间&nbsp;&nbsp;
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
        <el-button type="primary" size="mini" @click="focusInfo(termInfo.macAddress, termInfo.remark)"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain size="mini" @click="exportExcel($event)" :style="{ visibility:(activeSign===1?'visible':'hidden') }" style="float:right"><i class="fa fa-download" aria-hidden="true"></i>&nbsp;导出Excel</el-button>
        <div class="container">
          <el-table
            id= "detailData"
            :row-style="{height:'35px'}"
            :cell-style="{ padding:0, fontSize:'12px'}"
            :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
            :style="{ visibility:(activeSign===1?'visible':'hidden') }"
            :data="tbList"
            stripe
            highlight-current-row
            border
            :height="tableHeight"
            tooltip-effect="dark">
            <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="100"></el-table-column>
            <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="CO" label="CO（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="O3" label="O3（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center"></el-table-column>
          </el-table>
          <div id="concentration" :style="{ visibility:(activeSign===2?'visible':'hidden'), height:chartHeight }"></div>
          <div id="temperature" :style="{ visibility:(activeSign===3?'visible':'hidden'), height:chartHeight }"></div>
          <div id="humidity" :style="{ visibility:(activeSign===4?'visible':'hidden'), height:chartHeight }"></div>
          <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Detail',
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
      liList: [], // 左侧站点列表
      countSite: 0, // 站点总数
      countOL: 0, // 站点在线数
      termStateObj: {}, // 终端在线状态对象
      termInfo: {}, // 终端信息对象
      termState: '', // 终端在线状态
      batteryIcon: '', // 电池图标
      activeSign: 1, // 选项卡激活项
      airChart: '', // 气体图表
      tempChart: '', // 温度图表
      humidityChart: '', // 湿度图表
      N: 2, // 默认显示N天前至当天的信息
      beginEndT: [], // 开始结束日期
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      viewLoading: 'hidden', // 窗口可见性
      tableHeight: '100%', // 表格高度
      chartHeight: '100%', // 图表高度
      timer: null, // 定时器
      refreshTime: '', // 更新时间
      tbList: [], // 存放详细数据的表格
      optionAir: { // 气体曲线图配置
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
          right: 10,
          data: ['SO2', 'NO2', 'PM10', 'PM2.5', 'CO', 'O3']
        },
        grid: {
          left: '38px',
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
          name: 'CO',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: 'O3',
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionTemp: { // 温度曲线图的设置数据
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: {
          type: 'inside',
          filterMode: 'none'
        },
        grid: {
          left: '38px',
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
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionHumidity: { // 湿度曲线图的设置数据
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: {
          type: 'inside',
          filterMode: 'none'
        },
        grid: {
          left: '38px',
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
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  methods: {
    focusInfo(addr, remark) { // 展示选定站点的信息
      let that = this // this拷贝，防止后续因层级关系无法调用this
      this.viewLoading = 'visible' // 显示加载标志
      this.beginEndTState = this.beginEndT
      this.termInfo.macAddress = addr // 提前赋值，使左侧站点列表选中反应达到最快，增加用户体验
      this.$axios
      .all([this.$axios.get('/' + addr + '/macAirDeviceInfo'), // 获取选定站点的终端信息
            this.$axios.get('/macAirList'), // 获取所有站点的空气信息
            this.$axios.get('/macAirHourHistory', { // 获取选定站点在一定日期范围内的气体信息
              params: {
                macAddress: addr,
                beginTime: this.beginEndT[0],
                endTime: this.beginEndT[1]
              }
            })
      ])
      .then(this.$axios.spread(function (madi, mal, mahh) {
        if (madi.data.successful && madi.data.data.length) {
          that.termInfo = madi.data.data[0]
          switch (Math.round(parseInt(that.termInfo.batteryInfo) / 10)) { // 根据电池电量值选择不同的电池图标
            case 0:
              that.batteryIcon = 'fa fa-battery-0'
              break
            case 1:
            case 2:
            case 3:
              that.batteryIcon = 'fa fa-battery-1'
              break
            case 4:
            case 5:
              that.batteryIcon = 'fa fa-battery-2'
              break
            case 6:
            case 7:
            case 8:
              that.batteryIcon = 'fa fa-battery-3'
              break
            case 9:
            case 10:
              that.batteryIcon = 'fa fa-battery'
              break
            default:
              that.batteryIcon = 'fa fa-battery'
          }
        } else {
          that.termInfo = {
            'macAddress': addr,
            'beginTime': '',
            'batteryInfo': 0,
            'lon': 0,
            'lat': 0,
            'errorCode': '',
            'remark': remark,
            'version': ''
          }
          that.batteryIcon = 'fa fa-battery-0'
        }
        if (mal.data.successful && mal.data.data.length) {
          that.countSite = mal.data.data.length // 站点总数
          that.countOL = 0
          for (let i = 0; i < mal.data.data.length; i++) { // 站点在线状态
            if (parseInt(Date.now() / 1000) - that.$moment(mal.data.data[i].beginTime).unix() < 1800) {
              that.termStateObj[mal.data.data[i].macAddress] = '在线'
              that.countOL++
            } else {
              that.termStateObj[mal.data.data[i].macAddress] = '离线'
            }
          }
          that.termState = that.termStateObj[remark]
        } else {
          that.countSite = 0 // 站点总数
          that.countOL = 0 // 在线站点数
          for (let key in that.termStateObj) {
            that.termStateObj[key] = '离线'
          }
          that.termState = '离线' // 终端在线状态
        }
        // 由于后续数据是逐个索引赋值的，所以先清空，提前清空，if后面就无需else
        that.optionAir.series[0].data = []
        that.optionAir.series[1].data = []
        that.optionAir.series[2].data = []
        that.optionAir.series[3].data = []
        that.optionAir.series[4].data = []
        that.optionAir.series[5].data = []
        that.optionTemp.series[0].data = []
        that.optionHumidity.series[0].data = []
        that.optionAir.xAxis.data = []
        that.optionTemp.xAxis.data = []
        that.optionHumidity.xAxis.data = []
        if (mahh.data.successful && mahh.data.data.length) {
          that.tbList = mahh.data.data
          // 图表数据赋值
          for (let i = 0; i < mahh.data.data.length; i++) {
            that.optionAir.series[0].data[i] = mahh.data.data[i].SO2
            that.optionAir.series[1].data[i] = mahh.data.data[i].NO2
            that.optionAir.series[2].data[i] = mahh.data.data[i].PM10
            that.optionAir.series[3].data[i] = mahh.data.data[i].PM25
            that.optionAir.series[4].data[i] = mahh.data.data[i].CO
            that.optionAir.series[5].data[i] = mahh.data.data[i].O3
            that.optionTemp.series[0].data[i] = mahh.data.data[i].temp
            that.optionHumidity.series[0].data[i] = mahh.data.data[i].humidity
            that.optionAir.xAxis.data[i] = mahh.data.data[i].beginTime
            that.optionTemp.xAxis.data[i] = mahh.data.data[i].beginTime
            that.optionHumidity.xAxis.data[i] = mahh.data.data[i].beginTime
          }
        } else {
          that.tbList = []
        }
        // 作曲线图
        that.airChart.setOption(that.optionAir)
        that.tempChart.setOption(that.optionTemp)
        that.humidityChart.setOption(that.optionHumidity)
        that.viewLoading = 'hidden'
        that.refreshTime = that.$moment().format('YYYY-MM-DD HH:mm:ss')
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
    termStateRefresh() { // 站点在线状态刷新
      this.$axios
        .get('/macAirList') // 获取所有站点的终端信息
        .then(mal => {
          if (mal.data.successful && mal.data.data.length) {
            this.countSite = mal.data.data.length // 站点总数
            this.countOL = 0
            for (let i = 0; i < mal.data.data.length; i++) { // 站点在线状态
              if (parseInt(Date.now() / 1000) - this.$moment(mal.data.data[i].beginTime).unix() < 1800) {
                this.termStateObj[mal.data.data[i].macAddress] = '在线'
                this.countOL++
              } else {
                this.termStateObj[mal.data.data[i].macAddress] = '离线'
              }
            }
          } else {
            this.countSite = 0 // 站点总数
            this.countOL = 0 // 在线站点数
            for (let key in this.termStateObj) {
              this.termStateObj[key] = '离线'
            }
          }
          this.refreshTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    chooseData(x) { // 选择要激活的选项卡的内容
      this.activeSign = x
    },
    exportExcel(e) { // 导出excel文件
      e.currentTarget.blur()
      const th = ['监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', 'CO（μg/m³）', 'O3（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'CO', 'O3', 'speed', 'direct']
      const data = this.tbList.map(v => filterVal.map(k => v[k]))
      const fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.termInfo.remark + '详情'
      const [fileType, sheetName] = ['xlsx', '详情数据']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  created () {
    console.log(document.body.clientWidth)
    // 判断浏览器宽度是否小于阈值
    if (document.body.clientWidth < 1069) {
      // 修改表格高度
      this.tableHeight = 'calc(100% - 30px)'
      // 修改图表高度
      this.chartHeight = 'calc(100% - 30px)'
    }
  },
  mounted () {
    // this拷贝，防止后续因层级关系无法调用this
    let that = this
    // 显示加载标志
    this.viewLoading = 'visible'
    // 开始日期和结束日期初始化
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
    // 其它初始化（在线状态、站点标签及其点击事件等）
    this.$axios
    .all([this.$axios.get('/macAirDeviceList'), this.$axios.get('/macAirList')]) // 获取所有站点的终端信息
    .then(this.$axios.spread(function(madl, mal) {
      // 创建图表实例
      that.airChart = that.$echarts.init(document.getElementById('concentration'))
      that.tempChart = that.$echarts.init(document.getElementById('temperature'))
      that.humidityChart = that.$echarts.init(document.getElementById('humidity'))
      if (mal.data.successful && mal.data.data.length) {
        that.countSite = mal.data.data.length // 站点总数
        for (let i = 0; i < mal.data.data.length; i++) { // 站点在线状态
          if (parseInt(Date.now() / 1000) - that.$moment(mal.data.data[i].beginTime).unix() < 1800) {
            that.termStateObj[mal.data.data[i].macAddress] = '在线'
            that.countOL++
          } else {
            that.termStateObj[mal.data.data[i].macAddress] = '离线'
          }
        }
      }
      if (madl.data.successful && madl.data.data.length) {
        that.liList = madl.data.data // 左侧栏列表
        that.focusInfo(that.$route.query.macAddress, that.$route.query.remark)
      }
      that.timer = setInterval(that.termStateRefresh, 60000)
    }))
    .catch(function (error) { // 请求失败处理
      console.log(error)
    })
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
.navleft {
  /*width: 13%;*/
  width: 200px;
  float: left;
  padding: 10px 5px 10px 10px;
  height: calc(100% - 50px);
  overflow-y: auto;
}
.navleft ul {
  background-color: white;
  border-radius: 0 0 4px 4px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-bottom: 2px solid #eee;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
}
.navleft ul li {
  padding: 5px 0;
}
.navleft ul a {
  display: block;
  padding: 4px 0;
  font-size: 15px;
  color: #999;
  text-decoration: none;
}
.navleft ul a:hover {
  color: #666;
}
.navleft .active a {
  border-left: 4px solid rgb(253,216,69);
  color: #000;
  font-weight: bold;
}
.navleft a:hover {
  border-left: 4px solid rgb(253,216,69);
  color: #000;
  font-weight: bold;
}
.li-head {
  border-radius: 4px 4px 0 0;
  font-size: 17px;
  font-weight: bold;
  padding: 10px 0 0 10px;
  color: rgb(40,40,40);
  background-color: white;
  border-top: 2px solid #eee;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
}
.li-head1 {
  font-size: 15px;
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid #eee;
  background-color: white;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
}
.li-head2 {
  font-size: 17px;
  font-weight: bold;
  padding: 10px 0 6px 10px;
  color: rgb(40,40,40);
  background-color: white;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
}
.winmain {
  /*width: 87%;*/
  width: calc(100% - 200px);
  padding: 10px 10px 10px 5px;
  float: left;
  height: calc(100% - 50px);
}
.el-col a {
  text-decoration: none;
  color: rgb(70, 160, 255);
  padding: 6px 16px 5px 10px;
  border-radius: 4px;
  background-color: rgb(235, 245, 255);
  border: 1px solid rgb(155, 225, 255);
}
.el-col a:hover {
  background-color: rgb(155, 225, 255);
}
.el-row {
  padding: 4px 0;
}
.el-row a:hover {
  color: #666;
}
.term-name {
  text-align: left;
  font-size: 17px;
  font-weight: bold;
  color: black;
}
.back-home {
  text-align: right;
  font-size: 13px;
  color: #999;
}
.term-info {
  background-color: white;
  padding: 3px 20px;
  margin-top: 6px;
  border-radius: 4px;
  box-shadow: 0 0 2px 1px #ddd;
}
.term-info .el-col {
  text-align: left;
  font-size: 13px;
  font-weight: bold;
  color: #999;
}
.term-info .el-col span {
  color: black;
}
.chart-table {
  background-color: white;
  padding: 6px 20px;
  margin-top: 6px;
  font-size: 15px;
  border-radius: 4px;
  height: calc(100% - 100px);
  box-shadow: 0 0 2px 1px #ddd;
}
.chart-table a {
  text-decoration: none;
  color: #999;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  background-color: #f4f4f4;
  box-shadow: 0 0 2px 1px #ddd;
}
.chart-table a.active {
  color: black;
  background-color: #dddddd;
}
.chart-table a:hover {
  color: black;
  background-color: #dddddd;
}
.chart-table .container {
  position: relative;
  margin-top: 4px;
  height: calc(100% - 30px);
}
#concentration, #temperature, #humidity {
  width: 100%;
  position: absolute;
}
#detailData {
  width: 100%;
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
@media screen and (min-width: 1980px) {
  .container-main {
    background-color: lightgreen;
  }
}
</style>
