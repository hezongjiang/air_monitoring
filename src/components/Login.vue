<template>
    <!--登录界面-->

      <el-form class="login-container" status-icon :rules="loginRules" :model="loginForm" ref="loginForm">
        <h2 class="login-title">大气质量智能监控平台</h2>
        <div class='tips' :class="displaySign===0?'':goneClass">&nbsp;</div>
        <div class="tips" :class="displaySign===1?'':goneClass">{{tip1}}</div>
        <div class="tips" :class="displaySign===2?'':goneClass">{{tip2}}</div>
        <div class="tips" :class="displaySign===3?'':goneClass">{{tip3}}</div>
        <el-form-item prop="username">
          <el-input @keyup.enter.native="login" v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input @keyup.enter.native="login" v-model="loginForm.password" placeholder="密码" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item prop="verifycode">
          <el-input @keyup.enter.native="login" v-model="loginForm.verifycode" placeholder="验证码" prefix-icon="el-icon-unlock"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="identifybox">
            <div @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
            <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%; border: none" v-on:click="login">登录</el-button>
        </el-form-item>
      </el-form>

</template>

<script>
import SIdentify from '@/components/SIdentify.vue'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        verifycode: '',
      },
      responseResult: [],
      tip1: '账号和密码不能为空',
      tip2: '账号和密码长度至少为4',
      tip3: '验证码错误',
      displaySign: 0,
      goneClass: 'sth-gone',
      identifyCodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R','S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      identifyCode: '',
      loginRules: { // 绑定在form表单中的验证规则
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' },
                   { min: 4, message: '账号长度至少为4位', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
                   { min: 4, message: '密码长度至少为4位', trigger: 'blur' }],
        verifycode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
    }
  },
  components: {
    SIdentify
  },
  methods: {
    login() {
      if (this.loginForm.username === '' || this.loginForm.password === '') { // 检验是否为空
        this.displaySign = 1
      }
      else if (this.loginForm.username.length < 4 || this.loginForm.password.length < 4) {
        this.displaySign = 2
      }
      else if (this.loginForm.verifycode.toUpperCase() != this.identifyCode) { // 检验验证码
        this.displaySign = 3
      }
      else {
        this.displaySign = 0
        this.$axios.get('/login',
          {params: {
              loginName: this.loginForm.username,
              password: this.loginForm.password
            }}
        ).then(res => {
            console.log(res)
            if (res.data.successful === true) { // successful = true为登录成功
                this.$message({
                  message: '登录成功',
                  center: true,
                  duration: 1000
                })
                // 登录成功后，将loginForm信息存入本地
                var path = this.$route.query.redirect
                window.sessionStorage.setItem('username',this.loginForm.username)
                this.$router.push(path === '/' || path === undefined ? '/index' : path)
              } else {
                this.$message({
                  message: '账号或密码错误',
                  center: true,
                  duration: 2000
                })
              }
            }
          ).catch(error => {
          console.log(error)
          })
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
      console.log(this.identifyCode)
    }
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  }
}
</script>

<style scoped>
.login-container {
  margin: 90px auto;
  width: 300px;
  padding: 10px 40px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  background: white;
}
.login-title {
  text-align: center;
}
.tips {
  text-align: left;
  font-size: 14px;
  color: #f56c6c;
  line-height: 20px;
}
.sth-gone {
  display: none;
}
.el-input__inner {
  background-color:blue !important;
}
.identifybox {
  display: flex;
  justify-content: space-between;
  margin-top:7px;
}
</style>
