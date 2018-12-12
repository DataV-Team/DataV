<template>
  <div id="app" ref="data-root">
    <div class="datav-container">
      <demo />
    </div>
  </div>
</template>

<script>
import demo from './views/demo/index'

export default {
  name: 'app',
  components: {
    demo
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background-size: 100%;
  background-image: url('./assets/img/bg.png');
  background-repeat: repeat;

  .datav-container {
    width: 100%;
    height: 100%;
  }
}
</style>
