<template>
  <div class="dv-decoration-12" :ref="ref">
    <svg :width="width" :height="height">
      <defs>
        <g :id="gId">
          <path
            :stroke="pathColor[i]"
            :stroke-width="width / 2"
            fill="transparent"
            v-for="(d, i) in pathD"
            :key="d"
            :d="d"
          />
        </g>

        <radialGradient
          :id="gradientId"
          cx="50%" cy="50%" r="50%"
        >
          <stop offset="0%" stop-color="transparent" stop-opacity="1" />
          <stop offset="100%" :stop-color="fade(mergedColor[1] || defaultColor[1], 30)" stop-opacity="1" />
        </radialGradient>
      </defs>

      <circle
        v-for="r in circleR"
        :key="r"
        :r="r"
        :cx="x"
        :cy="y"
        :stroke="mergedColor[1]"
        :stroke-width="0.5"
        fill="transparent"
      />

      <circle
        r="1"
        :cx="x"
        :cy="y"
        stroke="transparent"
        :fill="`url(#${gradientId})`"
      >
        <animate
          attributeName="r"
          :values="`1;${width / 2}`"
          :dur="`${haloDur}s`"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0"
          :dur="`${haloDur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        r="2"
        :cx="x"
        :cy="y"
        :fill="mergedColor[1]"
      />

      <g v-if="showSplitLine">
        <polyline
          v-for="p in splitLinePoints"
          :key="p"
          :points="p"
          :stroke="mergedColor[1]"
          :stroke-width="0.5"
          opacity="0.5"
        />
      </g>

      <path
        v-for="d in arcD"
        :key="d"
        :d="d"
        :stroke="mergedColor[1]"
        stroke-width="2"
        fill="transparent"
      />

      <use :xlink:href="`#${gId}`">
        <animateTransform
          attributeName="transform"
          type="rotate"
          :values="`0, ${x} ${y};360, ${x} ${y}`"
          :dur="`${scanDur}s`"
          repeatCount="indefinite"
        />
      </use>
    </svg>

    <div class="decoration-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'
import { uuid } from '../../../util/index'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone, getCircleRadianPoint } from '@jiaminghi/c-render/lib/plugin/util'

import { fade } from '@jiaminghi/color'

export default {
  name: 'DvDecoration12',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    /**
     * @description Scan animation dur
     */
    scanDur: {
      type: Number,
      default: 3
    },
    /**
     * @description Halo animation dur
     */
    haloDur: {
      type: Number,
      default: 2
    }
  },
  data () {
    const id = uuid()
    return {
      ref: 'decoration-12',
      gId: `decoration-12-g-${id}`,
      gradientId: `decoration-12-gradient-${id}`,

      defaultColor: ['#2783ce', '#2cf7fe'],

      mergedColor: [],

      pathD: [],

      pathColor: [],

      circleR: [],

      splitLinePoints: [],

      arcD: [],

      segment: 30,

      sectorAngle: Math.PI / 3,

      ringNum: 3,

      ringWidth: 1,

      showSplitLine: true
    }
  },
  watch: {
    color () {
      const { mergeColor } = this

      mergeColor()
    }
  },
  computed: {
    x () {
      const { width } = this

      return width / 2
    },
    y () {
      const { height } = this

      return height / 2
    }
  },
  methods: {
    init () {
      const { mergeColor, calcPathD, calcPathColor, calcCircleR, calcSplitLinePoints, calcArcD } = this

      mergeColor()

      calcPathD()

      calcPathColor()

      calcCircleR()

      calcSplitLinePoints()

      calcArcD()
    },
    mergeColor () {
      const { color, defaultColor } = this

      this.mergedColor = deepMerge(deepClone(defaultColor, true), color || [])
    },
    calcPathD () {
      const { x, y, width, segment, sectorAngle } = this

      const startAngle = -Math.PI / 2
      const angleGap = sectorAngle / segment
      const r = width / 4
      let lastEndPoints = getCircleRadianPoint(x, y, r, startAngle)

      this.pathD = new Array(segment)
        .fill('')
        .map((_, i) => {
          const endPoints = getCircleRadianPoint(x, y, r, startAngle - (i + 1) * angleGap).map(_ => _.toFixed(5))
          const d = `M${lastEndPoints.join(',')} A${r}, ${r} 0 0 0 ${endPoints.join(',')}`
          lastEndPoints = endPoints

          return d
        })
    },
    calcPathColor () {
      const { mergedColor: [color], segment } = this

      const colorGap = 100 / (segment - 1)

      this.pathColor = new Array(segment)
        .fill(color)
        .map((_, i) => fade(color, 100 - i * colorGap))
    },
    calcCircleR () {
      const { segment, ringNum, width, ringWidth } = this

      const radiusGap = (width / 2 - ringWidth / 2) / ringNum

      this.circleR = new Array(ringNum)
        .fill(0)
        .map((_, i) => radiusGap * (i + 1))
    },
    calcSplitLinePoints () {
      const { x, y, width } = this

      const angleGap = Math.PI / 6
      const r = width / 2

      this.splitLinePoints = new Array(6)
        .fill('')
        .map((_, i) => {
          const startAngle = angleGap * (i + 1)
          const endAngle = startAngle + Math.PI
          const startPoint = getCircleRadianPoint(x, y, r, startAngle)
          const endPoint = getCircleRadianPoint(x, y, r, endAngle)

          return `${startPoint.join(',')} ${endPoint.join(',')}`
        })
    },
    calcArcD () {
      const { x, y, width } = this

      const angleGap = Math.PI / 6
      const r = width / 2 - 1

      this.arcD = new Array(4)
        .fill('')
        .map((_, i) => {
          const startAngle = angleGap * (3 * i + 1)
          const endAngle = startAngle + angleGap
          const startPoint = getCircleRadianPoint(x, y, r, startAngle)
          const endPoint = getCircleRadianPoint(x, y, r, endAngle)

          return `M${startPoint.join(',')} A${x}, ${y} 0 0 1 ${endPoint.join(',')}`
        })
    },
    afterAutoResizeMixinInit () {
      const { init } = this

      init()
    },
    fade
  }
}
</script>

<style lang="less">
.dv-decoration-12 {
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
