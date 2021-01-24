<!--原始数据曲线页面-->
<template>
  <div class="container-main">
    <div class="winmain">
      <div class="title-filter">
        <span>原始数据曲线</span>
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
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="time" label="监测时间" align="center" width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air1" label="绿岛湖" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air2" label="南庄实验中学" align="center" width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air3" label="罗南村委" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air4" label="南庄水利所" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air5" label="吉利小学" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air6" label="罗格村委" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air7" label="龙津老年活动中心" align="center" width="130"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air8" label="南庄三中" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air9" label="吉利社区" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air10" label="龙湾大桥" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air11" label="南庄污水处理厂" align="center" width="115"></el-table-column>
        </el-table>
        <el-table
          id="table2"
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
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="time" label="监测时间" align="center" width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air1" label="广台-紫洞" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air2" label="季华-紫洞" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air3" label="季华-禅港" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air4" label="广台-禅港" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air5" label="罗南-禅港" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air6" label="南庄-紫洞" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air7" label="南庄-陶兴" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air8" label="吉利-龙津" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="air9" label="南庄-龙津" align="center"></el-table-column>
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
      :style="{ visibility:(chartSign===0&&typeState===1?'visible':'hidden') }"
      layout="total, sizes, prev, pager, next"
      :total="tbList1.length">
    </el-pagination>
    <el-pagination
      align="center"
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page="currentPage"
      :page-sizes="[24]"
      :page-size="pageSize"
      :style="{ visibility:(chartSign===0&&typeState===2?'visible':'hidden') }"
      layout="total, sizes, prev, pager, next"
      :total="tbList2.length">
    </el-pagination>
  </div>
</template>

<script>

export default {
  name: 'OriginalCurve',
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      airChart: '', // 气体图表
      beginEndT: '', // 开始结束日期
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
      }],
      optionAir: { // 气体曲线配置
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
          data: ['绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
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
    searchSth: function () { // 查询
      this.viewLoading = 'visible' // 显示加载标志
      this.currentPage = 1 // 每次查询都回到第一页
      this.typeState = this.typeChoose // 主要用于excel导出，因为这时站点类型选择器可能人为动过
      this.airChooseState = this.airChoose // 主要用于excel导出，因为这时气体选择器可能人为动过
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.tbList1 = [] // 由于两张表格切换查找，初始化，避免查询错误导致上一次的数据还在，就奇奇怪怪的
      this.tbList2 = [] // 由于两张表格切换查找，初始化，避免查询错误导致上一次的数据还在，就奇奇怪怪的
      this.$axios.get('/macOldAirHour', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          airType: this.airChoose,
          type: this.typeChoose
        }
      })
      .then(moah => {
        if (moah.data.successful) {
          if (this.typeState === 1) {
            this.tbList1 = moah.data.newData
          } else if (this.typeState === 2) {
            this.tbList2 = moah.data.newData
          }
          this.optionAir.legend.data = moah.data.macName
          for (let i = 0; i < this.optionAir.legend.data.length; i++) {
            this.optionAir.series[i].name = this.optionAir.legend.data[i]
          }
          this.optionAir.xAxis.data = moah.data.data.time
          this.optionAir.series[0].data = moah.data.data.air1
          this.optionAir.series[1].data = moah.data.data.air2
          this.optionAir.series[2].data = moah.data.data.air3
          this.optionAir.series[3].data = moah.data.data.air4
          this.optionAir.series[4].data = moah.data.data.air5
          this.optionAir.series[5].data = moah.data.data.air6
          this.optionAir.series[6].data = moah.data.data.air7
          this.optionAir.series[7].data = moah.data.data.air8
          this.optionAir.series[8].data = moah.data.data.air9
          this.optionAir.series[9].data = moah.data.data.air10
          this.optionAir.series[10].data = moah.data.data.air11
        } else {
          if (this.typeState === 1) {
            this.tbList1 = []
          } else if (this.typeState === 2) {
            this.tbList2 = []
          }
          this.optionAir.xAxis.data = []
          this.optionAir.legend.data = []
          for (let i = 0; i < this.optionAir.legend.data.length; i++) {
            this.optionAir.series[i].name = ''
            this.optionAir.series[i].data = []
          }
        }
        // 作图
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
      if (this.typeState === 1) {
        let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
        let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11']
        let data = this.tbList1.map(v => filterVal.map(k => v[k]))
        let fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.airChooseState + '南庄一期原始数据曲线'
        let [fileType, sheetName] = ['xlsx', '原始数据曲线']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      } else if (this.typeState === 2) {
        let th = ['监测时间', '广台-紫洞', '季华-紫洞', '季华-禅港', '广台-禅港', '罗南-禅港', '南庄-紫洞', '南庄-陶兴', '吉利-龙津', '南庄-龙津']
        let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9']
        let data = this.tbList2.map(v => filterVal.map(k => v[k]))
        let fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.airChooseState + '南庄二期原始数据曲线'
        let [fileType, sheetName] = ['xlsx', 'All站点小时空气']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      }
    }
  },
  mounted () {
    // 设置默认开始日期和结束日期
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
    // 创建charts实例
    this.airChart = this.$echarts.init(document.getElementById('multiSiteAirContrast'))
    // 查询数据
    this.searchSth()
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
  /* height: 450px; */
  height: calc(100% - 70px);
}
#multiSiteAirContrast {
  width: 100%;
  /* height: 468px; */
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
