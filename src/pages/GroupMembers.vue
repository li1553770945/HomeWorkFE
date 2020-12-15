<template>
  <div id="group-create">
    <Layout>
      <Content>
        <List item-layout="vertical">
          <ListItem v-for="item in list_data" :key="item.id">
            <ListItemMeta :title="item.name" :description="item.username" />
            <template slot="action">
              <Button @click="del(item.id)" type="error">删除</Button>
            </template>
          </ListItem>
        </List>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "GroupMembers",
  data() {
    return {
      list_data: "",
      id:this.$route.params.id
    };
  },
  created() {
    this.getData();
  },
  watch: {
    $route(to,from) {
      this.id =Number(to.params.id);
      this.getData();
      from
    },
  },
  methods: {
    getData() {
      this.$Loading.start()
      this.$api.get(
        "groupmembers/",
        {
          id:this.id
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("请求失败，服务器错误");
            this.$Message.error("" + response);
            this.$Loading.error();
          } else {
            if (response.data.err_code == 0) {
              this.list_data = response.data.data;
              this.$Loading.finish();
            } else {
              this.$Message.error("请求失败，" + response.data.error);
              this.$Loading.error();
            }
          }
        }
      );
    },
    del(uid)
    {
       this.$api.delete(
        "groupmembers/",
        {
          group_id:this.id,
          user_id:uid
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("请求失败，服务器错误");
            this.$Message.error("" + response);
          } else {
            if (response.data.err_code == 0) {
              this.$Message.success("删除成功");
            } else {
              this.$Message.error("请求失败，" + response.data.error);
            }
          }
        }
      );
    }
  },
};
</script>

<style scoped>
</style>
