<template>
  <div style="position:relative;">
    <div class="userAction">
      <Input v-model="searchText" placeholder="请输入管理员名称">
      <Button slot="prepend" icon="ios-search"></Button>
      </Input>
      <div class="float-right">
        <Button type="warning" size="large" @click="createB=true">新建部门</Button>
        <Button type="error" size="large" @click="createUserBool=true">添加成员</Button>
      </div>
    </div>
    <Table :columns="columns1" :data="data1"></Table>
    <Select v-model="departSelect" class="departSelect" @on-change="selectDepart">
      <Option value="all">全部</Option>
      <Option :value="departItem.value" v-for="departItem in departList" :key="departItem.value">{{departItem.label}}</Option>
    </Select>
    <div style="margin: 10px 0;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageTotal" :current="1" @on-change="changePage" showElevator></Page>
      </div>
    </div>
    <Modal
      v-model="modal"
      width="460"
      :styles="{top: '150px'}"
      title="注销"
      @on-ok="ok"
      @on-cancel="cancel">
      <h4>您是否确认注销该管理员账号？</h4>
    </Modal>
    <Modal
      v-model="modal2"
      width="760"
      :styles="{top: '150px'}"
      title="权限设置"
      @on-ok="auth"
      @on-cancel="cancel"
      ok-text="保存设置">
      <CheckboxGroup v-model="fruit">
        <Checkbox :label="item.hmid" v-for="item in menu" :key="item.hmid">{{item.name}}</Checkbox>
      </CheckboxGroup>
    </Modal>
    <Modal
      v-model="modal3"
      width="460"
      :styles="{top: '150px'}"
      title="重置密码"
      @on-ok="resetPassword"
      @on-cancel="cancel">
      <h4>您是否确认重置该管理员账号密码？</h4>
    </Modal>
    <Modal
      v-model="createB"
      width="460"
      :styles="{top: '150px'}"
      title="新建部门"
      @on-ok="createDepart('departName')"
      @on-cancel="cancel">
      <Form ref="departName" label-position="left" :model="departName" :label-width="85" :rules="ruleValidate">
        <FormItem label="部门名称" prop="name">
          <Input v-model="departName.name" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <!--<div><span>部门名称: </span><Input v-model="departName" size="large" placeholder="请输入部门名称"></Input></div>-->
    </Modal>
    <Modal
      v-model="createUserBool"
      width="760"
      :styles="{top: '150px'}"
      title="添加成员"
      @on-ok="createUser('userInfo')"
      ok-text="确认添加"
      @on-cancel="cancel">
      <Form ref="userInfo" label-position="right" :model="userInfo" :label-width="85" :rules="ruleValidate">
        <FormItem label="用户名" prop="name">
          <Row>
            <Col span="8">
              <Input v-model="userInfo.name" placeholder="请输入"></Input>
            </Col>
            <Col span="16"></Col>
          </Row>
        </FormItem>
        <FormItem label="真实姓名" prop="realname">
          <Row>
            <Col span="8">
              <Input v-model="userInfo.realname" placeholder="请输入"></Input>
            </Col>
            <Col span="16"></Col>
          </Row>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Row>
            <Col span="8">
              <Input v-model="userInfo.phone" placeholder="请输入"></Input>
            </Col>
            <Col span="16"></Col>
          </Row>
        </FormItem>
        <FormItem label="部门" prop="hdid">
          <Row>
            <Col span="4">
            <Select v-model="userInfo.hdid" placeholder="请选择部门" not-found-text="请先新建部门"
                    :transfer="true" placement="top" :label-in-value="true" @on-change="selectUser">
              <Option :value="departItem.value" v-for="departItem in departList" :key="departItem.value">{{departItem.label}}</Option>
            </Select>
            </Col>
            <Col span="2" style="text-align: center;">岗位</Col>
            <Col span="4">
              <Input v-model="userInfo.station" placeholder="请输入"></Input>
            </Col>
            <Col span="14"></Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import apis from '@/apis';

  export default {
    data() {
      const that = this;
      const phoneReg = (rule, value, callback) => {
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(value))) {
          callback(new Error('手机号码不对'));
        } else {
          callback();
        }
      };
      const hdidReg = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('部门不能为空'));
        } else {
          callback();
        }
      };
      return {
        searchText: '', // 搜索关键词
        departSelect: 'all', // 部门选择
        hdids: '', // 当前部门id；
        departList: [], // 部门列表
        departName: {
          name: '', // 新建部门名称
        },
        ruleValidate: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
          ],
          realname: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: phoneReg, trigger: 'blur' },
          ],
          hdid: [
            { validator: hdidReg, trigger: 'change' },
          ],
        },
        userInfo: {
          name: '',
          realname: '',
          hdid: '',
          phone: '',
          station: '',
          pwd: '123456',
        },
        fruit: [], // 授权设置后的权限
        fruitOld: [], // 授权设置前的权限
        menu: [], // 授权列表
        params: '', // 当前操作成员数据
        pageTotal: 0, // 列表总数
        modal: false, // 注销弹框
        modal2: false, // 注销弹框
        modal3: false, // 重置密码弹框
        createB: false, // 新建部门弹框
        createUserBool: false, // 新建成员弹框
        columns1: [
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
            title: '手机号',
            key: 'phone',
            align: 'center',
          },
          {
            title: '部门 ∨',
            key: 'departName',
            align: 'center',
//            filters: [],
//            filterMultiple: false,
//            filterMethod(value, row) {
//              return value === row.hdid;
//            },
          },
          {
            title: '岗位',
            key: 'station',
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
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      that.modal3 = true;
                      that.params = params;
                    },
                  },
                }, '重置密码'),
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
                      that.modal2 = true;
                      that.params = params;
                      that.$http.post(apis.Menu, { huid: params.row.huid })
                        .then((res) => {
                          res.json().then((ress) => {
                            that.menu = ress.result;
                            that.fruit = [];
                            that.fruitOld = [];
                            ress.result.map((vals) => {
                              if (vals.isAuth) {
                                that.fruit.push(vals.hmid);
                                that.fruitOld.push(vals.hmid);
                              }
                              return that.fruit;
                            });
                          });
                        });
                    },
                  },
                }, '权限'),
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
                }, '注销'),
              ]);
            },
          },
        ],
        data1: [],
      };
    },
    methods: {
      // 新建部门
      createDepart(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(apis.DepartAdd, { name: this.departName.name })
              .then((res) => {
                res.json().then((ress) => {
                  if (ress.success) {
                    this.$Message.success('部门新建成功');
                    this.departList.push({ label: this.departName.name, value: ress.result });
                  } else {
                    this.$Message.error(ress.msg);
                  }
                });
              }, (res) => {
                res.json().then((ress) => {
                  this.$Message.error(ress.msg);
                });
              });
          } else {
            this.$Message.error('部门新建失败!');
          }
        });
      },
      // 添加成员
      createUser(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(apis.UserAdd, this.userInfo)
              .then(res => res.json())
              .then((ress) => {
                if (ress.success) {
                  this.$Message.success('添加成功');
                  this.$set(this.userInfo, 'realName', this.userInfo.realname);
                  this.$set(this.userInfo, 'huid', ress.result);
                  this.data1.unshift(this.userInfo);
                } else {
                  this.$Message.error(ress.msg);
                }
              }, (ress) => {
                this.$Message.error(ress.msg);
              });
          }
        });
      },
      // 部门选择
      selectUser(v) {
        this.$set(this.userInfo, 'departName', v.label);
      },
      // 翻页
      changePage(index, pageSizes = 10, id = this.hdids, names = '') {
        this.$http.post(apis.UserList,
          { pageIndex: index, pageSize: pageSizes, hdid: id, name: names })
          .then((res) => {
            res.json().then((ress) => {
              this.data1 = ress.result.data;
              this.pageTotal = ress.result.total;
            });
          });
      },
      ok() { // 成员注销
        this.$http.post(apis.UserCancel, { huid: this.params.row.huid })
          .then((res) => {
            res.json().then((ress) => {
              if (ress.success) {
                this.$Message.success('注销成功');
                this.data1.splice(this.params.index, 1);
                this.pageTotal -= 1;
              }
            });
          });
      },
      auth() { // 权限设置
        // 授权
        this.fruit.map((val) => {
          if (this.fruitOld.indexOf(val) === -1) {
            this.$http.post(apis.UserAuth, { huid: this.params.row.huid, hmid: val, state: 1 })
              .then((res) => {
                res.json().then((ress) => {
                  if (ress.success) {
                  //  this.$Message.success('设置成功');
                  }
                });
              });
          }
          return false;
        });
        // 取消授权
        this.fruitOld.map((val) => {
          if (this.fruit.indexOf(val) === -1) {
            this.$http.post(apis.UserAuth, { huid: this.params.row.huid, hmid: val, state: 0 })
              .then((res) => {
                res.json().then((ress) => {
                  if (ress.success) {
                  //  this.$Message.success('设置成功');
                  }
                });
              });
          }
          return false;
        });
      },
      resetPassword() {
        this.$http.post(apis.ResetPwd, { huid: this.params.row.huid })
          .then(res => res.json())
          .then((ress) => {
            if (ress.success) {
              this.$Message.success('操作成功');
            }
          });
      },
      cancel() {
        return false;
      },
      // 部门筛选
      selectDepart(val) {
        let hdids = val;
        if (val === 'all') {
          hdids = '';
        }
        this.hdids = hdids;
        this.changePage(1, 10, hdids);
      },
    },
    watch: {
      // 搜索成员
      searchText(value) {
        this.$http.post(apis.UserList, { pageIndex: 1, pageSize: 10, name: value }).then((res) => {
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
//      部门列表
      this.$http.post(apis.DepartList, { pageIndex: 1, pageSize: 10 }).then((res) => {
        res.json().then((ress) => {
          if (ress.success) {
            const array = [];
            ress.result.data.map((val) => {
              const obj = {};
              obj.label = val.name;
              obj.value = val.hdid;
              array.push(obj);
              return array;
            });
            this.departList = array;
            this.columns1[3].filters = array;
          }
        });
      });
//      成员列表
      this.$http.post(apis.UserList, { pageIndex: 1, pageSize: 10 }).then((res) => {
        res.json().then((ress) => {
          if (ress.success) {
            this.data1 = ress.result.data;
            this.pageTotal = ress.result.total;
          }
        });
      });
    },
    mounted() {

    },
  };
</script>
<style>
  .userAction {
    padding-top: 30px;
    padding-bottom: 20px;
    overflow: hidden;
  }
  .departSelect {
    position: absolute;
    top: 95px;
    left: 440px;
    width: 100px;
    text-align: center;
    font-weight: bold;
  }
  .departSelect .ivu-select-selected-value {
    text-align: center;
  }
  .departSelect .ivu-select-selection {
    background-color: #f8f8f9;
    border: none;
  }
  .departSelect.ivu-select-visible .ivu-select-selection {
    box-shadow: none;
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
</style>
