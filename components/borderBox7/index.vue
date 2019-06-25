<template>
  <div class="dv-border-box-7" :ref="ref">
    <svg class="dv-svg-container">
      <polyline class="dv-bb7-line-width-2" :points="`0, 25 0, 0 25, 0`" />
      <polyline class="dv-bb7-line-width-2" :points="`${width - 25}, 0 ${width}, 0 ${width}, 25`" />
      <polyline class="dv-bb7-line-width-2" :points="`${width - 25}, ${height} ${width}, ${height} ${width}, ${height - 25}`" />
      <polyline class="dv-bb7-line-width-2" :points="`0, ${height - 25} 0, ${height} 25, ${height}`" />

      <polyline class="dv-bb7-line-width-5" :points="`0, 10 0, 0 10, 0`" />
      <polyline class="dv-bb7-line-width-5" :points="`${width - 10}, 0 ${width}, 0 ${width}, 10`" />
      <polyline class="dv-bb7-line-width-5" :points="`${width - 10}, ${height} ${width}, ${height} ${width}, ${height - 10}`" />
      <polyline class="dv-bb7-line-width-5" :points="`0, ${height - 10} 0, ${height} 10, ${height}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../mixins/autoResize.js'

export default {
  name: 'BorderBox7',
  mixins: [autoResize],
  data () {
    return {
      ref: 'border-box-7'
    }
  }
}
</script>

<style lang="less">
@color: fade(gray, 30);

.dv-border-box-7 {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 40px fade(@color, 30);
  border: 1px solid @color;

  .dv-svg-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    polyline {
      fill: none;
      stroke-linecap: round;
    }
  }

  .dv-bb7-line-width-2 {
    stroke: @color;
    stroke-width: 2;
  }

  .dv-bb7-line-width-5 {
    stroke: fade(gray, 50);
    stroke-width: 5;
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
