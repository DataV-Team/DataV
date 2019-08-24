<template>
  <div class="dv-decoration-2" :ref="ref">
    <svg :width="`${width}px`" :height="`${height}px`">
      <rect :x="x" :y="y" :width="w" :height="h" fill="#3faacb">
        <animate
          :attributeName="reverse ? 'height' : 'width'"
          from="0"
          :to="reverse ? height : width"
          dur="6s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines=".42,0,.58,1"
          repeatCount="indefinite"
        />
      </rect>

      <rect :x="x" :y="y" width="1" height="1" fill="#fff">
        <animate
          :attributeName="reverse ? 'y' : 'x'"
          from="0"
          :to="reverse ? height : width"
          dur="6s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.42,0,0.58,1"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvDecoration2',
  mixins: [autoResize],
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ref: 'decoration-2',

      x: 0,
      y: 0,

      w: 0,
      h: 0
    }
  },
  watch: {
    reverse () {
      const { calcSVGData } = this

      calcSVGData()
    }
  },
  methods: {
    afterAutoResizeMixinInit () {
      const { calcSVGData } = this

      calcSVGData()
    },
    calcSVGData () {
      const { reverse, width, height } = this

      if (reverse) {
        this.w = 1
        this.h = height
        this.x = width / 2
        this.y = 0
      } else {
        this.w = width
        this.h = 1
        this.x = 0
        this.y = height / 2
      }
    },
    onResize () {
      const { calcSVGData } = this

      calcSVGData()
    }
  }
}
</script>