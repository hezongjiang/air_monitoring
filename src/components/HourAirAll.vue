<!--All站点小时空气页面-->
<template>
  <div class="container-main">
    <div class="winmain">
      <div class="title-filter">
        <span>All站点小时空气</span>
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
        <span>气体</span>
        <el-select size="mini" v-model="airChoose" placeholder="请选择气体" style="width:150px">
          <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>站点类型</span>
        <el-select size="mini" v-model="typeChoose" placeholder="请选择站点类型" style="width:150px">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
        <el-button-group style="float: right;">
          <el-button size="mini" :type="isChart()" @click="toChart($event)"><i class="fa fa-line-chart"></i>&nbsp;图表</el-button>
          <el-button size="mini" :type="isTable()" @click="toTable($event)"><i class="fa fa-table"></i>&nbsp;表格</el-button>
        </el-button-group>
      </div>
      <div class="container-chart">
        <div id="multiSiteAirContrast" :style="{ visibility:(chartSign===1?'visible':'hidden'), height:chartHeight }"></div>
        <el-table
          id="table1"
          ref="table1"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="tbList1.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          :style="{ visibility:(chartSign===0&&typeState===1?'visible':'hidden') }"
          tooltip-effect="dark">
          <el-table-column v-for="(item, index) in columnConfig1" :key="index" :type="item.type" :prop="item.prop" :label="item.label" :align="item.align" :width="item.width" :show-overflow-tooltip="item.of"></el-table-column>
        </el-table>
        <el-table
          id="table2"
          ref="table2"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="tbList2.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          :style="{ visibility:(chartSign===0&&typeState===2?'visible':'hidden') }"
          tooltip-effect="dark">
          <el-table-column v-for="(item, index) in columnConfig2" :key="index" :type="item.type" :prop="item.prop" :label="item.label" :align="item.align" :width="item.width" :show-overflow-tooltip="item.of"></el-table-column>
        </el-table>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
    <el-pagination
      align="center"
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page="currentPage"
      :page-sizes="[24]"
      :page-size="pageSize"
      :style="{ visibility:(chartSign===0?'visible':'hidden') }"
      layout="total, sizes, prev, pager, next"
      :total="typeState === 1 ? tbList1.length : tbList2.length">
    </el-pagination>
  </div>
</template>

<script>

