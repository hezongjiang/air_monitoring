<template>
    <!--登录界面-->

      <el-form class="login-container">
        <h3 class="login-title">登录</h3>
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
          this.$axios.get('/device/login',
            {params: {
                loginName: this.loginForm.username,
                password: this.loginForm.password
              }}
          ).then(res => {
              console.log(res.data.data)
              if (res.data.data.code === 1) { // code=1为登录成功，code=0为登录失败
                  this.$message({
                    message: '登录成功',
                    center: true,
                    duration: 800
                  })
                  // 登录成功后，将loginForm信息存入本地
                  this.$store.commit('login', this.loginForm) // 对store里的login方法，输入参数this.loginForm
                  let path = this.$route.query.redirect
                  console.log(path)
                  this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
                } else {
                  this.$message({
                    message: '账号或密码错误',
                    center: true,
                    duration: 800
                  })
                }
              }
            ).catch(error => {
            alert('出错了')
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

  }
  #tips{
    text-align: left;
    font-size: 14px;
    color: red;
    line-height: 30px;
    visibility: hidden
  }

</style>
