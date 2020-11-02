<template>
  <div id="details">
    <Layout>
      <Layout>
        <Content>
          <Form ref="form" :model="formItem" :rules="rule">
            <FormItem label="作业名" prop="name">
              <i-Input
                v-model="formItem.name"
                placeholder="请输入名称"
              ></i-Input>
            </FormItem>
            <FormItem label="提交类型" prop="type">
              <Select v-model="formItem.type">
                <Option value="file">文件</Option>
                <Option value="hypertext">超文本</Option>
              </Select>
            </FormItem>
            <FormItem label="科目" prop="subject">
              <i-Input
                v-model="formItem.subject"
                placeholder="请输入科目"
              ></i-Input>
            </FormItem>
            <FormItem label="备注（可不填）" prop="remark">
              <i-Input
                type="textarea"
                :rows="5"
                v-model="formItem.remark"
                placeholder="请输入备注"
              ></i-Input>
            </FormItem>
            <FormItem label="成员可见完成情况">
              <Select v-model="formItem.member_can_know_donelist">
                <Option value="false">否</Option>
                <Option value="true">是</Option>
              </Select>
            </FormItem>
            <FormItem label="成员可互相查看作业">
              <Select v-model="formItem.member_can_see_others">
                <Option value="false">否</Option>
                <Option value="true">是</Option>
              </Select>
            </FormItem>
            <FormItem label="截止时间">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择截止日期"
                v-model="formItem.end_time"
              ></DatePicker>
            </FormItem>
          </Form>
          <Poptip
            trigger="hover"
            content="您无权执行此操作"
            v-if="!formItem.is_creater"
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
            v-if="!formItem.is_creater"
          >
            <Button type="error" @click="del()" disabled>删除</Button>
          </Poptip>

          <Button v-else type="error" @click="del()">删除</Button>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "Details",
  data() {
    return {
      id: this.$route.params.id,
      loading: false,

      formItem: {
      },
      rule: {
        name: [{ required: true, message: "该项必填", trigger: "change,blur" }],
      },
    };
  },
  created() {
    this.get();
  },

  watch: {
    $route(to) {
      this.id = to.params.id;
      this.get();
    },
  },
  methods: {
    get() {
      this.$api.get(
        "homework/",
        {
          id: this.id,
        },
        (response) => {
          if (response.status == 200) {
            var data = response.data;
            if (data.err_code == 0) {
              data = data.data;
              this.formItem = data;
              if (data.member_can_know_donelist)
                this.formItem.member_can_know_donelist = "true";
              else this.formItem.member_can_know_donelist = "false";
              if (data.member_can_see_others)
                this.formItem.member_can_see_others = "true";
              else this.formItem.member_can_see_others = "false";
            } else {
              this.$Message.error(data.error);
            }
          } else {
            this.$Message.error("服务器错误" + response.data.err_code);
          }
        }
      );
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.put(
            "homework/",
            {
              id:this.formItem.id,
              name: this.formItem.name,
              type: this.formItem.type,
              subject: this.formItem.subject,
              remark: this.formItem.remark,
              end_time: this.formatDate(this.formItem.end_time),
              member_can_know_donelist: this.formItem.member_can_know_donelist,
              member_can_see_others: this.formItem.member_can_see_others,
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
    del() {this.$api.delete(
            "homework/",
            {
              id:this.formItem.id,
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
                  this.$router.push('/homework')
                }
              }
            }
          );},
    formatDate(UTCDateString) {
      if (!UTCDateString) {
        return "-";
      }
      function formatFunc(str) {
        //格式化显示
        return str > 9 ? str : "0" + str;
      }
      var date2 = new Date(UTCDateString); //这步是关键
      var year = date2.getFullYear();
      var mon = formatFunc(date2.getMonth() + 1);
      var day = formatFunc(date2.getDate());
      var hour = formatFunc(date2.getHours());
      var minute = formatFunc(date2.getMinutes());
      var second = formatFunc(date2.getSeconds());
      var dateStr =
        year + "-" + mon + "-" + day + " " + hour + ":" + minute + ":" + second;
      return dateStr;
    },
  },
};
</script>

<style scoped>
</style>

