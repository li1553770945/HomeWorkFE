<template>
  <div id="me">
    <Layout>
      <Content>
        <List border>
          <ListItem>
            <div id="username">学号：{{user.username}}</div>
          </ListItem>
          <ListItem>
            <div id="name">姓名：{{user.name}}</div>
          </ListItem>
          <ListItem>
            <div id="last_login">上次登录：{{user.last_login}}</div>
          </ListItem>
          <ListItem>
            <div id="date_joined">注册时间：{{user.date_joined}}</div>
          </ListItem>
        </List>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "Me",
  data() {
    return {
      user: ""
    };
  },
  methods:{
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
  created: function() {
    this.$Loading.start()
    this.$api.get("me/", {}, response => {
      if (response.status == 200) {
        var data = response.data;
        if (data.err_code == 0) {
          data = data.data;
          this.user = data;
          this.user.last_login = this.formatDate(new Date(data.last_login));
          this.user.date_joined = this.formatDate(new Date(data.date_joined));
          this.$Loading.finish();
        } else {
          this.$Message.error(data.error);
          this.$Loading.error();
        }
      } else {
        this.$Message.error("抱歉，发生错误");
        this.$Message.error("" + response);
        this.$Loading.error();
      }
    });
  }
};
</script>

<style scoped>
</style>
