<!--告警页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>异常告警</span>
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
        <span>气体类型</span>
        <el-select size="mini" v-model="airChoose" placeholder="请选择气体类型">
          <el-option v-for="item in airOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <div class="container-table">
        <el-table
          id="table"
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="tbList.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          tooltip-effect="dark">
          <el-table-column show-overflow-tooltip type="index" label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="macAddress" label="站点名称" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="告警时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airType" label="气体类型" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airValue" label="气体值" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="topType" label="异常类型" align="center"></el-table-column>
        </el-table>
        <div class="loading" :style="{visibility: viewLoading}"><i style="font-size:30px" class="el-icon-loading"></i><br/>loading...</div>
      </div>
    </div>
    <el-pagination
      align="center"
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="tbList.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Alarm',
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      airOptions: [{ // 气体选项
        value: 1,
        label: 'SO2'
      }, {
        value: 2,
        label: 'NO2'
      }, {
        value: 3,
        label: 'PM10'
      }, {
        value: 4,
        label: 'PM2.5'
      }, {
        value: 5,
        label: '温度'
      }, {
        value: 6,
        label: '湿度'
      }],
      airChoose: 1, // 气体选择
      airChooseState: 1, // 气体选择状态
      beginEndT: '', // 开始结束时间
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      N: 1, // 默认显示N天前至当天的信息
      tbList: [], // 表格数据
      currentPage: 1, // 当前页
      pageSize: 20, // 单页数
      viewLoading: 'hidden', // 加载标志可见性
      tableHeight: 'calc(100% - 10px)', // 表格高度
      airTypeOptions: { // 气体类型选项
        1: 'SO2',
        2: 'NO2',
        3: 'PM10',
        4: 'PM2.5',
        5: '温度',
        6: '湿度'
      },
      topTypeOptions: { // 异常类型选项
        1: '异常突变',
        2: '正常突变'
      }
    }
  },
  methods: {
    searchSth() {
      this.currentPage = 1 // 每次查询都回到第一页
      this.viewLoading = 'visible' // 显示加载标志
      this.airChooseState = this.airChoose // 主要用于excel导出，因为这时气体选择器可能人为动过
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.$axios
      .get('/topAirInfo', {
        params: {
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          airType: this.airChoose
        }}
      ).then(tai => {
        if (tai.data.successful && tai.data.data.length) {
          this.tbList = tai.data.data
          for (let i = 0; i < this.tbList.length; i++) {
            this.tbList[i].airType = this.airTypeOptions[this.tbList[i].airType]
            this.tbList[i].topType = this.topTypeOptions[this.tbList[i].topType]
          }
        } else {
          this.tbList = []
        }
        this.viewLoading = 'hidden' // 隐藏加载标志
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) { // 分页器
      this.pageSize = val
    },
    handleCurrentChange(val) { // 分页器
      this.currentPage = val
    },
    exportExcel(e) { // 导出为excel
      e.currentTarget.blur()
      const th = ['站点名称', '告警时间', '气体类型', '气体值', '异常类型']
      const filterVal = ['macAddress', 'beginTime', 'airType', 'airValue', 'topType']
      const data = this.tbList.map(v => filterVal.map(k => v[k]))
      const fileName = this.beginEndTState[0] + '至' + this.beginEndTState[1] + this.airChooseState + '告警'
      const [fileType, sheetName] = ['xlsx', '告警数据']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    }
  },
  mounted() {
    // 开始日期和结束日期初始化
    let t1 = this.$moment().subtract(this.N, 'days').format('YYYY-MM-DD')
    let t2 = this.$moment().format('YYYY-MM-DD')
    this.beginEndT = [t1, t2]
    this.searchSth() // 查询数据
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
