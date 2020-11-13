<template>
  <div id="export">
    <List item-layout="vertical">
      <ListItem v-for="item in list_data" :key="item.id">
        <template v-if="item.done" slot="action">
          <li>
            <a @click="download(item)">{{ item.file_name }}</a>
          </li>
        </template>
        <div v-if="item.done">
          <ListItemMeta :description="formatDate(item.upload_time) + '上传'">
            <template slot="title">
              <div style="color: green">{{ item.owner.name }}(已完成)</div>
            </template>
          </ListItemMeta>
        </div>
        <div v-else>
          <ListItemMeta>
            <template slot="title">
              <div style="color: red">{{ item.owner.name }}(未完成)</div>
            </template>
          </ListItemMeta>
        </div>
      </ListItem>
    </List>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Export",
  data() {
    return {
      work_id: this.$route.params.work_id,
      list_data: "",
    };
  },
  watch: {
    $route(to) {
      this.work_id = to.params.work_id;
      // this.get();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$api.get(
        "donelist/",
        {
          work_id: this.work_id,
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
    download(item) {
      var user_id = item.owner.id;
      var file_name = item.file_name;
      axios
        .get(
          "export/?work_id=" +
            String(this.work_id) +
            "&user_id=" +
            String(user_id) +
            "&file_name=" +
            String(file_name),
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          var response_type = response.headers["content-type"];
          if (response_type == "application/octet-stream") {
            var blob = new Blob([response.data]);
            if ("download" in document.createElement("a")) {
              //支持a标签download的浏览器
              const link = document.createElement("a"); //创建a标签
              link.download = file_name; //a标签添加属性
              link.style.display = "none";
              link.href = URL.createObjectURL(blob);
              document.body.appendChild(link);
              link.click(); //执行下载
              URL.revokeObjectURL(link.href); //释放url
              document.body.removeChild(link); //释放标签
            } else {
              navigator.msSaveBlob(blob, file_name);
            }
          } else {
            this.$api.get(
              "export/",
              { work_id: this.work_id, user_id: user_id, file_name: file_name },
              (response) => {
                this.$Message.error(response.data.error);
              }
            );
          }
        })
        .catch((e) => {
          this.$Message.error("下载失败，服务器错误");
          this.$Message.error(e.message);
        });
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
  },
};
</script>

<style scoped>
</style>

