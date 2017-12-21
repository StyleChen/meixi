<template>
  <div>
    <div class="userAction ">
      <Input v-model="searchText" placeholder="请输入标题搜索">
        <Button slot="prepend" icon="ios-search"></Button>
      </Input>
      <div class="float-right">
        <Button type="error" size="large" @click="noticeAdd()">发布头条</Button>
      </div>
    </div>
    <Table :columns="columns1" :data="data1"></Table>
    <div style="margin: 10px 0;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageTotal" :current="1" @on-change="changePage" showElevator></Page>
      </div>
    </div>
    <Modal
      v-model="modal"
      width="460"
      :styles="{top: '150px'}"
      title="删除"
      @on-ok="ok"
      @on-cancel="cancel">
      <h4>您是否确认删除该头条？</h4>
    </Modal>
    <Modal
      v-model="createB"
      width="760"
      :styles="{top: '150px'}"
      title="发布"
      @on-ok="notice('departName')"
      @on-cancel="cancel">
      <Form ref="departName" label-position="left" :model="noticeData" :label-width="85" :rules="ruleValidate">
        <FormItem label="头条标题" prop="title">
          <Input v-model="noticeData.title" style="width: 450px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="头条链接" prop="content">
          <Input v-model="noticeData.content" placeholder="请输入链接..." class="link">
            <Select v-model="select1" slot="prepend" style="width: 80px">
              <Option value="http://">http://</Option>
              <Option value="https://">https://</Option>
            </Select>
          </Input>
        </FormItem>
      </Form>
      <!--<div><span>部门名称: </span><Input v-model="departName" size="large" placeholder="请输入部门名称"></Input></div>-->
    </Modal>
  </div>
</template>
<script>
  import apis from '@/apis';

  export default {
    data() {
      const that = this;
      return {
        select1: 'http://',
        searchText: '', // 搜索关键词
        noticeData: {
          title: '', // 公告标题
          content: '', // 公告内容
          type: '头条快报', // 公告类型
        },
        ruleValidate: {
          title: [
            { required: true, message: '头条标题不能为空', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '头条链接不能为空', trigger: 'blur' },
          ],
        },
        params: {}, // 当前操作成员数据
        pageTotal: 0, // 列表总数
        createB: false, // 公告发布/编辑弹框
        modal: false, // 删除弹框
        columns1: [
          {
            title: '标题',
            key: 'title',
            align: 'left',
            width: 400,
          },
          {
            title: '发布者',
            key: 'realName',
            align: 'center',
          },
          {
            title: '发布时间',
            key: 'date',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render(h, params) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      that.createB = true;
                      that.params = params;
                      that.noticeData.title = params.row.title;
                      const select1 = params.row.content.match('https://') || params.row.content.match('http://') || ['http://'];
                      that.select1 = select1[0];
                      let content = params.row.content.replace('https://', '');
                      content = content.replace('http://', '');
                      that.noticeData.content = content;
                    },
                  },
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      that.modal = true;
                      that.params = params;
                    },
                  },
                }, '删除'),
              ]);
            },
          },
        ],
        data1: [],
      };
    },
    methods: {
      // 新建部门
      sure() {
        this.changePage();
      },
      noticeAdd() {
        this.createB = true;
        this.params = {};
        this.noticeData = {
          title: '', // 公告标题
          content: '', // 公告内容
          type: '头条快报', // 公告类型
        };
      },
      // 发布头条 修改头条
      notice(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.noticeData.content.indexOf('http') === -1) {
              this.noticeData.content = this.select1 + this.noticeData.content;
            }
            let url = apis.NoticesAdd;
            if ('row' in this.params) {
              this.$set(this.noticeData, 'hnid', this.params.row.hnid);
              url = apis.NoticesEdit;
            }
            this.$http.post(url, this.noticeData)
              .then(res => res.json())
              .then((ress) => {
                if (ress.success) {
                  this.$Message.success('发布成功');
                  this.getAll();
                } else {
                  this.$Message.error(ress.msg);
                }
              }, (ress) => {
                this.$Message.error(ress.msg);
              });
          } else {
            this.$Message.error('发布失败');
          }
        });
      },
      // 翻页
      changePage(index) {
        this.$http.post(apis.NoticesList, { pageIndex: index, pageSize: 10, type: '头条快报' })
          .then((res) => {
            res.json().then((ress) => {
              this.data1 = ress.result.data;
              this.pageTotal = ress.result.total;
            });
          });
      },
      ok() { // 公告删除
        this.$http.post(apis.NoticesDel, { hnid: this.params.row.hnid })
          .then((res) => {
            res.json().then((ress) => {
              if (ress.success) {
                this.$Message.success('删除成功');
                this.data1.splice(this.params.index, 1);
                this.pageTotal -= 1;
              }
            });
          });
      },
      cancel() {
        return false;
      },
      getAll() {
        //      成员列表
        this.$http.post(apis.NoticesList, { pageIndex: 1, pageSize: 10, type: '头条快报' }).then((res) => {
          res.json().then((ress) => {
            if (ress.success) {
              this.data1 = ress.result.data;
              this.pageTotal = ress.result.total;
            }
          });
        });
      },
    },
    computed: {
    },
    watch: {
      // 搜索成员
      searchText(value) {
        this.$http.post(apis.NoticesList, { pageIndex: 1, pageSize: 10, keyword: value, type: '头条快报' })
          .then((res) => {
            res.json().then((ress) => {
              if (ress.success) {
                this.data1 = ress.result.data;
                this.pageTotal = ress.result.total;
              }
            });
          });
      },
    },
    created() {
      this.getAll();
    },
  };
