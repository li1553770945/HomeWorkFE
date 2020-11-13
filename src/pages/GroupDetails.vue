<template>
  <div id="new-group">
    <Layout>
      <Content>
        <Form ref="form" :model="formItem" :rules="rule">
          <FormItem label="组织id(id作为唯一组织标识不可更改)">
            <i-Input disabled v-model="formItem.id"></i-Input>
          </FormItem>
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
          <FormItem label="说明（可不填）">
            <i-Input
              type="textarea"
              :rows="5"
              v-model="formItem.desc"
              placeholder="请输入备注"
            ></i-Input>
          </FormItem>
          <FormItem label="创建人">
            <i-Input disabled v-model="formItem.owner"></i-Input>
          </FormItem>
          <FormItem label="创建时间">
            <DatePicker
              disabled
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              v-model="formItem.create_time"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Poptip
              trigger="hover"
              content="您无权执行此操作"
              v-if="!formItem.is_owner"
              style="margin-right: 1%"
            >
              <Button
                type="primary"
                @click="submit()"
                :loading="loading"
                disabled
                >保存</Button
              >
            </Poptip>

            <Button
              v-else
              type="primary"
              @click="submit()"
              :loading="loading"
              style="margin-right: 1%"
              >保存</Button
            >

            <Poptip
              trigger="hover"
              content="您无权执行此操作"
              v-if="!formItem.is_owner"
            >
              <Button type="error" @click="del()" disabled>删除</Button>
            </Poptip>

            <Button v-else type="error" @click="del()">删除</Button>
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
      id: this.$route.params.id,
      loading: false,
      formItem: {},
      rule: {
        name: [{ required: true, message: "该项必填", trigger: "change,blur" }],
        subject: [
          { required: true, message: "该项必填", trigger: "change,blur" },
        ],
        password: [
          { required: true, message: "该项必填", trigger: "change,blur" },
        ],
      },
    };
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.get();
    },
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      this.$api.get(
        "group/",
        {
          id: this.id,
        },
        (response) => {
          if (response.status == 200) {
            var data = response.data;
            if (data.err_code == 0) {
              data = data.data;
              this.formItem = data;
            } else {
              this.$Message.error(data.error);
            }
          } else {
            this.$Message.error("服务器错误" + response.data.err_code);
          }
        }
      );
    },
    del() {
      this.$api.delete(
        "group/",
        {
          id: this.formItem.id,
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("删除失败，服务器错误");
            this.$Message.error("" + response);
          } else {
            var data = response.data;
            if (data.err_code != 0) {
              this.$Message.error("删除失败" + data.error);
            } else {
              this.$Message.success("删除成功");
              this.$router.go(-1);
            }
          }
        }
      );
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.put(
            "group/",
            {
              id: this.formItem.id,
              name: this.formItem.name,
              desc: this.formItem.desc,
              password: this.formItem.password,
            },
            (response) => {
              if (response.status != 200) {
                this.loading = false;
                this.$Message.error("提交失败，服务器错误");
                this.$Message.error("" + response);
              } else {
                var data = response.data;
                if (data.err_code != 0) {
                  this.$Message.error("提交失败" + data.error);
                  this.loading = false;
                } else {
                  this.$Message.success("提交成功");
                  this.loading = false;
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

