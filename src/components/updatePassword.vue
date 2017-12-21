<template>
  <div class="userWrap">
    <Form ref="passwords" :model="passwords" :label-width="80" label-position="right" :rules="rulesPass">
      <Row>
        <Col span="10">
          <FormItem label="原始密码" prop="old">
            <Input type="password" v-model="passwords.old" placeholder="请输入原始密码"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
        <FormItem label="新密码" prop="newp">
          <Input type="password" v-model="passwords.newp" placeholder="请输入新密码"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
        <FormItem label="确认密码" prop="newAlign">
          <Input type="password" v-model="passwords.newAlign" placeholder="请再次输入新密码"></Input>
        </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Button type="error" style="width: 140px;" @click="updateP">确认</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import apis from '@/apis';

  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度不小于6'));
        } else if (!(/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value))) {
          callback(new Error('密码必须包含数字和字母'));
        } else {
          if (this.passwords.newAlign !== '') {
            // 对第二个密码框单独验证
            this.$refs.passwords.validateField('newAlign');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwords.newp) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        passwords: {
          old: '',
          newp: '',
          newAlign: '',
        },
        rulesPass: {
          old: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
          ],
          newp: [
            { validator: validatePass, trigger: 'blur' },
          ],
          newAlign: [
            { validator: validatePassCheck, trigger: 'blur' },
          ],
        },
      };
    },
    methods: {
      updateP() {
        this.$refs.passwords.validate((valid) => {
          if (valid) {
            this.$http.post(apis.ChangePwd,
              { pwd: this.passwords.old, newpwd: this.passwords.newAlign })
              .then((res) => {
                res.json().then((ress) => {
                  if (ress.success) {
                    this.$Message.success('密码修改成功');
                  } else {
                    this.$Message.error(ress.msg);
                  }
                });
              }, (res) => {
                res.json().then((ress) => {
                  this.$Message.error(ress.msg);
                });
              });
          }
        });
      },
    },
  };
</script>
