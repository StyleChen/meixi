<template>
  <div class="pager">
    <div class="pager__list">
      <a class="pager__item" href="javascript:;" @click="prev">&lt;</a>
      <a class="pager__item pager__item-pageNum" :class="{ 'pager__item--active': 1 === dataCurrent}" href="javascript:;" @click="toPage" v-show="leftElliptic">1</a>
      <span class="pager__item" v-show="leftElliptic"></span>
      <a class="pager__item pager__item-pageNum" :class="{ 'pager__item--active': n === dataCurrent}" href="javascript:;" v-for="n in renderPages" @click="toPage">{{n}}</a>
      <span class="pager__item" v-show="rightElliptic"></span>
      <a class="pager__item pager__item-pageNum" :class="{ 'pager__item--active': dataPages === dataCurrent}" href="javascript:;" @click="toPage" v-show="rightElliptic">{{dataPages}}</a>
      <a class="pager__item" href="javascript:;" id="pager__item-last" @click="next">&gt;</a>
    </div>
    <form class="pager__goto" @submit.prevent="toPage">
      跳至
      <input class="pager__goto__input" type="number" name="page" min="1" :max="dataPages" required>页
      <button class="btn btn--bare pager__goto__btn">
        确认</button>
    </form>
  </div>
</template>

<script>
// 页数显示数目
const num = 5;

export default {
  props: ['data-pages', 'data-current'],
  computed: {
    leftElliptic() {
      if (this.dataCurrent - Math.floor(num / 2) > 1) {
        return true;
      } return false;
    },
    rightElliptic() {
      if (this.dataCurrent + Math.floor(num / 2) < this.dataPages) {
        return true;
      } return false;
    },
    renderPages() {
      const arr = [];
      for (let i = this.dataCurrent - Math.floor(num / 2);
        i <= this.dataCurrent + Math.floor(num / 2); i += 1) {
        arr.push(i);
      }
      return arr.filter(val => val > 0 && val <= this.dataPages);
    },
  },
  methods: {
    toPage(event) {
      if (event.type === 'click') {
        this.$emit('update:dataCurrent', parseInt(event.target.innerText, 10));
      } else this.$emit('update:dataCurrent', parseInt(event.target.childNodes[1].value, 10));
    },
    prev() {
      if (this.dataCurrent <= 1) {
        return;
      }
      this.$emit('update:dataCurrent', this.dataCurrent - 1);
    },
    next() {
      if (this.dataCurrent >= this.dataPages) {
        return;
      }
      this.$emit('update:dataCurrent', this.dataCurrent + 1); // 触发update:dataCurrent自定义事件 更新父组件传下来的属性
    },
  },
};
</script>
