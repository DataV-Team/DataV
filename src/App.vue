<template>
  <div id="app" ref="data-root">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
#app {
  font-family:
  'code',
  '-apple-system',
  'BlinkMacSystemFont',
  'Helvetica Neue',
  'PingFang SC',
  'Microsoft YaHei',
  'Source Han Sans SC',
  'Noto Sans CJK SC',
  'WenQuanYi Micro Hei',
  'sans-serif';
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
