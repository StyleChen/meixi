<template>
  <div>
    <div class="userWrap">
      <Table border :columns="columns" :data="dataLog"></Table>
    </div>
    <div style="margin: 10px;overflow: hidden">
      <!--<Button type="error" style="float: right;margin-left: 10px;" @click="selectorPage">确定</Button>-->
      <div style="float: right;">
        <Page :total="total" :current="1" @on-change="changePage" showElevator :page-size="10"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import apis from '@/apis';

  export default {
    data() {
      return {
        columns: [
          {
            title: '姓名/昵称',
            key: 'realName',
            align: 'center',
            width: 150,
          },
          {
            title: '时间',
            key: 'date',
            align: 'center',
            width: 150,
          },
          {
            title: '反馈内容',
            key: 'content',
            align: 'center',
          },
        ],
        dataLog: [],
        total: 0, // 列表总数
      };
    },
    methods: {
      changePage(pageIndexs) {
        this.$http.post(apis.FeedbackList, { pageIndex: pageIndexs, pageSize: 10, type: '用户反馈' })
          .then(res => res.json())
          .then((ress) => {
            this.dataLog = ress.result.data;
            this.total = ress.result.total;
          });
      },
//      selectorPage() {
//      },
    },
    created() {
      // 获取全部 操作日志 列表
      this.$http.post(apis.FeedbackList, { pageIndex: 1, pageSize: 10, type: '用户反馈' })
        .then(res => res.json())
        .then((ress) => {
          this.dataLog = ress.result.data;
          this.total = ress.result.total;
        });
    },
  };
</script>
