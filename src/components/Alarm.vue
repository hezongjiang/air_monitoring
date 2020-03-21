<!--告警页面-->
<template>
  <div>
    <div class="form_container" >
      <div id="filter_title">
        <img src="../assets/filter.png">
        <span>筛选条件</span>
      </div>
      <!--筛选条件-->
      <div id="filter_container">
        <span style="padding: 6px;">选择时间</span>
        <el-date-picker size="medium" v-model="value1" value-format="yyyy-MM-dd" type="daterange" align="left" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>

        <span style="padding: 10px 10px 10px 60px;">站点</span>
        <el-select size="medium" v-model="value2" clearable placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="medium" v-on:click="getTable" style="margin-left: 20px">查询</el-button>
        <el-button v-on:click="exportExcel" size="medium" style="float: right; margin-right:6px "><i class="el-icon-download"></i>导出Excel</el-button>
      </div>
      <!--表格-->
      <div style="padding: 30px">
      <el-table id="table" :data="filtedData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
                stripe highlight-current-row border >
        <el-table-column prop="macAddress" label="站点名称" align="center"></el-table-column>
        <el-table-column prop="beginTime" label="告警时间" align="center"></el-table-column>
        <el-table-column prop="airType" label="气体类型" align="center"></el-table-column>
        <el-table-column prop="airValue" label="气体值" align="center"></el-table-column>
        <el-table-column prop="topType" label="异常类型" align="center"></el-table-column>
      </el-table>
      </div>
    </div>
    <!--分页器-->
    <el-pagination align="center" @size-change='handleSizeChange' @current-change='handleCurrentChange'
                   :current-page="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next"
                   :total="filtedData.length" style="padding: 10px 20px 40px 20px;">
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
            pageSize: 10
          }
      },
      mounted() {
          this.getAddr() // 获取站点选择下拉列表的选项
          this.defaultDate() // 默认日期选择昨天零点到今天
          this.getTable() // 默认获取昨天零点到今天的数据
      },
      methods: {
          getAddr() { // 获取下拉列表选项
            this.$axios.get('/device/macAirList')
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
          exportExcel() {
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
          for (let i = 1; i <= 6; i++) {
            this.$axios.get('/device/topAirInfo',
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
  .form_container{
    margin: 10px 90px 10px 90px;
    padding-bottom: 20px ;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    min-height: 560px;
  }
  #filter_title{
    text-align:left;
    height: 30px;
    padding: 30px 20px 0 20px;
  }
  #filter_title span{
    font-weight: bold;
    float: left;
    line-height: 30px
  }
  #filter_title img{
    float: left;
    height: 30px;
  }
  #filter_container{
    text-align:left;
    padding: 10px 26px;
  }
  #filter_container span{
    font-size: 14px;
  }

</style>
