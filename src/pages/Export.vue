<template>
  <div id="export">
    <h2>作业“{{ work.name }}”的完成情况</h2>
    <Button @click="exportAll()" type="primary" :loading="export_loading"
      >一键导出</Button
    >
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
      work: "",
      export_loading: false,
    };
  },
  watch: {
    $route(to) {
      this.work_id = to.params.work_id;
      this.getData();
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

      this.$api.get(
        "homework/",
        {
          id: this.work_id,
        },
        (response) => {
          if (response.status == 200) {
            var data = response.data;
            if (data.err_code == 0) {
              data = data.data;
              this.work = data;
            } else {
              this.$Message.error(data.error);
            }
          } else {
            this.$Message.error("服务器错误" + response.data.err_code);
          }
        }
      );
    },
    exportAll() {
      this.export_loading = true;
      this.$api.get(
        "export/",
        { work_id: this.work_id, status: "status" },
        (response) => {
          var data = response.data;
          if (data.err_code == 0) {
            this.$Message.success("请求成功，后台正在处理，请耐心等待");
          } else {
            this.$Message.error("请求失败");
            this.$Message.error("" + data.error);
            this.export_loading = false;
            return;
          }
        }
      );
      this.$worker
        .run(
          (work_id) => {
            var done = false;
            while (!done) {
              
              var httpRequest = new XMLHttpRequest(); //第一步：建立所需的对象
              httpRequest.open(
                "GET",
                "http://localhost:8080/export/?work_id=" +
                  String(work_id) +
                  "&status=status",
                false
              );
              httpRequest.send();
              if (httpRequest.readyState == 4) {
                if (httpRequest.status == 200) {
                  var json = JSON.parse(String(httpRequest.responseText));
                  if (json["err_code"] != 0) {
                    return json["error"];
                  } else {
                    if (json["done"]) {
                      return 1;
                    } else {
                      var now = new Date();
                      var exitTime = now.getTime() + 2000;
                      console.log(exitTime);
                      console.log(now)
                      while (now.getTime() < exitTime) {
                        now = new Date();
                      }
                    }
                  }
                } else {
                  return "请求失败，服务器错误";
                }
              }
              else
              {
                return "网络错误";
              }
            }
          },
          [this.work_id]
        )
        .then((res) => {
          if (res == 1) {
            axios
              .get("export/?work_id=" + String(this.work_id), {
                responseType: "blob",
              })
              .then((response) => {
                var file_name = this.work.name + ".zip";
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
                  this.$Message.error("导出失败，未知错误");
                }
              })
              .catch((e) => {
                this.$Message.error("下载失败，服务器错误");
                this.$Message.error(e.message);
              });
          } else if (res != 0) {
            this.$Message.error(res);
          }
          this.export_loading = false;
        });
    },
    download(item) {
      var user_id = item.owner.id;
      var file_name = item.file_name;
      this.$api.get(
        "export/",
        {
          work_id: this.work_id,
          user_id: user_id,
          file_name: file_name,
          status: "status",
        },
        (response) => {
          if (response.status != 200) {
            this.$Message.error("请求失败，服务器错误");
            this.$Message.error("" + response);
          } else {
            var data = response.data;
            if (data.err_code != 0) {
              this.$Message.error(data.error);
            } else {
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
                    this.$Message.error("导出失败，未知错误");
                  }
                })
                .catch((e) => {
                  this.$Message.error("下载失败，服务器错误");
                  this.$Message.error(e.message);
                });
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
  },
};
</script>

<style scoped>
</style>

