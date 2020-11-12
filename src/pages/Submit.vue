<template>
  <div id="submit">
    <br />
    <h1 style="font-family: '微软雅黑'">
      上传文件到作业：{{ work.work_name }}
    </h1>
    <Upload
      ref="upload"
      :disabled="work == ''"
      :before-upload="handleUpload"
      :data="{ work_id: this.work_id }"
      type="drag"
      action="submit/"
      :max-size="102400"
      :on-exceeded-size="exceededMaxsize"
      :on-success="handleSuccess"
      :on-error="handleError"
      :show-upload-list="false"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或拖拽文件到此处</p>
      </div>
    </Upload>
    <div v-if="work.done">
      已上传文件:
        <a @click="download()" >{{ work.file_name }} </a>
      <br />
      {{ this.formatDate(work.upload_time) }} 上传
    </div>
    <h3 v-if="!work.done">您还未上传过</h3>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Submit",
  data() {
    return {
      work: "",
      work_id: this.$route.params.work_id,
    };
  },
  created() {
    this.get();
  },

  watch: {
    $route(to) {
      this.work_id = to.params.work_id;
      this.get();
    },
  },
  methods: {
    get() {
      this.$api.get(
        "submit/",
        {
          work_id: this.work_id,
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
    handleUpload(upload_file) {
      this.$Loading.start();
      this.$refs.upload.post(upload_file);
      return false;
    },
    download() {
      axios
        .get("download/?work_id=" + String(this.work_id), {
          responseType: "blob",
        })
        .then((response) => {
          var response_type = response.headers["content-type"];
          if (response_type == "application/octet-stream") {
            var blob = new Blob([response.data]);
            if ("download" in document.createElement("a")) {
              //支持a标签download的浏览器
              const link = document.createElement("a"); //创建a标签
              var fileName = this.work.file_name;
              link.download = fileName; //a标签添加属性
              link.style.display = "none";
              link.href = URL.createObjectURL(blob);
              document.body.appendChild(link);
              link.click(); //执行下载
              URL.revokeObjectURL(link.href); //释放url
              document.body.removeChild(link); //释放标签
            } else {
              navigator.msSaveBlob(blob, fileName);
            }
          } else {
            this.$api.get(
              "download/",
              { work_id: this.work_id },
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
    exceededMaxsize(file, fileList) {
      file;
      fileList;
      this.$Message.error("文件最大为100MB");
    },
    handleSuccess(response, file, fileList) {
      if (response.err_code == 0) {
        file, fileList;
        this.get();
        this.$Message.success("上传成功");
        this.$Loading.finish();
      } else {
        this.$Message.error("上传失败," + response.error);
        this.$Loading.error();
      }
    },
    handleError(error, file, fileList) {
      file, fileList;
      this.$Message.error("上传失败," + error);
      this.$Loading.error();
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

