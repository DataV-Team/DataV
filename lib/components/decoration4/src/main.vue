<template>
  <div class="dv-decoration-4" :ref="ref">
    <div
      :class="`container ${reverse ? 'reverse' : 'normal'}`"
      :style="reverse ? `width:${width}px;height:5px` : `width:5px;height:${height}px;`"
    >
      <svg :width="reverse ? width : 5" :height="reverse ? 5 : height">
        <polyline
          stroke="rgba(255, 255, 255, 0.3)"
          :points="reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`"
        />
        <polyline
          class="bold-line"
          stroke="rgba(255, 255, 255, 0.3)"
          stroke-width="3"
          stroke-dasharray="20, 80"
          stroke-dashoffset="-30"
          :points="reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvDecoration4',
  mixins: [autoResize],
  props: ['reverse'],
  data () {
    return {
      ref: 'decoration-4'
    }
  }
}
</script>