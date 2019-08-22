<template>
  <div class="dv-border-box-7" :ref="ref">
    <svg class="dv-svg-container" :width="width" :height="height">
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
import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvBorderBox7',
  mixins: [autoResize],
  data () {
    return {
      ref: 'border-box-7'
    }
  }
}
</script>