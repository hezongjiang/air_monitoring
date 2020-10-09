<!--站点维护记录页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="filter_title">
        <span>站点维护记录</span>
      </div>
      <!--筛选条件-->
      <div class="filter_container">
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
          :row-style="{height:'35px'}"
          :cell-style="{ padding:0, fontSize:'12px'}"
          :header-cell-style="{ background:'#dddddd', fontSize:'13px'}"
          :data="filtedData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          tooltip-effect="dark">
          <el-table-column show-overflow-tooltip type="index" label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="检修时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="person" label="操作员" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airTime" label="空气传感器下次检修时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="pmTime" label="pm下次检修时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="检修内容" align="center"></el-table-column>
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
      siteMark: { // mac地址与站点名称的对应关系
        '440604:009:AAJ': '龙湾大桥',
        '440604:002:AAC': '罗南村委',
        '440604:000:AAA': '绿岛湖',
        '440604:006:AAG': '龙津老年活动中心',
        '440604:007:AAH': '南庄三中',
        '440604:004:AAE': '吉利小学',
        '440604:005:AAF': '罗格村委',
        '440604:008:AAI': '吉利社区',
        '440604:001:AAB': '南庄实验中学',
        '440604:003:AAD': '南庄水利所',
        '440604:010:AAK': '南庄污水处理厂'
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
      this.tableData = []
      this.filtedData = []
      this.currentPage = 1
      this.viewLoading='visible'
      this.$axios.get('/siteInfoList',
      ).then(res => {
        if (res.data.successful) {
          if (res.data.data.length !== 0) {
            console.log('有数据')
            // 获取所有数据
            this.tableData = res.data.data
            for(let i=0;i<this.tableData.length;i++) {
              this.tableData[i].macAddress = this.siteMark[this.tableData[i].macAddress]
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
            // 数组按维护时间倒序排列
            this.filtedData.sort(function(a, b) {
              return new Date(b.beginTime) - new Date(a.beginTime)
            })
          } else {
            console.log('无数据')
          }
        } else {
          console.log('fail')
        }
        this.viewLoading='hidden'
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
