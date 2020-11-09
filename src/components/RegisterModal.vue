<template>
  <div>
    <!-- 注册的弹出表单 -->
    <Modal v-model="show" @on-cancel="cancel" :mask-closable="false">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="nickname" style="display:inline">
          <i-Input type="text" v-model="formInline.nickname" placeholder="请输入姓名">
            <Icon type="md-person" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <FormItem prop="user" style="display:inline">
          <i-Input type="text" v-model="formInline.user" placeholder="请输入学号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <FormItem prop="password" style="display:inline">
          <i-Input type="password" v-model="formInline.password" placeholder="请输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <FormItem prop="repassword" style="display:inline">
          <i-Input type="password" v-model="formInline.repassword" placeholder="请重新输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" :loading="loading" @click="ok">注册</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import crypto from 'crypto'
export default {
  name: "LoginModal",
  props: ["show_parent"],
  data() {
    return {
      show: this.show_parent,
      loading: false,
      error_msg: "",
      formInline: {
        user: "",
        email: "",
        password: "",
        nickname: "",
        repassword: ""
      },
      ruleInline: {//表单验证规则
        user: [
          { required: true, message: "请输入学号", trigger: "change,blur" },
          {
            validator: (rule, value, callback) => {
              var reg = new RegExp("^[a-zA-Z0-9]{5,15}$");
              if (!reg.test(value)) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "用户名只能包括数字、字母，且长度必须在5-15位",
            trigger: "change,blur"
          }
        ],
        password: [
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
            message: "密码必须为6-18位，只能包括数字、字母、特殊字符",
            trigger: "change,blur"
          }
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "change,blur" },
          {
            validator: (rule, value, callback) => {
              var reg = new RegExp("^[\u4e00-\u9fa5·]{2,18}$");
              if (!reg.test(value)) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "姓名只能为2-18位，且智能包含汉字和'·'",
            trigger: "change,blur"
          }
        ],
        repassword: [
          {
            validator: (rule, value, callback) => {
              if (value != this.formInline.password) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "两次输入的密码不一样",
            trigger: "change,blur"
          }
        ]
      }
    };
  },
  methods: {
    ok() {//点击注册按钮
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$api.post(
            "register/",
            {
              username: this.formInline.user,
              password: this.setMd5(this.formInline.password),
              nickname: this.formInline.nickname,
              email: this.formInline.email
            },
            response => {
              this.loading = false;
              var params = { registered: true };
              if (response.status != 200) {
                this.$Message.error("注册失败，服务器错误");
                console.log(response);
                this.$Message.error("" + response);
              } else {
                var data = response.data;
                if(data.err_code==0)
                {
                  data=data.data
                  if (data.result) {
                  this.show = false;
                  this.$Message.success("注册成功，请您登录");
                  this.$emit("registerClosed", params);
                } else {
                  this.$Message.error(data.error);
                }
                }
                else{
                  this.$Message.error("请求失败"+data.error);
                }
              }
            }
          );
        } else {
          this.$Message.error("请更正信息后注册");
          this.$refs.modal.buttonLoading = false;
        }
      });
    },
    cancel() {//点击取消或右上角叉号
      var params = { registered: false };
      this.show = false;
      this.$emit("registerClosed", params);
    },
    setMd5(text) {//加密密码
      var md5 = crypto.createHash("md5");
      md5.update(text); 
      var text_md5 = md5.digest("hex"); 
      return text_md5;
    }
  }
};
</script>
<style>
</style>
