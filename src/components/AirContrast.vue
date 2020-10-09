<!--气体数据小时报表页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_title">
        <span>气体数据小时报表</span>
      </div>
      <!--筛选条件-->
      <div class="filter_container">
        <span>时间</span>
        <el-date-picker
          style="width:300px;margin-right:50px"
          size="mini"
          v-model="value1"
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
        <span>站点</span>
        <el-select size="mini" v-model="value2" placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>气体</span>
        <el-select size="mini" v-model="chartSign" placeholder="请选择气体">
          <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="getTable">查询</el-button>
        <el-button size="mini" style="float: right" @click="zoomChange($event)">切换缩放模式</el-button>
        <el-button size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <!--表格-->
      <div class="table-container">
        <div id="SO2Hour" :style="{ visibility:(chartSign==='SO2'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="NO2Hour" :style="{ visibility:(chartSign==='NO2'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="PM10Hour" :style="{ visibility:(chartSign==='PM10'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="PM25Hour" :style="{ visibility:(chartSign==='PM25'?'visible':'hidden'), height:chartHeight }"></div>
        <div class="loading-background" :style="{visibility: viewLoading}"></div>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AirContrast',
  data() {
    return {
      pickerOptions: {
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
      SO2Chart: '', // SO2小时报表
      NO2Chart: '', // NO2小时报表
      PM10Chart: '', // PM10小时报表
      PM25Chart: '', // PM2.5小时报表
      addrOptions: [],
      listMaahMoah: [], // 存放要导出为excel文件的数据
      value1: '',
      value2: '绿岛湖',
      N: 2,
      chartSign: 'SO2',
      chartHeight: '100%',
      viewLoading: 'hidden',
      airOptions: [
        {
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
        }
      ],
      siteMap: { // mac地址与站点名称的对应关系
        '龙湾大桥': '440604:009:AAJ',
        '罗南村委': '440604:002:AAC',
        '绿岛湖': '440604:000:AAA',
        '龙津老年活动中心': '440604:006:AAG',
        '南庄三中': '440604:007:AAH',
        '吉利小学': '440604:004:AAE',
        '罗格村委': '440604:005:AAF',
        '吉利社区': '440604:008:AAI',
        '南庄实验中学': '440604:001:AAB',
        '南庄水利所': '440604:003:AAD',
        '南庄污水处理厂': '440604:010:AAK'
      },
      optionSO2: {
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
          data: ['校准小时走势', '原始小时走势']
        },
        grid: {
          left: '40px',
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
      optionNO2: {
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
          data: ['校准小时走势', '原始小时走势']
        },
        grid: {
          left: '40px',
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
      optionPM10: {
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
          data: ['校准小时走势', '原始小时走势']
        },
        grid: {
          left: '40px',
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
      optionPM25: {
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
          data: ['校准小时走势', '原始小时走势']
        },
        grid: {
          left: '40px',
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
      }
    }
  },
  created () {
    if(document.body.clientWidth<891) {
      this.tableHeight="calc(100% - 30px)"
    }
    console.log(this.tableHeight)
  },
  mounted() {
    // 创建charts实例
    this.SO2Chart = this.$echarts.init(document.getElementById('SO2Hour'))
    this.NO2Chart = this.$echarts.init(document.getElementById('NO2Hour'))
    this.PM10Chart = this.$echarts.init(document.getElementById('PM10Hour'))
    this.PM25Chart = this.$echarts.init(document.getElementById('PM25Hour'))
    this.getAddr() // 获取站点选择下拉列表的选项
    this.defaultDate() // 默认日期选择昨天零点到今天
    this.getTable() // 默认获取昨天零点到今天的数据
  },
  methods: {
    getAddr() { // 获取下拉列表选项
      this.$axios.get('/macAirDeviceList')
      .then(res => {
        let addrArray = res.data.data
        for (let i = 0; i < addrArray.length; i++) {
          this.addrOptions.push({
            value: addrArray[i].remark,
            label: addrArray[i].remark
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    defaultDate() {
      let end = new Date()
      let start = new Date()
      start.setTime(end.getTime() - (this.N-1) * 3600 * 1000 * 24)
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
      this.value1 = [start, end]
    },
    zoomChange: function (e) { // 图表缩放模式改变
      e.currentTarget.blur()
      if(this.optionSO2.dataZoom.type=='inside') {
        this.optionSO2.dataZoom.type='slider'
        this.optionNO2.dataZoom.type='slider'
        this.optionPM10.dataZoom.type='slider'
        this.optionPM25.dataZoom.type='slider'
      }
      else {
        this.optionSO2.dataZoom.type='inside'
        this.optionNO2.dataZoom.type='inside'
        this.optionPM10.dataZoom.type='inside'
        this.optionPM25.dataZoom.type='inside'
      }
      this.SO2Chart.clear()
      this.NO2Chart.clear()
      this.PM10Chart.clear()
      this.PM25Chart.clear()
      this.SO2Chart.setOption(this.optionSO2)
      this.NO2Chart.setOption(this.optionNO2)
      this.PM10Chart.setOption(this.optionPM10)
      this.PM25Chart.setOption(this.optionPM25)
    },
    // 获取表格数据后并筛选
    getTable() {
      let date = this.value1 // 日期
      let filter = this.value2 // 站点
      // 定义字典
      this.viewLoading='visible'
      this.$axios.get('/macOldFourAir',
        {params: {
            beginTime: date[0],
            endTime: date[1],
            macAddress: this.siteMap[this.value2],
          }}
      ).then(mofa => {
        if (mofa.data.successful) {
          this.optionSO2.xAxis.data = mofa.data.data.time
          this.optionSO2.series[0].data = mofa.data.data.SO2
          this.optionSO2.series[1].data = mofa.data.data.OldSO2

          this.optionNO2.xAxis.data = mofa.data.data.time
          this.optionNO2.series[0].data = mofa.data.data.NO2
          this.optionNO2.series[1].data = mofa.data.data.OldNO2

          this.optionPM10.xAxis.data = mofa.data.data.time
          this.optionPM10.series[0].data = mofa.data.data.PM10
          this.optionPM10.series[1].data = mofa.data.data.OldPM10

          this.optionPM25.xAxis.data = mofa.data.data.time
          this.optionPM25.series[0].data = mofa.data.data.PM25
          this.optionPM25.series[1].data = mofa.data.data.OldPM25
        }
        else {
          this.optionSO2.xAxis.data = []
          this.optionSO2.series[0].data = []
          this.optionSO2.series[1].data = []

          this.optionNO2.xAxis.data = []
          this.optionNO2.series[0].data = []
          this.optionNO2.series[1].data = []

          this.optionPM10.xAxis.data = []
          this.optionPM10.series[0].data = []
          this.optionPM10.series[1].data = []

          this.optionPM25.xAxis.data = []
          this.optionPM25.series[0].data = []
          this.optionPM25.series[1].data = []
        }
        // 作图
        this.SO2Chart.setOption(this.optionSO2)
        this.NO2Chart.setOption(this.optionNO2)
        this.PM10Chart.setOption(this.optionPM10)
        this.PM25Chart.setOption(this.optionPM25)
        this.viewLoading='hidden'
      }).catch(error => {
        console.log(error)
      })
    },
    exportExcel:function (e) { // 导出excel文件
      e.currentTarget.blur()
      let that = this
      this.$axios
      .all([ // 获取校准气体数据和原始气体数据
        this.$axios.get('/macAllAirHour',{
          params: {
            beginTime: this.value1[0],
            endTime: this.value1[1],
            airType: this.chartSign
          }
        }),
        this.$axios.get('/macOldAirHour',{
          params: {
            beginTime: this.value1[0],
            endTime: this.value1[1],
            airType: this.chartSign
          }
        })
      ])
      .then(this.$axios.spread(function (maah,moah) {
        console.log(maah) // 得到校准气体数据
        console.log(moah) // 得到原始气体数据
        if(maah.data.successful&&moah.data.successful) {
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
          let th = ['监测时间', '绿岛湖（校准）', '绿岛湖（原始）', '南庄实验中学（校准）', '南庄实验中学（原始）', '罗南村委（校准）', '罗南村委（原始）', '南庄水利所（校准）', '南庄水利所（原始）', '吉利小学（校准）', '吉利小学（原始）', '罗格村委（校准）', '罗格村委（原始）', '龙津老年活动中心（校准）', '龙津老年活动中心（原始）', '南庄三中（校准）', '南庄三中（原始）', '吉利社区（校准）', '吉利社区（原始）', '龙湾大桥（校准）', '龙湾大桥（原始）', '污水处理厂（校准）', '污水处理厂（原始）']
          let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11', 'air12', 'air13', 'air14', 'air15', 'air16', 'air17', 'air18', 'air19', 'air20', 'air21', 'air22']
          let data = that.listMaahMoah.map(v => filterVal.map(k => v[k]))
          let fileName = that.value1[0] + '至' + that.value1[1] + that.chartSign + '数据分析校准原始对比'
          let [fileType, sheetName] = ['xlsx', '数据分析校准原始对比']
          that.$toExcel({th, data, fileName, fileType, sheetName})
        }
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
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
  margin: 0;
  position: absolute;
}
.winmain {
  margin: 10px 10px;
  background: white;
  border-radius: 6px;
  padding: 10px 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  /* min-height: 549px; */
  height: calc(100% - 105px);
}
.filter_title i {
  font-size: 25px;
  padding-right: 10px;
}
.filter_title span {
  font-weight: bold;
  font-size: 18px;
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
.table-container {
  position: relative;
  margin-top: 10px;
  /* height: 460px; */
  height: calc(100% - 70px);
}
#SO2Hour, #NO2Hour, #PM10Hour, #PM25 {
  width: 100%;
  /* height: 468px; */
  position: absolute;
}
.loading-background {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 465px;
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