</script>
<style>
  .userAction .ivu-input-group {
    float: left;
    width: 285px;
    height: 40px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
  }
  .userAction .ivu-input-group .ivu-input{
    height: 40px;
    width: calc(100% + 20px);
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    position: relative;
    left: -20px;
    padding-left: 25px;
  }
  .userAction .ivu-input-group-append,
  .userAction .ivu-input-group-prepend {
    overflow: hidden;
    -webkit-border-radius: 50% !important;
    -moz-border-radius: 50% !important;
    border-radius: 50% !important;
    background: var(--theme);
    width: 40px;
    position: relative;
    z-index: 3;
  }
  .userAction .ivu-btn.ivu-btn-icon-only {
    font-size: 15px;
    padding: 0;
    color: #fff !important;
  }
  .ivu-btn-large {
    margin-left: 10px;
    height: 40px;
  }

  /*注销弹框样式*/
  /*  .ivu-modal {
      top: calc(50vh - 128px);
    }*/
  .ivu-modal-footer {
    border: none;
    text-align: center;
    margin-bottom: 10px;
  }
  .ivu-modal-header {
    border: none;
    background: #edeff1;
  }
  .ivu-modal-header-inner {
    font-size: 14px;
    font-weight: 500;
  }
  .ivu-modal-content {
    overflow: hidden;
  }
  .ivu-modal-body h4 {
    text-align: center;
    font-size: 15px;
    color: #333;
    font-weight: normal;
    padding-top: 50px;
    padding-bottom: 60px;
  }
  .ivu-modal-footer button {
    width: 130px;
  }
  .ivu-modal-footer .ivu-btn-text {
    background: #c4c4c4;
    color: #fff;
  }
  .ivu-modal-footer .ivu-btn-primary {
    background: var(--theme);
    border-color: var(--theme);
  }

  /*权限设置*/
  .ivu-checkbox-wrapper.ivu-checkbox-group-item {
    margin: 15px 20px;
  }
  .ivu-checkbox {
    margin-right: 5px;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: var(--theme);
    background-color: var(--theme);
  }
  .link .ivu-input-group-append,
  .link .ivu-input-group-prepend {
    overflow: inherit;
    -webkit-border-radius: 5px !important;
    -moz-border-radius: 5px !important;
    border-radius: 5px !important;
    background: #eee;
    width: 30px;
    position: relative;
    z-index: 3;
    color: #fff;
  }
  .link.ivu-input-group .ivu-input {
    border-radius: 5px;
    height: 32px;
  }
  .link.ivu-input-group {
    height: 32px;
  }
</style>
