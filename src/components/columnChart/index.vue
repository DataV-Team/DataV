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
      const { data, labelTagGap, defaultMulItemDrawType, defaultColumnType } = this

      const { data: td, columnType, mulItemDrawType } = data

      const halfGap = labelTagGap / 2

      const columnWidth = this.columnWidth = labelTagGap / (td.length + 1)

      this.columnItemREPos = new Array(td.length).fill(0).map((t, i) =>
        (i + 1) * columnWidth).map(pos => pos - halfGap)

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
      const { labelAxisPos, horizon, defaultMulItemDrawType, data, filterNull } = this

      const { getAxisPointsPos, axisMaxMin, axisOriginPos, axisWH, deepClone, multipleSum } = this

      const { mulItemDrawType, data: td } = data

      const trueMulItemDrawType = this.mulItemDrawType = mulItemDrawType || defaultMulItemDrawType

      this.columnData = td.map(({ data: values }, i) =>
        values.map((v, j) => {
          if (!v) return false

          let beginPoint = labelAxisPos[j]

          if (v instanceof Array) {
            return v.map((ci, k) => {
              if (!ci) return false

              if (trueMulItemDrawType === 'cover') {
                return [
                  beginPoint,
                  getAxisPointsPos(axisMaxMin, ci, axisOriginPos, axisWH, beginPoint, horizon)
                ]
              } else {
                const beReutrn = [
                  deepClone(beginPoint),
                  getAxisPointsPos(axisMaxMin,
                    multipleSum(...filterNull(v.slice(0, k + 1))), axisOriginPos, axisWH, beginPoint, horizon)
                ]

                beginPoint = deepClone(beReutrn[1])

                return beReutrn
              }
            })
          } else {
            if (!v) return false

            return [
              deepClone(beginPoint),
              getAxisPointsPos(axisMaxMin, v, axisOriginPos, axisWH, beginPoint, horizon)
            ]
          }
        }))
    },
    drawColumnBG () {
      const { ctx, showColumnBG, columnWidth, axisWH } = this

      const { bgColor, bgColorMul, horizon, labelAxisPos } = this

      const { columnType, data } = this

      if (!showColumnBG) return

      !bgColorMul && (ctx.strokeStyle = bgColor)

      const bgColorNum = bgColor.length

      const bgColumnWidth = columnWidth * data.data.length

      ctx.lineWidth = bgColumnWidth

      ctx.setLineDash([10, 0])

      ctx.lineCap = columnType

      const halfColumnWidth = bgColumnWidth / 2

      labelAxisPos.forEach((pos, i) => {
        const movePos = pos
        const endPos = horizon ? [pos[0] + axisWH[0], pos[1]] : [pos[0], pos[1] - axisWH[1]]

        if (columnType === 'round') {
          if (horizon) {
            movePos[0] += halfColumnWidth
            endPos[0] -= halfColumnWidth
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
      const { ctx, drawColors, drawColorsMul, data: { data: td }, horizon } = this

      const { columnWidth, columnItemREPos, columnData, getREPos, canvas } = this

      const { axisOriginPos, axisWH, columnType, getRoundLinePoints } = this

      const { getLinearGradientColor } = canvas

      const halfColumnWidth = columnWidth / 2

      ctx.lineWidth = columnWidth

      !drawColorsMul && (ctx.strokeStyle = drawColors)

      ctx.setLineDash([10, 0])

      ctx.lineCap = columnType

      const drawColorsNum = drawColors.length

      const linearGradientColorPos = horizon ? [
        axisOriginPos,
        [axisOriginPos[0] + axisWH[0], axisOriginPos[1]]
      ] : [
        axisOriginPos,
        [axisOriginPos[0], axisOriginPos[1] - axisWH[1]]
      ]

      columnData.forEach((column, i) => {
        drawColorsMul && (ctx.strokeStyle = drawColors[i % drawColorsNum])

        let currentFillColor = td[i].fillColor

        currentFillColor === 'colors' && (currentFillColor = drawColors)

        const currentFillColorMul = currentFillColor instanceof Array

        const currentFillColorNum = currentFillColorMul ? currentFillColor.length : 0

        currentFillColor && (ctx.strokeStyle = getLinearGradientColor(ctx, ...linearGradientColorPos, currentFillColor))

        column[0][0][0] instanceof Array && column.forEach((ci, j) =>
          ci.forEach((cii, k) => {
            if (!cii) return

            drawColorsMul && (ctx.strokeStyle = drawColors[(i + k) % drawColorsNum])

            if (currentFillColorMul) (ctx.strokeStyle = currentFillColor[k % currentFillColorNum])

            ctx.beginPath()

            let currentREPos = cii.map(tci => getREPos(tci, columnItemREPos[i]))

            columnType === 'round' && (currentREPos = getRoundLinePoints(currentREPos, halfColumnWidth))

            ctx.moveTo(...currentREPos[0])
            ctx.lineTo(...currentREPos[1])

            ctx.stroke()
          }))

        !(column[0][0][0] instanceof Array) && column.forEach((ci, j) => {
          if (!ci) return

          ctx.beginPath()

          let currentREPos = ci.map(tci => getREPos(tci, columnItemREPos[i]))

          columnType === 'round' && (currentREPos = getRoundLinePoints(currentREPos, halfColumnWidth))

          ctx.moveTo(...currentREPos[0])
          ctx.lineTo(...currentREPos[1])

          ctx.stroke()
        })
      })
    },
    getREPos ([x, y], datum) {
      const { horizon } = this

      return [
        horizon ? x : x + datum,
        horizon ? y + datum : y
      ]
    },
    getRoundLinePoints ([pa, pb], columnWidth) {
      const { horizon } = this

      let [a, b, c, d] = [0, 0, 0, 0]

      if (horizon) {
        a = pa[0] + columnWidth
        b = pa[1]
        c = pb[0] - columnWidth
        d = pb[1]
      } else {
        a = pa[0]
        b = pa[1] - columnWidth
        c = pb[0]
        d = pb[1] + columnWidth
      }

      return horizon ? [
        [a > c ? c : a, b],
        [c, d]
      ] : [
        [a, b],
        [c, b > d ? d : b]
      ]
    }
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
