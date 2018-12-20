<template>
  <div class="column-chart">
    <loading v-if="!data" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <label-line :label="data.labelLine" :colors="drawColors" />
  </div>
</template>

<script>
import colorsMixin from '../../mixins/colorsMixin.js'

import canvasMixin from '../../mixins/canvasMixin.js'

import axisMixin from '../../mixins/axisMixin.js'

export default {
  name: 'ColumnChart',
  mixins: [colorsMixin, canvasMixin, axisMixin],
  data () {
    return {
      ref: `radar-chart-${(new Date()).getTime()}`,

      axisType: 'column',

      defaultColumnType: 'butt',
      defaultBGColor: 'rgba(250, 250, 250, 0.2)',
      defaultMulItemDrawType: 'link',
      defaultShowColumnBG: false,

      columnType: '',
      columnWidth: '',
      columnItemREPos: [],
      mulItemDrawType: '',
      showColumnBG: false,
      bgColor: '',
      bgColorMul: false,
      mulItemDrawType: '',
      columnData: []
    }
  },
  props: ['data', 'colors'],
  methods: {
    async init () {
      const { initCanvas, data, draw } = this

      await initCanvas()

      data && draw()
    },
    draw () {
      const { clearCanvas, initColors, initAxis, drawAxis, calcColumnConfig, drawColumnBG } = this

      clearCanvas()

      initColors()

      initAxis()

      drawAxis()

      const { calcBGConfig, drawColumn, calcColumnData } = this

      calcBGConfig()

      calcColumnConfig()

      calcColumnData()

      drawColumnBG()

      drawColumn()
    },
    calcColumnConfig () {
      const { horizon, data, labelTagGap, valueTagGap, defaultMulItemDrawType, defaultColumnType } = this

      const { data: td, columnType, mulItemDrawType } = data

      const halfGap = labelTagGap / 2

      const columnWidth = this.columnWidth = labelTagGap / (td.length + 1)

      const halfColumnWidth = columnWidth / 2

      this.columnItemREPos = new Array(td.length).fill(0).map((t, i) =>
        i * columnWidth + halfColumnWidth).map(pos => pos - halfGap)

      this.columnType = columnType || defaultColumnType

      this.mulItemDrawType = mulItemDrawType || defaultMulItemDrawType
    },
    calcBGConfig () {
      const { data, defaultBGColor, drawColors, defaultShowColumnBG } = this

      const { showColumnBG, bgColor } = data

      this.showColumnBG = showColumnBG || defaultShowColumnBG

      let trueBGColor = bgColor || defaultBGColor

      trueBGColor === 'colors' && (trueBGColor = drawColors)

      this.bgColor = trueBGColor

      this.bgColorMul = trueBGColor instanceof Array
    },
    calcColumnData () {
      const { labelTagPos, horizon, defaultMulItemDrawType, data } = this

      const { getAxisPointsPos, axisMaxMin, axisOriginPos, axisWH } = this

      const { mulItemDrawType, data: td } = data

      this.mulItemDrawType = mulItemDrawType || defaultMulItemDrawType

      const columnData = td.map(({ data: values }, i) => {
        const beginPos = []

        values.map((v, j) => {
          if (!v) return

          if (v instanceof Array) {
            return v.map()
          } else {
            return getAxisPointsPos(axisMaxMin, v, axisOriginPos, axisWH, labelTagPos[j], horizon)
          }
        })
      })
    },
    drawColumnBG () {
      const { ctx, showColumnBG, columnWidth, columnItemREPos, axisWH } = this

      const { labelTagPos, bgColor, bgColorMul, horizon, axisOriginPos } = this

      const { columnType, data } = this

      if (!showColumnBG) return

      !bgColorMul && (ctx.strokeStyle = bgColor)

      const bgColorNum = bgColor.length

      const bgColumnWidth = columnWidth * data.data.length

      ctx.lineWidth = bgColumnWidth

      ctx.setLineDash([10, 0])

      ctx.lineCap = columnType

      const halfColumnWidth = bgColumnWidth  / 2

      labelTagPos.forEach(([x, y], i) => {
        const movePos = horizon ? [axisOriginPos[0], y] : [x, axisOriginPos[1]]
        const endPos = horizon ? [axisOriginPos[0] + axisWH[0], y] : [x, axisOriginPos[1] - axisWH[1]]

        if (columnType === 'round') {
          if (horizon) {
            movePos[0] += halfColumnWidth
            endPos[1] -= halfColumnWidth
          } else {
            movePos[1] -= halfColumnWidth
            endPos[1] += halfColumnWidth
          }
        }

        bgColorMul && (ctx.strokeStyle = bgColor[i % bgColorNum])

        ctx.beginPath()

        ctx.moveTo(...movePos)
        ctx.lineTo(...endPos)

        ctx.stroke()
      })
    },
    drawColumn () {
    },
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.column-chart {
  position: relative;
  display: flex;
  flex-direction: column;

  .canvas-container {
    flex: 1;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
