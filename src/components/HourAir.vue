<!--小时空气页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_title">
        <span>小时空气</span>
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
        <el-button type="primary" size="mini" v-on:click="getTable">查询</el-button>
        <el-button v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <!--表格-->
      <div class="table-container">
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
          tooltip-effect="dark">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="130"></el-table-column>
          <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center" width="90"></el-table-column>
          <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center" width="120"></el-table-column>
        </el-table>
        <div class="loading-background" :style="{visibility: viewLoading}"></div>
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
      layout="total, sizes, prev, pager, next"
      :total="list.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'HourAir',
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
      addrOptions: [],
      value1: '',
      value2: '绿岛湖',
      list: [],
      currentPage: 1,
      pageSize: 24,
      viewLoading: 'hidden',
      tableHeight: '100%',
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
      start.setTime(end.getTime() - 3600 * 1000 * 24)
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
      this.value1 = [start, end]
    },
    // 分页器
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 导出为excel
    exportExcel(e) {
      e.currentTarget.blur()
      const th = ['监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', '风速（m/s）', '风向']
      const filterVal = ['beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'speed', 'direct']
      const data = this.list.map(v => filterVal.map(k => v[k]))
      const fileName = this.value1[0] + '至' + this.value1[1] + this.value2 + '小时空气'
      const [fileType, sheetName] = ['xlsx', '小时空气']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    },
    // 获取表格数据后并筛选
    getTable() {
      let date = this.value1 // 日期
      let filter = this.value2 // 站点
      // 定义字典
      this.list = []
      this.currentPage = 1
      this.viewLoading='visible'
      this.$axios.get('/macAirHourHistory',
        {params: {
            macAddress: this.siteMap[this.value2],
            beginTime: date[0],
            endTime: date[1],
          }}
      ).then(res => {
        if (res.data.successful) {
          this.list = res.data.data
          for(var i=0;i<this.list.length;i++) {
          this.list[i].SO2 = parseFloat(this.list[i].SO2).toFixed(2)
          this.list[i].NO2 = parseFloat(this.list[i].NO2).toFixed(2)
          this.list[i].PM10 = parseFloat(this.list[i].PM10).toFixed(2)
          this.list[i].PM25 = parseFloat(this.list[i].PM25).toFixed(2)
          // 根据风速值选择不同强度的风
          if(this.list[i].speed >= 10) { this.list[i].speed = this.list[i].speed + '（强风）' }
          else if(this.list[i].speed >= 6) { this.list[i].speed = this.list[i].speed + '（和风）' }
          else if(this.list[i].speed > 0) { this.list[i].speed = this.list[i].speed + '（微风）' }
          else { this.list[i].speed = this.list[i].speed + '（无风）' }
          // 根据风向值选择不同的风向
          if(this.list[i].direct >= 348) { this.list[i].direct = this.list[i].direct + '（北风）' }
          else if(this.list[i].direct >= 282) { this.list[i].direct = this.list[i].direct + '（西北风）' }
          else if(this.list[i].direct >= 258) { this.list[i].direct = this.list[i].direct + '（西风）' }
          else if(this.list[i].direct >= 192) { this.list[i].direct = this.list[i].direct + '（西南风）' }
          else if(this.list[i].direct >= 168) { this.list[i].direct = this.list[i].direct + '（南风）' }
          else if(this.list[i].direct >= 102) { this.list[i].direct = this.list[i].direct + '（东南风）' }
          else if(this.list[i].direct >= 78) { this.list[i].direct = this.list[i].direct + '（东风）' }
          else if(this.list[i].direct >= 12) { this.list[i].direct = this.list[i].direct + '（东北风）' }
          else { this.list[i].direct = this.list[i].direct + '（北风）' }
        }
          this.viewLoading='hidden'
        } else {
          console.log('fail')
        }
      }).catch(error => {
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
#table {
  width: 100%;
  /* height: 432px; */
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
