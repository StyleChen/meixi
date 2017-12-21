<template>
  <div>
    <div class="userWrap">
      <Form ref="formValidate" :model="formValidate" :rules="rule" :label-width="80">
        <FormItem label="系统消息" prop="desc">
          <Row>
            <Col span="18">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 7,maxRows: 15}" placeholder="请输入..."></Input>
            </Col>
            <Col span="6"></Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="error" @click="handleSubmit('formValidate')">添加发送</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import apis from '@/apis';

  export default {
    data() {
      return {
        formValidate: {
          desc: '',
        },
        rule: {
          desc: [
            { required: true, message: '系统消息不能为空', trigger: 'blur' },
          ],
        },
      };
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(apis.MessageAdd, { content: this.formValidate.desc })
              .then(res => res.json())
              .then((ress) => {
                if (ress.success) {
                  this.$Message.success('发送成功!');
                } else {
                  this.$Message.error(ress.msg);
                }
              });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
    },
  };
</script>

<style scoped>
  .userWrap {
    padding-top: 30px;
  }
</style>
