<template>
  <div class="dv-decoration-9" :ref="ref">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">
      <defs>
        <polygon :id="polygonId" points="15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5" />
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        :stroke="mergedColor[1]"
        stroke-width="10"
        stroke-dasharray="80, 100, 30, 100"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          :dur="`${dur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        :stroke="mergedColor[0]"
        stroke-width="6"
        stroke-dasharray="50, 66, 100, 66"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;-360 50 50"
          :dur="`${dur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="38"
        fill="transparent"
        :stroke="fade(mergedColor[1] || defaultColor[1], 30)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />

      <use
        v-for="(foo, i) in new Array(20).fill(0)"
        :key="i"
        :xlink:href="`#${polygonId}`"
        :stroke="mergedColor[1]"
        :fill="Math.random() > 0.4 ? 'transparent' : mergedColor[0]"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          :dur="`${dur}s`"
          :begin="`${i * dur / 20}s`"
          repeatCount="indefinite"
        />
      </use>

      <circle
        cx="50"
        cy="50"
        r="26"
        fill="transparent"
        :stroke="fade(mergedColor[1] || defaultColor[1], 30)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />
    </svg>

    <slot></slot>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'
import { uuid } from '../../../util/index'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

import { fade } from '@jiaminghi/color'

export default {
  name: 'DvDecoration9',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    dur: {
      type: Number,
      default: 3
    }
  },
  data () {
    const id = uuid()
    return {
      ref: 'decoration-9',

      polygonId: `decoration-9-polygon-${id}`,

      svgWH: [100, 100],

      svgScale: [1, 1],

      defaultColor: ['rgba(3, 166, 224, 0.8)', 'rgba(3, 166, 224, 0.5)'],

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
    afterAutoResizeMixinInit () {
      const { calcScale } = this

      calcScale()
    },
    calcScale () {
      const { width, height, svgWH } = this

      const [w, h] = svgWH

      this.svgScale = [width / w, height / h]
    },
    onResize () {
      const { calcScale } = this

      calcScale()
    },
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