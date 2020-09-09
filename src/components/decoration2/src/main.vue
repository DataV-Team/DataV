<template>
  <div class="dv-decoration-2" :ref="ref">
    <svg :width="`${width}px`" :height="`${height}px`">
      <rect :x="x" :y="y" :width="w" :height="h" :fill="mergedColor[0]">
        <animate
          :attributeName="reverse ? 'height' : 'width'"
          from="0"
          :to="reverse ? height : width"
          :dur="`${dur}s`"
          calcMode="spline"
          keyTimes="0;1"
          keySplines=".42,0,.58,1"
          repeatCount="indefinite"
        />
      </rect>

      <rect :x="x" :y="y" width="1" height="1" :fill="mergedColor[1]">
        <animate
          :attributeName="reverse ? 'y' : 'x'"
          from="0"
          :to="reverse ? height : width"
          :dur="`${dur}s`"
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

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvDecoration2',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    reverse: {
      type: Boolean,
      default: false
    },
    dur: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      ref: 'decoration-2',

      x: 0,
      y: 0,

      w: 0,
      h: 0,

      defaultColor: ['#3faacb', '#fff'],

      mergedColor: []
    }
  },
  watch: {
    color () {
      const { mergeColor } = this

      mergeColor()
    },
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
    },
    mergeColor () {
      const { color, defaultColor } = this

      this.mergedColor = deepMerge(deepClone(defaultColor, true), color || [])
    }
  },
  mounted () {
    const { mergeColor } = this

    mergeColor()
  }
}
</script>

<style lang="less">
.dv-decoration-2 {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
