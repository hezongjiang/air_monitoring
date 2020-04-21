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
    <div class="winmain">
      <div>
        <el-row type="flex" align="bottom">
          <el-col :span="14" class="term-name">{{ termInfo.remark }}</el-col>
          <el-col :span="10" class="back-home"><router-link to="/index"><i class="fa fa-reply" aria-hidden="true"></i>&nbsp;返回首页</router-link></el-col>
        </el-row>
      </div>
      <div class="term-info">
        <el-row type="flex" align="bottom">
          <el-col :span="6">设备状态&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color:(termState === '正常' ? '#11aa11' : '#aa1111' )}">{{ termState }}</span></el-col>
          <el-col :span="6">经度&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ parseFloat(termInfo.lon/100).toFixed(6) }}</span></el-col>
          <el-col :span="6">设备编号&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ termInfo.macAddress }}</span></el-col>
          <el-col :span="6">固件版本&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ termInfo.version }}</span></el-col>
        </el-row>
        <el-row type="flex" align="bottom">
          <el-col :span="6">设备电量&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ parseInt(termInfo.batteryInfo) }}%&nbsp;<i :class="batteryIcon" aria-hidden="true" style="font-size:15px"></i></span></el-col>
          <el-col :span="6">纬度&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ parseFloat(termInfo.lat/100).toFixed(6) }}</span></el-col>
          <el-col :span="6">设备备注名&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ termInfo.remark }}</span></el-col>
        </el-row>
      </div>
      <div class="chart-table">
        <a href="javascript:void(0)" :class="{active:activeSign==4}" v-on:click="chooseData(4)">详细数据</a>
        <a href="javascript:void(0)" :class="{active:activeSign==1}" v-on:click="chooseData(1)">气体浓度</a>
        <a href="javascript:void(0)" :class="{active:activeSign==2}" v-on:click="chooseData(2)">气温</a>
        <a href="javascript:void(0)" :class="{active:activeSign==3}" v-on:click="chooseData(3)" style="margin-right:60px">湿度</a>
        时间&nbsp;&nbsp;
        <el-date-picker
          type="date"
          v-model="newBeginT"
          placeholder="开始日期"
          size="mini"
          value-format="yyyy-MM-dd"
          style="width:150px"
          :editable="false"
          :clearable="false">
        </el-date-picker>
        ～
        <el-date-picker
          type="date"
          v-model="newEndT"
          placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
          style="width:150px"
          :editable="false"
          :clearable="false">
        </el-date-picker>
        &nbsp;&nbsp;
        <el-button type="primary" size="mini" @click="searchDate(termInfo.macAddress)"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button size="mini" @click="exportExcel($event)" :class="activeSign===4?'':goneClass" style="float:right"><i class="fa fa-download" aria-hidden="true"></i>&nbsp;导出Excel</el-button>
        <el-button size="mini" @click="zoomChange($event)" :class="activeSign==1||activeSign==2||activeSign==3?'':goneClass" style="float:right">切换缩放模式</el-button>
        <div class="container">
          <div id="concentration" :style="{ visibility:(activeSign===1?'visible':'hidden') }"></div>
          <div id="temperature" :style="{ visibility:(activeSign===2?'visible':'hidden') }"></div>
          <div id="humidity" :style="{ visibility:(activeSign===3?'visible':'hidden') }"></div>
          <el-table 
            :cell-style="{ padding:0, fontSize:'12px'}"
            :header-cell-style="{ padding:0, background:'#dddddd', fontSize:'13px'}"
            :style="{ visibility:(activeSign===4?'visible':'hidden') }"
            :data="list"
            stripe
            highlight-current-row
            border
            max-height="438px"
            tooltip-effect="dark">
            <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="100"></el-table-column>
            <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center"></el-table-column>
          </el-table>
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
      termInfo: { macAddress: ' ' }, // 终端信息
      termState: '', // 终端状态
      batteryIcon: '', // 电池图标
      activeSign: 4, // 选项卡激活项
      goneClass: 'sth-gone', // 选项卡内容隐藏
      airChart: '', // 气体图表
      tempChart: '', // 温度图表
      humidityChart: '', // 湿度图表
      chartX: [], // 横轴数据
      N: 2, // 默认显示前2天至当天的信息
      newBeginT: '', // 日期选择器上显示的开始日期
      newEndT: '', // 日期选择器上显示的结束日期
      beginT: '', // 实际选定了的开始日期
      endT: '', // 实际选定了的结束日期
      list: [], // 存放详细数据
      optionAir: { // 气体曲线图的设置数据
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside',
          filterMode: 'none'
        },
        legend: {
          top: 10,
          right: 10,
          data: ['SO2', 'NO2', 'PM10', 'PM2.5']
        },
        grid: {
          left: '35px',
          right: '11px',
          bottom: '40px',
          top: '40px'
        },
        xAxis: {
          name: '时间（时）',
          nameLocation: 'middle',
          nameTextStyle: { padding: [10,0,0,0] },
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          name: '浓度（μg/m³）',
          nameTextStyle: { padding: [0,0,0,20] },
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
        }]
      },
      optionTemp: { // 温度曲线图的设置数据
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside',
          filterMode: 'none'
        },
        grid: {
          left: '30px',
          right: '11px',
          bottom: '40px',
          top: '40px'
        },
        xAxis: {
          name: '时间（时）',
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
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionHumidity: { // 湿度曲线图的设置数据
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside',
          filterMode: 'none'
        },
        grid: {
          left: '30px',
          right: '11px',
          bottom: '40px',
          top: '40px'
        },
        xAxis: {
          name: '时间（时）',
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
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  methods: {
    focusInfo: function (addr) { // 展示选定站点的信息
      let that = this
      this.termInfo.macAddress = addr
      this.newBeginT=this.beginT
      this.newEndT=this.endT
      this.list=[]
      // 判断结束日期是否为当天，当天和非当天的横轴数据有差异
      if(new Date().getDate() == this.$moment(this.endT).format("D")) {
        var endH=new Date().getHours()
        for(var j=0;j<this.N;j++) {
          this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
          for(var i=1;i<24;i++) {
            this.chartX[24*j+i]=i
          }
        }
        this.chartX[24*j]=new Date().getDate()+'日'
        for(i=1;i<endH+1;i++) {
          this.chartX[24*j+i]=i
        }
        console.log(this.chartX)
      }
      this.$axios
      .all([this.$axios.get('/'+addr+'/macAirDeviceInfo'), // 获取选定站点的终端信息
            this.$axios.get('/macAirHourHistory',{ // 获取选定站点在一定日期范围内的气体信息
              params: {
                macAddress: addr,
                beginTime: this.beginT,
                endTime: this.endT
              }
            })
      ])
      .then(this.$axios.spread(function (madi, mahh) {
        console.log(madi) // 得到选定站点的终端信息
        if(madi.data.successful && madi.data.data.length) {
          that.termInfo = madi.data.data[0]
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
          console.log(mahh) // 得到选定站点在一定日期范围内的气体信息
          if(mahh.data.successful) {
            that.list=mahh.data.data
            for(var i=0;i<mahh.data.data.length;i++) {
              that.optionAir.series[0].data[i]=mahh.data.data[i].SO2
              that.optionAir.series[1].data[i]=mahh.data.data[i].NO2
              that.optionAir.series[2].data[i]=mahh.data.data[i].PM10
              that.optionAir.series[3].data[i]=mahh.data.data[i].PM25
              that.optionTemp.series[0].data[i]=mahh.data.data[i].temp
              that.optionHumidity.series[0].data[i]=mahh.data.data[i].humidity
            }
            that.termState = '正常'
          }
          else {  // 如果选定站点在一定日期范围内的气体信息的请求失败，则初始化相关信息
            that.termState='查询异常'
            that.optionAir.series[0].data=[]
            that.optionAir.series[1].data=[]
            that.optionAir.series[2].data=[]
            that.optionAir.series[3].data=[]
            that.optionTemp.series[0].data=[]
            that.optionHumidity.series[0].data=[]
            that.list=[]
          }
        }
        else { // 如果选定站点的终端信息请求失败，则初始化相关信息
          that.termInfo = { macAddress: addr }
          that.termState='设备异常'
          that.optionAir.series[0].data=[]
          that.optionAir.series[1].data=[]
          that.optionAir.series[2].data=[]
          that.optionAir.series[3].data=[]
          that.optionTemp.series[0].data=[]
          that.optionHumidity.series[0].data=[]
          that.list=[]
        }
        // 设置横轴数据，作曲线图
        that.optionAir.xAxis.data=that.chartX
        that.optionTemp.xAxis.data=that.chartX
        that.optionHumidity.xAxis.data=that.chartX
        that.airChart.setOption(that.optionAir)
        that.tempChart.setOption(that.optionTemp)
        that.humidityChart.setOption(that.optionHumidity)
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
    chooseData:function (x) { // 选择要激活的选项卡的内容
      this.activeSign=x
    },
    searchDate:function (x) { // 点击查询按钮后展示选定站点的信息
      this.beginT=this.newBeginT
      this.endT=this.newEndT
      // 初始化图表数据
      this.optionAir.series[0].data=[]
      this.optionAir.series[1].data=[]
      this.optionAir.series[2].data=[]
      this.optionAir.series[3].data=[]
      this.optionTemp.series[0].data=[]
      this.optionHumidity.series[0].data=[]
      this.chartX=[]
      this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
      // 判断结束日期是否为非当天，当天和非当天的横轴数据有差异
      if(!(new Date().getDate() == this.$moment(this.endT).format("D"))) {
        for(var j=0;j<this.N+1;j++) {
          this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
          for(var i=1;i<24;i++) {
            this.chartX[24*j+i]=i
          }
        }
        console.log(this.chartX)
      }
      this.focusInfo(x)
    },
    zoomChange: function (e) { // 图表缩放模式改变
      e.currentTarget.blur()
      if(this.optionAir.dataZoom.type=='inside') {
        this.optionAir.dataZoom.type='slider'
        this.optionTemp.dataZoom.type='slider'
        this.optionHumidity.dataZoom.type='slider'
      }
      else {
        this.optionAir.dataZoom.type='inside'
        this.optionTemp.dataZoom.type='inside'
        this.optionHumidity.dataZoom.type='inside'
      }
      this.airChart.clear()
      this.tempChart.clear()
      this.humidityChart.clear()
      this.airChart.setOption(this.optionAir)
      this.tempChart.setOption(this.optionTemp)
      this.humidityChart.setOption(this.optionHumidity)
    },
    exportExcel(e) { // 导出excel文件
      e.currentTarget.blur()
      const th = ['监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'speed', 'direct']
      const data = this.list.map(v => filterVal.map(k => v[k]))
      const fileName = this.beginT + '至' + this.endT + this.termInfo.remark + '详情'
      const [fileType, sheetName] = ['xlsx', '详情数据']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted () {
    // 创建charts实例
    this.airChart = this.$echarts.init(document.getElementById('concentration'))
    this.tempChart = this.$echarts.init(document.getElementById('temperature'))
    this.humidityChart = this.$echarts.init(document.getElementById('humidity'))
    // 设置默认开始日期和结束日期
    this.beginT=this.$moment().subtract(this.N,'days').format("YYYY-MM-DD")
    this.endT=this.$moment().format("YYYY-MM-DD")
    this.newBeginT=this.beginT
    this.newEndT=this.endT
    this.focusInfo('440604:009:AAJ')
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
.winmain {
  width: 87%;
  padding: 10px;
  float: left;
}
.el-col a {
  text-decoration: none;
  color:#999;
  padding:6px 16px 5px 10px;
  border-radius: 6px;
  font-weight: bold;
  background-color:white;
}
.el-row {
  padding:4px 0;
}
.el-row a:hover {
  color:#666;
}
.term-name {
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color:black;
}
.back-home {
  text-align: right;
  font-size: 13px;
  color:#999;
}
.sth-gone {
  display: none;
}
.term-info {
  background-color:white;
  padding: 3px 20px;
  margin-top: 6px;
  border-radius: 6px;
}
.term-info .el-col {
  text-align: left;
  font-size: 13px;
  font-weight: bold;
  color:#999;
}
.term-info .el-col span {
  color:black;
}
.chart-table {
  background-color:white;
  padding: 6px 20px;
  margin-top: 6px;
  font-size: 15px;
  border-radius: 6px;
  height: 485px;
}
.chart-table a {
  text-decoration: none;
  color:#999;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  background-color:#f4f4f4;
}
.chart-table a.active {
  background-color:#dddddd;  
}
.chart-table a:hover {
  color:#666;
}
.chart-table .container {
  position: relative;
  margin-top: 4px;
}
.chart-table .container div {
  width: 100%;
  height: 432px;
  position: absolute;
}
</style>
