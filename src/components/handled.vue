<template>
  <div>
    <div class="userAction">
      <Input v-model="searchText" placeholder="请输入处理人名称">
        <Button slot="prepend" icon="ios-search"></Button>
      </Input>
    </div>
    <Table :columns="columns" :data="datas" border></Table>
    <Page :total='pageTotal' show-elevator class-name='page' @on-change="changePage"></Page>
  </div>
</template>
<script>
import apis from '@/apis';

export default {
  data() {
    return {
      searchText: '',
      columns: [
        {
          title: '真实姓名',
          key: 'realName',
          width: 100,
        },
        {
          title: '手机',
          key: 'phone',
        },
        {
          title: '申请时间',
          key: 'date',
          width: 150,
        },
        {
          title: '提现账号',
          key: 'cardNumber',
          width: 160,
        },
        {
          title: '金额(元)',
          key: 'money',
          width: 100,
        },
        {
          title: '处理人',
          key: 'clrName',
          width: 100,
        },
        {
          title: '处理时间',
          key: 'clTime',
          width: 150,
        },
      ],
      datas: [],
      pageTotal: 0,
    };
  },
  methods: {
    getList(keyword = '', pageIndexs = 1, pageSizes = 10) {
      this.$http.post(apis.CashList,
      { clrName: keyword, state: 2, pageIndex: pageIndexs, pageSize: pageSizes })
        .then(res => res.json()).then((ress) => {
          if (ress.success) {
            const resultData = ress.result.data;
            for (let i = 0; i < resultData.length; i += 1) {
              const cardNumber = resultData[i].cardNumber;
              if (cardNumber) {
                const cardNumberArr = [];
                cardNumberArr.push(cardNumber.substr(0, 4));
                cardNumberArr.push(cardNumber.substr(4, 4));
                cardNumberArr.push(cardNumber.substr(8, 4));
                cardNumberArr.push(cardNumber.substr(12, 4));
                resultData[i].cardNumber = cardNumberArr.join(' ');
              }
            }
            this.datas = resultData;
            this.pageTotal = ress.result.total;
          }
        }).catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    changePage(val) {
      this.getList(this.searchText, val);
    },
  },
  mounted() {
    this.getList();
  },
  watch: {
    searchText(val) {
      this.getList(val, 1);
    },
  },
};
</script>

<style scoped>
  .userAction {
    padding-bottom: 20px;
    overflow: hidden;
  }
  .page {
    float: right;
    margin-top: 20px;
  }
</style>

