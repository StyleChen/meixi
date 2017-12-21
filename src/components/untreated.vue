<template>
  <div>
<!--     <div class="userAction">
      <Input v-model="searchText" placeholder="请输入申请人名称">
        <Button slot="prepend" icon="ios-search"></Button>
      </Input>
    </div> -->
    <Table :columns="columns" :data="datas" border style="margin-top: 30px;"></Table>
    <Page :total='pageTotal' show-elevator class-name='page' @on-change="changePage"></Page>
    <Modal title="转账确认提示" v-model="align" @on-ok="confrim" @ono-cancel="cancel">
      <p style="text-align: center; font-size: 18px;">请确认已人工转账!</p>
    </Modal>
  </div>
</template>
<script>
import apis from '@/apis';

export default {
  data() {
    const that = this;
    return {
      // searchText: '',
      align: false,
      params: {},
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
          title: '开户行',
          key: 'bankName',
        },
        {
          title: '提现账号',
          key: 'cardNumber',
          width: 160,
        },
        {
          title: '金额 (元)',
          key: 'money',
          width: 100,
        },
        {
          title: '申请时间',
          key: 'date',
          width: 150,
        },
        {
          title: '操作',
          align: 'center',
          render(h, params) {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    that.align = true;
                    that.params = params;
                  },
                },
              }, '确认转账'),
            ]);
          },
        },
      ],
      datas: [],
      pageTotal: 0,
    };
  },
  methods: {
    getList(pageIndexs = 1, pageSizes = 10) {
      this.$http.post(apis.CashList,
      { state: 1, pageIndex: pageIndexs, pageSize: pageSizes })
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
      this.getList(val);
    },
    cancel() {
      return false;
    },
    confrim() {
      if ('row' in this.params) {
        this.$http.post(apis.CashComfirm,
                    { walletid: this.params.row.walletid, phone: this.params.row.phone })
                      .then(res => res.json()).then((ress) => {
                        if (ress.success) {
                          this.$Message.success('操作成功');
                          this.getList();
                        }
                      }).catch(err => this.$Message.error(err.msg));
      }
    },
  },
  mounted() {
    this.getList();
  },
/*   watch: {
    searchText(val) {
      this.getList(val, 1);
    },
  }, */
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

