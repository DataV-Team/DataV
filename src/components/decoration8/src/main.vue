<template>
  <div class="dv-decoration-8" :ref="ref">
    <svg :width="width" :height="height">
      <polyline
        stroke="#3f96a5"
        stroke-width="2"
        fill="transparent"
        :points="`${xPos(0)}, 0 ${xPos(30)}, ${height / 2}`"
      />

      <polyline
        stroke="#3f96a5"
        stroke-width="2"
        fill="transparent"
        :points="`${xPos(20)}, 0 ${xPos(50)}, ${height / 2} ${xPos(width)}, ${height / 2}`"
      />

      <polyline
        stroke="#3f96a5"
        fill="transparent"
        stroke-width="3"
        :points="`${xPos(0)}, ${height - 3}, ${xPos(200)}, ${height - 3}`"
      />
    </svg>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvDecoration8',
  mixins: [autoResize],
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ref: 'decoration-8'
    }
  },
  methods: {
    xPos (pos) {
      const { reverse, width } = this

      if (!reverse) return pos

      return width - pos
    }
  }
}
</script>

<style lang="less">
.dv-decoration-8 {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
