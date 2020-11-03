<template>
  <div id="new">
    <Layout>
      <Content>
        <Form ref="form" :model="formItem"  :rules="rule">
          <FormItem label="作业名" prop="name">
            <i-Input v-model="formItem.name" placeholder="请输入名称"></i-Input>
          </FormItem>
          <FormItem label="提交类型">
            <Select v-model="formItem.type">
              <Option value="file">文件</Option>
              <!-- <Option value="hypertext">超文本</Option> -->
            </Select>
          </FormItem>
          <FormItem label="科目">
            <i-Input
              v-model="formItem.subject"
              placeholder="请输入科目"
            ></i-Input>
          </FormItem>
          <FormItem label="备注（可不填）">
            <i-Input
              type="textarea"
              :rows="5"
              v-model="formItem.remark"
              placeholder="请输入备注"
            ></i-Input>
          </FormItem>
          <!-- <FormItem label="成员可见完成情况">
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
          </FormItem> -->
          <FormItem label="截止时间">
            <DatePicker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择截止日期"
              v-model="formItem.end_time"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit()" :loading="loading"
              >发布</Button
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
        type: "file",
        subject: "",
        remark: "",
        end_time: new Date(),
        member_can_know_donelist: "false",
        member_can_see_others: "false",
      },
      rule: {
        name: [
          { required: true, message: "该项必填", trigger: "change,blur" },
        ],
      }
    }
  },
  methods: {
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

    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.post(
            "homework/",
            {
              name: this.formItem.name,
              type: this.formItem.type,
              subject: this.formItem.subject,
              remark: this.formItem.remark,
              end_time: this.formatDate(this.formItem.end_time),
              member_can_know_donelist:this.formItem.member_can_know_donelist,
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
                  var id=response.data.data.id;
                  this.$router.push('details/'+id)
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

