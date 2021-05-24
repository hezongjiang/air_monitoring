<!--AQI气体曲线页面-->
<template>
  <div class="container-main">
    <div class="winmain">
      <div class="title-filter">
        <span>AQI气体曲线</span>
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
        <span>站点类型</span>
        <el-select size="mini" v-model="typeChoose" placeholder="请选择站点类型" style="width:150px">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
      </div>
      <div class="container-chart">
        <div id="multiSiteAirContrast" :style="{ height:chartHeight }"></div>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'AQI',
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
        airChart: '', // 气体数据图表
        beginEndT: [], // 开始结束日期
        N: 30, // 默认显示N天前至当天的信息
        viewLoading: 'hidden', // 加载标志可见性
        chartHeight: 'calc(100% - 10px)', // 图表高度
        typeChoose: 1, // 站点类型选择
        typeOptions: [{
          value: 1,
          label: '南庄一期'
        }, {
          value: 2,
          label: '南庄二期'
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
            name: 'IAQI',
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
        this.optionAir.series = []
        this.$axios
        .get('/macAllIAQI', {
          params: {
            beginTime: this.beginEndT[0],
            endTime: this.beginEndT[1],
            type: this.typeChoose
          }
        })
        .then(maah => {
          if (maah.data.successful) {
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
            this.optionAir.xAxis.data = []
            this.optionAir.legend.data = []
            for (let i = 0; i < maah.data.macName.length; i++) {
              this.optionAir.series[i].name = ''
              this.optionAir.series[i].data = []
            }
          }
          // 作图
          this.airChart.clear()
          this.airChart.setOption(this.optionAir)
          this.viewLoading = 'hidden'
        })
        .catch(function (error) { // 请求失败处理
          console.log(error)
        })
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
    height: calc(100% - 70px);
  }
  #multiSiteAirContrast {
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
