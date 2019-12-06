<template>
  <div class="dv-decoration-1" :ref="ref">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">

      <template
        v-for="(point, i) in points"
      >
        <rect
          v-if="Math.random() > 0.6"
          :key="i"
          :fill="mergedColor[0]"
          :x="point[0] - halfPointSideLength"
          :y="point[1] - halfPointSideLength"
          :width="pointSideLength"
          :height="pointSideLength"
        >
          <animate
            v-if="Math.random() > 0.6"
            attributeName="fill"
            :values="`${mergedColor[0]};transparent`"
            dur="1s"
            :begin="Math.random() * 2"
            repeatCount="indefinite"
          />
        </rect>
      </template>

      <rect
        v-if="rects[0]"
        :fill="mergedColor[1]"
        :x="rects[0][0] - pointSideLength"
        :y="rects[0][1] - pointSideLength"
        :width="pointSideLength * 2"
        :height="pointSideLength * 2"
      >
        <animate
          attributeName="width"
          :values="`0;${pointSideLength * 2}`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="height"
          :values="`0;${pointSideLength * 2}`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          :values="`${rects[0][0]};${rects[0][0] - pointSideLength}`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          :values="`${rects[0][1]};${rects[0][1] - pointSideLength}`"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>

      <rect
        v-if="rects[1]"
        :fill="mergedColor[1]"
        :x="rects[1][0] - 40"
        :y="rects[1][1] - pointSideLength"
        :width="40"
        :height="pointSideLength * 2"
      >
        <animate
          attributeName="width"
          values="0;40;0"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          :values="`${rects[1][0]};${rects[1][0] - 40};${rects[1][0]}`"
          dur="2s"
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
  name: 'DvDecoration1',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    const pointSideLength = 2.5

    return {
      ref: 'decoration-1',

      svgWH: [200, 50],

      svgScale: [1, 1],

      rowNum: 4,
      rowPoints: 20,

      pointSideLength,
      halfPointSideLength: pointSideLength / 2,

      points: [],

      rects: [],

      defaultColor: ['#fff', '#0de7c2'],

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
      const { calcPointsPosition, calcRectsPosition, calcScale } = this

      calcPointsPosition()

      calcRectsPosition()

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
    },
    calcRectsPosition () {
      const { points, rowPoints } = this

      const rect1 = points[rowPoints * 2 - 1]
      const rect2 = points[rowPoints * 2 - 3]

      this.rects = [rect1, rect2]
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