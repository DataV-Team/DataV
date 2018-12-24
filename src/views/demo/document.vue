<template>
  <div id="datav-document">
    <div class="document">
      <div class="title">介绍</div>

      <div class="text-info">本组件库基于Vue, 用构建大屏数据展示(图表类)</div>
      <div class="text-info">类似于echarts, 但是消耗资源更小, 更轻量, 易于使用</div>

      <div class="title">使用</div>

      <div class="text-info">你需要将DataV文件夹复制至你的项目内</div>
      <div class="text-info">并在main.js中引入使用</div>

      <highlight-code>
// main.js
import dataV from './DataV/index.js'

Vue.use(dataV)

// 可以直接在Views文件夹下的dataView页面直接编写页面
// dataView页面已做全屏缩放处理 routerPath: #/datav/view
      </highlight-code>

      <div class="text-info">组件具体用法见示例</div>
      <div class="text-info"><a href="https://github.com/jiaming743/DataV" target="_BLANK">GitHub</a></div>
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

  a {
    color: #0084ff;

    &:hover,
    &:active,
    &:visited {
      color: #0084ff;
    }
  }
}
</style>
