<template>
  <div class="dv-border-box-6" :ref="ref">
    <svg class="dv-svg-container">
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

    <slot></slot>
  </div>
</template>

<script>
import borderBoxMixin from '../../mixins/borderBoxMixin.js'

export default {
  name: 'BorderBox6',
  mixins: [borderBoxMixin],
  data () {
    return {
      ref: `border-box-6-${(new Date()).getTime()}`
    }
  }
}
</script>

<style lang="less">
.dv-border-box-6 {
  position: relative;
  box-sizing: border-box;
  padding: 10px;

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
}
</style>
