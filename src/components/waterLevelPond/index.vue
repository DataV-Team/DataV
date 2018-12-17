<template>
  <div class="water-level-pond">
    <svg class="svg-container">
      <defs>
        <linearGradient :id="id" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop v-for="lc in linearGradient" :key="lc[0]"
            :offset="lc[0]"
            :stop-color="lc[1]" />
        </linearGradient>
      </defs>

      <text :stroke="`url(#${id})`"
        :fill="`url(#${id})`"
        :x="arcOriginPos[0] + 8"
        :y="arcOriginPos[1] + 8">
        {{ (level && Math.max(...level)) || 0 }}%
      </text>

      <ellipse v-if="!type || type === 'circle'"
        :cx="arcOriginPos[0] + 8"
        :cy="arcOriginPos[1] + 8"
        :rx="canvasWH[0] / 2 + 5"
        :ry="canvasWH[1] / 2 + 5"
        :stroke="`url(#${id})`" />

      <rect v-else
        x="2" y="2"
        :rx="type === 'roundRect' && 10" :ry="type === 'roundRect' && 10"
        :width="canvasWH[0] + 12"
        :height="canvasWH[1] + 12"
        :stroke="`url(#${id})`" />
    </svg>
    <canvas :ref="ref" :style="`border-radius: ${radius};`" />
  </div>
</template>

