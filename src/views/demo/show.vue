<template>
  <div id="show">
    <border-box-7 class="show-item" v-for="show in showData" :key="show.title">
      <a :href="show.href" target="_BLANK">{{ show.title }}</a>
    </border-box-7>
  </div>
</template>

<script>
export default {
  name: 'Show',
  data () {
    return {
      showData: [
        {
          title: '运维管理台',
          href: 'http://datav.jiaminghi.com/demo/manage-desk'
        },
        {
          title: '运维电子档案',
          href: 'http://datav.jiaminghi.com/demo/electronic-file'
        }
      ]
    }
  }
}
</script>

<style lang="less">
#show {

  .show-item {
    width: 60%;
    height: 300px;
    margin-left: 20%;
    margin-bottom: 20px;
    text-align: center;
    font-size: 100px;
    line-height: 300px;
  }

  a {
    position: relative;
    color: #fff;
    text-decoration: none;
    text-shadow: 0 0 10px gray;
    z-index: 9;

    &:hover,
    &:active,
    &:visited {
      color: #fff;
    }
  }
}
</style>
