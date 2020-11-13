<template>
  <div id="new-group">
    <Layout>
      <Content>
        <Form ref="form" :model="formItem" :rules="rule">
          <FormItem label="组织名" prop="name">
            <i-Input
              v-model="formItem.name"
              placeholder="请输入组织名"
            ></i-Input>
          </FormItem>
          <FormItem label="加入密码(该项对成员不可见）" prop="password">
            <i-Input
              v-model="formItem.password"
              placeholder="请输入组织加入密码"
            ></i-Input>
          </FormItem>

          <FormItem label=" 成员可用该组织创建作业" prop="member_can_use">
            <Tooltip max-width="300" content="对于常用、其他人可用组织，建议开启此功能。例如一个班级，如果开启此功能，所有人都可以用此组织创建作业，否则每人都要创建一个班级组织">
              <Icon type="ios-help-circle" />
            </Tooltip>
            <i-switch v-model="formItem.member_can_use" />
          </FormItem>

          <FormItem label="说明（可不填）">
            <i-Input
              type="textarea"
              :rows="5"
              v-model="formItem.desc"
              placeholder="请输入备注"
            ></i-Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit()" :loading="loading"
              >提交</Button
            >
          </FormItem>
        </Form>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "New",
  data() {
    return {
      loading: false,
      formItem: {
        name: "",
        desc: "",
        password: "",
        member_can_use: false,
      },
      rule: {
        name: [{ required: true, message: "该项必填", trigger: "change,blur" }],

        password: [
          { required: true, message: "该项必填", trigger: "change,blur" },
          {
            validator: (rule, value, callback) => {
              var reg = new RegExp("^[0-9a-zA-Z]{6,18}$");
              if (!reg.test(value)) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "密码必须为6-18位，只能包括数字、字母",
            trigger: "change,blur",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.post(
            "group/",
            {
              name: this.formItem.name,
              desc: this.formItem.desc,
              password: this.formItem.password,
              member_can_use:this.formItem.member_can_use
            },
            (response) => {
              if (response.status != 200) {
                this.loading = false;
                this.$Message.error("提交失败，服务器错误");
                this.$Message.error("" + response);
              } else {
                var data = response.data;
                if (data.err_code != 0) {
                  this.$Message.error("提交失败," + data.error);
                  this.loading = false;
                } else {
                  this.$Message.success("提交成功");
                  this.loading = false;
                  var id = response.data.data.id;
                  this.$router.push("groupdetails/" + id);
                }
              }
            }
          );
        } else {
          this.$Message.error("请更正信息后提交");
        }
      });
    },
  },
};
</script>

<style scoped>
</style>

