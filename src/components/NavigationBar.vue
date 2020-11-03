<template>
  <div>
    <Menu mode="horizontal"  active-name="1-1">
      <Submenu name="1">
            <template slot="title">
                作业
            </template>
                <router-link to="/"><MenuItem name="1-1">全部</MenuItem></router-link>
        </Submenu>
      <router-link to="/new"><MenuItem name="2" >发布</MenuItem></router-link>
      <!-- 如果没有登录 -->
      <div id="login-button" v-if="!logined"> 
        <Button @click="login">登陆</Button>
      </div>
      <login-modal :show_parent="show_login" v-on:loginClosed="loginClosed" :key="timer_login"></login-modal>
      <Submenu name="me" id="me" v-if="logined">
        <template slot="title">{{name}}</template>
        <router-link to="/me"><MenuItem name="4-1">我</MenuItem></router-link>
        <MenuItem  @click.native="logout" name="4-2">
          <span>登出</span>
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>
<script>
import LoginModal from "./LoginModal.vue";
export default {
  name: "NavigationBar",
  components: { "login-modal": LoginModal,
  },
  data() {
    return {
      value: "",
      show_login: false,
      logined: false,
      timer_login: "",
      name: ""
    };
  },
  created: function() {
    this.$api.get("login/", {}, response => {
      if (response.status == 200) {
        var data = response.data;
        if (data.err_code==0 && data.data.result == true) {
          this.logined = true;
          this.name = data.data.name;
          this.$Message.success(this.name+",欢迎回来");
        }
      }
    });
  },
  methods: {
    login() {
      this.timer_login = new Date().getTime();
      this.show_login = true;
    },
    loginClosed(params) {
      var login_status = params.logined;
      if (login_status == true) {
        this.name = params.data.name;
        this.logined = true;
      } else {
        this.show_login = false;
        this.logined = false;
      }
     
    },
    logout() {
      this.$api.get("logout/", {}, response => {
        if (response.status != 200) {
          this.$Message.error("操作失败，服务器错误");
          this.$Message.error("" + response);
        } else {
          var data = response.data;
          if (data.data.result == true) {
            this.logined = false;
            this.$Message.success("操作成功");
          }
        }
      });
    }
  }
};
</script>
<style scoped>
#login-button {
  position: absolute;
  right: 5%;
}
#me {
  position: absolute;
  right: 5%;
}
</style>