<template>
  <div id="new">
    <Layout>
      <Content>
        <Form ref="form" :model="formItem" :rules="rule">
          <FormItem label="作业名" prop="name">
            <i-Input v-model="formItem.name" placeholder="请输入名称"></i-Input>
          </FormItem>
          <FormItem label="提交类型">
            <Select v-model="formItem.type">
              <Option value="file">文件</Option>
              <!-- <Option value="hypertext">超文本</Option> -->
            </Select>
          </FormItem>
          <FormItem label="科目" prop="subject">
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
          <FormItem label="选择参与组" prop="groups">
            <Tooltip
              max-width="300"
              content="您创建作业选择组织，则组织内所有成员都视为参与本作业。若后续有成员加入组织，也会视为参与本次作业。当成员退出组织时，他不会退出本次作业，只是后续发布新作业已退出组员不再参加。"
            >
              <Icon type="ios-help-circle" />
            </Tooltip>
            <CheckboxGroup
              v-model="formItem.groups"
              @on-change="change_check()"
            >
              <List item-layout="vertical">
                <ListItem v-for="item in list_data" :key="item.id">
                  <Checkbox :label="item.id">
                    <span>{{ item.name }}</span>
                  </Checkbox>
                </ListItem>
              </List>
            </CheckboxGroup>

            <div style="text-align: center">
              <Page
                :current="page"
                :total="total"
                :page-size="page_size"
                @on-change="change_page"
              />
            </div>
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
      page_size: 1,
      total: 0,
      list_data: "",
      page: 1,
      loading: false,
      formItem: {
        name: "",
        type: "file",
        subject: "",
        remark: "",
        end_time: new Date(),
        member_can_know_donelist: "false",
        member_can_see_others: "false",
        groups: [],
      },
      rule: {
        name: [{ required: true, message: "该项必填", trigger: "change,blur" }],
        subject: [
          { required: true, message: "该项必填", trigger: "change,blur" },
        ],
        groups:[{
          validator: (rule, value, callback) => {
              if (!value.length) {
                callback(true);
              } else {
                callback();
              }
            },
            message: "请至少选择一个小组",
            trigger: "change,blur"
        }]
      },
    };
  },
  created() {
    this.end = this.page_size;
    this.$api.get(
      "mygroupnum/",
      {
        status: "can_use",
      },
      (response) => {
        if (response.status != 200) {
          this.$Message.error("请求失败，服务器错误");
          this.$Message.error("" + response);
        } else {
          if (response.data.err_code == 0) {
            this.total = response.data.data;
          } else {
            this.$Message.error("请求失败，" + response.data.error);
          }
        }
      }
    );
    this.getData();
  },
  methods: {
    change_check() {
      console.log(this.formItem.groups);
    },
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
    getData() {
      this.$api.get(
        "mygroup/",
        {
          status: "can_use",
          start: (this.page - 1) * this.page_size + 1,
          end: this.page * this.page_size,
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("请求失败，服务器错误");
            this.$Message.error("" + response);
          } else {
            if (response.data.err_code == 0) {
              this.list_data = response.data.data;
            } else {
              this.$Message.error("请求失败，" + response.data.error);
            }
          }
        }
      );
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
              member_can_know_donelist: this.formItem.member_can_know_donelist,
              member_can_see_others: this.formItem.member_can_see_others,
              groups: this.formItem.groups,
            },
            (response) => {
              if (response.status != 200) {
                this.loading = false;
                this.$Message.error("提交失败，服务器错误");
                this.$Message.error("" + response);
              } else {
                var data = response.data;
                if (data.err_code != 0) {
                  this.$Message.error("提交失败，" + data.error);
                  this.loading = false;
                } else {
                  this.$Message.success("提交成功");
                  this.loading = false;
                  var id = response.data.data.id;
                  this.$router.push("details/" + id);
                }
              }
            }
          );
        } else {
          this.$Message.error("请更正信息后提交");
        }
      });
    },
    change_page(page) {
      this.page = page;
      this.getData();
    },
  },
};
</script>

<style scoped>
</style>

