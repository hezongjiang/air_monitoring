<template>
<div style="margin:10px 70px">
  <div class="tabtop">
    <a href="javascript:void(0)" :class="{active:activeSign==0}" @click="chooseData(0)">多站点气体数据对比</a>
    <a href="javascript:void(0)" :class="{active:activeSign==1}" @click="chooseData(1)">校准数据与原始数据对比</a>
    <a href="javascript:void(0)" :class="{active:activeSign==2}" @click="chooseData(2)">AQI气体曲线</a>
    <a href="javascript:void(0)" :class="{active:activeSign==3}" @click="chooseData(3)">终端电量曲线</a>
  </div>
  <div class="winmain">
    <div class="filter_title">
      <i class="fa fa-filter"></i><span>筛选条件</span>
    </div>
    <div class="filter_container">
      <span>时间</span>
      <el-date-picker
        type="date"
        v-model="beginT"
        placeholder="开始日期"
        size="mini"
        value-format="yyyy-MM-dd"
        style="width:150px"
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
        style="width:150px;margin-right:50px"
        :clearable="false"
        :editable="false">
      </el-date-picker>
      <span :class="activeSign===0||activeSign===1?'':goneClass">气体</span>
      <el-select :class="activeSign===0||activeSign===1?'':goneClass" size="mini" v-model="airChoose" placeholder="请选择气体" style="width:150px">
        <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" size="mini" v-on:click="searchSth">查询</el-button>
      <el-button size="mini" style="float: right" @click="zoomChange($event)">切换缩放模式</el-button>
      <el-button size="mini" style="float: right" @click="exportExcel" :class="activeSign===0?'':goneClass"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
    </div>
    <div style="position:relative;margin-top:4px">
      <div id="multiSiteAirContrast" :style="{ visibility:(activeSign===0?'visible':'hidden') }" style="width: 100%;height: 468px;position:absolute"></div>
      <div id="adjustOriginAirContrast" :style="{ visibility:(activeSign===1?'visible':'hidden') }" style="width: 100%;height: 468px;position:absolute"></div>
      <div id="aqiAirChart" :style="{ visibility:(activeSign===2?'visible':'hidden') }" style="width: 100%;height: 468px;position:absolute"></div>
      <div id="termBatteryChart" :style="{ visibility:(activeSign===3?'visible':'hidden') }" style="width: 100%;height: 468px;position:absolute"></div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'Analyse',
  data () {
    return {
      airChart: '',
      airContrastChart: '',
      airAQIChart: '',
      batteryChart: '',
      chartX: [],
      beginT: '',
      endT: '',
      beginTL: [],
      endTL: [],
      activeSign: 0,
      goneClass: 'sth-gone',
      N: 1,
      list: [],
      macAddrList: ['440604:000:AAA','440604:001:AAB','440604:002:AAC','440604:003:AAD','440604:004:AAE','440604:005:AAF','440604:006:AAG','440604:007:AAH','440604:008:AAI','440604:009:AAJ','440604:010:AAK'],
      airChoose: 'SO2',
      airCL: [],
      airOptions: [{
        value: 'SO2',
        label: 'SO2'
      },
      {
        value: 'NO2',
        label: 'NO2'
      },
      {
        value: 'PM10',
        label: 'PM10'
      },
      {
        value: 'PM25',
        label: 'PM2.5'
      }],
      optionAir: {
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
          data: ['绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        },
        grid: {
          left: '33px',
          right: '15px',
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
      optionAirContrast: {
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside',
          filterMode: 'none'
        },
        legend: {
          top: 0,
          left: 300,
          data: ['绿岛湖','绿岛湖-原始','南庄实验中学','南庄实验中学-原始','罗南村委','罗南村委-原始','南庄水利所','南庄水利所-原始','吉利小学','吉利小学-原始','罗格村委','罗格村委-原始','龙津老年活动中心','龙津老年活动中心-原始','南庄三中','南庄三中-原始','吉利社区','吉利社区-原始','龙湾大桥','龙湾大桥-原始','污水处理厂','污水处理厂-原始']
        },
        grid: {
          left: '33px',
          right: '15px',
          bottom: '40px',
          top: '66px'
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
        },
        {
          name: '绿岛湖-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '南庄实验中学-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '罗南村委-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '南庄水利所-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '吉利小学-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '罗格村委-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '龙津老年活动中心-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '南庄三中-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '吉利社区-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '龙湾大桥-原始',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '污水处理厂-原始',
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionAirAQI: {
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
      optionBattery: {
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
          name: '电量（%）',
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
      }
    }
  },
  methods: {
    searchSth: function () {
      let that = this
      this.chartX=[]
      if(this.activeSign == 0) {
        this.beginTL[0]=this.beginT
        this.endTL[0]=this.endT
        this.airCL[0]=this.airChoose
        this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
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
        else {
          for(var j=0;j<this.N+1;j++) {
            this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
            for(var i=1;i<24;i++) {
              this.chartX[24*j+i]=i
            }
          }
          console.log(this.chartX)
        }
        this.$axios.get('/device/macAllAirHour',{
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            airType: this.airChoose
          }
        })
        .then( maah => {
          console.log(maah)
          if(maah.data.successful) {
            that.list = maah.data.newData
            that.optionAir.series[0].data = maah.data.data.air1
            that.optionAir.series[1].data = maah.data.data.air2
            that.optionAir.series[2].data = maah.data.data.air3
            that.optionAir.series[3].data = maah.data.data.air4
            that.optionAir.series[4].data = maah.data.data.air5
            that.optionAir.series[5].data = maah.data.data.air6
            that.optionAir.series[6].data = maah.data.data.air7
            that.optionAir.series[7].data = maah.data.data.air8
            that.optionAir.series[8].data = maah.data.data.air9
            that.optionAir.series[9].data = maah.data.data.air10
            that.optionAir.series[10].data = maah.data.data.air11
          }
          else {
            that.list = []
            for(var i=0;i<11;i++) {
              that.optionAir.series[i].data = []
            }
          }
          that.optionAir.xAxis.data=that.chartX
          that.airChart.setOption(that.optionAir)
        })
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
      }
      else if(this.activeSign == 1) {
        this.beginTL[1]=this.beginT
        this.endTL[1]=this.endT
        this.airCL[1]=this.airChoose
        this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
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
        else {
          for(var j=0;j<this.N+1;j++) {
            this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
            for(var i=1;i<24;i++) {
              this.chartX[24*j+i]=i
            }
          }
          console.log(this.chartX)
        }
        this.$axios
        .all([
          this.$axios.get('/device/macAllAirHour',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              airType: this.airChoose
            }
          }),
          this.$axios.get('/device/macOldAirHour',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              airType: this.airChoose
            }
          })
        ])
        .then(this.$axios.spread(function (maah,moah) {
          console.log(maah)
          that.optionAirContrast.series[0].data = maah.data.data.air1
          that.optionAirContrast.series[1].data = maah.data.data.air2
          that.optionAirContrast.series[2].data = maah.data.data.air3
          that.optionAirContrast.series[3].data = maah.data.data.air4
          that.optionAirContrast.series[4].data = maah.data.data.air5
          that.optionAirContrast.series[5].data = maah.data.data.air6
          that.optionAirContrast.series[6].data = maah.data.data.air7
          that.optionAirContrast.series[7].data = maah.data.data.air8
          that.optionAirContrast.series[8].data = maah.data.data.air9
          that.optionAirContrast.series[9].data = maah.data.data.air10
          that.optionAirContrast.series[10].data = maah.data.data.air11
          console.log(moah)
          that.optionAirContrast.series[11].data = moah.data.data.air1
          that.optionAirContrast.series[12].data = moah.data.data.air2
          that.optionAirContrast.series[13].data = moah.data.data.air3
          that.optionAirContrast.series[14].data = moah.data.data.air4
          that.optionAirContrast.series[15].data = moah.data.data.air5
          that.optionAirContrast.series[16].data = moah.data.data.air6
          that.optionAirContrast.series[17].data = moah.data.data.air7
          that.optionAirContrast.series[18].data = moah.data.data.air8
          that.optionAirContrast.series[19].data = moah.data.data.air9
          that.optionAirContrast.series[20].data = moah.data.data.air10
          that.optionAirContrast.series[21].data = moah.data.data.air11
          that.optionAirContrast.xAxis.data = that.chartX
          that.airContrastChart.setOption(that.optionAirContrast)
        }))
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
      }
      else if(this.activeSign == 2) {
        this.beginTL[2]=this.beginT
        this.endTL[2]=this.endT
        this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
        for(var i=this.N;i>=0;i--) {
          that.optionAirAQI.xAxis.data[this.N-i] = this.$moment().subtract(i,'days').format('YYYY-MM-DD')
        }
        this.$axios
        .all([
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[0],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[1],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[2],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[3],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[4],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[5],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[6],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[7],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[8],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[9],
              beginTime: this.beginT,
              endTime: this.endT
            }
          }),
          this.$axios.get('/device/macDayIAQI',{
            params: {
              macAddress: this.macAddrList[10],
              beginTime: this.beginT,
              endTime: this.endT
            }
          })
        ])
        .then( this.$axios.spread(function (mdiaqi1,mdiaqi2,mdiaqi3,mdiaqi4,mdiaqi5,mdiaqi6,mdiaqi7,mdiaqi8,mdiaqi9,mdiaqi10,mdiaqi11) {
          if(mdiaqi1.data.successful) { that.optionAirAQI.series[0].data = mdiaqi1.data.data.IAQI }
          else { that.optionAirAQI.series[0].data = [] }
          if(mdiaqi2.data.successful) { that.optionAirAQI.series[1].data = mdiaqi2.data.data.IAQI }
          else { that.optionAirAQI.series[1].data = [] }
          if(mdiaqi3.data.successful) { that.optionAirAQI.series[2].data = mdiaqi3.data.data.IAQI }
          else { that.optionAirAQI.series[2].data = [] }
          if(mdiaqi4.data.successful) { that.optionAirAQI.series[3].data = mdiaqi4.data.data.IAQI }
          else { that.optionAirAQI.series[3].data = [] }
          if(mdiaqi5.data.successful) { that.optionAirAQI.series[4].data = mdiaqi5.data.data.IAQI }
          else { that.optionAirAQI.series[4].data = [] }
          if(mdiaqi6.data.successful) { that.optionAirAQI.series[5].data = mdiaqi6.data.data.IAQI }
          else { that.optionAirAQI.series[5].data = [] }
          if(mdiaqi7.data.successful) { that.optionAirAQI.series[6].data = mdiaqi7.data.data.IAQI }
          else { that.optionAirAQI.series[6].data = [] }
          if(mdiaqi8.data.successful) { that.optionAirAQI.series[7].data = mdiaqi8.data.data.IAQI }
          else { that.optionAirAQI.series[7].data = [] }
          if(mdiaqi9.data.successful) { that.optionAirAQI.series[8].data = mdiaqi9.data.data.IAQI }
          else { that.optionAirAQI.series[8].data = [] }
          if(mdiaqi10.data.successful) { that.optionAirAQI.series[9].data = mdiaqi10.data.data.IAQI }
          else { that.optionAirAQI.series[9].data = [] }
          if(mdiaqi11.data.successful) { that.optionAirAQI.series[10].data = mdiaqi11.data.data.IAQI }
          else { that.optionAirAQI.series[10].data = [] }
          that.airAQIChart.setOption(that.optionAirAQI)
        }))
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
      }
      else if(this.activeSign == 3) {
        this.beginTL[3]=this.beginT
        this.endTL[3]=this.endT
        this.$axios
        .all([
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[0]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[1]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[2]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[3]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[4]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[5]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[6]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[7]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[8]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[9]
            }
          }),
          this.$axios.get('/device/batteryList',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              macAddress: this.macAddrList[10]
            }
          })
        ])
        .then( this.$axios.spread(function (bl1,bl2,bl3,bl4,bl5,bl6,bl7,bl8,bl9,bl10,bl11) {
          if(bl1.data.successful) {
            that.optionBattery.series[0].data = bl1.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl1.data.data.beginTime
          }
          else { that.optionBattery.series[0].data = [] }
          if(bl2.data.successful) {
            that.optionBattery.series[1].data = bl2.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl2.data.data.beginTime
          }
          else { that.optionBattery.series[1].data = [] }
          if(bl3.data.successful) {
            that.optionBattery.series[2].data = bl3.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl3.data.data.beginTime
          }
          else { that.optionBattery.series[2].data = [] }
          if(bl4.data.successful) {
            that.optionBattery.series[3].data = bl4.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl4.data.data.beginTime
          }
          else { that.optionBattery.series[3].data = [] }
          if(bl5.data.successful) {
            that.optionBattery.series[4].data = bl5.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl5.data.data.beginTime
          }
          else { that.optionBattery.series[4].data = [] }
          if(bl6.data.successful) {
            that.optionBattery.series[5].data = bl6.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl6.data.data.beginTime
          }
          else { that.optionBattery.series[5].data = [] }
          if(bl7.data.successful) {
            that.optionBattery.series[6].data = bl7.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl7.data.data.beginTime
          }
          else { that.optionBattery.series[6].data = [] }
          if(bl8.data.successful) {
            that.optionBattery.series[7].data = bl8.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl8.data.data.beginTime
          }
          else { that.optionBattery.series[7].data = [] }
          if(bl9.data.successful) {
            that.optionBattery.series[8].data = bl9.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl9.data.data.beginTime
          }
          else { that.optionBattery.series[8].data = [] }
          if(bl10.data.successful) {
            that.optionBattery.series[9].data = bl10.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl10.data.data.beginTime
          }
          else { that.optionBattery.series[9].data = [] }
          if(bl11.data.successful) {
            that.optionBattery.series[10].data = bl11.data.data.batteryInfo
            that.optionBattery.xAxis.data = bl11.data.data.beginTime
          }
          else { that.optionBattery.series[10].data = [] }
          that.batteryChart.setOption(that.optionBattery)
        }))
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
      }
    },
    zoomChange: function (e) {  
      e.currentTarget.blur()
      switch(this.activeSign) {
        case 0: if(this.optionAir.dataZoom.type=='inside') { this.optionAir.dataZoom.type='slider' }
                else { this.optionAir.dataZoom.type='inside' }
                this.airChart.clear()
                this.airChart.setOption(this.optionAir)
                break
        case 1: if(this.optionAirContrast.dataZoom.type=='inside') { this.optionAirContrast.dataZoom.type='slider' }
                  else { this.optionAirContrast.dataZoom.type='inside' }
                this.airContrastChart.clear()
                this.airContrastChart.setOption(this.optionAirContrast)
                break
        case 2: if(this.optionAirAQI.dataZoom.type=='inside') { this.optionAirAQI.dataZoom.type='slider' }
                  else { this.optionAirAQI.dataZoom.type='inside' }
                this.airAQIChart.clear()
                this.airAQIChart.setOption(this.optionAirAQI)
                break
        case 3: if(this.optionBattery.dataZoom.type=='inside') { this.optionBattery.dataZoom.type='slider' }
                  else { this.optionBattery.dataZoom.type='inside' }
                this.batteryChart.clear()
                this.batteryChart.setOption(this.optionBattery)
                break
      }
    },
    chooseData:function (x) {
      this.activeSign=x
      this.beginT=this.beginTL[x]
      this.endT=this.endTL[x]
      if(x==0||x==1) {
        this.airChoose=this.airCL[x]
      }
    },
    exportExcel() {
        const th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        const filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11']
        const data = this.list.map(v => filterVal.map(k => v[k]))
        const fileName = this.beginT + '至' + this.endT + this.airChoose + '数据分析'
        const [fileType, sheetName] = ['xlsx', '数据分析']
        this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted () {
    this.airChart = this.$echarts.init(document.getElementById('multiSiteAirContrast'))
    this.airContrastChart = this.$echarts.init(document.getElementById('adjustOriginAirContrast'))
    this.airAQIChart = this.$echarts.init(document.getElementById('aqiAirChart'))
    this.batteryChart = this.$echarts.init(document.getElementById('termBatteryChart'))
    this.beginT = this.$moment().subtract(this.N,'days').format("YYYY-MM-DD")
    this.endT = this.$moment().format("YYYY-MM-DD")
    for(var i=0;i<4;i++) {
      this.beginTL[i]=this.beginT
      this.endTL[i]=this.endT
    }
    for(i=0;i<2;i++) {
      this.airCL[i]=this.airChoose
    }
  }
}
</script>

<style scoped>
.tabtop {
  padding: 6px 0;
}
.tabtop a{
  text-decoration: none;
  color:#999;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 15px;
}
.tabtop a.active {
  background-color:white;
  font-weight: bold;
}
.tabtop a:hover {
  color:#666;
}
.winmain {
  margin-top: 5px;
  background: white;
  border-radius: 6px;
  padding: 10px 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  height: 529px;
}
.filter_title i {
  font-size: 25px;
  padding-right: 10px;
}
.filter_title span {
  font-weight: bold;
  font-size: 15px;
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
.sth-gone {
  display: none;
}
</style>
