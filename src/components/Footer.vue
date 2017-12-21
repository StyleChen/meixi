<template>
  <footer>
    <div class="ucFooter__wrapper">
      <p class="ucFooter__copyright">创企科技有限公司 版权所有
        © 2015-2016 dreamhiway.com, All Rights Reserved 闽ICP备15011711号         </p>
      <ul class="ucFooter__list _clearfix">
        <li class="ucFooter__list__item"><a href="#">免责声明</a></li>
        <li class="ucFooter__list__item"><a href="#">帮助中心</a></li>
        <li class="ucFooter__list__item"><a href="#">项目规范</a></li>
        <li class="ucFooter__list__item"><a href="#">服务协议</a></li>
      </ul>
    </div>
  </footer>
</template>
<style>
  footer{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 65px;
    width: 100%;
    background: #337ab7;
    font-size: 13px;
    color: #fff;
  }
  .ucFooter__wrapper {
    width: 1200px;
    height: 65px;
    margin: auto;
    line-height: 65px;
  }
  .ucFooter__copyright {
    float: left;
  }
  .ucFooter__list {
    float: right;
  }
  .ucFooter__list__item {
    float: left;
    margin-left: 65px;
  }
  .ucFooter__list__item>a {
    text-decoration: none;
    color: #fff;
  }
</style>
