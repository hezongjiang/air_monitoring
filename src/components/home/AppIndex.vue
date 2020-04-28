<!--首页-->
<template>
  <div class="container">
    <div class="navleft">
      <ul>
        <li class="li-head">站点</li>
        <li :class="{active: termInfo.macAddress === '440604:009:AAJ'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:009:AAJ')">龙湾大桥</a></li>
        <li :class="{active: termInfo.macAddress === '440604:002:AAC'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:002:AAC')">罗南村委</a></li>
        <li :class="{active: termInfo.macAddress === '440604:000:AAA'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:000:AAA')">绿岛湖</a></li>
        <li :class="{active: termInfo.macAddress === '440604:006:AAG'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:006:AAG')">龙津老年活动中心</a></li>
        <li :class="{active: termInfo.macAddress === '440604:007:AAH'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:007:AAH')">南庄三中</a></li>
        <li :class="{active: termInfo.macAddress === '440604:004:AAE'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:004:AAE')">吉利小学</a></li>
        <li :class="{active: termInfo.macAddress === '440604:005:AAF'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:005:AAF')">罗格村委</a></li>
        <li :class="{active: termInfo.macAddress === '440604:008:AAI'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:008:AAI')">吉利社区</a></li>
        <li :class="{active: termInfo.macAddress === '440604:001:AAB'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:001:AAB')">南庄实验中学</a></li>
        <li :class="{active: termInfo.macAddress === '440604:003:AAD'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:003:AAD')">南庄水利所</a></li>
        <li :class="{active: termInfo.macAddress === '440604:010:AAK'}"><a href="javascript:void(0)" v-on:click="focusInfo('440604:010:AAK')">南庄污水处理厂</a></li>
      </ul>
    </div>
    <div class="bdmap">
      <div id="allmap"></div>
      <div class="winchild1" :style="{visibility: viewInfo, top: winchildTop}">
        <el-row class="state-detail" type="flex" align="bottom">
          <el-col :span="18" class="term-state">{{ termInfo.remark }}<span :style="{color:(termState === '在线' ? '#11aa11' : '#999' )}" style="font-size:13px;color:green;font-weight:normal">&nbsp;&nbsp;{{ termState }}</span></el-col>
          <el-col :span="6" class="view-detail"><router-link to="/detail" style="text-decoration: none; color: blue">查看详情</router-link></el-col>
        </el-row>
        <el-row class="air-type" type="flex" align="bottom" style="padding-top:14px">
          <el-col :span="6">SO<span>2&nbsp;μg/m3</span></el-col>
          <el-col :span="6">NO<span>2&nbsp;μg/m3</span></el-col>
          <el-col :span="6">PM10<span>&nbsp;μg/m3</span></el-col>
          <el-col :span="6">PM2.5<span>&nbsp;μg/m3</span></el-col>
        </el-row>
        <el-row class="air-value" type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="6" :style="{color:colorSO2}">{{ parseFloat(airInfo.SO2).toFixed(2) }}</el-col>
          <el-col :span="6" :style="{color:colorNO2}">{{ parseFloat(airInfo.NO2).toFixed(2) }}</el-col>
          <el-col :span="6" :style="{color:colorPM10}">{{ parseFloat(airInfo.PM10).toFixed(2) }}</el-col>
          <el-col :span="6" :style="{color:colorPM25}">{{ parseFloat(airInfo.PM25).toFixed(2) }}</el-col>
        </el-row>
        <el-row class="other-item" type="flex" align="bottom" style="padding-top:14px">
          <el-col :span="6">温度<span>&nbsp;℃</span></el-col>
          <el-col :span="6">湿度<span>&nbsp;%R.H.</span></el-col>
          <el-col :span="6">风速<span>&nbsp;m/s</span></el-col>
          <el-col :span="6">风向</el-col>
        </el-row>
        <el-row class="other-value" type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="6">{{ airInfo.temp }}</el-col>
          <el-col :span="6">{{ airInfo.humidity }}</el-col>
          <el-col :span="6">{{ airInfo.speed }}<span style="font-size:12px;color:#999">&nbsp;&nbsp;{{ windSpe }}</span></el-col>
          <el-col :span="6">{{ airInfo.direct }}<span style="font-size:12px;color:#999">&nbsp;&nbsp;{{ windDir }}</span></el-col>
        </el-row>
      </div>
      <div class="winchild2" :style="{visibility: viewInfo}">
        <el-row class="info1" type="flex" align="bottom">
          <el-col :span="6">经度</el-col>
          <el-col :span="6" :offset="6">纬度</el-col>
          <el-col :span="6" style="text-align:right;font-size:13px;color:black">{{ parseInt(termInfo.batteryInfo) }}%&nbsp;<i :class="batteryIcon" aria-hidden="true" style="font-size:15px"></i></el-col>
        </el-row>
        <el-row class="info1-value" type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="12">{{ parseFloat(termInfo.lon/100).toFixed(6) }}</el-col>
          <el-col :span="12">{{ parseFloat(termInfo.lat/100).toFixed(6) }}</el-col>
        </el-row>
        <el-row class="info2" type="flex" align="bottom" style="padding-top:10px">
          <el-col :span="12">设备编号</el-col>
          <el-col :span="12">固件版本</el-col>
        </el-row>
        <el-row class="info2-value" type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="12">{{ termInfo.macAddress }}</el-col>
          <el-col :span="12">{{ termInfo.version }}</el-col>
        </el-row>
      </div>
      <div id="main" :style="{visibility: viewInfo}"></div>
      <div class="loading-background" :style="{visibility: viewLoading}"></div>
      <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      <div class="win-close-btn" :style="{visibility: viewInfo}"><el-button size="mini" type="danger" plain @click="closeSuspend">关闭悬浮窗口</el-button></div>
      <div class="air-indicator" :style="{visibility: viewInfo}">
        <img src="@/assets/airIndicator.png" width="160" height="88" alt="气体浓度指示图">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppIndex',
  data () {
    return {
      siteMark: { // mac地址与站点名称的对应关系
        '440604:009:AAJ': '龙湾大桥',
        '440604:002:AAC': '罗南村委',
        '440604:000:AAA': '绿岛湖',
        '440604:006:AAG': '龙津老年活动中心',
        '440604:007:AAH': '南庄三中',
        '440604:004:AAE': '吉利小学',
        '440604:005:AAF': '罗格村委',
        '440604:008:AAI': '吉利社区',
        '440604:001:AAB': '南庄实验中学',
        '440604:003:AAD': '南庄水利所',
        '440604:010:AAK': '南庄污水处理厂'
      },
      map: '',
      termInfo: {
        macAddress: '未知',
        remark: '未知',
        lon: 0,
        lat: 0,
        batteryInfo: 0,
        version: '未知'
      }, // 终端信息
      termState: '', //终端状态
      batteryIcon: '', // 电池图标
      airInfo: '', // 气体信息
      windSpe: '', // 风速
      windDir: '', // 风向
      colorSO2: 'black',
      colorNO2: 'black',
      colorPM10: 'black',
      colorPM25: 'black',
      charts: '',
      // 气体曲线图数据
      chartSO2: [],
      chartNO2: [],
      chartPM10: [],
      chartPM25: [],
      chartX: [],
      viewInfo: 'hidden', // 气泡弹窗可见与否，默认为否
      viewLoading: 'hidden',
      winchildTop: '17%'
    }
  },
  methods: {
    focusInfo: function (addr) { // 展示选定站点的信息
      let that = this
      var d=new Date()
      this.termInfo.macAddress = addr
      this.viewLoading='visible'
      this.$axios
      .all([this.$axios.get('/'+addr+'/macAirDeviceInfo'), // 获取选定站点的终端信息
            this.$axios.get('/macAirList'), // 获取所有站点的空气信息
            this.$axios.get('/macAirHourHistory',{ // 获取选定站点在一定日期范围内的气体信息
              params: {
                macAddress: addr,
                beginTime: this.$moment().subtract(1,'days').format("YYYY-M-D"), // 昨天
                endTime: this.$moment().format("YYYY-M-D") // 当天
              }
            })
      ])
      .then(this.$axios.spread(function (madi, mal, mahh) {
        console.log(madi) // 得到选定站点的终端信息
        if(madi.data.successful && madi.data.data.length) {
          that.termInfo = madi.data.data[0]
          var point = new BMap.Point(that.termInfo.lon/100,that.termInfo.lat/100)
          that.map.centerAndZoom(point, 16)  //设置地图中心点坐标和地图级别
          switch(parseInt(that.termInfo.batteryInfo/10)) { // 根据电池电量值选择不同的电池图标
            case 0: that.batteryIcon="fa fa-battery-0"
            break
            case 1:
            case 2:
            case 3: that.batteryIcon="fa fa-battery-1"
            break
            case 4:
            case 5: that.batteryIcon="fa fa-battery-2"
            break
            case 6:
            case 7:
            case 8: that.batteryIcon="fa fa-battery-3"
            break
            case 9:
            case 10: that.batteryIcon="fa fa-battery"
            break
          }
          console.log(mal) // 得到所有站点的空气信息
          for(var i=0;i<mal.data.data.length;i++) { // 循环检索选定站点的空气信息
            if(mal.data.data[i].macAddress === that.siteMark[addr]) { //判断是否找到了选定的站点
              that.airInfo = mal.data.data[i]
              that.termState = '在线'
              // 根据风速值选择不同强度的风
              if(that.airInfo.speed >= 10) { that.windSpe = '强风' }
              else if(that.airInfo.speed >= 6) { that.windSpe = '和风' }
              else if(that.airInfo.speed > 0) { that.windSpe = '微风' }
              else { that.windSpe = '无风' }
              // 根据风向值选择不同的风向
              if(that.airInfo.direct >= 348) { that.windDir = '北风' }
              else if(that.airInfo.direct >= 282) { that.windDir = '西北风' }
              else if(that.airInfo.direct >= 258) { that.windDir = '西风' }
              else if(that.airInfo.direct >= 192) { that.windDir = '西南风' }
              else if(that.airInfo.direct >= 168) { that.windDir = '南风' }
              else if(that.airInfo.direct >= 102) { that.windDir = '东南风' }
              else if(that.airInfo.direct >= 78) { that.windDir = '东风' }
              else if(that.airInfo.direct >= 12) { that.windDir = '东北风' }
              else { that.windDir = '北风' }
              // 根据气体值选择不同的颜色
              that.setColorSO2(that.airInfo.SO2)
              that.setColorNO2(that.airInfo.NO2)
              that.setColorPM10(that.airInfo.PM10)
              that.setColorPM25(that.airInfo.PM25)
              break // 一旦找到了选定的站点则跳出循环
            }
          }
          if(i == mal.data.data.length) { // 如果循环结束了还没找到选定的站点，则初始化相关信息
            that.termState = '离线'
            that.airInfo = {
              SO2: 0,
              NO2: 0,
              PM10: 0,
              PM25: 0,
              temp: 0,
              humidity: 0,
              speed: 0,
              direct: 0
            }
            that.windSpe = ''
            that.windDir = ''
            that.colorSO2 = 'black'
            that.colorNO2 = 'black'
            that.colorPM10 = 'black'
            that.colorPM25 = 'black'
          }
          console.log(mahh) // 得到选定站点在一定日期范围内的气体信息
          if(mahh.data.successful) {
            for(var i=0, beginH=d.getHours()+1 ;i<24;i++) { // 只取最近24小时的气体信息
              that.chartSO2[i]=mahh.data.data[mahh.data.data.length-24+i].SO2
              that.chartNO2[i]=mahh.data.data[mahh.data.data.length-24+i].NO2
              that.chartPM10[i]=mahh.data.data[mahh.data.data.length-24+i].PM10
              that.chartPM25[i]=mahh.data.data[mahh.data.data.length-24+i].PM25
              // 设置横轴数据
              that.chartX[i]=beginH+i
              if( that.chartX[i] >23 ) { that.chartX[i] -= 24 }
              if( that.chartX[i] === 0) { that.chartX[i] = d.getDate()+'日' }
            }
            console.log(that.chartX)
          }
          else { // 如果选定站点在一定日期范围内的气体信息的请求失败，则初始化相关信息
            that.chartSO2=[]
            that.chartNO2=[]
            that.chartPM10=[]
            that.chartPM25=[]
          }
        }
        else { // 如果选定站点的终端信息请求失败，则初始化相关信息
          that.termState = '离线'
          that.airInfo = {
            SO2: 0,
            NO2: 0,
            PM10: 0,
            PM25: 0,
            temp: 0,
            humidity: 0,
            speed: 0,
            direct: 0
          }
          that.windSpe = ''
          that.windDir = ''
          that.colorSO2 = 'black'
          that.colorNO2 = 'black'
          that.colorPM10 = 'black'
          that.colorPM25 = 'black'
          that.chartSO2 = []
          that.chartNO2 = []
          that.chartPM10 = []
          that.chartPM25 = []
          that.termInfo = {
            macAddress: addr,
            remark: '未知',
            lon: 0,
            lat: 0,
            batteryInfo: 0,
            version: '未知'
          }, // 终端信息
          that.batteryIcon = ''
        }
        that.charts.setOption({ // 作24小时气体实时曲线图
          title: {
            text: '24小时气体实时曲线',
            textStyle:{ color: 'black' },
            padding: [16,0,0,8]
          },
          tooltip: {
            show: true
          },
          legend: {
            top: 15,
            right: 10,
            data: ['SO2', 'NO2', 'PM10', 'PM2.5']
          },
          grid: {
            top: '70px',
            left: '40px',
            right: '20px',
            bottom: '42px'
          },
          xAxis: {
            name: '时间（时）',
            nameLocation: 'middle',
            nameTextStyle: { padding: [10,0,0,0] },
            type: 'category',
            boundaryGap: false,
            data: that.chartX,
            axisLabel: { fontSize: 11, interval: 0 }
          },
          yAxis: {
            name: '浓度（μg/m³）',
            nameTextStyle: { padding: [0,0,0,20] },
            type: 'value',
            axisLabel: { fontSize: 11 }
          },
          series: [{
            name: 'SO2',
            data: that.chartSO2,
            type: 'line',
            smooth: true
          },
          {
            name: 'NO2',
            data: that.chartNO2,
            type: 'line',
            smooth: true
          },
          {
            name: 'PM10',
            data: that.chartPM10,
            type: 'line',
            smooth: true
          },
          {
            name: 'PM2.5',
            data: that.chartPM25,
            type: 'line',
            smooth: true
          }]
        })
        that.viewInfo = 'visible'
        that.viewLoading='hidden'
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
    // 地图上的每个站点的标记点击事件
    focusInfo1: function () { this.focusInfo('440604:009:AAJ') },
    focusInfo2: function () { this.focusInfo('440604:002:AAC') },
    focusInfo3: function () { this.focusInfo('440604:000:AAA') },
    focusInfo4: function () { this.focusInfo('440604:006:AAG') },
    focusInfo5: function () { this.focusInfo('440604:007:AAH') },
    focusInfo6: function () { this.focusInfo('440604:004:AAE') },
    focusInfo7: function () { this.focusInfo('440604:005:AAF') },
    focusInfo8: function () { this.focusInfo('440604:008:AAI') },
    focusInfo9: function () { this.focusInfo('440604:001:AAB') },
    focusInfo10: function () { this.focusInfo('440604:003:AAD') },
    focusInfo11: function () { this.focusInfo('440604:010:AAK') },
    // 根据气体值选择不同的颜色
    setColorSO2: function (x) { this.colorSO2 = this.setColorAir(x) },
    setColorNO2: function (x) { this.colorNO2 = this.setColorAir(x) },
    setColorPM10: function (x) { this.colorPM10 = this.setColorAir(x) },
    setColorPM25: function (x) { this.colorPM25 = this.setColorAir(x) },
    setColorAir: function (x) {
      if(x>=251) return '#8c0000'
      else if(x>=151) return '#993366'
      else if(x>=101) return '#ff2f2f'
      else if(x>=61) return '#ff9600'
      else if(x>=31) return '#ffdf4f'
      else return '#7fcf9f'
    },
    //关闭气泡弹窗
    closeSuspend: function () {
      this.viewInfo='hidden'
      this.termInfo.macAddress = ''
    }
  },
  created () {
    if(document.body.clientWidth<1028) {
      this.winchildTop="5%"
    }
    console.log(this.winchildTop)
  },
  mounted () {
    this.map = new BMap.Map("allmap") // 创建Map实例
    var point=new BMap.Point(113.02, 22.99)
    this.map.centerAndZoom(point, 14) // 设置地图中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    this.$axios
      .get('/macAirDeviceList') //获取所有站点的终端信息
      .then(response => {
        for(var i=0;i<response.data.data.length;i++)
        {
          console.log(response) // 得到所有站点的终端信息
          // 根据站点坐标设置地图标记
          var marker=new BMap.Marker(new BMap.Point(response.data.data[i].lon/100,response.data.data[i].lat/100))
          // 为地图标记设置站点名标签
          var label = new BMap.Label(response.data.data[i].remark,{offset:new BMap.Size(-10,-20)})
          marker.setLabel(label)
          switch(response.data.data[i].macAddress) // 为每个地图标记添加它所对应的站点的点击事件
          {
            case '440604:009:AAJ': marker.addEventListener("click",this.focusInfo1)
            break
            case '440604:002:AAC': marker.addEventListener("click",this.focusInfo2)
            break
            case '440604:000:AAA': marker.addEventListener("click",this.focusInfo3)
            break
            case '440604:006:AAG': marker.addEventListener("click",this.focusInfo4)
            break
            case '440604:007:AAH': marker.addEventListener("click",this.focusInfo5)
            break
            case '440604:004:AAE': marker.addEventListener("click",this.focusInfo6)
            break
            case '440604:005:AAF': marker.addEventListener("click",this.focusInfo7)
            break
            case '440604:008:AAI': marker.addEventListener("click",this.focusInfo8)
            break
            case '440604:001:AAB': marker.addEventListener("click",this.focusInfo9)
            break
            case '440604:003:AAD': marker.addEventListener("click",this.focusInfo10)
            break
            case '440604:010:AAK': marker.addEventListener("click",this.focusInfo11)
            break
          }
          this.map.addOverlay(marker) // 显示地图标记
        }
      })
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    this.charts = this.$echarts.init(document.getElementById('main')) // 创建charts实例
  }
}
</script>

<style scoped>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  position: absolute;
}
.navleft {
  width: 13%;
  float: left;
  padding:10px;
  /* height: 605px; */
  height: calc(100% - 50px);
  overflow-y: auto;
}
.navleft ul {
  background-color:white;
  border-radius: 6px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: center;
}
.navleft ul li {
  padding: 4px 0;
}
.navleft ul a {
  display: block;
  padding: 4px 0;
  font-size: 15px;
  color:#999;
  text-decoration: none;
}
.navleft ul a:hover {
  color:#666;
}
.navleft .active a {
  border-left:4px solid rgb(253,216,69);
  color:#000;
  font-weight: bold;
}
.li-head {
  font-size: 18px;
  font-weight: bolder;
  border-bottom: 1px solid #ccc;
}
.bdmap {
  width: 87%;
  height: calc(100% - 50px);
  /* height: 100%; */
  padding: 10px;
  float: left;
  position: relative;
}
#allmap {
  /* height: 585px; */
  border-radius: 6px;
  width: calc(100% - 20px);
	height: calc(100% - 20px);
  /* height: 100%; */
	/* overflow: hidden; */
	margin: 0;
	position: absolute;
}
.winchild1 {
  position: absolute;
  left: 14%;
  z-index: 1;
  background-color:white;
  padding: 12px 16px;
  border-radius: 6px;
  width: 34%;
}
.winchild1 .state-detail {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}
.winchild1 .state-detail .term-state {
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color:black;
}
.winchild1 .state-detail .view-detail {
  font-size: 13px;
  text-align: right;
}
.winchild1 .air-type .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 15px;
  color:#999;
}
.winchild1 .air-type .el-col span {
  font-size: 12px;
}
.winchild1 .air-value .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 18px;
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
  color:black;
}
.winchild2 {
  position: absolute;
  top: 49.2%;
  left: 14%;
  z-index: 1;
  background-color:white;
  padding: 12px 16px;
  border-radius: 6px;
  width:34%; 
}
.winchild2 .info1 .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 15px;
  color:#999;
}
.winchild2 .info1-value .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 18px;
  color:black;
}
.winchild2 .info2 .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 15px;
  color:#999;
}
.winchild2 .info2-value .el-col {
  font-weight: bold;
  text-align: left;
  font-size: 18px;
  color:black;
}
#main {
  width: 46%;
  height: 52.5%;
  position: absolute;
  top: 17%;
  left: 52%;
  z-index: 1;
  background-color:white;
  border-radius: 6px; 
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
  left: 10px;
  z-index: 1;
  background-color:white;
  padding: 3px 3px 0 3px;
}
.loading-background {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 604px;
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
