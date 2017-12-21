<template>
  <div>
    <div class="userWrap">
      <Table border :columns="columns" :data="dataLog"></Table>
      <Select v-model="types" placeholder="全部" class="types">
        <Option value="all">全部</Option>
        <Option value="登录日志">登录日志</Option>
        <Option value="操作日志">操作日志</Option>
      </Select>
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
        types: 'all', // 类型筛选
        columns: [
          {
            title: '用户名',
            key: 'name',
            align: 'center',
          },
          {
            title: '真实姓名',
            key: 'realName',
            align: 'center',
          },
          {
            title: '部门',
            key: 'depart',
            align: 'center',
          },
          {
            title: '时间',
            key: 'date',
            align: 'center',
            width: 150,
          },
          {
            title: '类型',
            key: 'type',
            align: 'center',
          },
          {
            title: '操作内容',
            key: 'content',
            align: 'center',
            width: 300,
          },
        ],
        dataLog: [],
        total: 0, // 列表总数
      };
    },
    methods: {
      changePage(pageIndexs) {
        this.$http.post(apis.LogList, { pageIndex: pageIndexs, pageSize: 10 })
          .then(res => res.json())
          .then((ress) => {
            this.dataLog = ress.result.data;
            this.total = ress.result.total;
          });
      },
//      selectorPage() {
//      },
    },
    watch: {
      types(val) {
        let value = '';
        if (val !== 'all') {
          value = val;
        }
        this.$http.post(apis.LogList, { pageIndex: 1, pageSize: 10, type: value })
          .then(res => res.json())
          .then((ress) => {
            this.dataLog = ress.result.data;
            this.total = ress.result.total;
          });
      },
    },
    created() {
      // 获取全部 操作日志 列表
      this.$http.post(apis.LogList, { pageIndex: 1, pageSize: 10 })
        .then(res => res.json())
        .then((ress) => {
          this.dataLog = ress.result.data;
          this.total = ress.result.total;
        });
    },
  };
</script>
<style>
  .userWrap {
    padding-top: 30px;
    position: relative;
  }
  .types {
    position: absolute;
    top: 35px;
    left: 490px;
    width: 100px;
  }
  .types.ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .types.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    text-align: center;
    font-weight: bold;
  }
  .types.ivu-select-single .ivu-select-selection {
    background: #f8f8f9;
    border: none;
  }
</style>
