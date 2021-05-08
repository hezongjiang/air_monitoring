<!--首页-->
<template>
  <div class="container-main">
    <div class="navleft">
      <div class="li-head">站点总数：{{ countSite }}个</div>
      <div class="li-head1">
        <span style="color:rgb(7,193,96)">在线：</span>
        <span style="color:white;background-color:rgb(7,193,96);padding:0 4px;border-radius: 4px;">{{ countOL }}个</span>
        <br/>
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
    <div class="bdmap">
      <div id="allmap"></div>
      <div class="winchild1" :style="{visibility: viewInfo}">
        <el-row class="state-detail" type="flex" align="bottom">
          <el-col :span="16" class="term-state">{{ termInfo.remark }}<span :style="{color:(termState === '在线' ? '#11aa11' : '#999' )}" style="font-size:13px;color:green;font-weight:normal">&nbsp;&nbsp;{{ termState }}</span><span style="font-size:13px;color:#999;font-weight:normal">&nbsp;&nbsp;监测时间：{{ airInfo.beginTime }}</span></el-col>
          <el-col :span="8" class="view-detail"><router-link :to="{path:'/detail',query:{macAddress:termInfo.macAddress,remark:termInfo.remark}}">查看详情<i class="el-icon-caret-right"></i></router-link></el-col>
        </el-row>
        <el-row class="air-type" type="flex" align="bottom" style="padding-top:14px">
          <el-col :span="3">SO<span>2&nbsp;μg/m3</span></el-col>
          <el-col :span="3">NO<span>2&nbsp;μg/m3</span></el-col>
          <el-col :span="3">PM10<span>&nbsp;μg/m3</span></el-col>
          <el-col :span="3">PM2.5<span>&nbsp;μg/m3</span></el-col>
          <el-col :span="3">CO<span>&nbsp;μg/m3</span></el-col>
          <el-col :span="4">经度</el-col>
          <el-col :span="3">纬度</el-col>
          <el-col :span="2" style="text-align:right;font-size:13px;color:black">{{ parseInt(termInfo.batteryInfo) }}%&nbsp;<i :class="batteryIcon" aria-hidden="true" style="font-size:15px"></i></el-col>
        </el-row>
        <el-row class="air-value" type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="3" :style="{color:colorSO2}">{{ parseFloat(airInfo.SO2).toFixed(2) }}</el-col>
          <el-col :span="3" :style="{color:colorNO2}">{{ parseFloat(airInfo.NO2).toFixed(2) }}</el-col>
          <el-col :span="3" :style="{color:colorPM10}">{{ parseFloat(airInfo.PM10).toFixed(2) }}</el-col>
          <el-col :span="3" :style="{color:colorPM25}">{{ parseFloat(airInfo.PM25).toFixed(2) }}</el-col>
          <el-col :span="3" :style="{color:colorCO}">{{ parseFloat(airInfo.CO).toFixed(2) }}</el-col>
          <el-col :span="4">{{ parseFloat(termInfo.lon/100).toFixed(6) }}</el-col>
          <el-col :span="5">{{ parseFloat(termInfo.lat/100).toFixed(6) }}</el-col>
        </el-row>
        <el-row class="other-item" type="flex" align="bottom" style="padding-top:14px">
          <el-col :span="3">O3<span>&nbsp;μg/m3</span></el-col>
          <el-col :span="3">温度<span>&nbsp;℃</span></el-col>
          <el-col :span="3">湿度<span>&nbsp;%R.H.</span></el-col>
          <el-col :span="3">风速<span>&nbsp;m/s</span></el-col>
          <el-col :span="3">风向</el-col>
          <el-col :span="4">固件版本</el-col>
          <el-col :span="5">设备编号</el-col>
        </el-row>
        <el-row class="other-value" type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="3" :style="{color:colorO3}">{{ parseFloat(airInfo.O3).toFixed(2) }}</el-col>
          <el-col :span="3">{{ airInfo.temp }}</el-col>
          <el-col :span="3">{{ airInfo.humidity }}</el-col>
          <el-col :span="3">{{ airInfo.speed }}<span style="font-size:12px;color:#999">&nbsp;&nbsp;{{ windSpe }}</span></el-col>
          <el-col :span="3">{{ airInfo.direct }}<span style="font-size:12px;color:#999">&nbsp;&nbsp;{{ windDir }}</span></el-col>
          <el-col :span="4">{{ termInfo.version }}</el-col>
          <el-col :span="5">{{ termInfo.macAddress }}</el-col>
        </el-row>
      </div>
      <div id="main" :style="{visibility: viewInfo}"></div>
      <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      <div class="win-close-btn" :style="{visibility: viewInfo}"><el-button type="danger" size="mini" icon="el-icon-error" style="font-size:16px" @click="closeSuspend"><span style="font-size:15px">关闭悬浮窗口</span></el-button></div>
      <div class="air-indicator" :style="{visibility: viewInfo}">
        <img src="@/assets/airIndicator.png" width="85" height="136" alt="气体浓度指示图">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppIndex',
  data () {
    return {
      madl: [],
      macAddressTemp: '',
      remarkTemp: '',
      liList: [], // 左侧站点列表
      countSite: 0, // 站点总数
      countOL: 0, // 站点在线数
      termStateObj: {}, // 终端在线状态对象
      map: '', // 用于实例化百度地图
      termInfo: {}, // 终端信息对象
      termState: '', // 终端在线状态
      batteryIcon: '', // 电池图标
      airInfo: {}, // 气体信息对象
      colorSO2: 'black', // SO2颜色
      colorNO2: 'black', // NO2颜色
      colorPM10: 'black', // PM10颜色
      colorPM25: 'black', // PM2.5颜色
      colorCO: 'black', // CO颜色
      colorO3: 'black', // O3颜色
      windSpe: '', // 风速文字描述
      windDir: '', // 风向文字描述
      charts: '', // 用于实例化24小时曲线图表
      viewInfo: 'hidden', // 悬浮窗口可见性
      viewLoading: 'hidden', // 加载标志可见性
      timer: null, // 定时器
      refreshTime: '', // 更新时间
      optionAir: { // 24小时曲线图配置
        title: {
          text: '24小时气体实时曲线',
          textStyle: { color: 'black' }
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        legend: {
          right: 0,
          data: ['SO2', 'NO2', 'PM10', 'PM2.5', 'CO', 'O3']
        },
        grid: {
          top: '60px',
          left: '40px',
          right: '20px',
          bottom: '36px'
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
          nameTextStyle: { padding: [0, 0, 0, 12] },
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
      }
    }
  },
  methods: {
    focusInfo(addr, remark) {
      let that = this
      this.viewLoading = 'visible' // 显示加载标志
      this.focusInfo1(addr, remark)
      clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(function() { that.focusInfo1(addr, remark) }, 30000)
    },
    focusInfo1(addr, remark) { // 展示选定站点的信息
      let that = this // this拷贝，防止后续因层级关系无法调用this
      this.termInfo.macAddress = addr // 提前赋值，使左侧站点列表选中反应达到最快，增加用户体验
      this.$axios
      .all([this.$axios.get('/' + addr + '/macAirDeviceInfo'), // 获取选定站点的终端信息
            this.$axios.get('/macAirList'), // 获取所有站点的空气信息
            this.$axios.get('/macAirHourHistory', { // 获取选定站点在一定日期范围内的气体信息
              params: {
                macAddress: addr,
                beginTime: this.$moment().subtract(1, 'days').format('YYYY-M-D'), // 昨天
                endTime: this.$moment().format('YYYY-M-D') // 当天
              }
            })
      ])
      .then(this.$axios.spread(function (madi, mal, mahh) {
        if (madi.data.successful && madi.data.data.length) {
          that.termInfo = madi.data.data[0] // 站点信息对象
          let convertor = new BMap.Convertor()
          let pointArr = []
          pointArr.push(new BMap.Point(madi.data.data[0].lon / 100, madi.data.data[0].lat / 100))
          convertor.translate(pointArr, 1, 5, that.translatePanToCallback)
          switch (Math.round(parseInt(madi.data.data[0].batteryInfo) / 10)) { // 根据电池电量值选择不同的电池图标
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
          this.map.panTo(new BMap.Point(113.02, 22.99)) // 设置地图中心点坐标
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
          for (let i = 0; i < mal.data.data.length; i++) { // 循环检索选定站点的空气信息
            if (mal.data.data[i].macAddress === remark) { // 判断是否找到了选定的站点
              that.airInfo = mal.data.data[i] // 空气信息对象
              that.termState = that.termStateObj[remark]
              // 根据风速值选择不同强度的风
              if (that.airInfo.speed >= 10) {
                that.windSpe = '强风'
              } else if (that.airInfo.speed >= 6) {
                that.windSpe = '和风'
              } else if (that.airInfo.speed > 0) {
                that.windSpe = '微风'
              } else {
                that.windSpe = '无风'
              }
              // 根据风向值选择不同的风向
              if (that.airInfo.direct >= 348) {
                that.windDir = '北风'
              } else if (that.airInfo.direct >= 282) {
                that.windDir = '西北风'
              } else if (that.airInfo.direct >= 258) {
                that.windDir = '西风'
              } else if (that.airInfo.direct >= 192) {
                that.windDir = '西南风'
              } else if (that.airInfo.direct >= 168) {
                that.windDir = '南风'
              } else if (that.airInfo.direct >= 102) {
                that.windDir = '东南风'
              } else if (that.airInfo.direct >= 78) {
                that.windDir = '东风'
              } else if (that.airInfo.direct >= 12) {
                that.windDir = '东北风'
              } else {
                that.windDir = '北风'
              }
              // 根据气体值选择不同的颜色
              that.setColorAir('SO2', that.airInfo.SO2)
              that.setColorAir('NO2', that.airInfo.NO2)
              that.setColorAir('PM10', that.airInfo.PM10)
              that.setColorAir('PM25', that.airInfo.PM25)
              that.setColorAir('CO', that.airInfo.CO)
              that.setColorAir('O3', that.airInfo.O3)
              break // 一旦找到了选定的站点则跳出循环
            }
          }
        } else {
          that.countSite = 0 // 站点总数
          that.countOL = 0 // 在线站点数
          for (let key in that.termStateObj) {
            that.termStateObj[key] = '离线'
          }
          that.airInfo = { // 空气信息对象
            'macAddress': remark,
            'beginTime': '',
            'SO2': 0,
            'NO2': 0,
            'PM10': 0,
            'PM25': 0,
            'speed': 0,
            'direct': 0,
            'temp': 0,
            'humidity': 0
          }
          that.termState = '离线' // 终端在线状态
          that.windSpe = '' // 风速文字描述
          that.winDir = '' // 风向文字描述
          that.colorSO2 = 'black' // SO2颜色
          that.colorNO2 = 'black' // NO2颜色
          that.colorPM10 = 'black' // PM10颜色
          that.colorPM25 = 'black' // PM2.5颜色
        }
        if (mahh.data.successful && mahh.data.data.length) {
          for (let i = 0; i < 24; i++) { // 只取最近24小时的气体信息
            that.optionAir.series[0].data[i] = mahh.data.data[mahh.data.data.length - 24 + i].SO2
            that.optionAir.series[1].data[i] = mahh.data.data[mahh.data.data.length - 24 + i].NO2
            that.optionAir.series[2].data[i] = mahh.data.data[mahh.data.data.length - 24 + i].PM10
            that.optionAir.series[3].data[i] = mahh.data.data[mahh.data.data.length - 24 + i].PM25
            that.optionAir.series[4].data[i] = mahh.data.data[mahh.data.data.length - 24 + i].CO
            that.optionAir.series[5].data[i] = mahh.data.data[mahh.data.data.length - 24 + i].O3
            that.optionAir.xAxis.data[i] = mahh.data.data[mahh.data.data.length - 24 + i].beginTime
          }
        } else {
          that.optionAir.series[0].data = []
          that.optionAir.series[1].data = []
          that.optionAir.series[2].data = []
          that.optionAir.series[3].data = []
          that.optionAir.series[4].data = []
          that.optionAir.series[5].data = []
          that.optionAir.xAxis.data = []
        }
        that.charts.setOption(that.optionAir) // 作24小时曲线图
        that.viewInfo = 'visible' // 显示悬浮窗口
        that.viewLoading = 'hidden' // 隐藏加载标志
        that.refreshTime = that.$moment().format('YYYY-MM-DD HH:mm:ss')
      }))
      .catch(function(error) { // 请求失败处理
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
    setColorAir(air, value) { // 根据气体值选择不同的颜色
      switch (air) {
        case 'SO2':
          this.colorSO2 = this.setSO2Color(value)
          break
        case 'NO2':
          this.colorNO2 = this.setNO2Color(value)
          break
        case 'PM10':
          this.colorPM10 = this.setPM10Color(value)
          break
        case 'PM25':
          this.colorPM25 = this.setPM25Color(value)
        case 'CO':
          this.colorCO = this.setCOColor(value)
        case 'O3':
          this.colorO3 = this.setO3Color(value)
          break
      }
    },
    setSO2Color(value) { // 设置气体颜色
      if (value > 800) return '#993366'
      else if (value > 650) return '#ff2f2f'
      else if (value > 500) return '#ff9600'
      else if (value > 150) return '#ffdf4f'
      else return '#7fcf9f'
    },
    setNO2Color(value) { // 设置气体颜色
      if (value > 2340) return '#8c0000'
      else if (value > 1200) return '#993366'
      else if (value > 700) return '#ff2f2f'
      else if (value > 200) return '#ff9600'
      else if (value > 100) return '#ffdf4f'
      else return '#7fcf9f'
    },
    setPM10Color(value) { // 设置气体颜色
      if (value > 420) return '#8c0000'
      else if (value > 350) return '#993366'
      else if (value > 250) return '#ff2f2f'
      else if (value > 150) return '#ff9600'
      else if (value > 50) return '#ffdf4f'
      else return '#7fcf9f'
    },
    setPM25Color(value) { // 设置气体颜色
      if (value > 250) return '#8c0000'
      else if (value > 150) return '#993366'
      else if (value > 115) return '#ff2f2f'
      else if (value > 75) return '#ff9600'
      else if (value > 35) return '#ffdf4f'
      else return '#7fcf9f'
    },
    setCOColor(value) { // 设置气体颜色
      if (value > 90) return '#8c0000'
      else if (value > 60) return '#993366'
      else if (value > 35) return '#ff2f2f'
      else if (value > 10) return '#ff9600'
      else if (value > 5) return '#ffdf4f'
      else return '#7fcf9f'
    },
    setO3Color(value) { // 设置气体颜色
      if (value > 800) return '#8c0000'
      else if (value > 265) return '#993366'
      else if (value > 215) return '#ff2f2f'
      else if (value > 160) return '#ff9600'
      else if (value > 100) return '#ffdf4f'
      else return '#7fcf9f'
    },
    closeSuspend() { // 关闭悬浮窗口
      this.viewInfo = 'hidden' // 隐藏悬浮窗口
      this.termInfo.macAddress = '' // 去掉左侧列表选中标志
      clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(this.termStateRefresh, 60000)
    },
    translateCallback(data) {
      let that = this
      if (data.status === 0) {
        for (let i = 0; i < this.madl.length; i++) {
          var marker = new BMap.Marker(data.points[i]) // 站点标记
          var label = new BMap.Label(this.madl[i].remark, {offset: new BMap.Size(20, 0)}) // 标记标签
          marker.setLabel(label) // 为站点标记绑定标签
          marker.addEventListener('click', function () {
            that.focusInfo(that.madl[i].macAddress, that.madl[i].remark)
          }) // 为站点标记添加点击事件
          this.map.addOverlay(marker) // 在地图上添加站点标记
        }
      }
    },
    translatePanToCallback(data) {
      this.map.panTo(data.points[0]) // 设置地图中心点坐标
    }
  },
  mounted () {
    // this拷贝，防止后续因层级关系无法调用this
    let that = this
    // 显示加载标志
    this.viewLoading = 'visible'
    // 百度地图初始化
    this.map = new BMap.Map('allmap') // 创建Map实例
    this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT})) // 添加比例尺
    this.map.addControl(new BMap.NavigationControl()) // 添加缩放控件
    this.map.centerAndZoom(new BMap.Point(113.02, 22.99), 14) // 设置地图中心点坐标和地图缩放级别
    this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    // 其它初始化（在线状态、站点标签及其点击事件等）
    this.$axios
    .all([this.$axios.get('/macAirDeviceList'), this.$axios.get('/macAirList')]) // 获取所有站点的终端信息
    .then(this.$axios.spread(function(madl, mal) {
      if (madl.data.successful && madl.data.data.length) {
        that.liList = madl.data.data // 左侧栏列表
        that.madl = madl.data.data
        let pointArr = []
        for (let i = 0; i < madl.data.data.length; i++) { // 设置站点地图标记
          pointArr.push(new BMap.Point(madl.data.data[i].lon / 100, madl.data.data[i].lat / 100))
        }
        let convertor = new BMap.Convertor()
        convertor.translate(pointArr, 1, 5, that.translateCallback)
      }
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
      that.refreshTime = that.$moment().format('YYYY-MM-DD HH:mm:ss')
      // 隐藏加载标志
      that.viewLoading = 'hidden'
      that.timer = setInterval(that.termStateRefresh, 60000)
    }))
    .catch(function (error) { // 请求失败处理
      console.log(error)
    })
    // 创建charts图表实例
    this.charts = this.$echarts.init(document.getElementById('main'))
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
  /* height: 605px; */
  height: calc(100% - 50px);
  overflow-y: auto;
}
.navleft ul {
  background-color: white;
  border-radius: 0 0 4px 4px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  /* text-align: center; */
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
  border-left:4px solid rgb(253,216,69);
  color: #000;
  font-weight: bold;
}
.navleft a:hover {
  border-left:4px solid rgb(253,216,69);
  color: #000;
  font-weight: bold;
}
.li-head {
  border-radius: 4px 4px 0 0;
  font-size: 17px;
  font-weight: bold;
  padding: 10px 0 0 10px;
  color: rgb(40,40,40);
  /* border-bottom: 1px solid #ccc; */
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
.bdmap {
  /*width: 87%;*/
  width: calc(100% - 200px);
  height: calc(100% - 50px);
  /* height: 100%; */
  padding: 10px 10px 10px 5px;
  float: left;
  position: relative;
}
#allmap {
  border-radius: 4px;
  width: calc(100% - 15px);
	height: calc(100% - 20px);
	margin: 0;
	position: absolute;
  border: 2px solid #eee;
}
.winchild1 {
  position: absolute;
  left: 14%;
  top: calc(50% - 200px);
  z-index: 1;
  background-color: rgba(255,255,255,0.9);
  padding: 12px 16px;
  border-radius: 4px;
  width: 73%;
  box-shadow: 0 0 2px 1px #ddd;
}
.winchild1 .state-detail {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}
.winchild1 .state-detail .term-state {
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color: black;
}
.winchild1 .state-detail .view-detail {
  font-size: 15px;
  font-weight: bold;
  text-align: right;
}
.winchild1 .air-type .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 15px;
  color: #999;
}
.winchild1 .air-type .el-col span {
  font-size: 12px;
}
.winchild1 .air-value .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 18px;
  color: black;
}
.winchild1 .other-item .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 15px;
  color:#999;
}
.winchild1 .other-item .el-col span {
  font-size: 12px;
}
.winchild1 .other-value .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 18px;
  color: black;
}
.el-col a {
  color: white;
  background-color: #ffdf4f;
  padding: 6px 6px 6px 12px;
  text-decoration: none;
  border-radius: 4px;
}
.el-col a:hover {
  background-color: #ffef6f;
}
#main {
  width: 73%;
  height: 40%;
  position: absolute;
  top: 50%;
  left: 14%;
  padding: 12px 12px;
  z-index: 1;
  background-color: rgba(255,255,255,0.9);
  border-radius: 4px;
  box-shadow: 0 0 2px 1px #ddd;
}
.win-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
.air-indicator {
  position: absolute;
  bottom: 10px;
  left: 5px;
  z-index: 0;
  background-color: white;
  padding: 3px 3px 0 3px;
  border-radius: 4px;
  box-shadow: 0 0 2px 1px #ddd;
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
