<template>
  <div>
    <Modal v-model="show" @on-cancel="cancel" :mask-closable="false">
      <Form  :model="formInline">
        <FormItem label="组织id：" style="display:inline">
          <i-Input type="text" inline v-model="formInline.id" placeholder="请输入组织id">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <br>
        <FormItem label="密码：" style="display:inline" prop="password">
          <i-Input type="password" v-model="formInline.password" placeholder="请输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" :loading="loading" @click="ok">加入</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "JoinGroup",
  props: ["show_parent"],
  data() {
    return {
      show: this.show_parent,
      loading: false,
      formInline: {
        id: "",
        password: ""
      },
      
    };
  },
  methods: {
    ok() {
          this.loading = true;
          this.$api.post(
            "mygroup/",
            {
              id: this.formInline.id,
              password: this.formInline.password,
            },
            response => {
              if (response.status != 200) {
                this.loading = false;
                this.$Message.error("加入失败，服务器错误");
                this.$Message.error("" + response);
              } else {
                var data = response.data;
                if(data.err_code != 0)
                {
                  this.$Message.error("加入失败，"+data.error);
                  this.loading = false;
                }
                else{
                  data=data.data;
                  if(data.result==true){
                  this.$Message.success("加入成功");
                  this.show = false;
                  this.$emit("joinClosed");
                  }
                  else{
                    this.loading = false;
                    this.$Message.error(data.error);
                  }
                }
              }
            }
          );
    },
    cancel() {
      this.show = false;
      this.$emit("joinClosed");
    },
  }
};
</script>
<style scoped>
</style>
