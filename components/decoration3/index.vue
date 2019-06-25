<template>
  <div class="dv-decoration-3" :ref="ref">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">

      <template
        v-for="(point, i) in points"
      >
        <rect
          :key="i"
          fill="#7acaec"
          :x="point[0] - halfPointSideLength"
          :y="point[1] - halfPointSideLength"
          :width="pointSideLength"
          :height="pointSideLength"
        >
          <animate
            v-if="Math.random() > 0.6"
            attributeName="fill"
            values="#7acaec;transparent"
            :dur="Math.random() + 1 + 's'"
            :begin="Math.random() * 2"
            repeatCount="indefinite"
          />
        </rect>
      </template>
    </svg>
  </div>
</template>

<script>
import autoResize from '../../mixins/autoResize.js'

export default {
  name: 'Decoration3',
  mixins: [autoResize],
  data () {
    const pointSideLength = 7

    return {
      ref: 'decoration-3',

      svgWH: [300, 35],

      svgScale: [1, 1],

      rowNum: 2,
      rowPoints: 25,

      pointSideLength,
      halfPointSideLength: pointSideLength / 2,

      points: []
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
    },
    calcScale () {
      const { width, height, svgWH } = this

      const [w, h] = svgWH

      this.svgScale = [width / w, height / h]
    },
    onResize () {
      const { calcSVGData } = this
      
      calcSVGData()
    }
  }
}
</script>

<style lang="less">
.dv-decoration-3 {
  width: 100%;
  height: 100%;

  svg {
    transform-origin: left top;
  }
}
</style>
