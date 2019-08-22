<template>
  <div class="dv-border-box-5" :ref="ref">
    <svg :class="`dv-svg-container  ${reverse && 'dv-reverse'}`" :width="width" :height="height">
      <polyline class="dv-bb5-line-1" :points="`8, 5 ${width - 5}, 5 ${width - 5}, ${height - 100}
        ${width - 100}, ${height - 5} 8, ${height - 5} 8, 5`" />
      <polyline class="dv-bb5-line-2" :points="`3, 5 ${width - 20}, 5 ${width - 20}, ${height - 60}
        ${width - 74}, ${height - 5} 3, ${height - 5} 3, 5`" />
      <polyline class="dv-bb5-line-3" :points="`50, 13 ${width - 35}, 13`" />
      <polyline class="dv-bb5-line-4" :points="`15, 20 ${width - 35}, 20`" />
      <polyline class="dv-bb5-line-5" :points="`15, ${height - 20} ${width - 110}, ${height - 20}`" />
      <polyline class="dv-bb5-line-6" :points="`15, ${height - 13} ${width - 110}, ${height - 13}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvBorderBox5',
  mixins: [autoResize],
  data () {
    return {
      ref: 'border-box-5'
    }
  },
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  }
}
</script>