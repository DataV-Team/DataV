<template>
  <div class="dv-border-box-5" :ref="ref">
    <svg :class="`dv-svg-container  ${reverse && 'dv-reverse'}`">
      <polyline class="dv-bb5-line-1" :points="`8, 5 ${width - 5}, 5 ${width - 5}, ${height - 100}
        ${width - 100}, ${height - 5} 8, ${height - 5} 8, 5`" />
      <polyline class="dv-bb5-line-2" :points="`3, 5 ${width - 20}, 5 ${width - 20}, ${height - 60}
        ${width - 74}, ${height - 5} 3, ${height - 5} 3, 5`" />
      <polyline class="dv-bb5-line-3" :points="`50, 13 ${width - 35}, 13`" />
      <polyline class="dv-bb5-line-4" :points="`15, 20 ${width - 35}, 20`" />
      <polyline class="dv-bb5-line-5" :points="`15, ${height - 20} ${width - 110}, ${height - 20}`" />
      <polyline class="dv-bb5-line-6" :points="`15, ${height - 13} ${width - 110}, ${height - 13}`" />
    </svg>

    <slot></slot>
  </div>
</template>

<script>
import borderBoxMixin from '../../mixins/borderBoxMixin.js'

export default {
  name: 'BorderBox5',
  mixins: [borderBoxMixin],
  data () {
    return {
      ref: `border-box-5-${(new Date()).getTime()}`
    }
  },
  props: ['reverse']
}
</script>

<style lang="less">
.dv-border-box-5 {
  position: relative;
  box-sizing: border-box;
  padding: 20px;

  .dv-reverse {
    transform: rotate(180deg);
  }

  .dv-svg-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    polyline {
      fill: none;
    }
  }

  .dv-bb5-line-1 {
    stroke-width: 1;
    stroke: fade(#fff, 35);
  }

  .dv-bb5-line-2 {
    stroke: fade(#fff, 20);
  }

  .dv-bb5-line-3, .dv-bb5-line-6 {
    stroke-width: 5;
    stroke: fade(#fff, 15);
  }

  .dv-bb5-line-4, .dv-bb5-line-5 {
    stroke-width: 2;
    stroke: fade(#fff, 15);
  }

}
</style>
