<template>
    <!--登录界面-->

      <el-form class="login-container">
        <h3 class="login-title">大气质量智能监控平台</h3>
        <div ref="tips" id="tips">{{tips}}</div>
        <el-form-item>
          <el-input  v-on:input="input" v-model="loginForm.username" placeholder="用户名" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-input  v-on:input="input" v-model="loginForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%; border: none" v-on:click="login">登录</el-button>
        </el-form-item>
      </el-form>

</template>

<script>

    export default {
        name: 'Login',
        data() {
          return {
            loginForm: {
              username: '',
              password: ''
            },
            responseResult: [],
            tips: '账号或密码不能为空'

          }
    },

    methods: {
      input() {
        if (this.loginForm.username || this.loginForm.password) { // 检验是否为空
          this.$refs.tips.style.visibility = 'hidden'
        }
      },

      login() {
        if (this.loginForm.username === '' || this.loginForm.password === '') { // 检验是否为空
          this.$refs.tips.style.visibility = 'visible'
        } else {
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
                    duration: 800
                  })
                  // 登录成功后，将loginForm信息存入本地
                  var path = this.$route.query.redirect
                  window.sessionStorage.setItem('username',this.loginForm.username)
                  this.$router.push(path === '/' || path === undefined ? '/index' : path)
                } else {
                  this.$message({
                    message: '账号或密码错误',
                    center: true,
                    duration: 800
                  })
                }
              }
            ).catch(error => {
            console.log(error)
            })
        }
        }
    }
    }
</script>

<style scoped>
  .login-container{
    margin: 90px auto;
    width: 300px;
    padding: 10px 40px;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    background: white;
  }
  #tips{
    text-align: left;
    font-size: 14px;
    color: red;
    line-height: 30px;
    visibility: hidden
  }

</style>
