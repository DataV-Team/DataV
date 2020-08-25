<template>
  <div class="dv-border-box-6" :ref="ref">
    <svg class="dv-border-svg-container" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        9, 7 ${width - 9}, 7 ${width - 9}, ${height - 7} 9, ${height - 7}
      `" />

      <circle :fill="mergedColor[1]" cx="5" cy="5" r="2"/>
      <circle :fill="mergedColor[1]" :cx="width - 5" cy="5" r="2" />
      <circle :fill="mergedColor[1]" :cx="width - 5" :cy="height - 5" r="2" />
      <circle :fill="mergedColor[1]" cx="5" :cy="height - 5" r="2" />
      <polyline :stroke="mergedColor[0]" :points="`10, 4 ${width - 10}, 4`" />
      <polyline :stroke="mergedColor[0]" :points="`10, ${height - 4} ${width - 10}, ${height - 4}`" />
      <polyline :stroke="mergedColor[0]" :points="`5, 70 5, ${height - 70}`" />
      <polyline :stroke="mergedColor[0]" :points="`${width - 5}, 70 ${width - 5}, ${height - 70}`" />
      <polyline :stroke="mergedColor[0]" :points="`3, 10, 3, 50`" />
      <polyline :stroke="mergedColor[0]" :points="`7, 30 7, 80`" />
      <polyline :stroke="mergedColor[0]" :points="`${width - 3}, 10 ${width - 3}, 50`" />
      <polyline :stroke="mergedColor[0]" :points="`${width - 7}, 30 ${width - 7}, 80`" />
      <polyline :stroke="mergedColor[0]" :points="`3, ${height - 10} 3, ${height - 50}`" />
      <polyline :stroke="mergedColor[0]" :points="`7, ${height - 30} 7, ${height - 80}`" />
      <polyline :stroke="mergedColor[0]" :points="`${width - 3}, ${height - 10} ${width - 3}, ${height - 50}`" />
      <polyline :stroke="mergedColor[0]" :points="`${width - 7}, ${height - 30} ${width - 7}, ${height - 80}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize.js'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvBorderBox6',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data () {
    return {
      ref: 'border-box-6',

      defaultColor: ['rgba(255, 255, 255, 0.35)', 'gray'],

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
    }
  },
  mounted () {
    const { mergeColor } = this

    mergeColor()
  }
}
</script>