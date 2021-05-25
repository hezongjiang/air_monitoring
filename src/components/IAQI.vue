<!--站点日均IAQI统计页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>站点日均IAQI统计</span>
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
        <el-button type="primary" size="mini" v-on:click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <div class="container-table">
        <div id="DayAir" :style="{ height:chartHeight }"></div>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IAQI',
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
      airChart: '', // 气体图表
      addrOptions: [], // 站点选项
      addrChoose: '', // 站点选择
      addrChooseState: '', // 站点选择状态，主要用于excel导出，因为这时站点选择器可能人为动过
      beginEndT: '', // 开始结束日期
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      N: 30, // 默认显示N天前至当天的信息
      tbList: [], // 表格数据
      chartHeight: 'calc(100% - 10px)', // 图表高度
      viewLoading: 'hidden', // 加载标志可见性
      optionAir: { // 空气图表配置
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: {
          type: 'inside',
          filterMode: 'none'
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
          name: 'IAQI',
          nameTextStyle: { padding: [0, 0, 0, 20] },
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series: [{
          name: 'PM2.5',
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  methods: {
    searchSth() {
      this.viewLoading = 'visible' // 显示加载标志
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.addrChooseState = this.addrChoose // 主要用于excel导出，因为这时站点选择器可能人为动过
      this.$axios.get('/macDayIAQI', {
        params: {
          macAddress: this.addrChoose,
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1]
        }}
      ).then(mdi => {
        if (mdi.data.successful) {
          this.tbList = []
          for (let i = 0; i < mdi.data.data.time.length; i++) {
            this.tbList[i] = {}
            this.tbList[i].IAQI = mdi.data.data.AQI[i]
            this.tbList[i].time = mdi.data.data.time[i]
          }
          for (let i = 0; i < this.tbList.length; i++) {
            this.optionAir.xAxis.data = mdi.data.data.time
            this.optionAir.series[0].data = mdi.data.data.AQI
          }
        } else {
          this.tbList = []
          this.optionAir.xAxis.data = []
          this.optionAir.series[0].data = []
        }
        // 作图
        this.airChart.setOption(this.optionAir)
        this.viewLoading = 'hidden' // 隐藏加载标志
      }).catch(error => {
        console.log(error)
      })
    },
    exportExcel(e) { // 导出为excel
      let addrRemark = ''
      e.currentTarget.blur()
      this.$axios
      .get('/' + this.addrChooseState + '/macAirDeviceInfo')
      .then(madi => {
        if (madi.data.successful && madi.data.data.length) {
          addrRemark = madi.data.data[0].remark
        }
        const th = ['监测时间', 'IAQI']
        const filterVal = ['time', 'IAQI']
        const data = this.tbList.map(v => filterVal.map(k => v[k]))
        const fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + addrRemark + '站点日均IAQI统计'
        const [fileType, sheetName] = ['xlsx', '站点日均IAQI统计']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      })
      .catch(error => {
        console.log(error)
      })
      e.currentTarget.blur()
    }
  },
  mounted() {
    // 创建charts实例
    this.airChart = this.$echarts.init(document.getElementById('DayAir'))
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
.container-table {
  position: relative;
  margin-top: 10px;
  /* height: 460px; */
  height: calc(100% - 70px);
}
#DayAir {
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
</style>
