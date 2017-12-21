<template>
  <div class="userWrap">
    <Form ref="userinfo" label-position="right" :model="userInfo" :label-width="80" :rules="ruleValidate">
      <FormItem label="用户名" prop="name">
        <Row>
          <Col span="8">
          <Input v-model="userInfo.name" placeholder="请输入..." disabled></Input>
          </Col>
          <Col span="16"></Col>
        </Row>
      </FormItem>
      <FormItem label="真实姓名" prop="realName">
        <Row>
          <Col span="8">
          <Input v-model="userInfo.realName" placeholder="请输入..."></Input>
          </Col>
          <Col span="16"></Col>
        </Row>
      </FormItem>
      <FormItem label="手机号" prop="phone">
        <Row>
          <Col span="8">
          <Input v-model="userInfo.phone" placeholder="请输入..."></Input>
          </Col>
          <Col span="16"></Col>
        </Row>
      </FormItem>
      <Row>
        <Col span="6">
        <FormItem label="部门" prop="hdid">
          <Select v-model="userInfo.hdid" placeholder="请选择部门" not-found-text="请先新建部门"
                  :transfer="true" placement="top" :label-in-value="true" @on-change="selectUser">
            <Option :value="departItem.hdid" v-for="departItem in departList" :key="departItem.hdid">{{departItem.name}}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="岗位" prop="station">
          <Input v-model="userInfo.station" placeholder="请输入..."></Input>
        </FormItem>
        </Col>
        <Col span="14"></Col>
      </Row>
      <FormItem>
        <Button type="error" size="large" style="width: 140px;" @click="updateInfo">确认</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import apis from '@/apis';

  export default {
    data() {
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
        departList: [], // 部门列表
        ruleValidate: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: phoneReg, trigger: 'blur' },
          ],
          hdid: [
            { validator: hdidReg, trigger: 'change' },
          ],
          station: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
          ],
        },
        userInfo: {
          name: '',
          realName: '',
          hdid: '',
          phone: '',
          station: '',
          pwd: '123456',
        },
      };
    },
    methods: {
      // 部门选择
      selectUser(v) {
        this.$set(this.userInfo, 'departName', v.name);
      },
      updateInfo() {
        this.$refs.userinfo.validate((valid) => {
          if (valid) {
            const data = {
              realname: this.userInfo.realName, // 姓名
              phone: this.userInfo.phone, // 手机
              hdid: this.userInfo.hdid, // 部门id
              station: this.userInfo.station, // 岗位
            };
            this.$http.post(apis.UserEdit, data)
              .then(res => res.json())
              .then((ress) => {
                if (ress.success) {
                  this.$Message.success('修改成功');
                }
              });
          } else {
            this.$Message.error('请补全信息');
          }
        });
      },
    },
    created() {
      this.$http.post(apis.UserInfo).then((res) => {
        res.json().then((ress) => {
          if (ress.success) {
            this.userInfo = ress.result;
          }
        });
      });
      //      部门列表
      this.$http.post(apis.DepartList, { pageIndex: 1, pageSize: 10 }).then((res) => {
        res.json().then((ress) => {
          if (ress.success) {
            this.departList = ress.result.data;
          }
        });
      });
    },
  };
</script>