export default {
  name: 'HourAirAll',
  data () {
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
      columnConfig1: [
        {of: true, type: 'index', label: '序号', align: 'center'},
        {of: true, prop: 'time', label: '监测时间', align: 'center', width: '101'}
      ],
      columnConfig2: [
        {of: true, type: 'index', label: '序号', align: 'center'},
        {of: true, prop: 'time', label: '监测时间', align: 'center', width: '101'}
      ],
      airChart: '', // 气体数据图表
      beginEndT: [], // 开始结束日期
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      N: 1, // 默认显示N天前至当天的信息
      tbList1: [], // 表格数据
      tbList2: [], // 表格数据
      viewLoading: 'hidden', // 加载标志可见性
      chartHeight: 'calc(100% - 10px)', // 图表高度
      chartSign: 1, // 图表和表格的标志
      pageSize: 24, // 单页数
      currentPage: 1, // 当前页
      tableHeight: 'calc(100% - 10px)', // 表格高度
      typeState: 1, // 站点类型选择状态，主要用于excel导出，因为这时站点类型选择器可能人为动过
      typeChoose: 1, // 站点类型选择
      typeOptions: [{
        value: 1,
        label: '南庄一期'
      }, {
        value: 2,
        label: '南庄二期'
      }],
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
      optionAir: { // 气体图表配置
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
          data: []
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
        series: []
      }
    }
  },
  methods: {
    searchSth() { // 查询数据
      this.viewLoading = 'visible' // 显示加载标志
      this.currentPage = 1 // 每次查询都回到第一页
      this.typeState = this.typeChoose // 主要用于excel导出，因为这时站点类型选择器可能人为动过
      this.airChooseState = this.airChoose // 主要用于excel导出，因为这时气体选择器可能人为动过
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.tbList1 = [] // 由于两张表格切换查找，初始化，避免查询错误导致上一次的数据还在，就奇奇怪怪的
      this.tbList2 = [] // 由于两张表格切换查找，初始化，避免查询错误导致上一次的数据还在，就奇奇怪怪的
      this.optionAir.series = []
      this.$axios
      .get('/macAllAirHour', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          airType: this.airChoose,
          type: this.typeChoose
        }
      })
      .then(maah => {
        if (maah.data.successful) {
          if (this.typeState === 1) {
            this.tbList1 = maah.data.newData
          } else if (this.typeState === 2) {
            this.tbList2 = maah.data.newData
          }
          this.optionAir.legend.data = maah.data.macName
          for (let i = 0; i < maah.data.macName.length; i++) {
            this.optionAir.series[i] = {}
            this.optionAir.series[i].name = maah.data.macName[i]
            this.optionAir.series[i].data = maah.data.data['air' + (i + 1)]
            this.optionAir.series[i].type = 'line'
            this.optionAir.series[i].smooth = true
          }
          this.optionAir.xAxis.data = maah.data.data.time
        } else {
          if (this.typeState === 1) {
            this.tbList1 = []
          } else if (this.typeState === 2) {
            this.tbList2 = []
          }
          this.optionAir.xAxis.data = []
          this.optionAir.legend.data = []
          for (let i = 0; i < maah.data.macName.length; i++) {
            this.optionAir.series[i].name = ''
            this.optionAir.series[i].data = []
          }
        }
        this.$refs.table1.doLayout()
        this.$refs.table2.doLayout()
        // 作图
        if (this.airChooseState === 'CO') {
          this.optionAir.yAxis.name = '浓度（mg/m³）'
        } else {
          this.optionAir.yAxis.name = '浓度（μg/m³）'
        }
        this.airChart.clear()
        this.airChart.setOption(this.optionAir)
        this.viewLoading = 'hidden'
      })
      .catch(function (error) { // 请求失败处理
          console.log(error)
      })
    },
    isChart() { // 图表切换
      if (this.chartSign === 1) return 'success'
    },
    isTable() { // 表格切换
      if (this.chartSign === 0) return 'success'
    },
    toChart: function (e) { // 图表切换
      e.currentTarget.blur()
      this.chartSign = 1
    },
    toTable: function (e) { // 表格切换
      e.currentTarget.blur()
      this.chartSign = 0
    },
    handleSizeChange(val) { // 分页器
      this.pageSize = val
    },
    handleCurrentChange(val) { // 分页器
      this.currentPage = val
    },
    exportExcel(e) { // 导出excel文件
      e.currentTarget.blur()
      let th = this.optionAir.legend.data
      th.unshift('监测时间')
      let filterVal = ['time']
      for (let i = 1; i < th.length; i++) {
        filterVal[i] = 'air' + i
      }
      let data = []
      let fileName = ''
      if (this.typeState === 1) {
        data = this.tbList1.map(v => filterVal.map(k => v[k]))
        fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.airChooseState + '南庄一期All站点小时空气'
      } else if (this.typeState === 2) {
        data = this.tbList2.map(v => filterVal.map(k => v[k]))
        fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.airChooseState + '南庄二期All站点小时空气'
      }
      let [fileType, sheetName] = ['xlsx', 'All站点小时空气']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted () {
    // 设置默认开始日期和结束日期
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
    let that = this
    this.$axios
    .all([
      this.$axios.get('/macAllAirHour', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          airType: 'SO2',
          type: 1
        }
      }),
      this.$axios.get('/macAllAirHour', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          airType: 'SO2',
          type: 2
        }
      })
    ])
    .then(this.$axios.spread(function (maah1, maah2) {
      if (maah1.data.successful) {
        for (let i = 0; i < maah1.data.macName.length; i++) {
          that.columnConfig1[i + 2] = {}
          that.columnConfig1[i + 2].of = true
          that.columnConfig1[i + 2].prop = 'air' + (i + 1)
          that.columnConfig1[i + 2].label = maah1.data.macName[i]
          that.columnConfig1[i + 2].align = 'center'
        }
      }
      if (maah2.data.successful) {
        for (let i = 0; i < maah2.data.macName.length; i++) {
          that.columnConfig2[i + 2] = {}
          that.columnConfig2[i + 2].of = true
          that.columnConfig2[i + 2].prop = 'air' + (i + 1)
          that.columnConfig2[i + 2].label = maah2.data.macName[i]
          that.columnConfig2[i + 2].align = 'center'
        }
      }
      // 创建charts实例
      that.airChart = that.$echarts.init(document.getElementById('multiSiteAirContrast'))
      // 查询数据
      that.searchSth()
    }))
    .catch(function (error) { // 请求失败处理
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
  margin: 0;
  overflow: hidden;
  position: absolute;
}
.winmain {
  margin: 10px 10px;
  background: white;
  border-radius: 4px;
  padding: 10px 20px;
  /* height: 549px; */
  /* width: 100%; */
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
  height: calc(100% - 70px);
}
#multiSiteAirContrast {
  width: 100%;
  position: absolute;
}
#table1 {
  width: 100%;
  position: absolute;
}
#table2 {
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
</style>
