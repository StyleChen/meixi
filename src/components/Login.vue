<template>
  <div class="app">
    <div class="login">
      <div class="login-whole">
        <div class="theme">
          <div class="logo">美溪项目管理后台</div>
          <div id="error"></div>
        </div>

        <form class="tab-conter" @submit.prevent="onSubmits" v-bind:class="[current]">

          <p class="home" @click="change('home')">
            <i class="icon iconfont icon-wode1"></i>
            <input name="name" placeholder="请输入您的账号/手机号码" id="username" class="name" data-valid="true" required v-model="name">
          </p>
          <p class="news" @click="change('news')">
            <i class="icon iconfont icon-suo"></i>
            <input name="pwd" placeholder="请输入密码" type="password" id="password" data-valid="true" required v-model="pwd">
          </p>
          <p class="verification projects" @click="change('projects')">
            <input placeholder="请输入验证码" type="text" name="verify" data-valid="true" required v-model="verify">
            <span>
              <img :src="verifyImg" style="width:100%;height:100%;" alt="验证码" @click="verifyImg=verifyImg+'?'+Math.random()" />
            </span>
          </p>

          <div style="text-align: center;padding: 20px 0px 35px 0px;">
            <button type="submit" class="btn" id="btn" style="font-size:16px;">登录</button>
          </div>
        </form>
      </div>
    </div>
    <Modal v-model="isAuth" title="权限通知">
        <p>您暂时没有权限，请联系相关管理员设置权限...</p>
    </Modal>
    <foot></foot>
  </div>
</template>

<script>
import apis from '@/apis';
import foot from '@/components/Footer';

export default {
  components: { foot },
  data() {
    return {
      isAuth: false,
      platId: JSON.parse(sessionStorage.getItem('account')).platId,
      name: '',
      pwd: '',
      verify: '',
      verifyImg: apis.VerifyCode,
      current: 'home',
    };
  },

  methods: {
    change(cur) {
      this.current = cur;
    },
    onSubmits() {
      this.$http.post(apis.Login, {
        name: this.name,
        pwd: this.pwd,
        verify: this.verify,
      }).then(ress => ress.json())
        .then((ress) => {
          if (ress.success === false) {
            document.getElementById('error').innerHTML = ress.msg;
          } if (ress.success === true) {
            // 判断是否平台会员
            sessionStorage.id = ress.result.id;
            this.$http.post(apis.Menu, { huid: ress.result.id }).then(v => v.json())
              .then((vs) => {
                if (vs.success) {
                  const result = vs.result;
                  let isAuth = true;
                  for (let i = 0; i < result.length; i += 1) {
                    if (result[i].isAuth === 1) {
                      isAuth = false;
                      this.$router.push(result[i].url);
                      location.reload();
                      break;
                    }
                  }
                  if (isAuth) {
                    this.isAuth = true;
                  }
                }
              });
          }
        });
    },
  },
  created() {
    this.$http.get(apis.VerifyCode);
  },
};

</script>

<style>
/*输入框选中样式*/

.home .home,
.news .news,
.projects .projects {
  background: #edeff1 url(../assets/images/red.png) no-repeat
}


/*输入框选中样式结束*/

html {
  background: #EEF3FA;
}

html,
body {
  height: 100%;
  background: #edeff1;
}

#app {
  height: 100%;
}

.app {
  height: 100%;
  position: relative;
  background: url(../assets/images/bg.png) no-repeat;
}

.login {
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  color: #010101;
  font-size: 30px;
  position: relative;
}

.login-whole {
  position: relative;
  top: 21%;
  width: 540px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, .2);
  -moz-box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, .2);
  box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, .2);
}

.login-whole .theme {
  font-size: 30px;
  color: #333;
  position: relative;
}

.login-whole .theme .logo {
  background: url(../assets/images/logo.png) no-repeat;
  background-position: 60px 33px;
  padding-left: 35px;
  text-align: center;
  width: 100%;
  line-height: 120px;
}

.login .login-whole form p {
  padding: 15px 15px;
  margin: 0px;
}

.login .login-whole form p {
  text-align: center;
}

.login .login-whole form .reg {
  color: red;
  text-align: left;
  margin-left: 80px;
  font-size: 14px;
}

.login .login-whole form .verification {
  padding: 15px 52px;
  margin: 0px;
}

.login .login-whole form .verification input {
  width: 265px;
  text-align: left;
  margin-left: 10px;
}

.login .login-whole form .verification span {
  width: 125px;
  height: 50px;
  display: block;
  float: right;
}

.login .login-whole .icon {
  font-size: 24px;
  color: #bbbbbb;
}

.login .login-whole p input {
  width: 80%;
  height: 50px;
  padding-left: 15px;
  font-size: 14px;
  color: #151515;
  border: 1px solid #ddd;
  outline: none;
}

.login .login-whole p button {
  width: 130px;
  height: 45px;
  border: none;
  background: #D7000F;
  color: white;
  border-radius: 5px;
  margin-bottom: 15px;
}

.login .login-whole p a {
  font-size: 12px;
  line-height: 70px;
  margin-left: 10px;
}

#error {
  font-size: 16px;
  color: red;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  font-weight: 600;
}
</style>
