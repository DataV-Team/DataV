<template>
  <div class="polyline-chart">
    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <loading v-if="!data" />

    <div v-if="data.labelLine" class="label-line">
      <div class="label-item" v-for="(label, i) in data.labelLine" :key="label + i">
        <div :style="`background-color: ${data.color[i % data.color.length]};`"></div>
        <div>{{ label }}</div>
      </div>
    </div>

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
  watch: {
    data (d) {
      const { init } = this

      d && init()
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

      const { calcValuePointsData, drawValueColumn, drawValuePolyline } = this

      calcValuePointsData()

      drawValueColumn()

      drawValuePolyline()

      const { drawValuePoints, fillLineColor } = this

      fillLineColor()

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

      !max && max !== 0 && (max = Math.max(...data.map(({ data: td }) => Math.max(...td)))) && (unsetMax = true)
      !min && min !== 0 && (min = Math.min(...data.map(({ data: td }) => Math.min(...filterNull(td))))) && (unsetMin = true)

      let minus = max - min

      unsetMax && (max += minus / 2) && (max = Math.ceil(max))
      unsetMin && (min -= minus / 2) && (min = Math.floor(min))

      yAxisMinMax[0] = min
      yAxisMinMax[1] = max

      minus = max - min

      !num && (num = minus < 9 ? minus + 1 : 10)

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

      const numberData = data.map(({ data: td }) => ({ data: td.map(v => ((!v && v === 0) || v) ? Number(v) : NaN) }))

      this.valuePointsData =
        numberData.map(({ data: td }) =>
          td.map((v, i) =>
            Number.isFinite(v)
              ? [xPos[i], axisOriginPos[1] - (v - min) / minus * axisWH[1]]
              : false))
    },
    drawValueColumn () {
      const { ctx, valuePointsData, data: { data, color }, rowColumnSize, axisOriginPos, canvas, filterNull } = this

      const { getLinearGradientColor } = canvas

      const colorNum = color.length

      const columnWidth = rowColumnSize[1] / 3 * 2

      const offset = columnWidth / 2

      data.forEach(({ columnColor, type }, i) => {
        if (type !== 'column') return

        const filterPoints = filterNull(valuePointsData[i])

        filterPoints.forEach(point => {
          const height = axisOriginPos[1] - point[1]

          ctx.fillStyle = getLinearGradientColor(ctx, point, [point[0],
            axisOriginPos[1]], columnColor || color[i % colorNum])

          ctx.fillRect(point[0] - offset, point[1], columnWidth, height)
        })
      })
    },
    drawValuePolyline () {
      const { ctx, valuePointsData, canvas, color: { hexToRgb } } = this

      const { data: { data, color } } = this

      const colorNum = color.length

      data.forEach(({ lineColor, dashed, type }, i) =>
        (!type || type === 'polyline' || type === 'smoothline') &&
          canvas[(!type || type === 'polyline') ? 'drawPolyline' : 'drawSmoothline'](
            ctx, valuePointsData[i], 1,
            hexToRgb(lineColor || color[i % colorNum], 0.8), false,
            (dashed ? [5, 5] : [10, 0]), true, true))
    },
    fillLineColor () {
      const { ctx, valuePointsData, canvas, axisOriginPos, axisWH, data: { data }, filterNull } = this

      const { getLinearGradientColor } = canvas

      const colorBegin = [axisOriginPos[0], axisOriginPos[1] - axisWH[1]]

      data.forEach(({ fillColor, type }, i) => {
        if (!fillColor) return

        const currentValuePointData = filterNull(valuePointsData[i])

        const pointNum = currentValuePointData.length

        const rightBottom = [currentValuePointData[pointNum - 1][0], axisOriginPos[1]]
        const leftBottom = [currentValuePointData[0][0], axisOriginPos[1]]

        canvas[(!type || type === 'polyline') ? 'drawPolylinePath' : 'drawSmoothlinePath'](
          ctx, currentValuePointData, false, true, true)

        ctx.lineTo(...rightBottom)
        ctx.lineTo(...leftBottom)

        ctx.closePath()

        ctx.fillStyle = getLinearGradientColor(ctx, colorBegin, axisOriginPos, fillColor)

        ctx.fill()
      })
    },
    drawValuePoints () {
      const { ctx, valuePointsData, data: { data, color }, canvas: { drawPoints } } = this

      const colorNum = color.length

      data.forEach(({ pointColor, type }, i) =>
        type !== 'column' &&
        drawPoints(ctx, valuePointsData[i], 4, pointColor || color[i % colorNum]))
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

  .label-line {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 10px;
  }

  .label-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 15px;
    margin: 0px 3px;

    :nth-child(1) {
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
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
