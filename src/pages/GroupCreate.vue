<template>
  <div id="group-create">
    <Layout>
      <Content>
        <List item-layout="vertical">
          <ListItem v-for="item in list_data" :key="item.id">
            <ListItemMeta :title="item.name" />
            创建时间：{{ formatDate(item.create_time) }}
            <template slot="action">
              <Button :to="'../groupdetails/' + item.id">详细信息</Button>
              <Button :to="'../groupmembers/' + item.id">成员管理</Button>
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
  name: "GroupCreate",
  data() {
    return {
      page_size: 10,
      total: 0,
      list_data: "",
      page: Number(this.$route.params.page),
    };
  },
  created() {
    this.end = this.page_size;
    this.$api.get(
      "mygroupnum/",
      {
        status: "owner",
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
  watch: {
    $route(to,from) {
      this.page =Number(to.params.page);
      this.getData();
      from
    },
  },
  methods: {
    getData() {
      this.$api.get(
        "mygroup/",
        {
          status: "owner",
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
      this.$router.push("/groupcreate/" + page);
    },
  },
};
</script>

<style scoped>
</style>
