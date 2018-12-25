<template>
  <div class="side-nav">
    <div class="item" v-for="navItem in nav" :key="navItem.title">
      <a :href="`#${navItem.target}`">{{ navItem.title }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideNav',
  props: ['nav']
}
</script>

<style lang="less">
.side-nav {
  position: fixed;
  width: 200px;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);

  .item {
    font-weight: bold;
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 18px;

    a {
      color: #fff;

      &:hover,
      &:active,
      &:visited {
        color: #fff;
      }
    }
  }
}
</style>
