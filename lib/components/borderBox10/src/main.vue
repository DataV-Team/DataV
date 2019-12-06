<template>
  <div class="dv-border-box-10" :style="`box-shadow: inset 0 0 25px 3px ${mergedColor[0]}`">
    <svg
      width="150px"
      height="150px"
      :key="item"
      v-for="item in border"
      :class="`${item} border`"
    >
      <polygon
        :fill="mergedColor[1]"
        points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvBorderBox10',
  props: {
    color: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      border: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],

      defaultColor: ['#1d48c4', '#d3e1f8'],

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