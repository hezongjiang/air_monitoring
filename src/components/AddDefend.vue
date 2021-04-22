<template>
  <div>
    <el-button type="primary" plain v-on:click="openDialogForm($event)" size="mini"><i class="fa fa-plus"></i>&nbsp;添加记录</el-button>
    <el-dialog
      title="添加维护记录"
      :visible.sync="dialogFormVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="clear">
      <el-form v-model="form" style="text-align: left" :rules="submitRules"  :model="form" status-icon ref="dataForm">
        <el-form-item label="操作员" :label-width="formLabelWidth" prop="person">
          <el-input v-model="form.person" autocomplete="off" placeholder="请输入操作员"></el-input>
        </el-form-item>
        <el-form-item label="mac地址" :label-width="formLabelWidth" prop="macAddress">
          <el-select v-model="form.macAddress" clearable placeholder="请选择站点" style="width:100%">
            <el-option v-for="item in addrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检修开始时间" :label-width="formLabelWidth" prop="beginTime">
          <el-date-picker
            type="datetime"
            v-model="form.beginTime"
            placeholder="检修开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检修结束时间" :label-width="formLabelWidth" prop="endTime">
          <el-date-picker
            type="datetime"
            v-model="form.endTime"
            placeholder="检修结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="空气下次时间" :label-width="formLabelWidth" prop="airTime">
          <el-date-picker
            type="date"
            v-model="form.airTime"
            placeholder="检修日期"
            format="yyyy-M-d"
            value-format="yyyy-M-d"
            style="width:100%"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="pm下次时间" :label-width="formLabelWidth" prop="pmTime">
          <el-date-picker
            type="date"
            v-model="form.pmTime"
            placeholder="检修日期"
            format="yyyy-M-d"
            value-format="yyyy-M-d"
            style="width:100%"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检修内容" :label-width="formLabelWidth" prop="remark">
          <el-input type="textarea" v-model="form.remark" autocomplete="off" placeholder="请输入检修内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="tips" :style="{display:(displaySign===1?'':'none')}">{{tip}}</div>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddDefend',
    data() {
      return {
        tip: '必填项不能为空',
        displaySign: 0,
        dialogFormVisible: false,
        addrOptions: [],
        form: {
          macAddress: '',
          beginTime: '',
          endTime: '',
          person: '',
          airTime: '',
          pmTime: '',
          remark: ''
        },
        submitRules: { // 绑定在form表单中的验证规则
          macAddress: [{ required: true, message: '站点不能为空', trigger: 'blur' }],
          beginTime: [{ required: true, message: '检修开始时间不能为空', trigger: 'blur' }],
          endTime: [{ required: true, message: '检修结束时间不能为空', trigger: 'blur' }],
          person: [{ required: true, message: '操作员不能为空', trigger: 'blur' }],
          airTime: [{ required: true, message: '空气下次时间不能为空', trigger: 'blur' }],
          pmTime: [{ required: true, message: 'pm下次时间不能为空', trigger: 'blur' }],
          remark: [{ required: true, message: '检修内容不能为空', trigger: 'blur' }],
        },
        formLabelWidth: '110px'
      }
    },
    mounted() {
      this.getAddr() // 获取站点选择下拉列表的选项
    },
    methods: {
      getAddr() { // 获取下拉列表选项
        this.$axios.get('/macAirDeviceList')
          .then(res => {
            let addrArray = res.data.data
            for (let i = 0; i < addrArray.length; i++) {
              this.addrOptions.push({
                value: addrArray[i].macAddress,
                label: addrArray[i].remark
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      openDialogForm(e) {
        e.currentTarget.blur()
        this.dialogFormVisible = true
      },
      clear() {
        this.displaySign = 0
        // this.form = {
        //   macAddress: '',
        //   beginTime: '',
        //   endTime: '',
        //   person: '',
        //   airTime: '',
        //   pmTime: '',
        //   remark: ''
        // }
      },
      onSubmit() {
        if (this.form.macAddress === '' || this.form.beginTime === '' ||
            this.form.person === '' || this.form.airTime === '' ||
            this.form.pmTime === '' || this.form.remark === '') {
          this.displaySign = 1
        } else {
          this.$message({
            message: '此功能未实现',
            center: true,
            duration: 2000
          })
          this.displaySign = 0
          // this.$axios
          // .post('https://airapi.feelt-sport.com/device/SiteInfo', {
          //   macAddress: this.form.macAddress,
          //   beginTime: this.form.beginTime,
          //   endTime: this.form.endTime,
          //   person: this.form.person,
          //   airTime: this.form.airTime,
          //   pmTime: this.form.pmTime,
          //   remark: this.form.remark
          // }).then(resp => {
          //   if (resp && resp.status === 200) {
          //     this.$message({
          //       message: '添加成功',
          //       center: true,
          //       duration: 2000
          //     })
          //     this.dialogFormVisible = false
          //     this.form = {
          //       macAddress: '',
          //       beginTime: '',
          //       endTime: '',
          //       person: '',
          //       airTime: '',
          //       pmTime: '',
          //       remark: ''
          //     }
          //     this.$emit('onSubmit')
          //   }
          // }).catch(error => {
          //   console.log(error)
          // })
        }
      }
    }
  }
</script>

<style scoped>
  .tips {
    text-align: right;
    font-size: 14px;
    color: #f56c6c;
    line-height: 20px;
  }
</style>
