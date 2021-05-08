<!--历史数据-->
<template>
  <div class="container-main">
    <div class="winmain" >
      <div class="title-filter">
        <span>历史数据详情</span>
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
        <el-select size="mini" v-model="addrChoose" placeholder="请选择站点">
          <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          :data="tbList"
          stripe
          highlight-current-row
          border
          :height= "tableHeight"
          tooltip-effect="dark">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="macAddress" label="mac地址" align="center" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="beginTime" label="监测时间" align="center" width="140"></el-table-column>
          <el-table-column show-overflow-tooltip prop="temp" label="气温（℃）" align="center" width="90"></el-table-column>
          <el-table-column show-overflow-tooltip prop="humidity" label="湿度（%R.H.）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="SO2" label="SO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="NO2" label="NO2（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM10" label="PM10（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PM25" label="PM2.5（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="CO" label="CO（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="O3" label="O3（μg/m³）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="speed" label="风速（m/s）" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="direct" label="风向" align="center" width="110"></el-table-column>
        </el-table>
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
      :total="tbListTotal">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'HistoryData',
  data() {
    return {
      pickerOptions: { // 日期选择器的快捷选项
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
      tbListTotal: 0,
      addrOptions: [], // 站点选项
      N: 1, // 默认显示N天前至当天的信息
      beginEndT: [], // 开始结束日期
      beginEndTState: [], // 开始结束日期状态，主要用于excel导出，因为这时日期选择器可能人为动过
      addrChoose: '', // 站点选择
      addrChooseState: '', // 站点选择状态，主要用于excel导出，因为这时站点选择器可能人为动过
      tbList: [], // 表格数据
      currentPage: 1, // 当前页
      pageSize: 20, // 单页数
      viewLoading: 'hidden', // 加载标志可见性
      tableHeight: 'calc(100% - 10px)' // 表格高度
    }
  },
  methods: {
    searchSomething() { // 查询数据
      this.viewLoading = 'visible' // 显示加载标志
      this.beginEndTState = this.beginEndT // 主要用于excel导出，因为这时日期选择器可能人为动过
      this.addrChooseState = this.addrChoose // 主要用于excel导出，因为这时站点选择器可能人为动过
      this.$axios
      .get('/macAirHistory', {
        params: {
          macAddress: this.addrChoose,
          beginTime: this.beginEndT[0],
          endTime: this.beginEndT[1],
          pageIndex: this.currentPage,
          pageSize: this.pageSize
        }
      })
      .then(mah => {
        if (mah.data.successful && mah.data.data.length) {
          this.tbListTotal = mah.data.total
          this.tbList = mah.data.data
          for (let i = 0; i < this.tbList.length; i++) {
            // 气体浓度值保留两位小数
            this.tbList[i].SO2 = parseFloat(this.tbList[i].SO2).toFixed(2)
            this.tbList[i].NO2 = parseFloat(this.tbList[i].NO2).toFixed(2)
            this.tbList[i].PM10 = parseFloat(this.tbList[i].PM10).toFixed(2)
            this.tbList[i].PM25 = parseFloat(this.tbList[i].PM25).toFixed(2)
            this.tbList[i].CO = parseFloat(this.tbList[i].CO).toFixed(2)
            this.tbList[i].O3 = parseFloat(this.tbList[i].O3).toFixed(2)
            // 根据风速值选择不同强度的风
            if (this.tbList[i].speed >= 10) {
              this.tbList[i].speed = this.tbList[i].speed + '（强风）'
            } else if (this.tbList[i].speed >= 6) {
              this.tbList[i].speed = this.tbList[i].speed + '（和风）'
            } else if (this.tbList[i].speed > 0) {
              this.tbList[i].speed = this.tbList[i].speed + '（微风）'
            } else {
              this.tbList[i].speed = this.tbList[i].speed + '（无风）'
            }
            // 根据风向值选择不同的风向
            if (this.tbList[i].direct >= 348) {
              this.tbList[i].direct = this.tbList[i].direct + '（北风）'
            } else if (this.tbList[i].direct >= 282) {
              this.tbList[i].direct = this.tbList[i].direct + '（西北风）'
            } else if (this.tbList[i].direct >= 258) {
              this.tbList[i].direct = this.tbList[i].direct + '（西风）'
            } else if (this.tbList[i].direct >= 192) {
              this.tbList[i].direct = this.tbList[i].direct + '（西南风）'
            } else if (this.tbList[i].direct >= 168) {
              this.tbList[i].direct = this.tbList[i].direct + '（南风）'
            } else if (this.tbList[i].direct >= 102) {
              this.tbList[i].direct = this.tbList[i].direct + '（东南风）'
            } else if (this.tbList[i].direct >= 78) {
              this.tbList[i].direct = this.tbList[i].direct + '（东风）'
            } else if (this.tbList[i].direct >= 12) {
              this.tbList[i].direct = this.tbList[i].direct + '（东北风）'
            } else {
              this.tbList[i].direct = this.tbList[i].direct + '（北风）'
            }
          }
        } else {
          this.tbList = []
        }
        this.viewLoading = 'hidden' // 隐藏加载标志
      }).catch(error => {
        console.log(error)
      })
    },
    searchSth() {
      this.currentPage = 1 // 每次查询都回到第一页
      this.searchSomething()
    },
    handleSizeChange(val) { // 分页器
      this.pageSize = val
      this.currentPage = 1 // 每次查询都回到第一页
      this.searchSomething()
    },
    handleCurrentChange(val) { // 分页器
      this.currentPage = val
      this.searchSomething()
    },
    exportExcel(e) { // 导出为excel
      let tbL = []
      let addrRemark = ''
      let that = this
      e.currentTarget.blur()
      this.$axios
      .all([this.$axios.get('/' + this.addrChooseState + '/macAirDeviceInfo'),
        this.$axios.get('/macAirHistory', {
          params: {
            macAddress: this.addrChooseState,
            beginTime: this.beginEndTState[0],
            endTime: this.beginEndTState[1]
          }
        })
      ])
      .then(this.$axios.spread(function (madi, mah) {
        if (madi.data.successful && madi.data.data.length) {
          addrRemark = madi.data.data[0].remark
        }
        if (mah.data.successful && mah.data.data.length) {
          tbL = mah.data.data
          for (let i = 0; i < tbL.length; i++) {
            // 气体浓度值保留两位小数
            tbL[i].SO2 = parseFloat(tbL[i].SO2).toFixed(2)
            tbL[i].NO2 = parseFloat(tbL[i].NO2).toFixed(2)
            tbL[i].PM10 = parseFloat(tbL[i].PM10).toFixed(2)
            tbL[i].PM25 = parseFloat(tbL[i].PM25).toFixed(2)
            tbL[i].CO = parseFloat(tbL[i].CO).toFixed(2)
            tbL[i].O3 = parseFloat(tbL[i].O3).toFixed(2)
            // 根据风速值选择不同强度的风
            if (tbL[i].speed >= 10) {
              tbL[i].speed = tbL[i].speed + '（强风）'
            } else if (tbL[i].speed >= 6) {
              tbL[i].speed = tbL[i].speed + '（和风）'
            } else if (tbL[i].speed > 0) {
              tbL[i].speed = tbL[i].speed + '（微风）'
            } else {
              tbL[i].speed = tbL[i].speed + '（无风）'
            }
            // 根据风向值选择不同的风向
            if (tbL[i].direct >= 348) {
              tbL[i].direct = tbL[i].direct + '（北风）'
            } else if (tbL[i].direct >= 282) {
              tbL[i].direct = tbL[i].direct + '（西北风）'
            } else if (tbL[i].direct >= 258) {
              tbL[i].direct = tbL[i].direct + '（西风）'
            } else if (tbL[i].direct >= 192) {
              tbL[i].direct = tbL[i].direct + '（西南风）'
            } else if (tbL[i].direct >= 168) {
              tbL[i].direct = tbL[i].direct + '（南风）'
            } else if (tbL[i].direct >= 102) {
              tbL[i].direct = tbL[i].direct + '（东南风）'
            } else if (tbL[i].direct >= 78) {
              tbL[i].direct = tbL[i].direct + '（东风）'
            } else if (tbL[i].direct >= 12) {
              tbL[i].direct = tbL[i].direct + '（东北风）'
            } else {
              tbL[i].direct = tbL[i].direct + '（北风）'
            }
          }
        } else {
          tbL = []
        }
        const th = ['mac地址', '监测时间', '气温（℃）', '湿度（%R.H.）', 'SO2（μg/m³）', 'NO2（μg/m³）', 'PM10（μg/m³）', 'PM2.5（μg/m³）', 'CO（μg/m³）', 'O3（μg/m³）', '风速（m/s）', '风向']
        const filterVal = ['macAddress', 'beginTime', 'temp', 'humidity', 'SO2', 'NO2', 'PM10', 'PM25', 'CO', 'O3', 'speed', 'direct']
        const data = tbL.map(v => filterVal.map(k => v[k]))
        const fileName = that.beginEndTState[0] + '至' + that.beginEndTState[1] + addrRemark + '历史数据详情'
        const [fileType, sheetName] = ['xlsx', '历史数据详情']
        that.$toExcel({th, data, fileName, fileType, sheetName})
      }))
      .catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    if (document.body.clientWidth < 891) { // 浏览器窗口过窄时元素会挤占到下一行，使得表格突出去，这里根据浏览器窗口宽度调整表格高度
      this.tableHeight = 'calc(100% - 40px)'
    }
    console.log(this.tableHeight)
  },
  mounted() {
    this.viewLoading = 'visible' // 显示加载标志
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
