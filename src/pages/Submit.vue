<template>
  <div id="submit">
    <br />
    <h1 style="font-family: '微软雅黑'">上传作业到 {{ work.work_name }}</h1>
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
    <Tooltip trigger="hover" content="点击下载">
      <a
        ><h2 v-if="work.done" @click="download()">
          已上传文件{{ work.file_name }}
        </h2></a
      >
    </Tooltip>
    <h2 v-if="!work.done">您还未上传过</h2>
  </div>
</template>

<script>
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
    download() {},
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
  },
};
</script>

<style scoped>
</style>

