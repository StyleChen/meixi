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
            name: '统计分析',
            routerList: [
              {
                name: '统计分析',
                url: '/analyse/analyseInfo',
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
              if (result[i].isAuth === 1 && result[i].url === '/notice') {
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
