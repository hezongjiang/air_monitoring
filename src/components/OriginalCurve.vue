<!--原始数据曲线页面-->
<template>
<div class="container-main">
  <div class="winmain">
    <div class="filter_title">
      <span>原始数据曲线</span>
    </div>
    <div class="filter_container">
      <span>时间</span>
      <el-date-picker
        type="date"
        v-model="beginT"
        placeholder="开始日期"
        size="mini"
        value-format="yyyy-MM-dd"
        style="width:130px"
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
        style="width:130px;margin-right:20px"
        :clearable="false"
        :editable="false">
      </el-date-picker>
      <span>气体</span>
      <el-select size="mini" v-model="airChoose" placeholder="请选择气体" style="width:150px">
        <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
      <el-button type="success" plain size="mini" style="float: right" @click="exportExcel($event)"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      <el-button-group style="float: right;">
        <el-button size="mini" :type="isChart()" @click="toChart($event)"><i class="fa fa-line-chart"></i>&nbsp;图表</el-button>
        <el-button size="mini" :type="isTable()" @click="toTable($event)"><i class="fa fa-table"></i>&nbsp;表格</el-button>
      </el-button-group>
    </div>
    <div class="chart-area">
      <div id="multiSiteAirContrast" :style="{ visibility:(chartSign===1?'visible':'hidden'), height:chartHeight }"></div>
      <el-table
        id="table"
        :row-style="{height:'35px'}"
        :cell-style="{ padding:0, fontSize:'12px'}"
        :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
        :data="list.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
        stripe
        highlight-current-row
        border
        :height= "tableHeight"
        :style="{ visibility:(chartSign===0?'visible':'hidden') }"
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
      <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
    </div>
  </div>
  <!--分页器-->
  <el-pagination
    align="center"
    @size-change='handleSizeChange'
    @current-change='handleCurrentChange'
    :current-page="currentPage"
    :page-sizes="[24]"
    :page-size="pageSize"
    :style="{ visibility:(chartSign===0?'visible':'hidden') }"
    layout="total, sizes, prev, pager, next"
    :total="list.length">
  </el-pagination>
</div>
</template>

<script>

export default {
  name: 'OriginalCurve',
  data () {
    return {
      airChart: '', // 校准气体数据图表
      beginT: '', // 日期选择器上显示的开始日期
      endT: '', // 日期选择器上显示的结束日期
      N: 1, // 默认显示昨天至当天的信息
      list: [], // 存放要导出为excel文件的数据
      viewLoading: 'hidden',
      chartHeight: 'calc(100% - 10px)',
      chartSign: 1,
      pageSize: 24,
      currentPage: 1,
      tableHeight: 'calc(100% - 10px)',
      airChoose: 'SO2', // 气体选择器默认选定SO2
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
      optionAir: {
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
      }
    }
  },
  methods: {
    searchSth: function () { // 查询
      let that = this
      this.viewLoading='visible'
      this.list=[]
      this.$axios.get('/macOldAirHour',{ // 获取校准气体数据
          params: {
            beginTime: this.beginT,
            endTime: this.endT,
            airType: this.airChoose
          }
      })
      .then( maah => {
          console.log(maah) // 得到校准气体数据
          if(maah.data.successful) {
            that.list = maah.data.newData
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
      })
      .catch(function (error) { // 请求失败处理
          console.log(error)
      })
    },
    isChart() {
      if(this.chartSign == 1) return "success"
      else return
    },
    isTable() {
      if(this.chartSign == 0) return "success"
      else return
    },
    toChart: function (e) {
      e.currentTarget.blur()
      this.chartSign = 1
    },
    toTable: function (e) {
      e.currentTarget.blur()
      this.chartSign = 0
    },
    // 分页器
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    exportExcel:function (e) { // 导出excel文件
      e.currentTarget.blur()
      let th = ['监测时间', '绿岛湖', '南庄实验中学', '罗南村委', '南庄水利所', '吉利小学', '罗格村委', '龙津老年活动中心', '南庄三中', '吉利社区', '龙湾大桥', '污水处理厂']
      let filterVal = ['time', 'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'air7', 'air8', 'air9', 'air10', 'air11']
      let data = this.list.map(v => filterVal.map(k => v[k]))
      let fileName = this.beginT + '至' + this.endT + this.airChoose + '原始数据曲线'
      let [fileType, sheetName] = ['xlsx', '原始数据曲线']
      this.$toExcel({th, data, fileName, fileType, sheetName})
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
    // 设置默认开始日期和结束日期
    this.beginT = this.$moment().subtract(this.N,'days').format("YYYY-MM-DD")
    this.endT = this.$moment().format("YYYY-MM-DD")
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
.filter_title {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.filter_title i {
  font-size: 25px;
  padding-right: 10px;
}
.filter_title span {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.filter_container {
  margin-top: 10px;
  font-size: 15px;
}
.filter_container span {
  padding-right: 10px;
}
.el-select {
  padding-right: 20px;
  width: 150px;
}
.chart-area {
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
#table {
  width: 100%;
  /* height: 432px; */
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
.sth-gone {
  display: none;
}
</style>
