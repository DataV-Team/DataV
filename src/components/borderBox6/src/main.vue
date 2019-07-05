<template>
  <div class="dv-border-box-6" :ref="ref">
    <svg class="dv-svg-container" :width="width" :height="height">
      <circle cx="5" cy="5" r="2"/>
      <circle :cx="width - 5" cy="5" r="2" />
      <circle :cx="width - 5" :cy="height - 5" r="2" />
      <circle cx="5" :cy="height - 5" r="2" />
      <polyline :points="`10, 4 ${width - 10}, 4`" />
      <polyline :points="`10, ${height - 4} ${width - 10}, ${height - 4}`" />
      <polyline :points="`5, 70 5, ${height - 70}`" />
      <polyline :points="`${width - 5}, 70 ${width - 5}, ${height - 70}`" />
      <polyline :points="`3, 10, 3, 50`" />
      <polyline :points="`7, 30 7, 80`" />
      <polyline :points="`${width - 3}, 10 ${width - 3}, 50`" />
      <polyline :points="`${width - 7}, 30 ${width - 7}, 80`" />
      <polyline :points="`3, ${height - 10} 3, ${height - 50}`" />
      <polyline :points="`7, ${height - 30} 7, ${height - 80}`" />
      <polyline :points="`${width - 3}, ${height - 10} ${width - 3}, ${height - 50}`" />
      <polyline :points="`${width - 7}, ${height - 30} ${width - 7}, ${height - 80}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize.js'

export default {
  name: 'DvBorderBox6',
  mixins: [autoResize],
  data () {
    return {
      ref: 'border-box-6'
    }
  }
}
</script>

<style lang="less">
.dv-border-box-6 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-svg-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    circle {
      fill: gray;
    }

    polyline {
      fill: none;
      stroke-width: 1;
      stroke: fade(#fff, 35);
    }
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
