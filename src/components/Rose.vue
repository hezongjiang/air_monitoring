<!--风速风向玫瑰图页面-->
<template>
<div class="container-main">
  <div class="winmain">
    <div class="filter_title">
      <span>风向风速玫瑰图</span>
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
      <span>站点</span>
      <el-select size="mini" v-model="termChoose" placeholder="请选择站点" style="width:150px">
        <el-option v-for="item in termOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
    </div>
    <div class="chart-area">
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
      roseChart: '', // 终端电量图表
      beginT: '', // 日期选择器上显示的开始日期
      endT: '', // 日期选择器上显示的结束日期
      N: 30, // 默认显示昨天至当天的信息
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
      viewLoading: 'hidden',
      chartHeight: 'calc(100% - 10px)',
      termChoose: '吉利社区', // 站点选择器默认选定绿岛湖
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
      optionRose: { // 风速风向玫瑰图的设置数据
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 16,
            color: '#fff',
            fontFamily: 'Microsoft YaHei'
          }
        },
        color:["#0001F7","#00B8FE","#00FFFF","#00FF68","#BEFE00","#FFFF00","#FFA800","#E10100"],
        angleAxis: {
          zlevel:2,
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
          boundaryGap:false,//标签和数据点都会在两个刻度之间的带(band)中间
          axisTick: {
            show: false//是否显示坐标轴刻度
          },
          show:true,
          splitLine: {
            show:true,
            lineStyle:{
              // color:"black"
            },
          },
          axisLabel:{
            show:true,
            interval:5,//坐标轴刻度标签的显示间隔，在类目轴中有效
          },
        },
        radiusAxis: {
          // min:0,
          // max:100,
          axisLabel: {
            formatter: '{value}',
            margin:-5,
            textStyle: {
              fontSize: 10,
              color: 'black',
              // padding:5,
              width:30,
              // backgroundColor:'lightgray',
              // borderColor:'black',
              borderWidth:1,
              fontFamily: 'Microsoft YaHei'
            },
            rich: { }
          },
          zlevel:3,
          axisTick: {
            show: false//是否显示坐标轴刻度
          },
          axisLine:{
            show:true,//是否显示坐标轴轴线
          },
        },
        polar: {
        },
        series: [
        {
          barCategoryGap:0,
          type: 'bar',
          zlevel:1,
          data: [17, 2, 18, 4,
            2,3,4,6,
            1, 6, 3, 4,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,6,
            1, 3, 3, 4,
            2,3,4,6,
            2,7,4,5,
            1, 2, 3, 1,
            2,3,2,6,
            1, 2, 3, 1,
          ],
          coordinateSystem: 'polar',
          name: "0.1-2.3 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
            borderWidth:1,
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [7, 12, 13, 2,
            2,3,4,6,
            1, 2, 3, 2,
            2,3,4,6,
            1, 2, 3, 5,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,1,
            2,3,4,1,
            1, 2, 2, 4,
            2,3,5,1,
            1, 2, 3, 1,
          ],
          coordinateSystem: 'polar',
          name: "2.3-4.5 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [10, 12, 13, 4,
            2,13,14,26,
            11, 12, 23, 34,
            12,33,34,32,
            11, 22, 23, 24,
            2,23,24,6,
            21, 2, 3, 4,
            2,3,4,6,
            12,13,4,6,
            11, 32, 32, 14,
            12,33,24,41,
            1, 2, 3, 1,
          ],
          coordinateSystem: 'polar',
          name: "4.5-6.7 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [10, 2, 13, 2,
            2,3,4,6,
            1, 2, 3, 2,
            2,3,4,6,
            1, 2, 3, 5,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,1,
            2,3,4,1,
            1, 2, 2, 4,
            1, 2, 3, 1,
            2,3,5,1,
          ],
          coordinateSystem: 'polar',
          name: "6.7-8.9 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [10, 2, 13, 4,
            2,3,4,6,
            1, 2, 3, 4,
            1, 2, 3, 1,
            2,3,4,2,
            1, 2, 3, 4,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,6,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,1,
          ],
          coordinateSystem: 'polar',
          name: "8.9-11.0 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [10, 2, 0, 2,
            2,3,4,6,
            1, 2, 3, 2,
            1, 2, 3, 1,
            2,3,4,6,
            1, 2, 3, 5,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,1,
            2,3,4,1,
            1, 2, 2, 4,
            2,3,5,1,
          ],
          coordinateSystem: 'polar',
          name: "11.0-13.2 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [10, 2, 0, 4,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,2,
            1, 2, 3, 4,
            2,3,4,6,
            1, 2, 3, 4,
            1, 2, 3, 1,
            2,3,4,6,
            2,3,4,6,
            1, 2, 3, 4,
            2,3,4,1,
          ],
          coordinateSystem: 'polar',
          name: "13.2-15.4 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        },
        {
          barCategoryGap:0,
          type: 'bar',
          data: [0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            1, 2, 3, 1,
            0, 0, 0, 0,
            1, 2, 3, 4,
            2,3,4,1,
            0, 0, 0, 0,
            1, 2, 2, 4,
            2,3,2,1,
          ],
          coordinateSystem: 'polar',
          name: "15.4-17.6 m/s",
          stack: 'a',
          itemStyle: {
            borderColor:'black',
          }
        }],
        legend: {
          show: true,
          top:0,
          data: ["0.1-2.3 m/s","2.3-4.5 m/s","4.5-6.7 m/s","6.7-8.9 m/s",
                "8.9-11.0 m/s","11.0-13.2 m/s","13.2-15.4 m/s","15.4-17.6 m/s"],
          // width:500,//根据宽度调整换行
        }
      }
    }
  },
  methods: {
    searchSth: function () { // 查询
      let that = this
      this.viewLoading='visible'
      for(let i=0;i<48;i++) {
        for(let j=0;j<8;j++) {
          this.optionRose.series[j].data[i] = 0
        }
      }
      this.$axios.get('/macAirHourHistory',
        {params: {
            macAddress: this.siteMap[this.termChoose],
            beginTime: this.beginT,
            endTime: this.endT,
          }}
      ).then(res => {
        if(res.data.successful) {
          for(let i=0;i<res.data.data.length;i++) {
            if(res.data.data[i].direct > 356.25) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[0]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[0]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[0]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[0]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[0]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[0]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[0]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[0]++
            }
            else if(res.data.data[i].direct > 356.25-1*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[47]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[47]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[47]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[47]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[47]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[47]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[47]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[47]++
            }
            else if(res.data.data[i].direct > 356.25-2*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[46]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[46]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[46]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[46]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[46]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[46]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[46]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[46]++
            }
            else if(res.data.data[i].direct > 356.25-3*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[37]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[37]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[37]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[37]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[37]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[37]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[37]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[37]++
            }
            else if(res.data.data[i].direct > 356.25-4*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[44]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[44]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[44]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[44]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[44]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[44]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[44]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[44]++
            }
            else if(res.data.data[i].direct > 356.25-5*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[43]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[43]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[43]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[43]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[43]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[43]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[43]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[43]++
            }
            else if(res.data.data[i].direct > 356.25-6*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[42]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[42]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[42]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[42]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[42]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[42]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[42]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[42]++
            }
            else if(res.data.data[i].direct > 356.25-7*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[41]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[41]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[41]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[41]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[41]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[41]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[41]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[41]++
            }
            else if(res.data.data[i].direct > 356.25-8*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[40]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[40]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[40]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[40]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[40]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[40]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[40]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[40]++
            }
            else if(res.data.data[i].direct > 356.25-9*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[39]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[39]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[39]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[39]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[39]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[39]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[39]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[39]++
            }
            else if(res.data.data[i].direct > 356.25-10*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[38]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[38]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[38]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[38]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[38]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[38]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[38]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[38]++
            }
            else if(res.data.data[i].direct > 356.25-11*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[37]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[37]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[37]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[37]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[37]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[37]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[37]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[37]++
            }
            else if(res.data.data[i].direct > 356.25-12*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[36]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[36]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[36]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[36]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[36]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[36]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[36]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[36]++
            }
            else if(res.data.data[i].direct > 356.25-13*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[35]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[35]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[35]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[35]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[35]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[35]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[35]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[35]++
            }
            else if(res.data.data[i].direct > 356.25-14*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[34]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[34]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[34]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[34]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[34]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[34]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[34]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[34]++
            }
            else if(res.data.data[i].direct > 356.25-15*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[33]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[33]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[33]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[33]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[33]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[33]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[33]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[33]++
            }
            else if(res.data.data[i].direct > 356.25-16*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[32]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[32]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[32]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[32]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[32]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[32]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[32]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[32]++
            }
            else if(res.data.data[i].direct > 356.25-17*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[31]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[31]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[31]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[31]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[31]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[31]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[31]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[31]++
            }
            else if(res.data.data[i].direct > 356.25-18*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[30]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[30]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[30]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[30]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[30]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[30]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[30]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[30]++
            }
            else if(res.data.data[i].direct > 356.25-19*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[29]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[29]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[29]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[29]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[29]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[29]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[29]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[29]++
            }
            else if(res.data.data[i].direct > 356.25-20*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[28]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[28]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[28]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[28]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[28]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[28]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[28]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[28]++
            }
            else if(res.data.data[i].direct > 356.25-21*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[27]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[27]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[27]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[27]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[27]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[27]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[27]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[27]++
            }
            else if(res.data.data[i].direct > 356.25-22*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[26]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[26]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[26]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[26]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[26]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[26]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[26]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[26]++
            }
            else if(res.data.data[i].direct > 356.25-23*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[25]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[25]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[25]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[25]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[25]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[25]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[25]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[25]++
            }
            else if(res.data.data[i].direct > 356.25-24*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[24]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[24]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[24]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[24]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[24]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[24]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[24]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[24]++
            }
            else if(res.data.data[i].direct > 356.25-25*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[23]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[23]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[23]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[23]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[23]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[23]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[23]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[23]++
            }
            else if(res.data.data[i].direct > 356.25-26*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[22]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[22]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[22]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[22]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[22]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[22]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[22]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[22]++
            }
            else if(res.data.data[i].direct > 356.25-27*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[21]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[21]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[21]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[21]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[21]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[21]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[21]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[21]++
            }
            else if(res.data.data[i].direct > 356.25-28*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[20]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[20]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[20]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[20]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[20]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[20]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[20]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[20]++
            }
            else if(res.data.data[i].direct > 356.25-29*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[19]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[19]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[19]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[19]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[19]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[19]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[19]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[19]++
            }
            else if(res.data.data[i].direct > 356.25-30*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[18]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[18]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[18]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[18]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[18]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[18]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[18]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[18]++
            }
            else if(res.data.data[i].direct > 356.25-31*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[17]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[17]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[17]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[17]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[17]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[17]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[17]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[17]++
            }
            else if(res.data.data[i].direct > 356.25-32*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[16]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[16]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[16]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[16]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[16]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[16]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[16]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[16]++
            }
            else if(res.data.data[i].direct > 356.25-33*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[15]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[15]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[15]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[15]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[15]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[15]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[15]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[15]++
            }
            else if(res.data.data[i].direct > 356.25-34*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[14]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[14]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[14]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[14]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[14]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[14]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[14]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[14]++
            }
            else if(res.data.data[i].direct > 356.25-35*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[13]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[13]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[13]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[13]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[13]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[13]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[13]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[13]++
            }
            else if(res.data.data[i].direct > 356.25-36*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[12]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[12]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[12]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[12]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[12]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[12]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[12]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[12]++
            }
            else if(res.data.data[i].direct > 356.25-37*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[11]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[11]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[11]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[11]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[11]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[11]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[11]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[11]++
            }
            else if(res.data.data[i].direct > 356.25-38*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[10]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[10]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[10]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[10]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[10]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[10]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[10]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[10]++
            }
            else if(res.data.data[i].direct > 356.25-39*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[9]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[9]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[9]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[9]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[9]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[9]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[9]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[9]++
            }
            else if(res.data.data[i].direct > 356.25-40*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[8]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[8]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[8]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[8]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[8]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[8]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[8]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[8]++
            }
            else if(res.data.data[i].direct > 356.25-41*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[7]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[7]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[7]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[7]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[7]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[7]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[7]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[7]++
            }
            else if(res.data.data[i].direct > 356.25-42*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[6]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[6]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[6]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[6]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[6]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[6]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[6]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[6]++
            }
            else if(res.data.data[i].direct > 356.25-43*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[5]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[5]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[5]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[5]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[5]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[5]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[5]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[5]++
            }
            else if(res.data.data[i].direct > 356.25-44*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[4]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[4]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[4]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[4]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[4]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[4]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[4]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[4]++
            }
            else if(res.data.data[i].direct > 356.25-45*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[3]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[3]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[3]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[3]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[3]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[3]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[3]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[3]++
            }
            else if(res.data.data[i].direct > 356.25-46*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[2]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[2]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[2]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[2]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[2]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[2]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[2]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[2]++
            }
            else if(res.data.data[i].direct > 356.25-47*7.5) {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[1]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[1]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[1]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[1]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[1]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[1]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[1]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[1]++
            }
            else {
              if(res.data.data[i].speed >15.4) this.optionRose.series[7].data[0]++
              else if(res.data.data[i].speed >13.2) this.optionRose.series[6].data[0]++
              else if(res.data.data[i].speed >11.0) this.optionRose.series[5].data[0]++
              else if(res.data.data[i].speed >8.9) this.optionRose.series[4].data[0]++
              else if(res.data.data[i].speed >6.7) this.optionRose.series[3].data[0]++
              else if(res.data.data[i].speed >4.5) this.optionRose.series[2].data[0]++
              else if(res.data.data[i].speed >2.3) this.optionRose.series[1].data[0]++
              else if(res.data.data[i].speed >0.1) this.optionRose.series[0].data[0]++
            }
          }
        }
        that.roseChart.setOption(that.optionRose)
        that.viewLoading='hidden'
      })
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
    },
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
    this.roseChart = this.$echarts.init(document.getElementById('RoseChart'))
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
.sth-gone {
  display: none;
}
</style>
