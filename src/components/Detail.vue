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
        <el-row type="flex" align="bottom" style="padding:4px 0">
          <el-col :span="14" style="text-align:left;font-size:18px;font-weight:bold;color:black">{{ termInfo.remark }}</el-col>
          <el-col :span="10" style="text-align:right;font-size:13px;color:#999"><router-link to="/index" style="text-decoration: none;color:#999;background-color:white;padding:6px 16px 5px 10px;font-size:13px;border-radius: 6px"><i class="fa fa-reply" aria-hidden="true"></i>&nbsp;返回首页</router-link></el-col>
        </el-row>
      </div>
      <div style="background-color:white;padding:3px 20px;margin-top:6px;border-radius:6px">
        <el-row type="flex" align="bottom" style="padding:4px 0">
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">设备状态&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color:(termState === '正常' ? '#11aa11' : '#aa1111' )}">{{ termState }}</span></el-col>
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">经度&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black'>{{ parseFloat(termInfo.lon/100).toFixed(6) }}</span></el-col>
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">设备编号&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black'>{{ termInfo.macAddress }}</span></el-col>
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">固件版本&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black'>{{ termInfo.version }}</span></el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding:4px 0">
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">设备电量&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black'>{{ parseInt(termInfo.batteryInfo) }}%&nbsp;<i :class="batteryIcon" aria-hidden="true" style="font-size:15px"></i></span></el-col>
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">纬度&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black'>{{ parseFloat(termInfo.lat/100).toFixed(6) }}</span></el-col>
          <el-col :span="6" style="text-align:left;font-size:13px;font-weight:bold;color:#999">设备备注名&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black'>{{ termInfo.remark }}</span></el-col>
        </el-row>
      </div>
      <div style="background-color:white;padding:3px 20px;margin-top:6px;border-radius:6px;height:485px">
        <el-row type="flex" align="middle" style="padding:4px 0">
          <el-col :span="3" style="font-size:13px" :class="{active:activeSign==1}"><a href="javascript:void(0)" v-on:click="chooseData(1)">气体浓度</a></el-col>
          <el-col :span="2" style="font-size:13px" :class="{active:activeSign==2}"><a href="javascript:void(0)" v-on:click="chooseData(2)">气温</a></el-col>
          <el-col :span="2" style="font-size:13px" :class="{active:activeSign==3}"><a href="javascript:void(0)" v-on:click="chooseData(3)">湿度</a></el-col>
          <el-col :span="3" style="font-size:13px" :class="{active:activeSign==4}"><a href="javascript:void(0)" v-on:click="chooseData(4)">详细数据</a></el-col>
          <el-col :span="11" style="text-align:left;font-size:13px;color:#999">
            时间&nbsp;&nbsp;
            <el-date-picker
              type="date"
              v-model="newBeginT"
              placeholder="开始日期"
              size="mini"
              value-format="yyyy-MM-dd"
              style="width:150px">
            </el-date-picker>
            ～
            <el-date-picker
              type="date"
              v-model="newEndT"
              placeholder="结束日期"
              size="mini"
              value-format="yyyy-MM-dd"
              style="width:150px">
            </el-date-picker>
            &nbsp;&nbsp;
            <el-button type="primary" size="mini" @click="searchDate(termInfo.macAddress)"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
          </el-col>
          <el-col :span="3" style="text-align:right;font-size:13px;font-weight:bold;color:#999"><el-button id="xxButton" size="mini" @click="zoomChange($event)" :class="visibleSign==1||visibleSign==2||visibleSign==3?'':goneClass">切换缩放模式</el-button><el-button size="mini" @click="exportExcel" :class="visibleSign===4?'':goneClass"><i class="fa fa-download" aria-hidden="true"></i>&nbsp;导出Excel</el-button></el-col>
        </el-row>
        <div style="position:relative;margin-top:4px">
          <div id="concentration" :style="{ visibility:(visibleSign===1?'visible':'hidden') }" style="width: 100%;height: 432px;position:absolute"></div>
          <div id="temperature" :style="{ visibility:(visibleSign===2?'visible':'hidden') }" style="width: 100%;height: 432px;position:absolute"></div>
          <div id="humidity" :style="{ visibility:(visibleSign===3?'visible':'hidden') }" style="width: 100%;height: 432px;position:absolute"></div>
          <el-table 
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :cell-style="{ padding:0, fontSize:'12px'}"
            :header-cell-style="{ padding:0, background:'#dddddd', fontSize:'13px'}"
            :style="{ visibility:(visibleSign===4?'visible':'hidden') }"
            fit
            :data="list" border style="width:100%" ref="multipleTable" max-height="438px" tooltip-effect="dark">
            <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="100" sortable></el-table-column>
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
      termInfo: { macAddress: ' ' },
      termState: '',
      batteryIcon: '',
      activeSign: 1,
      visibleSign: 1,
      goneClass: 'sth-gone',
      airChart: '',
      tempChart: '',
      humidityChart: '',
      chartX: [],
      N: 2,
      newBeginT: '',
      newEndT: '',
      beginT: '',
      endT: '',
      list: [],
      optionAir: {
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside'
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
      optionTemp: {
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside'
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
      optionHumidity: {
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside'
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
    focusInfo: function (addr) {
      let that = this
      this.termInfo.macAddress = addr
      this.newBeginT=that.beginT
      this.newEndT=that.endT
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
      .all([this.$axios.get('/device/'+addr+'/macAirDeviceInfo'), 
            this.$axios.get('/device/macAirHourHistory',{
              params: {
                macAddress: addr,
                beginTime: this.beginT,
                endTime: this.endT
              }
            })
      ])
      .then(this.$axios.spread(function (madi, mahh) {
        console.log(madi)
        if(madi.data.successful && madi.data.data.length) {
          that.termInfo = madi.data.data[0]
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
          console.log(mahh)
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
          else {
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
        else {
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
    chooseData:function (x) {
      this.activeSign=x
      this.visibleSign=x
    },
    searchDate:function (x) {
      if(this.newBeginT && this.newEndT) {
        this.beginT=this.$moment(this.newBeginT).format("YYYY-MM-DD")
        this.endT=this.$moment(this.newEndT).format("YYYY-MM-DD")
        this.chartSO2=[]
        this.chartNO2=[]
        this.chartPM10=[]
        this.chartPM25=[]
        this.chartTemp=[]
        this.chartHumidity=[]
        this.chartX=[]
        this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
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
      }
      else {
        alert("请选择查询的起止日期")
      }
    },
    zoomChange: function (e) {  
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
    exportExcel() {
      const th = ['监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'speed', 'direct']
      const data = this.list.map(v => filterVal.map(k => v[k]))
      const fileName = this.beginT + '至' + this.endT + this.termInfo.remark + '详情'
      const [fileType, sheetName] = ['xlsx', '详情数据']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted () {
    this.airChart = this.$echarts.init(document.getElementById('concentration'))
    this.tempChart = this.$echarts.init(document.getElementById('temperature'))
    this.humidityChart = this.$echarts.init(document.getElementById('humidity'))
    this.beginT=this.$moment().subtract(this.N,'days').format("YYYY-MM-DD")
    this.endT=this.$moment().format("YYYY-MM-DD")
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
  padding: 6px 15px;
  border-radius: 12px;
}
.el-row .active a {
  background-color:#f2f2f2;
  font-weight: bold;
}
.el-row a:hover {
  color:#666;
}
.sth-gone {
  display: none;
}
</style>
