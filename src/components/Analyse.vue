<template>
<div class="container-main">
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
      <span :class="activeSign===1||activeSign===3?'':goneClass">站点</span>
      <el-select @input="contrastOrBattery" :class="activeSign===1||activeSign===3?'':goneClass" size="mini" v-model="termChoose" placeholder="请选择站点" style="width:150px">
        <el-option v-for="item in termOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span :class="activeSign===0||activeSign===1?'':goneClass">气体</span>
      <el-select :class="activeSign===0||activeSign===1?'':goneClass" size="mini" v-model="airChoose" placeholder="请选择气体" style="width:150px">
        <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="searchSth">查询</el-button>
      <el-button size="mini" style="float: right" @click="zoomChange($event)">切换缩放模式</el-button>
      <el-button size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
    </div>
    <div class="chart-area">
      <div id="multiSiteAirContrast" :style="{ visibility:(activeSign===0?'visible':'hidden'), height:chartHeight }"></div>
      <div id="adjustOriginAirContrast" :style="{ visibility:(activeSign===1?'visible':'hidden'), height:chartHeight }"></div>
      <div id="aqiAirChart" :style="{ visibility:(activeSign===2?'visible':'hidden'), height:chartHeight }"></div>
      <div id="termBatteryChart" :style="{ visibility:(activeSign===3?'visible':'hidden'), height:chartHeight }"></div>
      <div class="loading-background" :style="{visibility: viewLoading}"></div>
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
      airChart: '', // 校准气体数据图表
      airContrastChart: '', // 校准气体数据与原始气体数据对比的气体图表
      airAQIChart: '', // 空气AQI图表
      batteryChart: '', // 终端电量图表
      // chartX: [], // 横轴数据
      beginT: '', // 日期选择器上显示的开始日期
      endT: '', // 日期选择器上显示的结束日期
      beginTL: [], // 存储每个选项卡中的日期选择器上显示的开始日期
      endTL: [], // 存储每个选项卡中的日期选择器上显示的结束日期
      activeSign: 0, // 选项卡激活项
      goneClass: 'sth-gone', // 选项卡内容隐藏
      N: 1, // 默认显示昨天至当天的信息
      listMaah: [], // 存放要导出为excel文件的数据
      listMaahMoah: [], // 存放要导出为excel文件的数据
      listMdiaqi: [], // 存放要导出为excel文件的数据
      listBl: [], // 存放要导出为excel文件的数据
      // 各个站点的mac地址
      macAddrList: ['440604:000:AAA','440604:001:AAB','440604:002:AAC','440604:003:AAD','440604:004:AAE','440604:005:AAF','440604:006:AAG','440604:007:AAH','440604:008:AAI','440604:009:AAJ','440604:010:AAK'],
      maahData: {},
      moahData: {},
      blData: [],
      viewLoading: 'hidden',
      loadingSign: false,
      chartHeight: '100%',
      airChoose: 'SO2', // 气体选择器默认选定SO2
      airCL: [], // 不同选项卡所显示的选定气体
      airOptions: [{ // 校准气体数据曲线图的设置数据
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
      termChoose: '绿岛湖', // 站点选择器默认选定绿岛湖
      termCL: [], // 不同选项卡所显示的选定站点
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
          right: 0,
          data: ['绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
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
      optionAirContrast: { // 校准气体数据与原始气体数据对比的气体曲线图的设置数据
        tooltip: {
          show: true
        },
        dataZoom: { 
          type: 'inside',
          filterMode: 'none'
        },
        legend: {
          top: 10,
          right: 0,
          data: ['校准小时走势', '原始小时走势']
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
          name: '校准小时走势',
          data: [],
          type: 'line',
          smooth: true
        },
        {
          name: '原始小时走势',
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionAirAQI: { // 空气AQI曲线图的设置数据
        tooltip: {
          show: true
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
      optionBattery: { // 终端电量曲线图的设置数据
        tooltip: {
          show: true
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
      // this.chartX=[]
      if(this.activeSign == 0) { // 在第一个选项卡中点击的查询
        this.beginTL[0]=this.beginT
        this.endTL[0]=this.endT
        this.airCL[0]=this.airChoose
        // this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
        this.listMaah=[]
        // 判断结束日期是否为当天，当天和非当天的横轴数据有差异
        // if(new Date().getDate() == this.$moment(this.endT).format("D")) {
        //   var endH=new Date().getHours()
        //   for(var j=0;j<this.N;j++) {
        //     this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
        //     for(var i=1;i<24;i++) {
        //       this.chartX[24*j+i]=i
        //     }
        //   }
        //   this.chartX[24*j]=new Date().getDate()+'日'
        //   for(i=1;i<endH+1;i++) {
        //     this.chartX[24*j+i]=i
        //   }
        //   console.log(this.chartX)
        // }
        // // 结束日期为非当天
        // else {
        //   for(var j=0;j<this.N+1;j++) {
        //     this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
        //     for(var i=1;i<24;i++) {
        //       this.chartX[24*j+i]=i
        //     }
        //   }
        //   console.log(this.chartX)
        // }
        this.$axios.get('/macAllAirHour',{ // 获取校准气体数据
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            airType: this.airChoose
          }
        })
        .then( maah => {
          console.log(maah) // 得到校准气体数据
          if(maah.data.successful) {
            that.listMaah = maah.data.newData
            that.optionAir.xAxis.data = maah.data.data.time
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
          else { // 如果校准气体数据请求失败，则初始化相关信息
            for(let i=0;i<11;i++) {
              that.optionAir.series[i].data = []
            }
          }
          // 作图
          that.airChart.setOption(that.optionAir)
          that.viewLoading='hidden'
          that.loadingSign=true
        })
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
      }
      else if(this.activeSign == 1) { // 在第二个选项卡中点击的查询
        this.beginTL[1]=this.beginT
        this.endTL[1]=this.endT
        this.airCL[1]=this.airChoose
        // this.N=this.$moment(this.endT).diff(this.$moment(this.beginT),'days')
        this.listMaahMoah=[]
        // 判断结束日期是否为当天，当天和非当天的横轴数据有差异
        // if(new Date().getDate() == this.$moment(this.endT).format("D")) {
        //   var endH=new Date().getHours()
        //   for(var j=0;j<this.N;j++) {
        //     this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
        //     for(var i=1;i<24;i++) {
        //       this.chartX[24*j+i]=i
        //     }
        //   }
        //   this.chartX[24*j]=new Date().getDate()+'日'
        //   for(i=1;i<endH+1;i++) {
        //     this.chartX[24*j+i]=i
        //   }
        //   console.log(this.chartX)
        // }
        // // 结束日期为非当天
        // else {
        //   for(var j=0;j<this.N+1;j++) {
        //     this.chartX[24*j]=this.$moment(this.beginT).add(j,'days').format("D")+'日'
        //     for(var i=1;i<24;i++) {
        //       this.chartX[24*j+i]=i
        //     }
        //   }
        //   console.log(this.chartX)
        // }
        this.$axios
        .all([ // 获取校准气体数据和原始气体数据
          this.$axios.get('/macAllAirHour',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              airType: this.airChoose
            }
          }),
          this.$axios.get('/macOldAirHour',{
            params: {
              beginTime: this.beginT,
              endTime: this.endT,
              airType: this.airChoose
            }
          })
        ])
        .then(this.$axios.spread(function (maah,moah) {
          console.log(maah) // 得到校准气体数据
          console.log(moah) // 得到原始气体数据
          if(maah.data.successful&&moah.data.successful) {
            that.maahData = maah.data.data
            that.moahData = moah.data.data
            // 设置横轴数据
            that.optionAirContrast.xAxis.data = maah.data.data.time
            // 作图
            that.contrastMaahMoah()
            for(let i=0;i<maah.data.newData.length;i++) {
              that.listMaahMoah[i]=new Object()
              that.listMaahMoah[i].time=maah.data.data.time[i]
              that.listMaahMoah[i].air1=maah.data.data.air1[i]
              that.listMaahMoah[i].air2=moah.data.data.air1[i]
              that.listMaahMoah[i].air3=maah.data.data.air2[i]
              that.listMaahMoah[i].air4=moah.data.data.air2[i]
              that.listMaahMoah[i].air5=maah.data.data.air3[i]
              that.listMaahMoah[i].air6=moah.data.data.air3[i]
              that.listMaahMoah[i].air7=maah.data.data.air4[i]
              that.listMaahMoah[i].air8=moah.data.data.air4[i]
              that.listMaahMoah[i].air9=maah.data.data.air5[i]
              that.listMaahMoah[i].air10=moah.data.data.air5[i]
              that.listMaahMoah[i].air11=maah.data.data.air6[i]
              that.listMaahMoah[i].air12=moah.data.data.air6[i]
              that.listMaahMoah[i].air13=maah.data.data.air7[i]
              that.listMaahMoah[i].air14=moah.data.data.air7[i]
              that.listMaahMoah[i].air15=maah.data.data.air8[i]
              that.listMaahMoah[i].air16=moah.data.data.air8[i]
              that.listMaahMoah[i].air17=maah.data.data.air9[i]
              that.listMaahMoah[i].air18=moah.data.data.air9[i]
              that.listMaahMoah[i].air19=maah.data.data.air10[i]
              that.listMaahMoah[i].air20=moah.data.data.air10[i]
              that.listMaahMoah[i].air21=maah.data.data.air11[i]
              that.listMaahMoah[i].air22=moah.data.data.air11[i]
            }
          }
          else { // 如果校准气体数据请求失败，则初始化相关信息
            for(let i=0;i<2;i++) {
              that.optionAirContrast.series[i].data = []
            }
            that.maahData = {}
            that.moahData = {}
            // 作图
            that.airContrastChart.setOption(that.optionAirContrast)
          }
          if(that.loadingSign) {
            that.viewLoading='hidden'
          }
        }))
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
      }
      else if(this.activeSign == 2) { // 在第三个选项卡中点击的查询
        this.beginTL[2]=this.beginT
        this.endTL[2]=this.endT
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
          if(that.loadingSign) {
            that.viewLoading='hidden'
          }
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
      }
      else if(this.activeSign == 3) { // 在第四个选项卡中点击的查询
        this.beginTL[3]=this.beginT
        this.endTL[3]=this.endT
        this.termCL[1]=this.termChoose
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
          if(that.loadingSign) {
            that.viewLoading='hidden'
          }
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
      }
    },
    zoomChange: function (e) { // 图表缩放模式改变
      e.currentTarget.blur()
      switch(this.activeSign) { // 各个选项卡中的图表缩放模式互不影响
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
    chooseData:function (x) { // 选择要激活的选项卡的内容
      this.activeSign=x
      this.beginT=this.beginTL[x]
      this.endT=this.endTL[x]
      if(x==0) {
        this.airChoose=this.airCL[0]
      }
      else if(x==1) {
        this.airChoose=this.airCL[1]
        this.termChoose=this.termCL[0]
      }
      else if(x==3) {
        this.termChoose=this.termCL[1]
      }
    },
    contrastMaahMoah:function () {
      switch (this.termChoose) {
        case '绿岛湖':
          this.optionAirContrast.series[0].data = this.maahData.air1
          this.optionAirContrast.series[1].data = this.moahData.air1
          break
        case '南庄实验中学':
          this.optionAirContrast.series[0].data = this.maahData.air2
          this.optionAirContrast.series[1].data = this.moahData.air2
          break
        case '罗南村委':
          this.optionAirContrast.series[0].data = this.maahData.air3
          this.optionAirContrast.series[1].data = this.moahData.air3
          break
        case '南庄水利所':
          this.optionAirContrast.series[0].data = this.maahData.air4
          this.optionAirContrast.series[1].data = this.moahData.air4
          break
        case '吉利小学':
          this.optionAirContrast.series[0].data = this.maahData.air5
          this.optionAirContrast.series[1].data = this.moahData.air5
          break
        case '罗格村委':
          this.optionAirContrast.series[0].data = this.maahData.air6
          this.optionAirContrast.series[1].data = this.moahData.air6
          break
        case '龙津老年活动中心':
          this.optionAirContrast.series[0].data = this.maahData.air7
          this.optionAirContrast.series[1].data = this.moahData.air7
          break
        case '南庄三中':
          this.optionAirContrast.series[0].data = this.maahData.air8
          this.optionAirContrast.series[1].data = this.moahData.air8
          break
        case '吉利社区':
          this.optionAirContrast.series[0].data = this.maahData.air9
          this.optionAirContrast.series[1].data = this.moahData.air9
          break
        case '龙湾大桥':
          this.optionAirContrast.series[0].data = this.maahData.air10
          this.optionAirContrast.series[1].data = this.moahData.air10
          break
        case '污水处理厂':
          this.optionAirContrast.series[0].data = this.maahData.air11
          this.optionAirContrast.series[1].data = this.moahData.air11
          break
      }
      this.airContrastChart.setOption(this.optionAirContrast)
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
    contrastOrBattery:function () {
      if(this.activeSign===1) {
        this.contrastMaahMoah()
        this.termCL[0]=this.termChoose
      }
      else if(this.activeSign===3) {
        this.termBatteryInfo()
        this.termCL[1]=this.termChoose
      }
    },
    exportExcel:function (e) { // 导出excel文件
      e.currentTarget.blur()
      if(this.activeSign === 0) {
        let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11']
        let data = this.listMaah.map(v => filterVal.map(k => v[k]))
        let fileName = this.beginT + '至' + this.endT + this.airChoose + '数据分析'
        let [fileType, sheetName] = ['xlsx', '数据分析']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      }
      else if(this.activeSign === 1) {
        let th = ['监测时间', '绿岛湖（校准）', '绿岛湖（原始）', '南庄实验中学（校准）', '南庄实验中学（原始）', '罗南村委（校准）', '罗南村委（原始）', '南庄水利所（校准）', '南庄水利所（原始）', '吉利小学（校准）', '吉利小学（原始）', '罗格村委（校准）', '罗格村委（原始）', '龙津老年活动中心（校准）', '龙津老年活动中心（原始）', '南庄三中（校准）', '南庄三中（原始）', '吉利社区（校准）', '吉利社区（原始）', '龙湾大桥（校准）', '龙湾大桥（原始）', '污水处理厂（校准）', '污水处理厂（原始）']
        let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11', 'air12', 'air13', 'air14', 'air15', 'air16', 'air17', 'air18', 'air19', 'air20', 'air21', 'air22']
        let data = this.listMaahMoah.map(v => filterVal.map(k => v[k]))
        let fileName = this.beginT + '至' + this.endT + this.airChoose + '数据分析校准原始对比'
        let [fileType, sheetName] = ['xlsx', '数据分析校准原始对比']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      }
      else if(this.activeSign === 2) {
        let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        let filterVal = ['time', 'aqi1', 'aqi2', 'aqi3', 'aqi4', 'aqi5', 'aqi6', 'aqi7', 'aqi8', 'aqi9', 'aqi10', 'aqi11']
        let data = this.listMdiaqi.map(v => filterVal.map(k => v[k]))
        let fileName = this.beginT + '至' + this.endT + this.airChoose + '数据分析AQI气体分析'
        let [fileType, sheetName] = ['xlsx', '数据分析AQI气体分析']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      }
      else if(this.activeSign === 3) {
        let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        let filterVal = ['time', 'batt1', 'batt2', 'batt3', 'batt4', 'batt5', 'batt6', 'batt7', 'batt8', 'batt9', 'batt10', 'batt11']
        let data = this.listBl.map(v => filterVal.map(k => v[k]))
        let fileName = this.beginT + '至' + this.endT + this.airChoose + '数据分析终端电量'
        let [fileType, sheetName] = ['xlsx', '数据分析终端电量']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      }
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
    this.airChart = this.$echarts.init(document.getElementById('multiSiteAirContrast'))
    this.airContrastChart = this.$echarts.init(document.getElementById('adjustOriginAirContrast'))
    this.airAQIChart = this.$echarts.init(document.getElementById('aqiAirChart'))
    this.batteryChart = this.$echarts.init(document.getElementById('termBatteryChart'))
    // 设置默认开始日期和结束日期
    this.beginT = this.$moment().subtract(this.N,'days').format("YYYY-MM-DD")
    this.endT = this.$moment().format("YYYY-MM-DD")
    for(let i=0;i<4;i++) {
      this.beginTL[i]=this.beginT
      this.endTL[i]=this.endT
    }
    // 设置默认选定气体
    for(let i=0;i<2;i++) {
      this.airCL[i]=this.airChoose
    }
    for(let i=0;i<2;i++) {
      this.termCL[i]=this.termChoose
    }
    for(let i=3;i>=0;i--) {
      this.activeSign = i
      this.searchSth()
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
  padding: 10px 70px;
  position: absolute;
}
.tabtop {
  padding: 6px 0;
}
.tabtop a {
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
  /* height: 549px; */
  width: 100%;
  height: calc(100% - 85px);
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
.chart-area {
  position: relative;
  margin-top: 4px;
  /* height: 450px; */
  height: calc(100% - 60px);
}
#multiSiteAirContrast, #adjustOriginAirContrast, #aqiAirChart, #termBatteryChart {
  width: 100%;
  /* height: 468px; */
  position: absolute;
}
.loading-background {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 472px;
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
.sth-gone {
  display: none;
}
</style>
