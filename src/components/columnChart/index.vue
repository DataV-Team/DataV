<template>
  <div class="column-chart">
    <loading v-if="!data" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <label-line :label="data.labelLine" :colors="drawColors" />

    <for-slot><slot></slot></for-slot>
  </div>
</template>

<script>
import colorsMixin from '../../mixins/colorsMixin.js'

import canvasMixin from '../../mixins/canvasMixin.js'

import axisMixin from '../../mixins/axisMixin.js'

export default {
  name: 'ColumnChart',
  mixins: [colorsMixin, canvasMixin, axisMixin],
  props: ['data', 'colors'],
  data () {
    return {
      ref: `radar-chart-${(new Date()).getTime()}`,

      // axis base config
      boundaryGap: true,
      mulValueAdd: true,
      horizon: false,

      echelonOffset: 10,
      defaultColumnBGColor: 'rgba(100, 100, 100, 0.2)',

      defaultValueFontSize: 10,
      defaultValueColor: '#999',

      columnData: [],
      columnItemSeriesNum: 0,
      columnItemAllWidth: 0,
      columnItemWidth: 0,
      columnBGWidth: 0,
      columnItemOffset: [],

      valueTextOffset: [],

      valuePointPos: []
    }
  },
  watch: {
    data (d) {
      const { draw } = this

      d && draw()
    }
  },
  methods: {
    async init () {
      const { initCanvas, initColors } = this

      await initCanvas()

      initColors()

      const { data, draw } = this

      data && draw()
    },
    draw () {
      const { clearCanvas } = this

      clearCanvas()

      const { calcHorizon, initAxis, drawAxis } = this

      calcHorizon()

      initAxis()

      drawAxis()

      const { switchNormalOrCenterOriginType } = this

      switchNormalOrCenterOriginType()
    },
    calcHorizon () {
      const { data: { horizon } } = this

      this.horizon = horizon
    },
    switchNormalOrCenterOriginType () {
      const { centerOrigin, drawNormalTypeColumnChart, drawCenterOriginTypeColumnChart } = this

      if (centerOrigin) drawCenterOriginTypeColumnChart()

      if (!centerOrigin) drawNormalTypeColumnChart()
    },
    drawNormalTypeColumnChart () {
      const { calcColumnConfig, calcColumnItemOffset, calcValuePointPos } = this

      calcColumnConfig()

      calcColumnItemOffset()

      calcValuePointPos()

      const { drawColumnBG, drawFigure, drawValueText } = this

      drawColumnBG()

      drawFigure()

      drawValueText()
    },
    calcColumnConfig () {
      const { data: { data, spaceBetween }, labelAxisTagPos, axisOriginPos, horizon } = this

      const columnData = this.columnData = data.filter(({ type }) =>
        !(type === 'polyline' || type === 'smoothline'))

      const columnItemSeriesNum = this.columnItemSeriesNum = columnData.length

      const columnItemAllWidth = this.columnItemAllWidth = (horizon
        ? axisOriginPos[1] - labelAxisTagPos[0][1]
        : labelAxisTagPos[0][0] - axisOriginPos[0]) * 2

      const columnItemWidth = this.columnItemWidth = columnItemAllWidth / (columnItemSeriesNum + 1)

      const spaceGap = columnItemWidth / (columnItemSeriesNum + 1)

      let columnBGWidth = columnItemWidth * columnItemSeriesNum

      spaceBetween && (columnBGWidth += spaceGap * (columnItemSeriesNum - 1))

      this.columnBGWidth = columnBGWidth
    },
    calcColumnItemOffset () {
      const { columnItemSeriesNum, columnItemAllWidth, columnItemWidth } = this

      const { data: { spaceBetween, data } } = this

      const halfColumnWidth = columnItemWidth / 2

      const halfColumnItemAllWidth = columnItemAllWidth / 2

      let columnItemOffset = new Array(columnItemSeriesNum).fill(0)

      if (spaceBetween) {
        const spaceGap = columnItemWidth / (columnItemSeriesNum + 1)

        columnItemOffset = columnItemOffset.map((t, i) =>
          spaceGap * (i + 1) + columnItemWidth * i + halfColumnWidth - halfColumnItemAllWidth)
      }

      if (!spaceBetween) {
        columnItemOffset = columnItemOffset.map((t, i) =>
          columnItemWidth * (i + 1) - halfColumnItemAllWidth)
      }

      this.columnItemOffset = data.map(({ type }) =>
        (type === 'polyline' || type === 'smoothline')
          ? 0
          : columnItemOffset.shift())
    },
    calcValuePointPos () {
      const { getAxisPointsPos, valueAxisMaxMin, agValueAxisMaxMin } = this

      const { labelAxisTagPos, deepClone, filterNull, multipleSum } = this

      const { data: { data }, axisOriginPos, axisWH, horizon } = this

      const dealAfterData = deepClone(data).map(({ data, againstAxis }) => {
        if (!(data[0] instanceof Array)) return { data, againstAxis }

        const td = data.map(series => series.map((v, i) => {
          if (!v && v !== 0) return false

          return multipleSum(...filterNull(series.slice(0, i + 1)))
        }))

        return { data: td, againstAxis }
      })

      this.valuePointPos = dealAfterData.map(({ data, againstAxis }) =>
        getAxisPointsPos(
          againstAxis ? agValueAxisMaxMin : valueAxisMaxMin,
          data,
          axisOriginPos,
          axisWH,
          labelAxisTagPos,
          horizon
        ))
    },
    drawColumnBG () {
      const { ctx, data: { showColumnBG, columnBGColor, roundColumn } } = this

      if (!showColumnBG) return

      const { columnBGWidth, defaultColumnBGColor, horizon, axisWH: [w, h], labelAxisTagPos } = this

      const trueColumnColor = columnBGColor || defaultColumnBGColor

      ctx.lineWidth = columnBGWidth
      ctx.strokeStyle = trueColumnColor
      ctx.setLineDash([10, 0])

      const { getRoundColumnPoint, labelAxisTag } = this

      ctx.lineCap = roundColumn ? 'round' : 'butt'

      labelAxisTagPos.forEach(([x, y], i) => {
        if (!labelAxisTag[i] && labelAxisTag[i] !== 0) return

        const topPoint = horizon ? [x + w, y] : [x, y - h]
        let columnBGPoints = [[x, y], topPoint]

        roundColumn && (columnBGPoints = getRoundColumnPoint(columnBGPoints, columnBGWidth))

        ctx.beginPath()

        ctx.moveTo(...columnBGPoints[0])
        ctx.lineTo(...columnBGPoints[1])

        ctx.stroke()
      })
    },
    drawFigure () {
      const { data: { data }, valuePointPos } = this

      const { drawColumn, drawEchelon, drawline } = this

      data.forEach((series, i) => {
        switch (series.type) {
          case 'leftEchelon':
          case 'rightEchelon': drawEchelon(series, valuePointPos[i], i)
            break

          case 'polyline':
          case 'smoothline': drawline(series, valuePointPos[i], i)
            break

          default: drawColumn(series, valuePointPos[i], i)
            break
        }
      })
    },
    getGradientColor (value, colors) {
      const { data: { localGradient }, axisAnglePos, horizon } = this

      const { ctx, canvas: { getLinearGradientColor } } = this

      if (localGradient) {
        return getLinearGradientColor(ctx,
          ...(horizon
            ? [value, [axisAnglePos.leftTop[0], value[1]]]
            : [value, [value[0], axisAnglePos.leftBottom[1]]]),
          colors)
      } else {
        return getLinearGradientColor(ctx,
          ...(horizon
            ? [axisAnglePos.leftTop, axisAnglePos.rightTop]
            : [axisAnglePos.leftTop, axisAnglePos.leftBottom]),
          colors)
      }
    },
    drawColumn ({ fillColor }, points, i) {
      const { ctx, columnItemWidth, drawColors } = this

      ctx.setLineDash([10, 0])
      ctx.lineWidth = columnItemWidth

      const color = fillColor || drawColors[i]
      const colorNum = color.length
      const drawColorNum = drawColors.length

      const { columnItemOffset, labelAxisTagPos, getOffsetPoint } = this

      const currentOffset = columnItemOffset[i]
      const offsetTagPos = labelAxisTagPos.map(p => getOffsetPoint(p, currentOffset))

      const { getGradientColor, getRoundColumnPoint, data: { roundColumn } } = this

      ctx.lineCap = roundColumn ? 'round' : 'butt'

      const seriesColumn = points[0][0] instanceof Array

      seriesColumn && points.forEach((series, j) => {
        let lastEnd = offsetTagPos[j]

        series.forEach((item, k) => {
          if (!item && item !== 0) return

          const currentPoint = getOffsetPoint(item, currentOffset)

          let columnPoint = [lastEnd, currentPoint]

          roundColumn && (columnPoint = getRoundColumnPoint(columnPoint))

          if (typeof color === 'string') {
            ctx.strokeStyle = drawColors[(i + k) % drawColorNum]
          } else {
            ctx.strokeStyle = color[k % colorNum]
          }

          ctx.beginPath()
          ctx.moveTo(...columnPoint[0])
          ctx.lineTo(...columnPoint[1])
          ctx.stroke()

          lastEnd = currentPoint
        })
      })

      !seriesColumn && points.forEach((point, i) => {
        if (!point && point !== 0) return

        let columnPoint = [offsetTagPos[i], getOffsetPoint(point, currentOffset)]

        roundColumn && (columnPoint = getRoundColumnPoint(columnPoint))

        ctx.beginPath()
        ctx.strokeStyle = getGradientColor(point, color)
        ctx.moveTo(...columnPoint[0])
        ctx.lineTo(...columnPoint[1])
        ctx.stroke()
      })
    },
    getOffsetPoint ([x, y], offset) {
      const { horizon } = this

      return horizon
        ? [x, y + offset]
        : [x + offset, y]
    },
    getOffsetPoints (points, offset) {
      const { getOffsetPoint } = this

      return points.map(point => point ? getOffsetPoint(point, offset) : false)
    },
    getRoundColumnPoint ([pa, pb], cw = false) {
      const { horizon, columnItemWidth: dciw } = this

      const columnWidth = cw || dciw

      const radius = columnWidth / 2

      let [a, b, c, d] = [0, 0, 0, 0]

      if (horizon) {
        a = pa[0] + radius
        b = pa[1]
        c = pb[0] - radius
        d = pb[1]
      } else {
        a = pa[0]
        b = pa[1] - radius
        c = pb[0]
        d = pb[1] + radius
      }

      return horizon ? [
        [a > c ? c : a, b],
        [c, d]
      ] : [
        [a, b],
        [c, b > d ? d : b]
      ]
    },
    drawline ({ lineColor, fillColor, pointColor, lineType, lineDash, type }, points, i) {
      const { drawColors, ctx, axisOriginPos: [x, y], horizon } = this

      const { color: { hexToRgb }, getGradientColor, getTopPoint } = this

      const drawColorNum = drawColors.length
      const currentColor = drawColors[i % drawColorNum]

      let currentLineColor = hexToRgb(currentColor, 0.6)
      let currentPointColor = currentColor

      lineColor && (currentLineColor = lineColor)
      pointColor && (currentPointColor = pointColor)

      let currentLineType = lineType || 'line'
      let currentLineDash = currentLineType === 'dashed' ? (lineDash || [5, 5]) : [10, 0]

      ctx.strokeStyle = currentLineColor

      const { canvas: { drawPolylinePath, drawPolyline, drawPoints } } = this
      const { canvas: { drawSmoothlinePath, drawSmoothline } } = this

      const lineFun = type === 'polyline' ? [drawPolylinePath, drawPolyline] : [drawSmoothlinePath, drawSmoothline]

      if (fillColor) {
        const lastPoint = points[points.length - 1]

        ctx.fillStyle = getGradientColor(getTopPoint(points), fillColor)

        lineFun[0](ctx, points, false, true, true)
        ctx.lineTo(...(horizon ? [x, lastPoint[1]] : [lastPoint[0], y]))
        ctx.lineTo(...(horizon ? [x, points[0][1]] : [points[0][0], y]))

        ctx.closePath()
        ctx.fill()
      }

      lineFun[1](ctx, points, 1, currentLineColor, false, currentLineDash, true, true)

      drawPoints(ctx, points, 2, currentPointColor)
    },
    getTopPoint (points) {
      const { horizon } = this

      let topIndex = 0

      const xPos = points.map(([x]) => x)
      const yPos = points.map(([, y]) => y)

      if (horizon) {
        const top = Math.max(...xPos)

        topIndex = xPos.findIndex(v => v === top)
      }

      if (!horizon) {
        const top = Math.min(...yPos)

        topIndex = yPos.findIndex(v => v === top)
      }

      return points[topIndex]
    },
    drawEchelon ({ fillColor, type }, points, i) {
      const { data: { roundColumn } } = this

      const seriesColumn = points[0][0] instanceof Array

      if (seriesColumn || roundColumn) return

      const { ctx, columnItemOffset, labelAxisTagPos, getOffsetPoint } = this

      const currentOffset = columnItemOffset[i]
      const offsetTagPos = labelAxisTagPos.map(p => getOffsetPoint(p, currentOffset))

      const { drawColors, getGradientColor, getEchelonPoints } = this

      const drawColorsNum = drawColors.length

      const color = fillColor || drawColors[i % drawColorsNum]

      const { canvas: { drawPolylinePath } } = this

      points.forEach((point, i) => {
        const topPoint = getOffsetPoint(point, currentOffset)
        const bottomPoint = offsetTagPos[i]

        const echelonPoints = getEchelonPoints(topPoint, bottomPoint, type)

        drawPolylinePath(ctx, echelonPoints, true, true)

        ctx.fillStyle = getGradientColor(point, color)

        ctx.fill()
      })
    },
    getEchelonPoints ([tx, ty], [bx, by], type) {
      const { columnItemWidth, echelonOffset, horizon } = this

      const halfWidth = columnItemWidth / 2

      const echelonPoint = []

      if (horizon) {
        let enhance = tx - bx < echelonOffset

        if (type === 'leftEchelon') {
          echelonPoint[0] = [tx, ty + halfWidth]
          echelonPoint[1] = [bx, ty + halfWidth]
          echelonPoint[2] = [bx + echelonOffset, by - halfWidth]
          echelonPoint[3] = [tx, ty - halfWidth]
        }

        if (type === 'rightEchelon') {
          echelonPoint[0] = [tx, ty - halfWidth]
          echelonPoint[1] = [bx, ty - halfWidth]
          echelonPoint[2] = [bx + echelonOffset, by + halfWidth]
          echelonPoint[3] = [tx, ty + halfWidth]
        }

        if (enhance) echelonPoint.splice(2, 1)
      }

      if (!horizon) {
        let enhance = by - ty < echelonOffset

        if (type === 'leftEchelon') {
          echelonPoint[0] = [tx + halfWidth, ty]
          echelonPoint[1] = [tx + halfWidth, by]
          echelonPoint[2] = [tx - halfWidth, by - echelonOffset]
          echelonPoint[3] = [tx - halfWidth, ty]
        }

        if (type === 'rightEchelon') {
          echelonPoint[0] = [tx - halfWidth, ty]
          echelonPoint[1] = [tx - halfWidth, by]
          echelonPoint[2] = [tx + halfWidth, by - echelonOffset]
          echelonPoint[3] = [tx + halfWidth, ty]
        }

        if (enhance) echelonPoint.splice(2, 1)
      }

      return echelonPoint
    },
    drawValueText () {
      const { data: { showValueText }, horizon, columnItemOffset, getOffsetPoints } = this

      if (!showValueText) return

      const { data: { valueTextFontSize, valueTextColor, valueTextOffset, data } } = this

      const { ctx, defaultValueColor, defaultValueFontSize, valuePointPos, drawTexts } = this

      const offset = horizon ? [5, 0] : [0, -5]

      const trueOffset = valueTextOffset || offset

      ctx.fillStyle = valueTextColor || defaultValueColor

      ctx.font = `${valueTextFontSize || defaultValueFontSize}px Arial`

      ctx.textAlign = horizon ? 'left' : 'center'
      ctx.textBaseline = horizon ? 'middle' : 'bottom'

      data.forEach(({ data }, i) => {
        if (data[0] instanceof Array) {
          data.forEach((td, j) =>
            drawTexts(ctx,
              td,
              getOffsetPoints(valuePointPos[i][j], columnItemOffset[i]),
              trueOffset))

          return
        }

        drawTexts(ctx, data, getOffsetPoints(valuePointPos[i], columnItemOffset[i]), trueOffset)
      })
    },
    drawTexts (ctx, values, points, [x, y] = [0, 0]) {
      values.forEach((v, i) => {
        if (!v && v !== 0) return

        ctx.fillText(v, points[i][0] + x, points[i][1] + y)
      })
    },
    drawCenterOriginTypeColumnChart () {}
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
