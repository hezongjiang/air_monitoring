<!--告警页面-->
<template>
  <div>
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
      <div style="margin-top: 10px">
        <el-table
          id="table"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ padding:0, background:'#dddddd', fontSize:'13px'}"
          :data="filtedData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          tooltip-effect="dark">
          <el-table-column show-overflow-tooltip prop="macAddress" label="站点名称" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="告警时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airType" label="气体类型" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airValue" label="气体值" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="topType" label="异常类型" align="center"></el-table-column>
        </el-table>
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
      pageSize: 20
    }
  },
  mounted() {
    this.getAddr() // 获取站点选择下拉列表的选项
    this.defaultDate() // 默认日期选择昨天零点到今天
    this.getTable() // 默认获取昨天零点到今天的数据
  },
  methods: {
    getAddr() { // 获取下拉列表选项
      this.$axios.get('/macAirList')
      .then(res => {
        let addrArray = res.data.data
        for (let i = 0; i < addrArray.length; i++) {
          this.addrOptions.push({
            value: i + 1,
            label: addrArray[i].macAddress
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
      let tableData = []
      let filtedData = []
        // 定义字典
      const airTypeMap = {1: 'SO2', 2: 'NO2', 3: 'PM10', 4: 'PM2.5', 5: '温度', 6: '湿度'}
      const topTypeMap = {1: '异常突变', 2: '正常突变'}
      this.currentPage = 1
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
                tableData.push(
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
                filtedData = tableData.filter((item) => {
                    return item.macAddress === this.addrOptions[filter - 1].label
                  }
                )
                console.log(this.addrOptions[filter - 1].label)
              } else {
                filtedData = tableData
              }
              // 数组按告警时间倒序排列
              filtedData.sort(function(a, b) {
                return new Date(b.beginTime) - new Date(a.beginTime)
              })
              this.filtedData = filtedData
            } else {
              console.log('无数据')
            }
          } else {
            console.log('fail')
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
.winmain {
  margin: 10px 70px;
  background: white;
  border-radius: 6px;
  padding: 10px 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  min-height: 529px;
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
</style>
