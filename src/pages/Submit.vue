<template>
  <div id="submit">
       <Upload
        type="drag"
        action="/submit/"
        :on-success="handleSuccess"
        :data="{work_id:this.work_id}">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽文件到此处</p>
        </div>
    </Upload>
  </div>
</template>

<script>
export default {
  name: "Submit",
  data() {
    return {
      work_id: this.$route.params.work_id,
    }
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
      console.log(this.work_id)
    },
    handleSuccess(response,file,fileList)
    {
      console.log(response,file,fileList)
    }
  },
};
</script>

<style scoped>
</style>

