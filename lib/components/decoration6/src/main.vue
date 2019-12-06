<template>
  <div class="dv-decoration-6" :ref="ref">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">
      <template
        v-for="(point, i) in points"
      >
        <rect
          :key="i"
          :fill="mergedColor[Math.random() > 0.5 ? 0 : 1]"
          :x="point[0] - halfRectWidth"
          :y="point[1] - heights[i] / 2"
          :width="rectWidth"
          :height="heights[i]"
        >
          <animate
            attributeName="y"
            :values="`${point[1] - minHeights[i] / 2};${point[1] - heights[i] / 2};${point[1] - minHeights[i] / 2}`"
            :dur="`${randoms[i]}s`"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            :values="`${minHeights[i]};${heights[i]};${minHeights[i]}`"
            :dur="`${randoms[i]}s`"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      </template>
    </svg>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { randomExtend } from '../../../util'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvDecoration6',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    const rectWidth = 7

    return {
      ref: 'decoration-6',

      svgWH: [300, 35],

      svgScale: [1, 1],

      rowNum: 1,
      rowPoints: 40,

      rectWidth,
      halfRectWidth: rectWidth / 2,

      points: [],
      heights: [],
      minHeights: [],
      randoms: [],

      defaultColor: ['#7acaec', '#7acaec'],

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
      const { calcSVGData } = this

      calcSVGData()
    },
    calcSVGData () {
      const { calcPointsPosition, calcScale } = this

      calcPointsPosition()

      calcScale()
    },
    calcPointsPosition () {
      const { svgWH, rowNum, rowPoints } = this

      const [w, h] = svgWH

      const horizontalGap = w / (rowPoints + 1)
      const verticalGap = h / (rowNum + 1)

      let points = new Array(rowNum).fill(0).map((foo, i) =>
        new Array(rowPoints).fill(0).map((foo, j) => [
          horizontalGap * (j + 1), verticalGap * (i + 1)
        ]))

      this.points = points.reduce((all, item) => [...all, ...item], [])
      const heights = this.heights = new Array(rowNum * rowPoints)
        .fill(0).map(foo =>
          Math.random() > 0.8 ? randomExtend(0.7 * h, h) : randomExtend(0.2 * h, 0.5 * h))

      this.minHeights = new Array(rowNum * rowPoints)
        .fill(0).map((foo, i) => heights[i] * Math.random())

      this.randoms = new Array(rowNum * rowPoints)
        .fill(0).map(foo => Math.random() + 1.5)
    },
    calcScale () {
      const { width, height, svgWH } = this

      const [w, h] = svgWH

      this.svgScale = [width / w, height / h]
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