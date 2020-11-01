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
  created: function() {
    this.$api.get("me/", {}, response => {
      if (response.status == 200) {
        var data = response.data;
        if (data.err_code == 0) {
          data = data.data;
          this.user = data;
          this.user.last_login = new Date(data.last_login);
          this.user.date_joined = new Date(data.date_joined);
        } else {
          this.$Message.error(data.error);
        }
      } else {
        this.$Message.error("抱歉，发生错误");
        this.$Message.error("" + response);
      }
    });
  }
};
</script>

<style scoped>
</style>
