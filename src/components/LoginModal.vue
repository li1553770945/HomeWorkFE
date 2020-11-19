<template>
  <div>
    <Modal v-model="show" @on-cancel="cancel" :mask-closable="false">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem label="学号：" prop="username" style="display:inline">
          <i-Input type="text" inline v-model="formInline.username" placeholder="请输入学号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <br>
        <FormItem label="密码：" style="display:inline" prop="password">
          <i-Input type="password" v-model="formInline.password" placeholder="请输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" :loading="loading" @click="ok">登陆</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import crypto from "crypto";
export default {
  name: "LoginModal",
  props: ["show_parent"],
  data() {
    return {
      show: this.show_parent,
      loading: false,
      formInline: {
        username: "",
        password: ""
      },
      ruleInline: {
        username: [
          { required: true, message: "请输入学号", trigger: "change,blur" },
          {
            validator: (rule, value, callback) => {
              var reg = new RegExp("^[0-9]{9,9}$");
              if (!reg.test(value)) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "请输入正确的学号",
            trigger: "change,blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change,blur" },
          {
            validator: (rule, value, callback) => {
              var reg = new RegExp(
                "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$"
              );
              if (!reg.test(value)) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "密码必须为6-18位，只能包括数字、字母、特殊字符，且不能为纯字母、数字",
            trigger: "change,blur"
          }
        ]
      }
    };
  },
  methods: {
    ok() {
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$api.post(
            "login/",
            {
              username: this.formInline.username,
              password: this.setMd5(this.formInline.password),
            },
            response => {
              var params = { logined: false };
              console.log(response)
              if (response.status != 200) {
                this.loading = false;
                this.$Message.error("登陆失败，服务器错误");
                this.$Message.error("" + response);
                console.log(response);
              } else {
                var data = response.data;
                if(data.err_code != 0)
                {
                  this.$Message.error("登陆失败"+data.error);
                  this.loading = false;
                  this.$Message.error(data.error);
                }
                else{
                  data=data.data;
                  if(data.result==true){
                  this.$Message.success("登陆成功");
                  this.show = false;
                  params.logined = true;
                  params.data = data;
                  this.$emit("loginClosed", params);
                  }
                  else{
                    this.loading = false;
                    this.$Message.error(data.error);
                  }
                }
              }
            }
          );
        } else {
          this.$Message.error("请更正信息后登陆");
          this.$refs.modal.buttonLoading = false;
        }
      });
    },
    cancel() {
      var params = { logined: false };
      this.show = false;
      this.$emit("loginClosed", params);
    },
    setMd5(text) {
      var md5 = crypto.createHash("md5");
      md5.update(text);
      var text_md5 = md5.digest("hex");
      return text_md5;
    }
  }
};
</script>
<style scoped>
</style>
