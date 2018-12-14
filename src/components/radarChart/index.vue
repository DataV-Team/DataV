<template>
  <div class="radar-chart">

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <div class="label-line">
      <div class="label-item"
        v-for="(label, i) in data.labelLine"
        :key="label">
        <div :style="`background-color: ${colors[i % colors.length]};`"></div>
        <div>{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadarChart',
  data () {
    return {
      ref: `radar-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      arcOriginPos: [],

      defaultRadius: 0.8,
      defaultCircleNum: 4,
      defaultCircleColor: '#666',
      defaultRayLineColor: '#666',
      defaultRayLineOffset: Math.PI * -0.5,
      defaultLabelColor: '#fff',
      defaultLabelFS: 10,

      radius: '',
      rayLineRadianData: [],
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
      const { calcRadarRadius, drawRadarCircle, drawRayLine } = this

      calcRadarRadius()

      drawRadarCircle()

      drawRayLine()

      const { drawLable, caclValuePointData, fillRadar } = this

      drawLable()

      caclValuePointData()

      fillRadar()
    },
    calcRadarRadius () {
      const { canvasWH, data: { radius }, defaultRadius } = this

      this.radius = Math.min(...canvasWH) * (radius || defaultRadius) * 0.5
    },
    drawRadarCircle () {
      const { ctx, arcOriginPos, radius, data, defaultCircleNum, defaultCircleColor } = this

      const { circleNum, circleColor } = data

      const trueCircleNum = circleNum || defaultCircleNum

      const gap = radius / trueCircleNum

      ctx.strokeStyle = circleColor || defaultCircleColor

      ctx.setLineDash([5, 5])

      ctx.lineWidth = 1

      new Array(trueCircleNum).fill(0).forEach((t, i) => {
        ctx.beginPath()

        ctx.arc(...arcOriginPos, gap * (i + 1), 0, Math.PI * 2)

        ctx.stroke()
      })
    },
    drawRayLine () {
      const { ctx, radius, arcOriginPos, data: td, defaultRayLineColor, defaultRayLineOffset, canvas } = this

      const { label: { data }, rayLineColor, rayLineOffset } = td

      const { getCircleRadianPoint } = canvas

      const labelNum = data.length

      const gapRadian = Math.PI * 2 / labelNum

      const radianOffset = rayLineOffset || defaultRayLineOffset

      ctx.strokeStyle = rayLineColor || defaultRayLineColor

      ctx.lineWidth = 1

      ctx.setLineDash([10, 0])

      const rayLineRadianData = this.rayLineRadianData = []

      new Array(labelNum).fill(0).forEach((t, i) => {
        const currentRadian = gapRadian * (i + 1) + radianOffset

        rayLineRadianData.push(currentRadian)

        ctx.beginPath()

        ctx.moveTo(...arcOriginPos)

        ctx.lineTo(...getCircleRadianPoint(...arcOriginPos, radius, currentRadian))

        ctx.stroke()
      })
    },
    drawLable () {
      const { ctx, radius, arcOriginPos, canvas, data: td, defaultLabelColor, defaultLabelFS, rayLineRadianData } = this

      const { label: { data, color, fontSize } } = td

      const { getCircleRadianPoint } = canvas

      const endRadius = radius + 10

      ctx.font = `${fontSize || defaultLabelFS}px Arial`

      ctx.fillStyle = color || defaultLabelColor

      ctx.textBaseline = 'middle'

      data.forEach((label, i) => {
        const currentEndPointPos = getCircleRadianPoint(...arcOriginPos, endRadius, rayLineRadianData[i])

        ctx.textAlign = 'start'

        currentEndPointPos[0] < arcOriginPos[0] && (ctx.textAlign = 'end')

        ctx.fillText(label, ...currentEndPointPos)

        ctx.fill()
      })
    },
    caclValuePointData () {
      const { data: { data }, arcOriginPos, radius, canvas, rayLineRadianData } = this

      const { getCircleRadianPoint } = canvas

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
      const { ctx, data: { data }, valuePointData, colors, canvas, color, filterNull } = this

      const { drawPolylinePath } = canvas

      const { hexToRgb } = color

      const colorNum = colors.length

      valuePointData.forEach((line, i) => {
        const lineColor = data[i].color || colors[i % colorNum]

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
