<!--气体数据小时报表页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>气体数据小时报表</span>
      </div>
      <div class="container-filter">
        <span>时间</span>
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
        <span>站点</span>
        <el-select size="mini" v-model="addrChoose" placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>气体</span>
        <el-select size="mini" v-model="airChoose" placeholder="请选择气体">
          <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <div class="container-chart">
        <div id="SO2Hour" :style="{ visibility:(airChoose==='SO2'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="NO2Hour" :style="{ visibility:(airChoose==='NO2'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="PM10Hour" :style="{ visibility:(airChoose==='PM10'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="PM25Hour" :style="{ visibility:(airChoose==='PM25'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="COHour" :style="{ visibility:(airChoose==='CO'?'visible':'hidden'), height:chartHeight }"></div>
        <div id="O3Hour" :style="{ visibility:(airChoose==='O3'?'visible':'hidden'), height:chartHeight }"></div>
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      SO2Chart: '', // SO2图表
      NO2Chart: '', // NO2图表
      PM10Chart: '', // PM10图表
      PM25Chart: '', // PM2.5图表
      COChart: '', // CO图表
      O3Chart: '', // O3图表
      addrOptions: [], // 站点选项
      addrChoose: '', // 站点选择
      tbList1: [], // 存放要导出为excel文件的数据
      tbList2: [], // 存放要导出为excel文件的数据
      beginEndT: '', // 开始结束日期
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      N: 1, // 默认显示N天前至当天的信息
      chartHeight: 'calc(100% - 10px)', // 图表高度
      viewLoading: 'hidden', // 加载标志可见性
      airChoose: 'SO2', // 气体选择
      airChooseState: '', // 气体选择状态，主要用于excel导出，因为这时气体选择器可能人为动过
      airOptions: [{ // 气体选项
        value: 'SO2',
        label: 'SO2'
      }, {
        value: 'NO2',
        label: 'NO2'
      }, {
        value: 'PM10',
        label: 'PM10'
      }, {
        value: 'PM25',
        label: 'PM2.5'
      }, {
        value: 'CO',
        label: 'CO'
      }, {
        value: 'O3',
        label: 'O3'
      }],
      optionSO2: { // SO2图表配置
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
      optionNO2: { // NO2图表配置
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
      optionPM10: { // PM10图表配置
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
      optionPM25: { // PM2.5图表配置
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
      optionCO: { // CO图表配置
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
          nameTextStyle: { padding: [10, 0, 0, 0] },
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          name: '浓度（mg/m³）',
          nameTextStyle: { padding: [0, 0, 0, 20] },
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
      optionO3: { // O3图表配置
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
  methods: {
    searchSth() { // 查询数据
      this.viewLoading = 'visible' // 显示加载标志
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.airChooseState = this.airChoose // 主要用于excel导出，因为这时气体选择器可能人为动过
      this.$axios.get('/macOldFourAir', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          macAddress: this.addrChoose
        }
      })
      .then(mofa => {
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
          this.optionCO.xAxis.data = mofa.data.data.time
          this.optionCO.series[0].data = mofa.data.data.CO
          this.optionCO.series[1].data = mofa.data.data.OldCO
          this.optionO3.xAxis.data = mofa.data.data.time
          this.optionO3.series[0].data = mofa.data.data.O3
          this.optionO3.series[1].data = mofa.data.data.OldO3
        } else {
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
          this.optionCO.xAxis.data = []
          this.optionCO.series[0].data = []
          this.optionCO.series[1].data = []
          this.optionO3.xAxis.data = []
          this.optionO3.series[0].data = []
          this.optionO3.series[1].data = []
        }
        // 作图
        this.SO2Chart.setOption(this.optionSO2)
        this.NO2Chart.setOption(this.optionNO2)
        this.PM10Chart.setOption(this.optionPM10)
        this.PM25Chart.setOption(this.optionPM25)
        this.COChart.setOption(this.optionCO)
        this.O3Chart.setOption(this.optionO3)
        this.viewLoading = 'hidden' // 隐藏加载标志
      }).catch(error => {
        console.log(error)
      })
    },
    exportExcel(e) { // 导出excel文件
      e.currentTarget.blur()
      let that = this
      this.$axios
      .all([
        this.$axios.get('/macAllAirHour', {
          params: {
            beginTime: this.beginEndT[0],
            endTime: this.beginEndT[1],
            airType: this.airChoose,
            type: 1
          }
        }),
        this.$axios.get('/macOldAirHour', {
          params: {
            beginTime: this.beginEndT[0],
            endTime: this.beginEndT[1],
            airType: this.airChoose,
            type: 1
          }
        }),
        this.$axios.get('/macAllAirHour', {
          params: {
            beginTime: this.beginEndT[0],
            endTime: this.beginEndT[1],
            airType: this.airChoose,
            type: 2
          }
        }),
        this.$axios.get('/macOldAirHour', {
          params: {
            beginTime: this.beginEndT[0],
            endTime: this.beginEndT[1],
            airType: this.airChoose,
            type: 2
          }
        })
      ])
      .then(this.$axios.spread(function (maah1, moah1, maah2, moah2) {
        that.tbList1 = [] // 由于后续数据是逐个索引赋值的，所以先清空
        if (maah1.data.successful && moah1.data.successful) {
          for (let i = 0; i < maah1.data.newData.length; i++) {
            that.tbList1[i] = {}
            that.tbList1[i].time = maah1.data.data.time[i]
            that.tbList1[i].air1 = maah1.data.data.air1[i]
            that.tbList1[i].air2 = moah1.data.data.air1[i]
            that.tbList1[i].air3 = maah1.data.data.air2[i]
            that.tbList1[i].air4 = moah1.data.data.air2[i]
            that.tbList1[i].air5 = maah1.data.data.air3[i]
            that.tbList1[i].air6 = moah1.data.data.air3[i]
            that.tbList1[i].air7 = maah1.data.data.air4[i]
            that.tbList1[i].air8 = moah1.data.data.air4[i]
            that.tbList1[i].air9 = maah1.data.data.air5[i]
            that.tbList1[i].air10 = moah1.data.data.air5[i]
            that.tbList1[i].air11 = maah1.data.data.air6[i]
            that.tbList1[i].air12 = moah1.data.data.air6[i]
            that.tbList1[i].air13 = maah1.data.data.air7[i]
            that.tbList1[i].air14 = moah1.data.data.air7[i]
            that.tbList1[i].air15 = maah1.data.data.air8[i]
            that.tbList1[i].air16 = moah1.data.data.air8[i]
            that.tbList1[i].air17 = maah1.data.data.air9[i]
            that.tbList1[i].air18 = moah1.data.data.air9[i]
            that.tbList1[i].air19 = maah1.data.data.air10[i]
            that.tbList1[i].air20 = moah1.data.data.air10[i]
            that.tbList1[i].air21 = maah1.data.data.air11[i]
            that.tbList1[i].air22 = moah1.data.data.air11[i]
          }
          let th = ['监测时间', '绿岛湖（校准）', '绿岛湖（原始）', '南庄实验中学（校准）', '南庄实验中学（原始）', '罗南村委（校准）', '罗南村委（原始）', '南庄水利所（校准）', '南庄水利所（原始）', '吉利小学（校准）', '吉利小学（原始）', '罗格村委（校准）', '罗格村委（原始）', '龙津老年活动中心（校准）', '龙津老年活动中心（原始）', '南庄三中（校准）', '南庄三中（原始）', '吉利社区（校准）', '吉利社区（原始）', '龙湾大桥（校准）', '龙湾大桥（原始）', '污水处理厂（校准）', '污水处理厂（原始）']
          let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11', 'air12', 'air13', 'air14', 'air15', 'air16', 'air17', 'air18', 'air19', 'air20', 'air21', 'air22']
          let data = that.tbList1.map(v => filterVal.map(k => v[k]))
          let fileName = that.beginEndTState[0] + '至' + that.beginEndTState[1] + that.airChooseState + '南庄一期数据分析校准原始对比'
          let [fileType, sheetName] = ['xlsx', '数据分析校准原始对比']
          that.$toExcel({th, data, fileName, fileType, sheetName})
        }
        that.tbList2 = [] // 由于后续数据是逐个索引赋值的，所以先清空
        if (maah2.data.successful && moah2.data.successful) {
          for (let i = 0; i < maah2.data.newData.length; i++) {
            that.tbList2[i] = {}
            that.tbList2[i].time = maah2.data.data.time[i]
            that.tbList2[i].air1 = maah2.data.data.air1[i]
            that.tbList2[i].air2 = moah2.data.data.air1[i]
            that.tbList2[i].air3 = maah2.data.data.air2[i]
            that.tbList2[i].air4 = moah2.data.data.air2[i]
            that.tbList2[i].air5 = maah2.data.data.air3[i]
            that.tbList2[i].air6 = moah2.data.data.air3[i]
            that.tbList2[i].air7 = maah2.data.data.air4[i]
            that.tbList2[i].air8 = moah2.data.data.air4[i]
            that.tbList2[i].air9 = maah2.data.data.air5[i]
            that.tbList2[i].air10 = moah2.data.data.air5[i]
            that.tbList2[i].air11 = maah2.data.data.air6[i]
            that.tbList2[i].air12 = moah2.data.data.air6[i]
            that.tbList2[i].air13 = maah2.data.data.air7[i]
            that.tbList2[i].air14 = moah2.data.data.air7[i]
            that.tbList2[i].air15 = maah2.data.data.air8[i]
            that.tbList2[i].air16 = moah2.data.data.air8[i]
            that.tbList2[i].air17 = maah2.data.data.air9[i]
            that.tbList2[i].air18 = moah2.data.data.air9[i]
          }
          let th = ['监测时间', '广台-紫洞（校准）', '广台-紫洞（原始）', '季华-紫洞（校准）', '季华-紫洞（原始）', '季华-禅港（校准）', '季华-禅港（原始）', '广台-禅港（校准）', '广台-禅港（原始）', '罗南-禅港（校准）', '罗南-禅港（原始）', '南庄-紫洞（校准）', '南庄-紫洞（原始）', '南庄-陶兴（校准）', '南庄-陶兴（原始）', '吉利-龙津（校准）', '吉利-龙津（原始）', '南庄-龙津（校准）', '南庄-龙津（原始）']
          let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11', 'air12', 'air13', 'air14', 'air15', 'air16', 'air17', 'air18']
          let data = that.tbList2.map(v => filterVal.map(k => v[k]))
          let fileName = that.beginEndTState[0] + '至' + that.beginEndTState[1] + that.airChooseState + '南庄二期数据分析校准原始对比'
          let [fileType, sheetName] = ['xlsx', '数据分析校准原始对比']
          that.$toExcel({th, data, fileName, fileType, sheetName})
        }
      }))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    }
  },
  mounted() {
    // 创建charts实例
    this.SO2Chart = this.$echarts.init(document.getElementById('SO2Hour'))
    this.NO2Chart = this.$echarts.init(document.getElementById('NO2Hour'))
    this.PM10Chart = this.$echarts.init(document.getElementById('PM10Hour'))
    this.PM25Chart = this.$echarts.init(document.getElementById('PM25Hour'))
    this.COChart = this.$echarts.init(document.getElementById('COHour'))
    this.O3Chart = this.$echarts.init(document.getElementById('O3Hour'))
    this.viewLoading = 'visible' // 因为初次自动查询在axios回调里有等待时间，所以这里先手动显示加载标志
    // 开始日期和结束日期初始化
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
    // 其它初始化
    this.$axios
    .get('/macAirDeviceList')
    .then(madl => {
      if (madl.data.successful && madl.data.data.length) {
        this.addrChoose = madl.data.data[0].macAddress // 初始化站点选择
        for (let i = 0; i < madl.data.data.length; i++) { // 初始化站点选项
          this.addrOptions.push({
            value: madl.data.data[i].macAddress,
            label: madl.data.data[i].remark
          })
        }
        this.searchSth() // 查询数据
      }
    })
    .catch(error => {
      console.log(error)
    })
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
  border-radius: 4px;
  padding: 10px 20px;
  /* min-height: 549px; */
  height: calc(100% - 105px);
  box-shadow: 0 0 2px 1px #ddd;
}
.title-filter {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.title-filter i {
  font-size: 25px;
  padding-right: 10px;
}
.title-filter span {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.container-filter {
  margin-top: 10px;
  font-size: 15px;
}
.container-filter span {
  padding-right: 10px;
}
.el-select {
  padding-right: 20px;
  width: 150px;
}
.container-chart {
  position: relative;
  margin-top: 10px;
  /* height: 460px; */
  height: calc(100% - 70px);
}
#SO2Hour, #NO2Hour, #PM10Hour, #PM25Hour, #COHour, #O3Hour {
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
</style>
