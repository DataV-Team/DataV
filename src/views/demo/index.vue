<template>
  <div class="demo">
    <div class="menu-bar">
      <div @click="status = 'borderBox'">Border-Box</div>
      <div @click="status = 'decoration'">Decoration</div>
      <div @click="status = 'chart'">Charts</div>
      <div @click="status = 'other'">Other</div>
    </div>

    <border-box-demo v-if="status === 'borderBox'" />
    <decoration-demo v-if="status === 'decoration'" />
    <chart-demo v-if="status === 'chart'" />
  </div>
</template>

<script>
import borderBoxDemo from './borderBoxDemo'
import decorationDemo from './decorationDemo'
import chartDemo from './chartDemo'

export default {
  name: 'Demo',
  components: {
    borderBoxDemo,
    decorationDemo,
    chartDemo
  },
  data () {
    return {
      status: 'borderBox'
    }
  }
}
</script>

<style lang="less">
.demo {
  width: 100%;
  height: 100%;

  .menu-bar {
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 10px 0px;

    div {
      width: 150px;
      height: 100%;
      text-align: center;
      margin: 0px 20px;
      line-height: 50px;
      font-weight: bold;
      box-sizing: border-box;
      border: 2px solid #00baff;
      cursor: pointer;

      &:active {
        color: #00baff;
        border-color: #fff;
      }
    }
  }
}
</style>
