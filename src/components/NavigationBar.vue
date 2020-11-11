<template>
  <div>
    <Menu mode="horizontal" active-name="1-1" @on-select="click">
      <Submenu name="1">
        <template slot="title"> 作业 </template>
        <router-link to="/myhomeworknotdone/1"
          ><MenuItem name="1-1">未完成</MenuItem></router-link
        >
        <router-link to="/"><MenuItem name="1-2">我参与的</MenuItem></router-link>
        <router-link to="/myhomeworkcreate/1"
          ><MenuItem name="1-3">我发布的</MenuItem></router-link
        >

        <router-link to="/new"
          ><MenuItem name="1-4 ">发布</MenuItem></router-link
        >
      </Submenu>
      <Submenu name="2">
        <template slot="title"> 小组 </template>
        <router-link to="/groupjoin/1"
          ><MenuItem name="2-1">我加入的</MenuItem></router-link
        >
        <router-link to="/groupcreate/1"
          ><MenuItem name="2-2">我创建的</MenuItem></router-link
        >
        <router-link to="/newgroup"
          ><MenuItem name="2-3">创建</MenuItem></router-link
        >

        <MenuItem name="2-4">加入</MenuItem>
      </Submenu>
      <!-- 如果没有登录 -->
      <div id="login-button" v-if="!logined">
        <Button @click="login">登陆</Button>
        <Button @click="register">注册</Button>
      </div>
      <login-modal
        :show_parent="show_login"
        v-on:loginClosed="loginClosed"
        :key="timer_login"
      ></login-modal>
      <join-modal
        :show_parent="show_join"
        v-on:joinClosed="joinClosed"
        :key="timer_join"
      ></join-modal>
      <register-modal
        :show_parent="show_register"
        v-on:registerClosed="registerClosed"
        :key="timer_register"
      ></register-modal>
      <Submenu name="me" id="me" v-if="logined">
        <template slot="title">{{ name }}</template>
        <router-link to="/me"><MenuItem name="4-1">我</MenuItem></router-link>
        <MenuItem @click.native="logout" name="4-2">
          <span>登出</span>
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>
<script>
import JoinGroup from "./JoinGroup.vue";
import LoginModal from "./LoginModal.vue";
import RegisterModal from "./RegisterModal.vue";
//import JoinGroup from "./JoinGroup.vue"
export default {
  name: "NavigationBar",
  components: {
    "login-modal": LoginModal,
    "register-modal": RegisterModal,
    "join-modal": JoinGroup,
  },
  data() {
    return {
      value: "",
      show_login: false,
      show_join: false,
      logined: false,
      timer_login: "1",
      timer_join: "2",
      name: "",
      show_register: false,
      timer_register: "3",
    };
  },
  created: function () {
    this.$api.get("login/", {}, (response) => {
      if (response.status == 200) {
        var data = response.data;
        if (data.err_code == 0 && data.data.result == true) {
          this.logined = true;
          this.name = data.data.name;
          this.$Message.success(this.name + ",欢迎回来");
        }
      }
    });
  },
  methods: {
    login() {
      this.timer_login = new Date().getTime();
      this.show_login = true;
    },
    joinGroup() {
      this.timer_join = new Date().getTime();
      this.show_join = true;
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
    joinClosed(params) {
      params;
      this.show_join = false;
    },
    register() {
      this.timer_register = new Date().getTime();
      this.show_register = true;
    },
    registerClosed(params) {
      var register_status = params.registered;
      if (register_status == true) {
        this.show_register = false;
      }
    },
    click(name) {
      if (name == "2-4") this.joinGroup();
    },
    logout() {
      this.$api.get("logout/", {}, (response) => {
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
    },
  },
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