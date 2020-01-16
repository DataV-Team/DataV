<template>
  <div class="dv-active-ring-chart">
    <div class="active-ring-chart-container" ref="active-ring-chart" />
    <div class="active-ring-info">
      <dv-digital-flop :config="digitalFlop" />
      <div class="active-ring-name" :style="fontSize">{{ ringName }}</div>
    </div>
  </div>
</template>

<script>
import Charts from '@jiaminghi/charts'

import dvDigitalFlop from '../../digitalFlop/src/main.vue'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvActiveRingChart',
  components: {
    dvDigitalFlop
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      defaultConfig: {
        /**
         * @description Ring radius
         * @type {String|Number}
         * @default radius = '50%'
         * @example radius = '50%' | 100
         */
        radius: '50%',
        /**
         * @description Active ring radius
         * @type {String|Number}
         * @default activeRadius = '55%'
         * @example activeRadius = '55%' | 110
         */
        activeRadius: '55%',
        /**
         * @description Ring data
         * @type {Array<Object>}
         * @default data = [{ name: '', value: 0 }]
         */
        data: [{ name: '', value: 0 }],
        /**
         * @description Ring line width
         * @type {Number}
         * @default lineWidth = 20
         */
        lineWidth: 20,
        /**
         * @description Active time gap (ms)
         * @type {Number}
         * @default activeTimeGap = 3000
         */
        activeTimeGap: 3000,
        /**
         * @description Ring color (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default color = [Charts Default Color]
         * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        color: [],
        /**
         * @description Digital flop style
         * @type {Object}
         */
        digitalFlopStyle: {
          fontSize: 25,
          fill: '#fff'
        },
        /**
         * @description Digital flop toFixed
         * @type {Number}
         */
        digitalFlopToFixed: 0,
        /**
         * @description CRender animationCurve
         * @type {String}
         * @default animationCurve = 'easeOutCubic'
         */
        animationCurve: 'easeOutCubic',
        /**
         * @description CRender animationFrame
         * @type {String}
         * @default animationFrame = 50
         */
        animationFrame: 50
      },

      mergedConfig: null,

      chart: null,

      activeIndex: 0,

      animationHandler: ''
    }
  },
  computed: {
    digitalFlop () {
      const { mergedConfig, activeIndex } = this

      if (!mergedConfig) return {}

      const { digitalFlopStyle, digitalFlopToFixed, data } = mergedConfig

      const value = data.map(({ value }) => value)

      const sum = value.reduce((all, v) => all + v, 0)

      const percent = parseFloat(value[activeIndex] / sum * 100) || 0

      return {
        content: '{nt}%',
        number: [percent],
        style: digitalFlopStyle,
        toFixed: digitalFlopToFixed
      }
    },
    ringName () {
      const { mergedConfig, activeIndex } = this

      if (!mergedConfig) return ''

      return mergedConfig.data[activeIndex].name
    },
    fontSize () {
      const { mergedConfig } = this

      if (!mergedConfig) return ''

      return `font-size: ${mergedConfig.digitalFlopStyle.fontSize}px;`
    }
  },
  watch: {
    config () {
      const { animationHandler, mergeConfig, setRingOption } = this

      clearTimeout(animationHandler)

      this.activeIndex = 0

      mergeConfig()

      setRingOption()
    }
  },
  methods: {
    init () {
      const { initChart, mergeConfig, setRingOption } = this

      initChart()

      mergeConfig()

      setRingOption()
    },
    initChart () {
      const { $refs } = this

      this.chart = new Charts($refs['active-ring-chart'])
    },
    mergeConfig () {
      const { defaultConfig, config } = this

      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    },
    setRingOption () {
      const { getRingOption, chart, ringAnimation } = this

      const option = getRingOption()

      chart.setOption(option, true)

      ringAnimation()
    },
    getRingOption () {
      const { mergedConfig, getRealRadius } = this

      const radius = getRealRadius()

      mergedConfig.data.forEach(dataItem => {
        dataItem.radius = radius
      })

      return {
        series: [
          {
            type: 'pie',
            ...mergedConfig,
            outsideLabel: {
              show: false
            }
          }
        ],
        color: mergedConfig.color
      }
    },
    getRealRadius (active = false) {
      const { mergedConfig, chart } = this

      const { radius, activeRadius, lineWidth } = mergedConfig

      const maxRadius = Math.min(...chart.render.area) / 2

      const halfLineWidth = lineWidth / 2

      let realRadius = active ? activeRadius : radius

      if (typeof realRadius !== 'number') realRadius = parseInt(realRadius) / 100 * maxRadius

      const insideRadius = realRadius - halfLineWidth
      const outSideRadius = realRadius + halfLineWidth

      return [insideRadius, outSideRadius]
    },
    ringAnimation () {
      let { activeIndex, getRingOption, chart, getRealRadius } = this

      const radius = getRealRadius()
      const active = getRealRadius(true)

      const option = getRingOption()

      const { data } = option.series[0]

      data.forEach((dataItem, i) => {
        if (i === activeIndex) {
          dataItem.radius = active
        } else {
          dataItem.radius = radius
        }
      })

      chart.setOption(option, true)

      const { activeTimeGap } = option.series[0]

      this.animationHandler = setTimeout(foo => {
        activeIndex += 1

        if (activeIndex >= data.length) activeIndex = 0

        this.activeIndex = activeIndex

        this.ringAnimation()
      }, activeTimeGap)
    }
  },
  mounted () {
    const { init } = this

    init()
  },
  beforeDestroy () {
    const { animationHandler } = this

    clearTimeout(animationHandler)
  }
}
</script>

<style lang="less">
.dv-active-ring-chart {
  position: relative;

  .active-ring-chart-container {
    width: 100%;
    height: 100%;
  }

  .active-ring-info {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .dv-digital-flop {
      width: 100px;
      height: 30px;
    }

    .active-ring-name {
      width: 100px;
      height: 30px;
      color: #fff;
      text-align: center;
      vertical-align: middle;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
