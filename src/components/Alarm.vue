<!--告警页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_title">
        <i class="fa fa-filter"></i><span>筛选条件</span>
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
        <el-select size="mini" v-model="value2" clearable placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="getTable">查询</el-button>
        <el-button v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
      </div>
      <!--表格-->
      <div class="table-container">
        <el-table
          id="table"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ padding:0, background:'#dddddd', fontSize:'13px'}"
          :data="filtedData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          tooltip-effect="dark">
          <el-table-column show-overflow-tooltip prop="macAddress" label="站点名称" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="告警时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airType" label="气体类型" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airValue" label="气体值" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="topType" label="异常类型" align="center"></el-table-column>
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
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="filtedData.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Alarm',
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
      value2: '',
      tableData: [],
      filtedData: [],
      currentPage: 1,
      pageSize: 20,
      viewLoading: 'hidden',
      tableHeight: '100%'
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
            value: i + 1,
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
      const th = ['站点名称', '告警时间', '气体类型', '气体值', '异常类型']
      const filterVal = ['macAddress', 'beginTime', 'airType', 'airValue', 'topType']
      const data = this.filtedData.map(v => filterVal.map(k => v[k]))
      const addr = (this.value2 === '') ? '所有站点' : this.addrOptions[this.value2 - 1].label
      const fileName = this.value1[0] + '至' + this.value1[1] + addr + '告警'
      const [fileType, sheetName] = ['xlsx', '告警数据']
      this.$toExcel({th, data, fileName, fileType, sheetName})
    },
    // 获取表格数据后并筛选
    getTable() {
      let date = this.value1 // 日期
      let filter = this.value2 // 站点
      // 定义字典
      const airTypeMap = {1: 'SO2', 2: 'NO2', 3: 'PM10', 4: 'PM2.5', 5: '温度', 6: '湿度'}
      const topTypeMap = {1: '异常突变', 2: '正常突变'}
      this.tableData = []
      this.filtedData = []
      this.currentPage = 1
      this.viewLoading='visible'
      for (let i = 1; i <= 6; i++) {
        this.$axios.get('/topAirInfo',
          {params: {
              beginTime: date[0],
              endTime: date[1],
              airType: i
            }}
        ).then(res => {
          if (res.data.successful) {
            if (res.data.data.length !== 0) {
              console.log('有数据')
              let topData = res.data.data
              // 获取该日期下的所有数据
              for (let k = 0; k < topData.length; k++) {
                this.tableData.push(
                  {
                    macAddress: topData[k].macAddress,
                    beginTime: topData[k].beginTime,
                    airType: airTypeMap[topData[k].airType],
                    airValue: topData[k].airValue,
                    topType: topTypeMap[topData[k].topType]
                  }
                )
              }
              // 根据下拉框选择的站点进行筛选
              if (filter) {
                this.filtedData = this.tableData.filter((item) => {
                    return item.macAddress === this.addrOptions[filter - 1].label
                  }
                )
                console.log(this.addrOptions[filter - 1].label)
              } else {
                this.filtedData = this.tableData
              }
              // 数组按告警时间倒序排列
              this.filtedData.sort(function(a, b) {
                return new Date(b.beginTime) - new Date(a.beginTime)
              })
            } else {
              console.log('无数据')
            }
          } else {
            console.log('fail')
          }
          if(i==6) {
            this.viewLoading='hidden'
          }
        }).catch(error => {
          console.log(error)
        })
      }
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
  margin: 10px 70px;
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
  font-size: 15px;
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
