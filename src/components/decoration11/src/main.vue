<template>
  <div class="dv-decoration-11" :ref="ref">
    <svg :width="width" :height="height">
      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`20 10, 25 4, 55 4 60 10`"
      />

      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`20 ${height - 10}, 25 ${height - 4}, 55 ${height - 4} 60 ${height - 10}`"
      />

      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`${width - 20} 10, ${width - 25} 4, ${width - 55} 4 ${width - 60} 10`"
      />

      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`${width - 20} ${height - 10}, ${width - 25} ${height - 4}, ${width - 55} ${height - 4} ${width - 60} ${height - 10}`"
      />

      <polygon
        :fill="fade(mergedColor[0] || defaultColor[0], 20)"
        :stroke="mergedColor[0]"
        :points="`
          20 10, 5 ${height / 2} 20 ${height - 10}
          ${width - 20} ${height - 10} ${width - 5} ${height / 2} ${width - 20} 10
        `"
      />

      <polyline
        fill="transparent"
        :stroke="fade(mergedColor[0] || defaultColor[0], 70)"
        :points="`25 18, 15 ${height / 2} 25 ${height - 18}`"
      />

      <polyline
        fill="transparent"
        :stroke="fade(mergedColor[0] || defaultColor[0], 70)"
        :points="`${width - 25} 18, ${width - 15} ${height / 2} ${width - 25} ${height - 18}`"
      />
    </svg>

    <div class="decoration-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

import { fade } from '@jiaminghi/color'

export default {
  name: 'DvDecoration11',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    const timestamp = Date.now()
    return {
      ref: 'decoration-11',

      defaultColor: ['#1a98fc', '#2cf7fe'],

      mergedColor: []
    }
  },
  watch: {
    color () {
      const { mergeColor } = this

      mergeColor()
    }
  },
  methods: {
    mergeColor () {
      const { color, defaultColor } = this

      this.mergedColor = deepMerge(deepClone(defaultColor, true), color || [])
    },
    fade
  },
  mounted () {
    const { mergeColor } = this

    mergeColor()
  }
}
</script>

<style lang="less">
.dv-decoration-11 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;

  .decoration-content {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
