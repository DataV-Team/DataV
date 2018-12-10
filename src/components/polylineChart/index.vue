<template>
  <div class="polyline-chart">
    <canvas :ref="ref" />

    <div class="for-slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PolylineChart',
  props: ['data'],
  data () {
    return {
      ref: `polyline-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      defaultFontSize: 10,
      defaultAxisColor: 'rgba(250, 250, 250, 0.25)',

      xAxisData: [],
      yAxisData: [],
      axisWH: [],
      axisOriginPos: [],
      yAxisMinMax: [],
      rowColumnSize: [],
      valuePointsData: []
    }
  },
  methods: {
    init () {
      const { $nextTick, initCanvas, data, draw } = this

      $nextTick(e => {
        initCanvas()

        data && draw()
      })
    },
    initCanvas () {
      const { $refs, ref, canvasWH } = this

      const canvas = this.canvasDom = $refs[ref]

      canvasWH[0] = canvas.clientWidth
      canvasWH[1] = canvas.clientHeight

      canvas.setAttribute('width', canvasWH[0])
      canvas.setAttribute('height', canvasWH[1])

      this.ctx = canvas.getContext('2d')
    },
    draw () {
      const { ctx, canvasWH, getXAxisData, getYAxisData, calcAxisPos, drawAxis } = this

      ctx.clearRect(0, 0, ...canvasWH)

      getXAxisData()

      getYAxisData()

      calcAxisPos()

      drawAxis()

      const { calcValuePointsData, drawValuePolyline, drawValueSmoothline, drawValuePoints } = this

      calcValuePointsData()

      drawValuePolyline()

      drawValueSmoothline()

      drawValuePoints()
    },
    getXAxisData () {
      const { data: { x: { data } } } = this

      this.xAxisData = data
    },
    getYAxisData () {
      let { data: { data, y: { data: yAxisData, max, min, num, fixed } }, filterNull, yAxisMinMax } = this

      if (yAxisData) {
        this.yAxisData = yAxisData

        return
      }

      let [unsetMax, unsetMin] = [false, false]

      !max && (max = Math.max(...data.map(({ data: td }) => Math.max(...td)))) && (unsetMax = true)
      !min && (min = Math.min(...data.map(({ data: td }) => Math.min(...filterNull(td))))) && (unsetMin = true)

      let minus = max - min

      unsetMax && (max += minus / 2) && (max = Math.ceil(max))
      unsetMin && (min -= minus / 2) && (min = Math.floor(min))

      yAxisMinMax[0] = min
      yAxisMinMax[1] = max

      minus = max - min

      !num && (num = minus < 10 ? minus : 10)

      const gapNum = minus / (num - 1)

      this.yAxisData = new Array(num).fill(0).map((t, i) => (max - gapNum * i).toFixed(fixed || 0)).reverse()
    },
    calcAxisPos () {
      const { ctx, canvasWH, xAxisData, yAxisData, axisWH, axisOriginPos, rowColumnSize, data } = this

      const { x: { unit: xUT, offset: xOF }, y: { unit: yUT, fontSize: yFS, offset: yOF }, boundaryGap } = data

      ctx.font = `${yFS}px Arial`

      let yAxisMaxWidth = Math.max(...yAxisData.map(v => ctx.measureText(v).width))

      const yAxisUnitWidth = ctx.measureText(yUT || '').width

      yAxisMaxWidth < yAxisUnitWidth && (yAxisMaxWidth = yAxisUnitWidth)

      const yAxisRowHeight = (canvasWH[1] - (xOF || 20)) / (yAxisData.length + 1)
      const xAxisColumnWidth = (canvasWH[0] - (yOF || (yAxisMaxWidth + 10)) - ctx.measureText(xUT || '').width - 10) / (xAxisData.length + 1)

      axisWH[0] = xAxisColumnWidth * xAxisData.length
      axisWH[1] = yAxisRowHeight * yAxisData.length

      rowColumnSize[0] = axisWH[1] / (yAxisData.length - 1)
      rowColumnSize[1] = axisWH[0] / (boundaryGap ? xAxisData.length : xAxisData.length - 1)

      axisOriginPos[0] = (yOF || yAxisMaxWidth) + 10
      axisOriginPos[1] = canvasWH[1] - (xOF || 20)
    },
    drawAxis () {
      const { ctx, xAxisData, yAxisData, axisOriginPos, axisWH, canvasWH } = this

      const { defaultAxisColor, rowColumnSize, defaultFontSize, data: { x, y, boundaryGap } } = this

      const { unit: xUT, lineColor: xLC, color: xC, fontSize: xFS } = x

      const { unit: yUT, lineColor: yLC, color: yC, fontSize: yFS } = y

      const { canvas: { drawLine } } = this

      drawLine(ctx, axisOriginPos, [axisOriginPos[0] + axisWH[0], axisOriginPos[1]], 1, (xLC || defaultAxisColor))
      drawLine(ctx, axisOriginPos, [axisOriginPos[0], axisOriginPos[1] - axisWH[1]], 1, (yLC || defaultAxisColor))

      ctx.fillStyle = xC || 'rgba(250, 250, 250, 0.6)'

      ctx.font = `${xFS || defaultFontSize}px Microsoft Yahei`

      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      const columnWidth = rowColumnSize[1]

      const columnOffset = boundaryGap ? columnWidth / 2 : 0

      xAxisData.forEach((text, i) => ctx.fillText(text, axisOriginPos[0] + (i * columnWidth) + columnOffset, axisOriginPos[1] + 3))
      xUT && (ctx.textAlign = 'end') && ctx.fillText(xUT, canvasWH[0], axisOriginPos[1] + 3)

      ctx.font = `${yFS || defaultFontSize}px Microsoft Yahei`

      ctx.fillStyle = yC || 'rgba(250, 250, 250, 0.6)'

      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'

      const rowHeight = rowColumnSize[0]

      yAxisData.forEach((text, i) => ctx.fillText(text, axisOriginPos[0] - 7, axisOriginPos[1] - (i * rowHeight)))
      yUT && (ctx.textBaseline = 'top') && ctx.fillText(yUT, axisOriginPos[0] - 7, 0)
    },
    calcValuePointsData () {
      const { axisWH, axisOriginPos, yAxisMinMax: [min, max], rowColumnSize } = this

      const { data: { data, x, boundaryGap } } = this

      const columnWidth = rowColumnSize[1]

      const xOffset = (boundaryGap ? columnWidth / 2 : 0)

      const xPos = new Array(x.data.length).fill(0).map((v, i) => axisOriginPos[0] + (columnWidth * i) + xOffset)

      const minus = max - min

      this.valuePointsData =
        data.map(({ data: td }) =>
          td.map((v, i) =>
            Number.isFinite(v)
              ? [xPos[i], axisOriginPos[1] - (v - min) / minus * axisWH[1]]
              : false))
    },
    drawValuePolyline () {
      const { ctx, valuePointsData, canvas: { drawPolyline }, color: { hexToRgb } } = this

      const { data: { data, color } } = this

      const colorNum = color.length

      data.forEach(({ lineColor, dashed, type }, i) => type !== 'smoothline' &&
        drawPolyline(ctx, valuePointsData[i], 1,
          hexToRgb(lineColor || color[i % colorNum], 0.8), false, (dashed ? [5, 5] : [10, 0])))
    },
    drawValueSmoothline () {

    },
    drawValuePoints () {
      const { ctx, valuePointsData, data: { data, color }, canvas: { drawPoints } } = this

      const colorNum = color.length

      data.forEach(({ pointColor }, i) => drawPoints(ctx, valuePointsData[i], 4, pointColor || color[i % colorNum]))
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

  canvas {
    width: 100%;
    height: 100%;
  }

  .for-slot {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>
