
<template>
  <div
    class="dv-border-box-7"
    :style="`box-shadow: inset 0 0 40px ${mergedColor[0]}; border: 1px solid ${mergedColor[0]}`"
    :ref="ref"
  >
    <svg class="dv-svg-container" :width="width" :height="height">
      <polyline class="dv-bb7-line-width-2" :stroke="mergedColor[0]" :points="`0, 25 0, 0 25, 0`" />
      <polyline class="dv-bb7-line-width-2" :stroke="mergedColor[0]" :points="`${width - 25}, 0 ${width}, 0 ${width}, 25`" />
      <polyline class="dv-bb7-line-width-2" :stroke="mergedColor[0]" :points="`${width - 25}, ${height} ${width}, ${height} ${width}, ${height - 25}`" />
      <polyline class="dv-bb7-line-width-2" :stroke="mergedColor[0]" :points="`0, ${height - 25} 0, ${height} 25, ${height}`" />

      <polyline class="dv-bb7-line-width-5" :stroke="mergedColor[1]" :points="`0, 10 0, 0 10, 0`" />
      <polyline class="dv-bb7-line-width-5" :stroke="mergedColor[1]" :points="`${width - 10}, 0 ${width}, 0 ${width}, 10`" />
      <polyline class="dv-bb7-line-width-5" :stroke="mergedColor[1]" :points="`${width - 10}, ${height} ${width}, ${height} ${width}, ${height - 10}`" />
      <polyline class="dv-bb7-line-width-5" :stroke="mergedColor[1]" :points="`0, ${height - 10} 0, ${height} 10, ${height}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvBorderBox7',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      ref: 'border-box-7',

      defaultColor: ['rgba(128,128,128,0.3)', 'rgba(128,128,128,0.5)'],

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