<template>
  <aside-main :titleData="titleData"></aside-main>
</template>

<script>
  import AsideMain from '@/components/AsideMain';
  import apis from '@/apis';

  export default {
    components: { AsideMain },
    data() {
      return {
        titleData: [
          {
            name: '广告管理',
            routerList: [
              {
                name: '首页广告',
                url: '/advert/indexAd',
              },
              {
                name: '圈子广告',
                url: '/advert/circle',
              },
              {
                name: '动态广告',
                url: '/advert/dynamicAd',
              },
            ],
          },
          {
            name: '精品推荐',
            routerList: [
              {
                name: '动态精品',
                url: '/advert/recommend',
              },
            ],
          },
        ],
      };
    },
    beforeCreate() {
      // 权限判断
      this.$http.post(apis.Menu, { huid: sessionStorage.id }).then(v => v.json())
        .then((vs) => {
          if (vs.success) {
            const result = vs.result;
            for (let i = 0; i < result.length; i += 1) {
              if (result[i].isAuth === 1 && result[i].url === '/advert') {
                return false;
              }
            }
            for (let i = 0; i < result.length; i += 1) {
              if (result[i].isAuth === 1) {
                this.$router.push(result[i].url);
                location.reload();
                break;
              }
            }
          }
          return true;
        });
    },
  };

</script>
