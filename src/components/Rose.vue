<!--风速风向玫瑰图页面-->
<template>
  <div class="container-main">
    <div class="winmain">
      <div class="title-filter">
        <span>风向风速玫瑰图</span>
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
        <el-select size="mini" v-model="addrChoose" placeholder="请选择站点" style="width:150px">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
      </div>
      <div class="container-chart">
        <div id="RoseChart" :style="{ height:chartHeight }"></div>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Rose',
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
      roseChart: '', // 玫瑰图表
      beginEndT: [], // 开始结束日期
      N: 30, // 默认显示N天前至当天的信息
      viewLoading: 'hidden', // 加载标志可见性
      chartHeight: 'calc(100% - 10px)', // 图表高度
      addrChoose: '', // 站点选择
      addrOptions: [], // 站点选项
      optionRose: { // 玫瑰图表配置
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontFamily: 'Microsoft YaHei'
          }
        },
        color: ['#0001F7', '#00B8FE', '#00FFFF', '#00FF68', '#BEFE00', '#FFFF00', '#FFA800', '#E10100'],
        angleAxis: {
          zlevel: 2,
          type: 'category',
          data: [
            {value: '北'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '东北'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '东'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '东南'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '南'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '西南'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '西'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
            {value: '西北'},
            {value: ''},  {value: ''},  {value: ''},  {value: ''},  {value: ''},
          ],
          boundaryGap: false, //标签和数据点都会在两个刻度之间的带(band)中间
          axisTick: {
            show: false //是否显示坐标轴刻度
          },
          show: true,
          splitLine: {
            show: true,
            lineStyle: {
              // color:"black"
            },
          },
          axisLabel: {
            show: true,
            interval: 5, //坐标轴刻度标签的显示间隔，在类目轴中有效
          },
        },
        radiusAxis: {
          // min: 0,
          // max: 100,
          axisLabel: {
            formatter: '{value}',
            margin: -5,
            textStyle: {
              fontSize: 10,
              color: 'black',
              // padding: 5,
              width: 30,
              // backgroundColor: 'lightgray',
              // borderColor: 'black',
              borderWidth: 1,
              fontFamily: 'Microsoft YaHei'
            },
            rich: { }
          },
          zlevel: 3,
          axisTick: {
            show: false //是否显示坐标轴刻度
          },
          axisLine: {
            show: true, //是否显示坐标轴轴线
          },
        },
        polar: {
        },
        series: [
        {
          barCategoryGap: 0,
          type: 'bar',
          zlevel: 1,
          data: [],
          coordinateSystem: 'polar',
          name: "0.1-2.3 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
            borderWidth: 1,
          }
        }, {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "2.3-4.5 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        }, {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "4.5-6.7 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        }, {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "6.7-8.9 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        }, {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "8.9-11.0 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        }, {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "11.0-13.2 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        }, {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "13.2-15.4 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        },
        {
          barCategoryGap: 0,
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
          name: "15.4-17.6 m/s",
          stack: 'a',
          itemStyle: {
            borderColor: 'black',
          }
        }],
        legend: {
          show: true,
          top: 0,
          data: ["0.1-2.3 m/s", "2.3-4.5 m/s", "4.5-6.7 m/s", "6.7-8.9 m/s",
                "8.9-11.0 m/s", "11.0-13.2 m/s", "13.2-15.4 m/s", "15.4-17.6 m/s"],
          // width:500,//根据宽度调整换行
        }
      }
    }
  },
  methods: {
    searchSth() { // 查询数据
      this.viewLoading = 'visible' // 显示加载标志
      for(let i = 0; i < 48; i++) {
        for(let j = 0; j < 8; j++) {
          this.optionRose.series[j].data[i] = 0
        }
      }
      this.$axios
      .get('/macAirHourHistory', {
        params: {
          macAddress: this.addrChoose,
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1]
        }
      })
      .then(mahh => {
        if(mahh.data.successful) {
          for(let i = 0; i < mahh.data.data.length; i++) {
            if(mahh.data.data[i].direct > 356.25) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[0]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[0]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[0]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[0]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[0]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[0]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[0]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[0]++
            }
            else if(mahh.data.data[i].direct > 356.25-1*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[47]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[47]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[47]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[47]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[47]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[47]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[47]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[47]++
            }
            else if(mahh.data.data[i].direct > 356.25-2*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[46]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[46]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[46]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[46]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[46]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[46]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[46]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[46]++
            }
            else if(mahh.data.data[i].direct > 356.25-3*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[37]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[37]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[37]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[37]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[37]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[37]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[37]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[37]++
            }
            else if(mahh.data.data[i].direct > 356.25-4*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[44]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[44]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[44]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[44]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[44]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[44]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[44]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[44]++
            }
            else if(mahh.data.data[i].direct > 356.25-5*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[43]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[43]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[43]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[43]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[43]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[43]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[43]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[43]++
            }
            else if(mahh.data.data[i].direct > 356.25-6*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[42]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[42]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[42]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[42]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[42]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[42]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[42]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[42]++
            }
            else if(mahh.data.data[i].direct > 356.25-7*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[41]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[41]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[41]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[41]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[41]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[41]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[41]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[41]++
            }
            else if(mahh.data.data[i].direct > 356.25-8*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[40]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[40]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[40]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[40]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[40]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[40]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[40]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[40]++
            }
            else if(mahh.data.data[i].direct > 356.25-9*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[39]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[39]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[39]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[39]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[39]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[39]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[39]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[39]++
            }
            else if(mahh.data.data[i].direct > 356.25-10*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[38]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[38]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[38]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[38]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[38]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[38]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[38]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[38]++
            }
            else if(mahh.data.data[i].direct > 356.25-11*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[37]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[37]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[37]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[37]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[37]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[37]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[37]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[37]++
            }
            else if(mahh.data.data[i].direct > 356.25-12*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[36]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[36]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[36]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[36]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[36]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[36]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[36]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[36]++
            }
            else if(mahh.data.data[i].direct > 356.25-13*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[35]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[35]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[35]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[35]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[35]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[35]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[35]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[35]++
            }
            else if(mahh.data.data[i].direct > 356.25-14*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[34]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[34]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[34]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[34]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[34]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[34]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[34]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[34]++
            }
            else if(mahh.data.data[i].direct > 356.25-15*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[33]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[33]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[33]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[33]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[33]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[33]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[33]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[33]++
            }
            else if(mahh.data.data[i].direct > 356.25-16*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[32]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[32]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[32]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[32]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[32]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[32]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[32]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[32]++
            }
            else if(mahh.data.data[i].direct > 356.25-17*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[31]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[31]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[31]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[31]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[31]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[31]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[31]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[31]++
            }
            else if(mahh.data.data[i].direct > 356.25-18*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[30]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[30]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[30]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[30]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[30]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[30]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[30]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[30]++
            }
            else if(mahh.data.data[i].direct > 356.25-19*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[29]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[29]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[29]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[29]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[29]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[29]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[29]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[29]++
            }
            else if(mahh.data.data[i].direct > 356.25-20*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[28]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[28]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[28]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[28]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[28]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[28]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[28]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[28]++
            }
            else if(mahh.data.data[i].direct > 356.25-21*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[27]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[27]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[27]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[27]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[27]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[27]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[27]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[27]++
            }
            else if(mahh.data.data[i].direct > 356.25-22*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[26]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[26]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[26]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[26]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[26]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[26]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[26]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[26]++
            }
            else if(mahh.data.data[i].direct > 356.25-23*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[25]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[25]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[25]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[25]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[25]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[25]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[25]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[25]++
            }
            else if(mahh.data.data[i].direct > 356.25-24*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[24]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[24]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[24]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[24]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[24]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[24]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[24]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[24]++
            }
            else if(mahh.data.data[i].direct > 356.25-25*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[23]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[23]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[23]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[23]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[23]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[23]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[23]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[23]++
            }
            else if(mahh.data.data[i].direct > 356.25-26*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[22]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[22]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[22]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[22]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[22]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[22]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[22]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[22]++
            }
            else if(mahh.data.data[i].direct > 356.25-27*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[21]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[21]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[21]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[21]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[21]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[21]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[21]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[21]++
            }
            else if(mahh.data.data[i].direct > 356.25-28*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[20]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[20]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[20]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[20]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[20]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[20]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[20]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[20]++
            }
            else if(mahh.data.data[i].direct > 356.25-29*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[19]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[19]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[19]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[19]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[19]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[19]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[19]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[19]++
            }
            else if(mahh.data.data[i].direct > 356.25-30*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[18]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[18]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[18]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[18]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[18]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[18]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[18]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[18]++
            }
            else if(mahh.data.data[i].direct > 356.25-31*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[17]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[17]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[17]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[17]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[17]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[17]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[17]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[17]++
            }
            else if(mahh.data.data[i].direct > 356.25-32*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[16]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[16]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[16]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[16]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[16]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[16]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[16]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[16]++
            }
            else if(mahh.data.data[i].direct > 356.25-33*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[15]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[15]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[15]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[15]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[15]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[15]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[15]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[15]++
            }
            else if(mahh.data.data[i].direct > 356.25-34*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[14]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[14]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[14]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[14]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[14]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[14]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[14]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[14]++
            }
            else if(mahh.data.data[i].direct > 356.25-35*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[13]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[13]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[13]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[13]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[13]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[13]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[13]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[13]++
            }
            else if(mahh.data.data[i].direct > 356.25-36*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[12]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[12]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[12]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[12]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[12]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[12]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[12]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[12]++
            }
            else if(mahh.data.data[i].direct > 356.25-37*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[11]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[11]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[11]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[11]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[11]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[11]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[11]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[11]++
            }
            else if(mahh.data.data[i].direct > 356.25-38*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[10]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[10]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[10]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[10]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[10]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[10]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[10]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[10]++
            }
            else if(mahh.data.data[i].direct > 356.25-39*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[9]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[9]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[9]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[9]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[9]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[9]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[9]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[9]++
            }
            else if(mahh.data.data[i].direct > 356.25-40*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[8]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[8]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[8]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[8]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[8]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[8]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[8]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[8]++
            }
            else if(mahh.data.data[i].direct > 356.25-41*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[7]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[7]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[7]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[7]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[7]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[7]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[7]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[7]++
            }
            else if(mahh.data.data[i].direct > 356.25-42*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[6]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[6]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[6]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[6]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[6]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[6]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[6]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[6]++
            }
            else if(mahh.data.data[i].direct > 356.25-43*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[5]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[5]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[5]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[5]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[5]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[5]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[5]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[5]++
            }
            else if(mahh.data.data[i].direct > 356.25-44*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[4]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[4]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[4]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[4]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[4]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[4]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[4]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[4]++
            }
            else if(mahh.data.data[i].direct > 356.25-45*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[3]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[3]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[3]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[3]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[3]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[3]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[3]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[3]++
            }
            else if(mahh.data.data[i].direct > 356.25-46*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[2]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[2]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[2]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[2]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[2]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[2]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[2]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[2]++
            }
            else if(mahh.data.data[i].direct > 356.25-47*7.5) {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[1]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[1]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[1]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[1]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[1]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[1]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[1]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[1]++
            }
            else {
              if(mahh.data.data[i].speed >15.4) this.optionRose.series[7].data[0]++
              else if(mahh.data.data[i].speed >13.2) this.optionRose.series[6].data[0]++
              else if(mahh.data.data[i].speed >11.0) this.optionRose.series[5].data[0]++
              else if(mahh.data.data[i].speed >8.9) this.optionRose.series[4].data[0]++
              else if(mahh.data.data[i].speed >6.7) this.optionRose.series[3].data[0]++
              else if(mahh.data.data[i].speed >4.5) this.optionRose.series[2].data[0]++
              else if(mahh.data.data[i].speed >2.3) this.optionRose.series[1].data[0]++
              else if(mahh.data.data[i].speed >0.1) this.optionRose.series[0].data[0]++
            }
          }
        }
        this.roseChart.setOption(this.optionRose)
        this.viewLoading='hidden'
      })
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
  },
  mounted () {
    // 创建charts实例
    this.roseChart = this.$echarts.init(document.getElementById('RoseChart'))
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
  /* padding: 10px 10px; */
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
  margin-top: 14px;
  /* height: 410px; */
  height: calc(100% - 60px);
}
#RoseChart {
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
