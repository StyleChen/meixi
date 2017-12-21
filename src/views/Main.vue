<template>
  <div>
<!--    <header class="header">
      <div class="wrap">
        <ul class="left_ul">
          <li><a href="#"><i class="icon iconfont icon-home"></i>梦高速首页</a></li>
          <li><a href="#"><i class="icon iconfont icon-shouji"></i>手机梦云街</a></li>
        </ul>
        <ul class="right_ul">
          <li>您好,xxxx</li>
          <li><a href="#" class="line">退出</a></li>
          <li><a href="#" class="line">帮助中心</a></li>
          <li><a href="#" class="line">网站导航</a></li>
          <li><a href="#"><i class="icon iconfont icon-weixin1"></i></a></li>
          <li><a href="#"><i class="icon iconfont icon-weibo-logo"></i></a></li>
        </ul>
      </div>
    </header>-->
    <nav class="nav">
      <div class="wrap">
        <img src="../assets/images/logo.png" alt="" class="logo">
        <ul class="nav-bar">
          <router-link v-for="item in menuList" v-if="item.isAuth === 1" :to="item.url"
          class="nav-bar__link" tag="li" :key="item.url">{{item.name}}</router-link>
        </ul>
      </div>
    </nav>
    <div class="wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import apis from '@/apis';

export default {
  data() {
    return {
      asideData: [],
      menuList: '',
    };
  },
  created() {
    this.$http.post(apis.Menu, { huid: sessionStorage.id }).then((res) => {
      res.json().then((ress) => {
        this.menuList = ress.result;
        const array = [];
        ress.result.map(val => array.push(JSON.stringify(val)));
        sessionStorage.Menu = array.join('|');
      });
    }, (res) => {
      this.$Message.error(res.msg);
    });
  },
};
</script>

<style>
.header {
  height: 30px;
  background: #edeff1;
  width: 100%;
  color: #666;
}
.header a {
  color: #666;
}
.left_ul {
  float: left;
  line-height: 30px;
}
.right_ul {
  float: right;
  line-height: 30px;
}
.header li {
  float: left;
}
.header li a{
  padding: 0 8px;
}
.line {
  border-right: 1px solid #999;
}
.header .right_ul li:last-child {
  margin-right: 0;
}
.header .left_ul li:first-child {
  margin-left: 0;
}
.header .iconfont {
  margin-right: 5px;
}
.nav {
  background: var(--theme);
  height: 60px;
  margin-bottom: 10px;
}
.nav img{
  margin-top: 10px;
  float: left;
}
.nav-bar {
  float: left;
  margin-left: 60px;
}
.nav-bar .router-link-active {
  background: #c5020f;
}
.nav-bar__link{
  height: 60px;
  width: 100px;
  float: left;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.ivu-input {
  background: #FFFFFF;
}






</style>
