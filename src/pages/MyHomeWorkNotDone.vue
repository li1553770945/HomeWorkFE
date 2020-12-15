<template>
  <div id="homework-not-done">
    <Layout>
      <Content>
        <List item-layout="vertical">
          <ListItem v-for="item in list_data" :key="item.id">
            <ListItemMeta>
              <template slot="title">
                <div v-if="item.done" style="color: green">
                  {{ item.name }}(已完成)
                </div>
                <div v-else style="color: red">{{ item.name }}(未完成)</div>
              </template>
            </ListItemMeta>
            创建人:{{ item.owner }} <br />
            科目: {{ item.subject }} <br />
            截止时间：{{ formatDate(item.end_time) }}
            <template slot="action">
              <Button :to="'../details/' + item.id">详细信息</Button>
              <Button @click="toSubmit(item.id)">提交</Button>
            </template>
          </ListItem>
        </List>
        <div style="text-align: center">
          <Page
            :current="page"
            :total="total"
            :page-size="page_size"
            @on-change="change_page"
          />
        </div>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "HomeWork",
  data() {
    return {
      page_size: 10,
      total: 0,
      list_data: "",
      page: Number(this.$route.params.page),
    };
  },
  created() {
    this.getData();
  },
  watch: {
    $route(to, from) {
      this.page = Number(to.params.page);
      this.getData();
      from;
    },
  },
  methods: {
    getData() {
      this.$Loading.start();
      this.end = this.page_size;
      this.$api.get(
        "myhomeworknum/",
        {
          status: "notdone",
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("请求失败，服务器错误");
            this.$Message.error("" + response);
            this.$Loading.error();
            return;
          } else {
            if (response.data.err_code == 0) {
              this.total = response.data.data;
            } else {
              this.$Message.error("请求失败，" + response.data.error);
              this.$Loading.error();
              return;
            }
          }
        }
      );
      this.$api.get(
        "myhomework/",
        {
          status: "notdone",
          start: (this.page - 1) * this.page_size + 1,
          end: this.page * this.page_size,
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("请求失败，服务器错误");
            this.$Message.error("" + response);
            this.$Loading.error();
            return;
          } else {
            if (response.data.err_code == 0) {
              this.list_data = response.data.data;
              this.$Loading.finish();
            } else {
              this.$Message.error("请求失败，" + response.data.error);
              this.$Loading.error();
              return;
            }
          }
        }
      );
    },
    toSubmit(id) {
      this.$router.push("/submit/" + id);
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
    change_page(page) {
      this.$router.push("/myhomework/" + page);
    },
  },
};
</script>

<style scoped>
</style>
