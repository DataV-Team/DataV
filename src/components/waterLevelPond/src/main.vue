<template>
  <div class="dv-water-pond-level">
    <svg v-if="renderer">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop v-for="lc in svgBorderGradient" :key="lc[0]"
            :offset="lc[0]"
            :stop-color="lc[1]" />
        </linearGradient>
      </defs>

      <text
        v-if="renderer"
        :stroke="`url(#${gradientId})`"
        :fill="`url(#${gradientId})`"
        :x="renderer.area[0] / 2 + 8"
        :y="renderer.area[1] / 2 + 8"
      >
        {{ details }}
      </text>

      <ellipse v-if="!shape || shape === 'round'"
        :cx="renderer.area[0] / 2 + 8"
        :cy="renderer.area[1] / 2 + 8"
        :rx="renderer.area[0] / 2 + 5"
        :ry="renderer.area[1] / 2 + 5"
        :stroke="`url(#${gradientId})`" />

      <rect v-else
        x="2" y="2"
        :rx="shape === 'roundRect' ? 10 : 0"
        :ry="shape === 'roundRect' ? 10 : 0"
        :width="renderer.area[0] + 12"
        :height="renderer.area[1] + 12"
        :stroke="`url(#${gradientId})`" />
    </svg>

    <canvas ref="water-pond-level" :style="`border-radius: ${radius};`" />
  </div>
</template>

<script>
import { uuid } from '../../../util/index'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

import CRender from '@jiaminghi/c-render'

export default {
  name: 'DvWaterLevelPond',
  props: {
    config: Object,
    default: () => ({})
  },
  data () {
    const id = uuid()
    return {
      gradientId: `water-level-pond-${id}`,

      defaultConfig: {
        /**
         * @description Data
         * @type {Array<Number>}
         * @default data = []
         * @example data = [60, 40]
         */
        data: [],
        /**
         * @description Shape of wanter level pond
         * @type {String}
         * @default shape = 'rect'
         * @example shape = 'rect' | 'roundRect' | 'round'
         */
        shape: 'rect',
        /**
         * @description Water wave number
         * @type {Number}
         * @default waveNum = 3
         */
        waveNum: 3,
        /**
         * @description Water wave height (px)
         * @type {Number}
         * @default waveHeight = 40
         */
        waveHeight: 40,
        /**
         * @description Wave opacity
         * @type {Number}
         * @default waveOpacity = 0.4
         */
        waveOpacity: 0.4,
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default colors = ['#00BAFF', '#3DE7C9']
         * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: ['#3DE7C9', '#00BAFF'],
        /**
         * @description Formatter
         * @type {String}
         * @default formatter = '{value}%'
         */
        formatter: '{value}%'
      },

      mergedConfig: {},

      renderer: null,

      svgBorderGradient: [],

      details: '',

      waves: [],

      animation: false
    }
  },
  computed: {
    radius () {
      const { shape } = this.mergedConfig

      if (shape === 'round') return '50%'

      if (shape === 'rect') return '0'

      if (shape === 'roundRect') return '10px'

      return '0'
    },
    shape () {
      const { shape } = this.mergedConfig

      if (!shape) return 'rect'

      return shape
    }
  },
  watch: {
    config () {
      const { calcData, renderer } = this

      renderer.delAllGraph()

      this.waves = []

      setTimeout(calcData, 0)
    }
  },
  methods: {
    init () {
      const { initRender, config, calcData } = this

      initRender()

      if (!config) return

      calcData()
    },
    initRender () {
      const { $refs } = this

      this.renderer = new CRender($refs['water-pond-level'])
    },
    calcData () {
      const { mergeConfig, calcSvgBorderGradient, calcDetails } = this

      mergeConfig()

      calcSvgBorderGradient()

      calcDetails()

      const { addWave, animationWave } = this

      addWave()

      animationWave()
    },
    mergeConfig () {
      const { config, defaultConfig } = this

      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config)
    },
    calcSvgBorderGradient () {
      const { colors } = this.mergedConfig

      const colorNum = colors.length

      const colorOffsetGap = 100 / (colorNum - 1)

      this.svgBorderGradient = colors.map((c, i) => [colorOffsetGap * i, c])
    },
    calcDetails () {
      const { data, formatter } = this.mergedConfig

      if (!data.length) {
        this.details = ''

        return
      }

      const maxValue = Math.max(...data)

      this.details = formatter.replace('{value}', maxValue)
    },
    addWave () {
      const { renderer, getWaveShapes, getWaveStyle, drawed } = this

      const shapes = getWaveShapes()
      const style = getWaveStyle()

      this.waves = shapes.map(shape => renderer.add({
        name: 'smoothline',
        animationFrame: 300,
        shape,
        style,
        drawed
      }))
    },
    getWaveShapes () {
      const { mergedConfig, renderer, mergeOffset } = this

      const { waveNum, waveHeight, data } = mergedConfig

      const [w, h] = renderer.area

      const pointsNum = waveNum * 4 + 4

      const pointXGap = w / waveNum / 2

      return data.map(v => {
        let points = new Array(pointsNum).fill(0).map((foo, j) => {
          const x = w - pointXGap * j

          const startY = (1 - v / 100) * h

          const y = j % 2 === 0 ? startY : startY - waveHeight

          return [x, y]
        })

        points = points.map(p => mergeOffset(p, [pointXGap * 2, 0]))

        return { points }
      })
    },
    mergeOffset ([x, y], [ox, oy]) {
      return [x + ox, y + oy]
    },
    getWaveStyle () {
      const { renderer, mergedConfig } = this

      const h = renderer.area[1]

      return {
        gradientColor: mergedConfig.colors,
        gradientType: 'linear',
        gradientParams: [0, 0, 0, h],
        gradientWith: 'fill',
        opacity: mergedConfig.waveOpacity,
        translate: [0, 0]
      }
    },
    drawed ({ shape: { points } }, { ctx, area }) {
      const firstPoint = points[0]
      const lastPoint = points.slice(-1)[0]

      const h = area[1]

      ctx.lineTo(lastPoint[0], h)
      ctx.lineTo(firstPoint[0], h)

      ctx.closePath()

      ctx.fill()
    },
    async animationWave (repeat = 1) {
      const { waves, renderer, animation } = this

      if (animation) return

      this.animation = true

      const w = renderer.area[0]

      waves.forEach(graph => {
        graph.attr('style', { translate: [0, 0] })

        graph.animation('style', {
          translate: [w, 0]
        }, true)
      })

      await renderer.launchAnimation()

      this.animation = false

      if (!renderer.graphs.length) return

      this.animationWave(repeat + 1)
    }
  },
  mounted () {
    const { init } = this

    init()
  },
  beforeDestroy () {
    const { renderer } = this

    renderer.delAllGraph()

    this.waves = []
  }
}
</script>

<style lang="less">
.dv-water-pond-level {
  position: relative;

  svg {
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
  }
}
</style>
