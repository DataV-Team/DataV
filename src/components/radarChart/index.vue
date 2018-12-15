<template>
  <div class="radar-chart">

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <div class="label-line">
      <div class="label-item"
        v-for="(label, i) in data.labelLine"
        :key="label">
        <div :style="`background-color: ${drawColors[i % drawColors.length]};`"></div>
        <div>{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultColors from '../../config/color.js'

export default {
  name: 'RadarChart',
  data () {
    return {
      ref: `radar-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      arcOriginPos: [],

      defaultColors,
      defaultRadius: 0.8,
      defaultRingNum: 4,
      defaultRingType: 'circle',
      defaultRingLineType: 'dashed',
      defaultRingLineColor: '#666',
      defaultRingFillType: 'none',
      defaultRayLineType: 'line',
      defaultRayLineColor: '#666',

      defaultRayLineOffset: Math.PI * -0.5,
      defaultLabelColor: '#fff',
      defaultLabelFS: 10,

      drawColors: '',
      radius: '',
      ringType: '',
      rayLineRadianData: [],
      ringRadiusData: [],
      ringPolylineData: [],
      ringLineDash: [],
      ringlineMultipleColor: false,
      ringLineColor: '',
      ringFillType: '',
      ringFillMultipleColor: false,
      ringFillColor: '',
      rayLineColor: '',
      rayLineDash: '',
      rayLineMultipleColor: false,
      labelPosData: [],
      labelColor: '',
      labelFontSize: '',
      labelMultipleColor: false,

      valuePointData: []
    }
  },
  props: ['data', 'colors'],
  watch: {
    data (d) {
      const { reDraw } = this

      reDraw(d)
    },
    color (d) {
      const { reDraw } = this

      reDraw(d)
    }
  },
  methods: {
    init () {
      const { $nextTick, initCanvas, calcOriginPos, data, draw } = this

      $nextTick(e => {
        initCanvas()

        calcOriginPos()

        data && draw()
      })
    },
    initCanvas () {
      const { $refs, ref, labelRef, canvasWH } = this

      const canvas = this.canvasDom = $refs[ref]

      this.labelDom = $refs[labelRef]

      canvasWH[0] = canvas.clientWidth
      canvasWH[1] = canvas.clientHeight

      canvas.setAttribute('width', canvasWH[0])
      canvas.setAttribute('height', canvasWH[1])

      this.ctx = canvas.getContext('2d')
    },
    calcOriginPos () {
      const { canvasWH, arcOriginPos } = this

      arcOriginPos[0] = canvasWH[0] / 2
      arcOriginPos[1] = canvasWH[1] / 2
    },
    draw () {
      const { ctx, canvasWH } = this

      ctx.clearRect(0, 0, ...canvasWH)

      const { initColor, calcRadarRadius, calcRingType, calcRayLineRadianData } = this

      initColor()

      calcRadarRadius()

      calcRingType()

      calcRayLineRadianData()

      const { calcRingRadiusData, calcRingPolylineData, calcRingDrawConfig } = this

      calcRingRadiusData()

      calcRingPolylineData()

      calcRingDrawConfig()

      const { calcRingFillConfig, fillRing, drawCircleRing } = this

      calcRingFillConfig()

      fillRing()

      drawCircleRing()

      const { drawPolylineRing, calcRayLineConfig, drawRayLine, calcLabelPosData, calcLabelConfig } = this

      drawPolylineRing()

      calcRayLineConfig()

      drawRayLine()

      calcLabelPosData()

      calcLabelConfig()

      const { drawLable } = this

      drawLable()

      // drawRadarCircle()

      // drawRayLine()

      // const { drawLable, caclValuePointData, fillRadar } = this

      // drawLable()

      // caclValuePointData()

      // fillRadar()
    },
    initColor () {
      const { colors, defaultColors } = this

      this.drawColors = colors || defaultColors
    },
    calcRadarRadius () {
      const { canvasWH, data: { radius }, defaultRadius } = this

      this.radius = Math.min(...canvasWH) * (radius || defaultRadius) * 0.5
    },
    calcRingType () {
      const { data: { ringType }, defaultRingType } = this

      this.ringType = ringType || defaultRingType
    },
    calcRayLineRadianData () {
      const { data: { label }, defaultRayLineOffset } = this

      const { rayLineOffset, data } = label

      const fullRadian = Math.PI * 2

      const radianGap = fullRadian / data.length

      const radianOffset = rayLineOffset || defaultRayLineOffset

      this.rayLineRadianData = data.map((t, i) => radianGap * i + radianOffset)
    },
    calcRingRadiusData () {
      const { data: { ringNum }, defaultRingNum, radius } = this

      const num = ringNum || defaultRingNum

      const radiusGap = radius / num

      this.ringRadiusData = new Array(num).fill(0).map((t, i) =>
        radiusGap * (i + 1))
    },
    calcRingPolylineData () {
      const { ringRadiusData, rayLineRadianData, arcOriginPos } = this

      const { canvas: { getCircleRadianPoint } } = this

      this.ringPolylineData = ringRadiusData.map((r, i) =>
        rayLineRadianData.map(radian =>
          getCircleRadianPoint(...arcOriginPos, r, radian)))
    },
    calcRingDrawConfig () {
      const { defaultRingLineType, defaultRingLineColor } = this

      const { data: { ringLineType, ringLineColor }, drawColors } = this

      this.ringLineDash = (ringLineType || defaultRingLineType) === 'dashed' ? [5, 5] : [10, 0]

      const trueRingLineColor = ringLineColor === 'colors' ? drawColors : ringLineColor

      this.ringlineMultipleColor = typeof trueRingLineColor === 'object'

      this.ringLineColor = trueRingLineColor || defaultRingLineColor
    },
    calcRingFillConfig () {
      const { data: { ringFillType, ringFillColor }, defaultRingFillType, drawColors } = this

      this.ringFillType = ringFillType || defaultRingFillType

      const trueRingFillColor = this.ringFillColor = (!ringFillColor || ringFillColor === 'colors') ? drawColors : ringFillColor

      this.ringFillMultipleColor = typeof trueRingFillColor === 'object'
    },
    fillRing () {
      const { ringFillType, fillCoverRing, fillMulCoverRing, fillRingRing } = this

      switch (ringFillType) {
        case 'cover': fillCoverRing()
          break

        case 'mulCover': fillMulCoverRing()
          break

        case 'ring': fillRingRing()
          break
      }
    },
    fillCoverRing () {
      const { ctx, arcOriginPos, ringFillColor, ringType, radius, ringPolylineData } = this

      const { canvas: { getRadialGradientColor, drawPolylinePath } } = this

      const color = getRadialGradientColor(ctx, arcOriginPos, 0, radius, ringFillColor)

      ctx.beginPath()

      ringType === 'circle' && ctx.arc(...arcOriginPos, radius, 0, Math.PI * 2)

      ringType === 'polyline' && drawPolylinePath(ctx, ringPolylineData[ringPolylineData.length - 1])

      ctx.closePath()

      ctx.fillStyle = color

      ctx.fill()
    },
    fillMulCoverRing () {
      const { ctx, ringType, ringFillColor, arcOriginPos } = this

      const { ringFillMultipleColor, ringPolylineData, ringRadiusData, deepClone } = this

      const { canvas: { drawPolylinePath } } = this

      !ringFillMultipleColor && (ctx.fillStyle = ringFillColor)

      const colorNum = ringFillColor.length

      const LastRingIndex = ringRadiusData.length - 1

      ringType === 'circle' &&
        deepClone(ringRadiusData).reverse().forEach((radius, i) => {
          ctx.beginPath()

          ctx.arc(...arcOriginPos, radius, 0, Math.PI * 2)

          ringFillMultipleColor && (ctx.fillStyle = ringFillColor[(LastRingIndex - i) % colorNum])

          ctx.fill()
        })

      ringType === 'polyline' &&
        deepClone(ringPolylineData).reverse().forEach((line, i) => {
          drawPolylinePath(ctx, line, true, true)

          ringFillMultipleColor && (ctx.fillStyle = ringFillColor[(LastRingIndex - i) % colorNum])

          ctx.fill()
        })
    },
    fillRingRing () {
      const { ctx, ringType, ringRadiusData, rayLineRadianData, getPointToLineDistance } = this

      const { ringFillMultipleColor, arcOriginPos, ringFillColor, ringPolylineData } = this

      const { canvas: { drawPolylinePath, getCircleRadianPoint } } = this

      let lineWidth = ctx.lineWidth = ringRadiusData[0]

      const halfLineWidth = lineWidth / 2

      const colorNum = ringFillColor.length

      !ringFillMultipleColor && (ctx.strokeStyle = ringFillColor)

      ringType === 'circle' &&
        ringRadiusData.forEach((r, i) => {
          ctx.beginPath()

          ctx.arc(...arcOriginPos, r - halfLineWidth, 0, Math.PI * 2)

          ringFillMultipleColor && (ctx.strokeStyle = ringFillColor[i % colorNum])

          ctx.stroke()
        })

      ctx.lineCap = 'round'

      ctx.lineWidth = getPointToLineDistance(arcOriginPos, ringPolylineData[0][0], ringPolylineData[0][1])

      ringType === 'polyline' &&
        ringRadiusData.map(r => r - halfLineWidth).map(r =>
          rayLineRadianData.map(radian =>
            getCircleRadianPoint(...arcOriginPos, r, radian))).forEach((line, i) => {
          drawPolylinePath(ctx, line, true, true)

          ringFillMultipleColor && (ctx.strokeStyle = ringFillColor[i % colorNum])

          ctx.stroke()
        })
    },
    drawCircleRing () {
      const { data: { ringType }, defaultRingType } = this

      if ((ringType && ringType !== 'circle') || (!ringType && defaultRingType !== 'circle')) return

      const { ctx, ringRadiusData, arcOriginPos, ringLineDash, ringlineMultipleColor, ringLineColor } = this

      ctx.setLineDash(ringLineDash)

      ctx.lineWidth = 1

      !ringlineMultipleColor && (ctx.strokeStyle = ringLineColor)

      const colorNum = ringLineColor.length

      ringRadiusData.forEach((r, i) => {
        ctx.beginPath()

        ctx.arc(...arcOriginPos, r, 0, Math.PI * 2)

        ringlineMultipleColor && (ctx.strokeStyle = ringLineColor[i % colorNum])

        ctx.stroke()
      })
    },
    drawPolylineRing () {
      const { data: { ringType }, defaultRingType } = this

      if ((ringType && ringType !== 'polyline') || (!ringType && defaultRingType !== 'polyline')) return

      const { ctx, ringPolylineData, ringLineDash, ringlineMultipleColor, ringLineColor } = this

      const { canvas: { drawPolyline } } = this

      const colorNum = ringLineColor.length

      ringPolylineData.forEach((line, i) =>
        drawPolyline(ctx, line, 1,
          (ringlineMultipleColor ? ringLineColor[i % colorNum] : ringLineColor),
          true, ringLineDash, true))
    },
    calcRayLineConfig () {
      const { data: { rayLineType, rayLineColor }, defaultRayLineType, defaultRayLineColor, drawColors } = this

      this.rayLineDash = (rayLineType || defaultRayLineType) === 'line' ? [10, 0] : [5, 5]

      const trueRayLineColor = rayLineColor === 'colors' ? drawColors : rayLineColor

      this.rayLineMultipleColor = typeof trueRingFillColor === 'object'

      this.rayLineColor = trueRayLineColor || defaultRayLineColor
    },
    drawRayLine () {
      const { ctx, rayLineColor, rayLineDash, ringPolylineData, arcOriginPos, rayLineMultipleColor } = this

      const lastRingLineIndex = ringPolylineData.length - 1

      ctx.setLineDash(rayLineDash)

      !rayLineMultipleColor && (ctx.strokeStyle = rayLineColor)

      ctx.lineWidth = 1

      const colorNum = rayLineColor.length

      ringPolylineData[lastRingLineIndex].forEach((point, i) => {
        ctx.beginPath()

        ctx.moveTo(...arcOriginPos)

        ctx.lineTo(...point)

        rayLineMultipleColor && (ctx.strokeStyle = rayLineColor[i % colorNum])

        ctx.stroke()
      })
    },
    calcLabelPosData () {
      const { rayLineRadianData, radius, arcOriginPos } = this

      const { canvas: { getCircleRadianPoint } } = this

      const labelRadius = radius + 10

      this.labelPosData = rayLineRadianData.map(radian =>
        getCircleRadianPoint(...arcOriginPos, labelRadius, radian))
    },
    calcLabelConfig () {
      const { defaultLabelColor, defaultLabelFS, drawColors } = this

      const { data: { label: { color, fontSize } } } = this

      const trueLabelColor = color === 'colors' ? drawColors : (color || defaultLabelColor)

      this.labelMultipleColor = typeof trueLabelColor === 'object'

      this.labelFontSize = fontSize || defaultLabelFS

      this.labelColor = trueLabelColor
    },
    drawLable () {
      const { ctx, arcOriginPos: [x], labelPosData, labelColor, labelFontSize, labelMultipleColor } = this

      const { data: { label: { data } } } = this

      ctx.font = `${labelFontSize}px Arial`

      !labelMultipleColor && (ctx.fillStyle = labelColor)

      ctx.textBaseline = 'middle'

      const colorNum = labelColor.length

      labelPosData.forEach((pos, i) => {
        ctx.textAlign = 'start'

        pos[0] < x && (ctx.textAlign = 'end')

        labelMultipleColor && (ctx.fillStyle = labelColor[i % colorNum])

        ctx.fillText(data[i], ...pos)
      })
    },

    caclValuePointData () {
      const { data: { data }, arcOriginPos, radius, rayLineRadianData } = this

      const { canvas: { getCircleRadianPoint } } = this

      const maxValue = Math.max(...data.map(({ data: td }) => Math.max(...td)))

      const valueRadius = data.map(({ data: td }) =>
        td.map(value =>
          Number.isFinite(value)
            ? value / maxValue * radius : false))

      this.valuePointData = valueRadius.map(td =>
        td.map((r, i) =>
          r ? getCircleRadianPoint(...arcOriginPos, r, rayLineRadianData[i]) : false))
    },
    fillRadar () {
      const { ctx, data: { data }, valuePointData, drawColors, canvas, color, filterNull } = this

      const { drawPolylinePath } = canvas

      const { hexToRgb } = color

      const colorNum = drawColors.length

      valuePointData.forEach((line, i) => {
        const lineColor = data[i].color || drawColors[i % colorNum]

        data[i].dashed ? ctx.setLineDash([5, 5]) : ctx.setLineDash([10, 0])

        drawPolylinePath(ctx, filterNull(line), 1, true, true)

        ctx.strokeStyle = lineColor

        ctx.stroke()

        ctx.fillStyle = hexToRgb(lineColor, 0.5)

        ctx.fill()
      })
    },
    reDraw (d) {
      const { draw } = this

      d && draw()
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.radar-chart {
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

  .label-line {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 10px;

    .label-item {
      height: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0px 5px 5px 5px;

      :nth-child(1) {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
  }
}
</style>
