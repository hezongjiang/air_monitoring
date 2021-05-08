<!--站点维护记录页面-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>站点维护记录</span>
      </div>
      <div class="container-filter">
        <span>站点</span>
        <el-select size="mini" v-model="addrChoose" clearable placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-on:click="searchSth"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;查询</el-button>
        <el-button type="success" plain v-on:click="exportExcel($event)" size="mini" style="float: right"><i class="fa fa-download"></i>&nbsp;导出Excel</el-button>
        <AddDefend @onSubmit="searchSth" ref="edit" style="float:right"></AddDefend>
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
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="检修时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="person" label="操作员" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="airTime" label="空气传感器下次检修时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="pmTime" label="pm下次检修时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="检修内容" align="center"></el-table-column>
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
import AddDefend from './AddDefend'
export default {
  name: 'Defend',
  components: {AddDefend},
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
      addrOptions: [], // 站点选项
      addrChoose: '', // 站点选择
      addrChooseState: '', // 站点选择状态，主要用于excel导出，因为这时站点选择器可能人为动过
      tbList: [], // 表格数据
      currentPage: 1, // 当前页
      pageSize: 20, // 单页数
      viewLoading: 'hidden', // 加载标志可见性
      tableHeight: 'calc( 100% - 10px)' // 表格高度
    }
  },
  methods: {
    searchSth() { // 查询数据
      this.currentPage = 1 // 每次查询都回到第一页
      this.viewLoading = 'visible' // 显示加载标志
      this.addrChooseState = this.addrChoose // 主要用于excel导出，因为这时站点选择器可能人为动过
      this.$axios.get('/siteInfoList', {
        params: {
          macAddress: this.addrChoose
        }
      })
      .then(sil => {
        if (sil.data.successful && sil.data.data.length) {
          this.tbList = sil.data.data
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
      let addrRemark = ''
      e.currentTarget.blur()
      this.$axios
      .get('/' + this.addrChooseState + '/macAirDeviceInfo')
      .then(madi => {
        if (madi.data.successful && madi.data.data.length) {
          addrRemark = madi.data.data[0].remark
        }
        const th = ['mac地址', '检修时间', '操作员', '空气传感器下次检修时间', 'pm下次检修时间', '检修内容']
        const filterVal = ['macAddress', 'beginTime', 'person', 'airTime', 'pmTime', 'remark']
        const data = this.tbList.map(v => filterVal.map(k => v[k]))
        const fileName = this.$moment().format('YYYY-MM-DD HH-mm-ss') + addrRemark + '维护记录'
        const [fileType, sheetName] = ['xlsx', '站点维护记录']
        this.$toExcel({th, data, fileName, fileType, sheetName})
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  mounted() {
    this.viewLoading = 'visible' // 因为初次自动查询在axios回调里有等待时间，所以这里先手动显示加载标志
    // 其它初始化
    this.$axios
    .get('/macAirDeviceList')
    .then(madl => {
      if (madl.data.successful && madl.data.data.length) {
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
