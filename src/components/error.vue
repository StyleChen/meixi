<template>
  <div class="whole">
    <div class="details">
      <ul>
        <li class="item">
          <img src="../assets/images/fruit.png" height="320" width="280">
        </li>
        <li class="tnt">
          <p>很抱歉，</p>
          <p>您当前访问的页面不存在！</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style type="text/css">
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
fieldset,
input,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
}

html,
body,
.whole {
  height: 100%;
}

body {
  background: #edeff1;
}
#app{
  height:100%;
}
.whole {
  background: url(../assets/images/bg.png) no-repeat;
  position: relative;
}

.details {
  width: 900px;
  position: relative;
  background: #FFFFFF;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, .2);
  margin: 0 auto;
  top: 25%;
}

.details ul {
  display: flex;
}

.details ul .item {
  padding: 70px 70px 75px 90px;
}

.details ul .tnt {
  padding-top: 160px;
  font-size: 26px;
  color: #f6534e;
}
</style>
