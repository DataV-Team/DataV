<template>
  <div class="dv-border-box-2" :ref="ref">
    <svg class="dv-border-svg-container">
      <polyline class="dv-bb2-line1"
        :points="`2, 2 ${width - 2} ,2 ${width - 2}, ${height - 2} 2, ${height - 2} 2, 2`" />
      <polyline class="dv-bb2-line2"
        :points="`6, 6 ${width - 6}, 6 ${width - 6}, ${height - 6} 6, ${height - 6} 6, 6`" />
      <circle cx="11" cy="11" r="1" />
      <circle :cx="width - 11" cy="11" r="1" />
      <circle :cx="width - 11" :cy="height - 11" r="1" />
      <circle cx="11" :cy="height - 11" r="1" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvBorderBox2',
  mixins: [autoResize],
  data () {
    return {
      ref: 'border-box-2'
    }
  }
}
</script>

<style lang="less">
.dv-border-box-2 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-border-svg-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;

    polyline {
      fill: none;
      stroke-width: 1;
    }

    circle {
      fill: #fff;
    }
  }

  .dv-bb2-line1 {
    stroke: #fff;
  }

  .dv-bb2-line2 {
    stroke: fade(#fff, 60);
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
