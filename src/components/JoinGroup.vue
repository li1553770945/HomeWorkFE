<template>
  <div>
    <Modal v-model="show" @on-cancel="cancel" :mask-closable="false">
      <Form :model="formInline" ref="formInline" :rules="ruleInline">
        <FormItem label="组织id：" style="display: inline" prop="id">
          <i-Input
            type="text"
            inline
            v-model="formInline.id"
            placeholder="请输入组织id"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <br />
        <FormItem label="密码：" style="display: inline" prop="password">
          <i-Input
            type="password"
            v-model="formInline.password"
            placeholder="请输入密码"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" :loading="loading" @click="ok"
          >加入</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "JoinGroup",
  props: ["show_parent"],
  data() {
    return {
      show: this.show_parent,
      loading: false,
      formInline: {
        id: "",
        password: "",
      },
      ruleInline: {
        id: [{ required: true, message: "该项必填", trigger: "change,blur" }],
        password: [
          { required: true, message: "该项必填", trigger: "change,blur" },
        ],
      },
    };
  },
  methods: {
    ok() {
      this.$refs["formInline"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.post(
            "mygroup/",
            {
              id: this.formInline.id,
              password: this.formInline.password,
            },
            (response) => {
              if (response.status != 200) {
                this.loading = false;
                this.$Message.error("加入失败，服务器错误");
                this.$Message.error("" + response);
              } else {
                var data = response.data;
                if (data.err_code != 0) {
                  this.$Message.error("加入失败，" + data.error);
                  this.loading = false;
                } else {
                  data = data.data;
                  if (data.result == true) {
                    this.$Message.success("加入成功");
                    this.show = false;
                    this.$emit("joinClosed");
                  } else {
                    this.loading = false;
                    this.$Message.error(data.error);
                  }
                }
              }
            }
          );
        } else {
           this.$Message.error("请更正信息后提交");
        }
      });
    },
    cancel() {
      this.show = false;
      this.$emit("joinClosed");
    },
  },
};
</script>
<style scoped>
</style>
