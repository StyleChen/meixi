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
            name: '系统管理',
            routerList: [
              {
                name: '成员列表',
                url: '/admin/list',
              },
              {
                name: '系统消息',
                url: '/admin/message',
              },
              {
                name: '操作日志',
                url: '/admin/logs',
              },
            ],
          },
          {
            name: '用户反馈',
            routerList: [
              {
                name: '用户反馈',
                url: '/admin/feedback',
              },
              {
                name: '故障报修',
                url: '/admin/fault',
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
              if (result[i].isAuth === 1 && result[i].url === '/admin') {
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
