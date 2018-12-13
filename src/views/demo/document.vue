<template>
  <div id="datav-document">
    <div class="document">
      将src下的components及plugins复制至你的项目内
      并在main.js中引入他们即可使用

      <highlight-code>
import datavComponents from './components/index.js'
import datavPlugins from './plugin/index.js'

Vue.use(datavComponents)
Vue.use(datavPlugins)
      </highlight-code>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatavDocument'
}
</script>

<style lang="less">
#datav-document {
  font-size: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .document {
    width: 800px;
  }
}
</style>
