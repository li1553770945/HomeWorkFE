<style scoped>
/* .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
} */
.layout{
  display: flex;
      height: 100%;
}
.layout-footer-center {
  text-align: center;
}

navigation-bar{
  width: 100%;
}
</style>
<template>
  <div class="layout" style="height:100%">
    <Layout>
      <!-- <Header>  -->
        <navigation-bar></navigation-bar>
      <!-- </Header> -->
      <Content :style="{ padding: '0 50px' }"><router-view></router-view> </Content>
      <Footer class="layout-footer-center">2020 &copy; Yaning Li</Footer>
    </Layout>
  </div>
</template>
<script>
import NavigationBar from './components/NavigationBar'
export default {
  components: { "navigation-bar": NavigationBar },
};
</script>