<template>
  <div class="polyline-chart">
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
  name: 'PolylineChart',
  mixins: [colorsMixin, canvasMixin, axisMixin],
  props: ['data', 'colors'],
  data () {
    return {
      ref: `polyline-chart-${(new Date()).getTime()}`,

      // axis base config
      boundaryGap: false,
      mulValueAdd: false,
      horizon: false,

      defaultLineDash: [10, 5],
      defaultPointRadius: 2,

      defaultValueFontSize: 10,
      defaultValueColor: '#999',

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

      const { initAxisConfig, initAxis, drawAxis } = this

      initAxisConfig()

      initAxis()

      drawAxis()

      const { calcValuePointPos, drawLines, drawFills } = this

      calcValuePointPos()

      drawLines()

      drawFills()

      const { drawPoints, drawValues } = this

      drawPoints()

      drawValues()
    },
    initAxisConfig () {
      const { data: { boundaryGap } } = this

      this.boundaryGap = boundaryGap
    },
    calcValuePointPos () {
      const { valueAxisMaxMin, axisOriginPos, axisWH, labelAxisTagPos, horizon } = this

      const { data: { data }, getAxisPointsPos } = this

      this.valuePointPos = data.map(({ data, againstAxis }) =>
        getAxisPointsPos(
          valueAxisMaxMin,
          data,
          axisOriginPos,
          axisWH,
          labelAxisTagPos,
          horizon
        ))
    },
    drawLines () {
      const { data: { data }, valuePointPos, drawLine } = this

      data.forEach((line, i) => drawLine(line, valuePointPos[i], i))
    },
    drawLine ({ type, lineType, lineDash, lineColor }, points, i) {
      const { ctx, drawColors, defaultLineDash } = this

      const { canvas: { drawPolyline, drawSmoothline } } = this

      const { color: { hexToRgb } } = this

      let drawLineFun = drawPolyline
      type === 'smoothline' && (drawLineFun = drawSmoothline)

      let color = hexToRgb(drawColors[i], 0.8)
      lineColor && (color = lineColor)

      let tureLineType = lineType || 'line'
      const tureLineDash = tureLineType === 'dashed' ? (lineDash || defaultLineDash) : [10, 0]

      drawLineFun(ctx, points, 1, color, false, tureLineDash, true, true)
    },
    drawFills () {
      const { data: { data }, valuePointPos, drawFill } = this

      data.forEach((line, i) => drawFill(line, valuePointPos[i]))
    },
    drawFill ({ fillColor, type, data }, points) {
      if (!fillColor) return

      const { canvas: { drawPolylinePath, drawSmoothlinePath } } = this

      const { ctx, getGradientColor, filterNull, axisOriginPos: [, y] } = this

      let drawLineFun = drawPolylinePath
      type === 'smoothline' && (drawLineFun = drawSmoothlinePath)

      const maxValue = Math.max(...filterNull(data))
      const maxValueIndex = data.findIndex(v => v === maxValue)

      const color = getGradientColor(points[maxValueIndex], fillColor)

      const lastPoint = points[points.length - 1]

      ctx.fillStyle = color

      drawLineFun(ctx, points, false, true, true)

      ctx.lineTo(lastPoint[0], y)
      ctx.lineTo(points[0][0], y)

      ctx.closePath()

      ctx.fill()
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
    drawPoints () {
      const { data: { data }, valuePointPos, drawPoint } = this

      data.forEach((line, i) => drawPoint(line, valuePointPos[i], i))
    },
    drawPoint ({ pointColor }, points, i) {
      const { ctx, drawColors, defaultPointRadius } = this

      const { canvas: { drawPoints: drawPFun } } = this

      const color = pointColor || drawColors[i]

      drawPFun(ctx, points, defaultPointRadius, color)
    },
    drawValues () {
      const { ctx, data: { data, showValueText, valueTextOffset, valueTextFontSize } } = this

      if (!showValueText) return

      const { defaultValueFontSize, drawValue } = this

      const offset = valueTextOffset || [0, -5]

      ctx.font = `${valueTextFontSize || defaultValueFontSize}px Arial`

      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'

      data.forEach((line, i) => drawValue(line, i, offset))
    },
    drawValue ({ data, valueTextColor, lineColor, pointColor, fillColor }, i, offset) {
      const { ctx, getOffsetPoints, valuePointPos, drawColors, defaultValueColor } = this

      const { data: { valueTextColor: outerValueTC } } = this

      const drawColorsNum = drawColors.length

      let currentColor = valueTextColor
      currentColor === 'inherit' && (currentColor = pointColor || lineColor || fillColor || drawColors[i % drawColorsNum])
      currentColor instanceof Array && (currentColor = currentColor[0])

      ctx.fillStyle = currentColor || outerValueTC || defaultValueColor

      const pointsPos = valuePointPos[i]

      getOffsetPoints(pointsPos, offset).forEach((pos, i) => {
        if (!data[i] && data[i] !== 0) return

        ctx.fillText(data[i], ...pos)
      })
    },
    getOffsetPoint ([x, y], [ox, oy]) {
      return [x + ox, y + oy]
    },
    getOffsetPoints (points, offset) {
      const { getOffsetPoint } = this

      return points.map(point => point ? getOffsetPoint(point, offset) : false)
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.polyline-chart {
  position: relative;
  display: flex;
  flex-direction: column;

  .canvas-container {
    flex: 1;

    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