<script>
export default {
  name: 'WaterLevelPond',
  data () {
    return {
      ref: `water-level-pond-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      id: `water-level-pond-${(new Date()).getTime()}`,

      defaultColor: ['#00BAFF', '#3DE7C9'],

      defaultWaveNum: 3,
      defaultWaveHeight: 0.2,
      defaultWaveOffset: -0.5,

      waveAdded: 0.7,

      arcOriginPos: [0, 0],
      drawColor: '',
      linearGradient: [],
      waveTrueNum: '',
      waveTrueHeight: '',
      waveTrueWidth: '',
      wavePoints: [],
      bottomPoints: [],
      overXPos: 0,
      currentPoints: [],
      animationHandler: ''
    }
  },
  props: ['level', 'type', 'colors', 'waveNum', 'waveHeight', 'borderColor', 'noGradient'],
  computed: {
    radius () {
      const { type } = this

      if (type === 'circle') return '50%'

      if (type === 'rect') return '0'

      if (type === 'roundRect') return '10px'

      return '50%'
    }
  },
  methods: {
    init () {
      const { $nextTick, initCanvas, calcOriginPos, level, draw } = this

      $nextTick(e => {
        initCanvas()

        calcOriginPos()

        level && draw()
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

      const { initColor, calcBorderLinearColor, calcWaveData } = this

      initColor()

      calcBorderLinearColor()

      calcWaveData()

      const { calcBottomPoints, calcOverXPos, drawWaveAnimation } = this

      calcBottomPoints()

      calcOverXPos()

      drawWaveAnimation()
    },
    initColor () {
      const { colors, defaultColor } = this

      this.drawColor = colors || defaultColor
    },
    calcBorderLinearColor () {
      const { colors, defaultColor, borderColor } = this

      let trueColor = borderColor || colors || defaultColor

      typeof trueColor === 'string' && (trueColor = [trueColor, trueColor])

      const colorNum = trueColor.length

      const colorOffsetGap = 100 / (colorNum - 1)

      this.linearGradient = trueColor.map((c, i) => [colorOffsetGap * i, c])
    },
    calcWaveData () {
      const { waveNum, waveHeight, defaultWaveNum, defaultWaveHeight, canvasWH } = this

      const waveTrueNum = this.waveTrueNum = waveNum || defaultWaveNum

      const waveTrueHeight = this.waveTrueHeight = (waveHeight || defaultWaveHeight) * canvasWH[1]

      const waveWidth = this.waveTrueWidth = canvasWH[0] / waveTrueNum

      const { waveOffset, defaultWaveOffset, addWavePoint } = this

      const waveOffsetLength = waveTrueHeight * (waveOffset || defaultWaveOffset)

      const waveTop = waveTrueHeight + waveOffsetLength + canvasWH[1]

      const waveBottom = waveOffsetLength + canvasWH[1]

      const halfWidth = waveWidth / 2

      this.wavePoints = new Array(waveTrueNum * 2 + 1).fill(0).map((t, i) =>
        [i * halfWidth, i % 2 === 0 ? waveBottom : waveTop])

      addWavePoint() && addWavePoint() && addWavePoint()
    },
    addWavePoint () {
      const { wavePoints, waveTrueWidth } = this

      const addPoint = [wavePoints[1][0] - waveTrueWidth, wavePoints[1][1]]

      return wavePoints.unshift(addPoint)
    },
    calcBottomPoints () {
      const { canvasWH } = this

      this.bottomPoints = [
        [...canvasWH],
        [0, canvasWH[1]]
      ]
    },
    calcOverXPos () {
      const { canvasWH: [width], waveTrueWidth } = this

      this.overXPos = width + waveTrueWidth
    },
    drawWaveAnimation () {
      const { ctx, canvasWH, drawWaveAnimation } = this

      ctx.clearRect(0, 0, ...canvasWH)

      const { getCurrentPoints, drawCurrentWave, calcNextFramePoints } = this

      getCurrentPoints()

      drawCurrentWave()

      calcNextFramePoints()

      this.animationHandler = requestAnimationFrame(drawWaveAnimation)
    },
    getCurrentPoints () {
      const { level, wavePoints, canvasWH: [, height] } = this

      this.currentPoints = level.map(l =>
        wavePoints.map(([x, y]) =>
          [x, y - (l / 100 * height)]))
    },
    drawCurrentWave () {
      const { currentPoints, ctx, bottomPoints, drawColor, canvasWH: [, y], noGradient } = this

      const { canvas: { drawSmoothlinePath, getLinearGradientColor } } = this

      const { color: { hexToRgb } } = this

      const multipleColor = typeof drawColor === 'object'

      !multipleColor && (ctx.fillStyle = drawColor)

      multipleColor &&
        !noGradient &&
          (ctx.fillStyle = getLinearGradientColor(ctx, [0, y], [0, 0], drawColor.map(c => hexToRgb(c, 0.5))))

      const colorNum = drawColor.length

      currentPoints.forEach((line, i) => {
        drawSmoothlinePath(ctx, line, false, true, true)

        ctx.lineTo(...bottomPoints[0])
        ctx.lineTo(...bottomPoints[1])

        ctx.closePath()

        multipleColor && noGradient && (ctx.fillStyle = drawColor[i % colorNum])

        ctx.fill()
      })
    },
    calcNextFramePoints () {
      const { wavePoints, waveAdded, addWavePoint, overXPos } = this

      const addedWavePoints = wavePoints.map(([x, y]) => [x + waveAdded, y])

      const lastPointIndex = addedWavePoints.length - 1

      let addStatus = false

      addedWavePoints[lastPointIndex][0] > overXPos &&
        addedWavePoints.pop() && (addStatus = true)

      this.wavePoints = addedWavePoints

      addStatus && addWavePoint()
    },
    stopAnimation () {
      const { animationHandler } = this

      cancelAnimationFrame(animationHandler)
    }
  },
  mounted () {
    const { init } = this

    init()
  },
  destroyed () {
    const { stopAnimation } = this

    stopAnimation()
  }
}
</script>

<style lang="less">
.water-level-pond {
  position: relative;

  .percent-text {
    position: absolute;
    left: 50%;
    top: 50%;
    font-weight: bold;
    transform: translate(-50%, -50%);
  }

  .svg-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }

  text {
    font-size: 25px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  ellipse, rect {
    fill: none;
    stroke-width: 3;
  }

  canvas {
    margin-top: 8px;
    margin-left: 8px;
    width: calc(~"100% - 16px");
    height: calc(~"100% - 16px");
    box-sizing: border-box;
    border-radius: 50%;
  }
}
</style>
