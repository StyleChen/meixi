<template>
  <div>
    <ul class='billNav'>
      <router-link to='/bill/billList/untreated' tag="li">未处理</router-link>
      <router-link to='/bill/billList/handled' tag="li">已处理</router-link>
    </ul>
    <router-view></router-view>
  </div>
</template>
<style scoped>
  .billNav {
    margin: 0 -20px;
    border-bottom: 1px solid #e3e4e5;
    height: 51px;
  }
  .billNav li {
    float: left;
    height: 50px;
    line-height: 50px;
    width: 110px;
    text-align: center;
    background: #ffffff;
    position: relative;
    z-index: 1;
  }
  .billNav li.router-link-active {
    border-top: 2px solid var(--theme);
    border-left: 1px solid #e3e4e5;
    border-right: 1px solid #e3e4e5;
    height: 51px;
  }
</style>
