<!--首页-->
<template>
  <div>
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
    <div class="bdmap" style="position:relative">
      <div id="allmap"></div>
      <div style="position:absolute;top:17%;left:14%;z-index:1;background-color:white;padding:12px 16px;border-radius:6px;width:34%" :style="{visibility: viewInfo}">
        <el-row type="flex" align="bottom" style="border-bottom:1px solid #ccc;padding-bottom:8px">
          <el-col :span="18"  class="grid" style="text-align:left;font-size:18px;font-weight:bold;color:black">{{ termInfo.remark }}<span :style="{color:(termState === '在线' ? '#11aa11' : '#999' )}" style="font-size:13px;color:green;font-weight:normal">&nbsp;&nbsp;{{ termState }}</span></el-col>
          <el-col :span="6" class="grid" style="font-size:13px;color:blue;text-align:right"><router-link to="/detail" style="text-decoration: none; color: blue">查看详情</router-link></el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:14px">
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">SO<span style="font-size:12px">2&nbsp;μg/m3</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">NO<span style="font-size:12px">2&nbsp;μg/m3</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">PM10<span style="font-size:12px">&nbsp;μg/m3</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">PM2.5<span style="font-size:12px">&nbsp;μg/m3</span></el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px" :style="{color:colorSO2}">{{ parseFloat(airInfo.SO2).toFixed(2) }}</el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px" :style="{color:colorNO2}">{{ parseFloat(airInfo.NO2).toFixed(2) }}</el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px" :style="{color:colorPM10}">{{ parseFloat(airInfo.PM10).toFixed(2) }}</el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px" :style="{color:colorPM25}">{{ parseFloat(airInfo.PM25).toFixed(2) }}</el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:14px">
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">温度<span style="font-size:12px">&nbsp;℃</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">湿度<span style="font-size:12px">&nbsp;%R.H.</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">风速<span style="font-size:12px">&nbsp;m/s</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">风向</el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ airInfo.temp }}</el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ airInfo.humidity }}</el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ airInfo.speed }}<span style="font-size:12px;color:#999">&nbsp;&nbsp;{{ windSpe }}</span></el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ airInfo.direct }}<span style="font-size:12px;color:#999">&nbsp;&nbsp;{{ windDir }}</span></el-col>
        </el-row>
      </div>
      <div style="position:absolute;top:49.2%;left:14%;z-index:1;background-color:white;padding:12px 16px;border-radius:6px;width:34%" :style="{visibility: viewInfo}">
        <el-row type="flex" align="bottom">
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">经度</el-col>
          <el-col :span="6" :offset="6" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">纬度</el-col>
          <el-col :span="6" class="grid" style="font-weight:bold;text-align:right;font-size:13px;color:black">{{ parseInt(termInfo.batteryInfo) }}%&nbsp;<i :class="batteryIcon" aria-hidden="true" style="font-size:15px"></i></el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="12" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ parseFloat(termInfo.lon/100).toFixed(6) }}</el-col>
          <el-col :span="12" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ parseFloat(termInfo.lat/100).toFixed(6) }}</el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:10px">
          <el-col :span="12" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">设备编号</el-col>
          <el-col :span="12" class="grid" style="font-weight:bold;text-align:left;font-size:15px;color:#999">固件版本</el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top:3px">
          <el-col :span="12" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ termInfo.macAddress }}</el-col>
          <el-col :span="12" class="grid" style="font-weight:bold;text-align:left;font-size:18px;color:black">{{ termInfo.version }}</el-col>
        </el-row>
      </div>
      <div id="main" style="width: 46%;height: 52.5%;position:absolute;top:17%;left:52%;z-index:1;background-color:white;border-radius:6px" :style="{visibility: viewInfo}"></div>
      <div style="position:absolute;top:10px;right:10px;z-index:1" :style="{visibility: viewInfo}"><el-button size="mini" type="danger" plain @click="closeSuspend">关闭悬浮窗口</el-button></div>
      <div style="position:absolute;bottom:10px;left:10px;z-index:1;background-color:white;padding:3px 3px 0 3px" :style="{visibility: viewInfo}">
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
      siteMark: {
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
      termInfo: { macAddress: ' ' },
      termState: '',
      batteryIcon: '',
      airInfo: '',
      windSpe: '',
      windDir: '',
      colorSO2: 'black',
      colorNO2: 'black',
      colorPM10: 'black',
      colorPM25: 'black',
      charts: '',
      chartSO2: [],
      chartNO2: [],
      chartPM10: [],
      chartPM25: [],
      chartX: [],
      viewInfo: 'hidden'
    }
  },
  methods: {
    focusInfo: function (addr) {
      let that = this
      var d=new Date()
      this.viewInfo = 'visible'
      this.termInfo.macAddress = addr
      this.$axios
      .all([this.$axios.get('/device/'+addr+'/macAirDeviceInfo'), 
            this.$axios.get('/device/macAirList'),
            this.$axios.get('/device/macAirHourHistory',{
              params: {
                macAddress: addr,
                beginTime: this.$moment().subtract(1,'days').format("YYYY-M-D"),
                endTime: this.$moment().format("YYYY-M-D")
              }
            })
      ])
      .then(this.$axios.spread(function (madi, mal, mahh) {
        console.log(madi)
        if(madi.data.successful && madi.data.data.length) {
          that.termInfo = madi.data.data[0]
          var point = new BMap.Point(that.termInfo.lon/100,that.termInfo.lat/100)
          that.map.centerAndZoom(point, 16)  //初始化地图,设置中心点坐标和地图级别
          switch(parseInt(that.termInfo.batteryInfo/10)) {
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
          console.log(mal)
          for(var i=0;i<mal.data.data.length;i++) {
            if(mal.data.data[i].macAddress === that.siteMark[addr]) {
              that.airInfo = mal.data.data[i]
              that.termState = '在线'
              if(that.airInfo.speed >= 10) { that.windSpe = '强风' }
              else if(that.airInfo.speed >= 6) { that.windSpe = '和风' }
              else if(that.airInfo.speed > 0) { that.windSpe = '微风' }
              else { that.windSpe = '无风' }
              if(that.airInfo.direct >= 348) { that.windDir = '北风' }
              else if(that.airInfo.direct >= 282) { that.windDir = '西北风' }
              else if(that.airInfo.direct >= 258) { that.windDir = '西风' }
              else if(that.airInfo.direct >= 192) { that.windDir = '西南风' }
              else if(that.airInfo.direct >= 168) { that.windDir = '南风' }
              else if(that.airInfo.direct >= 102) { that.windDir = '东南风' }
              else if(that.airInfo.direct >= 78) { that.windDir = '东风' }
              else if(that.airInfo.direct >= 12) { that.windDir = '东北风' }
              else { that.windDir = '北风' }
              that.setColorSO2(that.airInfo.SO2)
              that.setColorNO2(that.airInfo.NO2)
              that.setColorPM10(that.airInfo.PM10)
              that.setColorPM25(that.airInfo.PM25)
              break
            }
          }
          if(i == mal.data.data.length) {
            that.airInfo = ''
            that.termState = '离线'
            that.windSpe = ''
            that.windDir = ''
            that.colorSO2 = 'black'
            that.colorNO2 = 'black'
            that.colorPM10 = 'black'
            that.colorPM25 = 'black'
          }
          console.log(mahh)
          if(mahh.data.successful) {
            for(var i=0, beginH=d.getHours()+1 ;i<24;i++) {
              that.chartSO2[i]=mahh.data.data[mahh.data.data.length-24+i].SO2
              that.chartNO2[i]=mahh.data.data[mahh.data.data.length-24+i].NO2
              that.chartPM10[i]=mahh.data.data[mahh.data.data.length-24+i].PM10
              that.chartPM25[i]=mahh.data.data[mahh.data.data.length-24+i].PM25
              that.chartX[i]=beginH+i
              if( that.chartX[i] >23 ) { that.chartX[i] -= 24 }
              if( that.chartX[i] === 0) { that.chartX[i] = d.getDate()+'日' }
            }
            console.log(that.chartX)
          }
          else {
            that.chartSO2=[]
            that.chartNO2=[]
            that.chartPM10=[]
            that.chartPM25=[]
          }
        }
        else {
          that.termInfo = { macAddress: addr }
          that.termState = '离线'
          that.batteryIcon = ''
          that.airInfo = ''
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
        }
        that.charts.setOption({
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
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
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
    closeSuspend: function () {
      this.viewInfo='hidden'
      this.termInfo.macAddress = ''
    }
  },
  mounted () {
    this.map = new BMap.Map("allmap") // 创建Map实例
    var point=new BMap.Point(113.02, 22.99)
    this.map.centerAndZoom(point, 14) // 初始化地图,设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    this.$axios
      .get('/device/macAirDeviceList')
      .then(response => {
        for(var i=0;i<response.data.data.length;i++)
        {
          console.log(response)
          var marker=new BMap.Marker(new BMap.Point(response.data.data[i].lon/100,response.data.data[i].lat/100))
          var label = new BMap.Label(response.data.data[i].remark,{offset:new BMap.Size(-10,-20)})
          marker.setLabel(label)
          switch(response.data.data[i].macAddress)
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
          this.map.addOverlay(marker)
        }
      })
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    this.charts = this.$echarts.init(document.getElementById('main'))
  }
}
</script>

<style scoped>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.navleft {
  width: 13%;
  float: left;
  padding: 10px;
  height: 586px;
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
  padding: 10px;
  float: left;
}
#allmap {
  height: 585px;
  border-radius: 6px;
}
</style>
