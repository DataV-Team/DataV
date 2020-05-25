<template>
  <div class="dv-percent-pond" ref="percent-pond">
    <svg>
      <defs>
        <linearGradient :id="gradientId1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop v-for="lc in linearGradient" :key="lc[0]"
            :offset="`${lc[0]}%`"
            :stop-color="lc[1]" />
        </linearGradient>

        <linearGradient :id="gradientId2" x1="0%" y1="0%" :x2="gradient2XPos" y2="0%">
          <stop v-for="lc in linearGradient" :key="lc[0]"
            :offset="`${lc[0]}%`"
            :stop-color="lc[1]" />
        </linearGradient>
      </defs>
      <rect
        :x="mergedConfig ? mergedConfig.borderWidth / 2 : '0'"
        :y="mergedConfig ? mergedConfig.borderWidth / 2 : '0'"
        :rx="mergedConfig ? mergedConfig.borderRadius : '0'"
        :ry="mergedConfig ? mergedConfig.borderRadius : '0'"
        fill="transparent"
        :stroke-width="mergedConfig ? mergedConfig.borderWidth : '0'"
        :stroke="`url(#${gradientId1})`"
        :width="rectWidth > 0 ? rectWidth : 0"
        :height="rectHeight > 0 ? rectHeight : 0"
      />
      <polyline
        :stroke-width="polylineWidth"
        :stroke-dasharray="mergedConfig ? mergedConfig.lineDash.join(',') : '0'"
        :stroke="`url(#${polylineGradient})`"
        :points="points"
      />
      <text
        :stroke="mergedConfig ? mergedConfig.textColor : '#fff'"
        :fill="mergedConfig ? mergedConfig.textColor : '#fff'"
        :x="width / 2"
        :y="height / 2"
      >
        {{ details }}
      </text>
    </svg>
  </div>
</template>

<script>
import { uuid } from '../../../util/index'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvPercentPond',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const id = uuid()
    return {
      gradientId1: `percent-pond-gradientId1-${id}`,
      gradientId2: `percent-pond-gradientId2-${id}`,

      width: 0,
      height: 0,

      defaultConfig: {
        /**
         * @description Value
         * @type {Number}
         * @default value = 0
         */
        value: 0,
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default colors = ['#00BAFF', '#3DE7C9']
         * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: ['#3DE7C9', '#00BAFF'],
        /**
         * @description Border width
         * @type {Number}
         * @default borderWidth = 3
         */
        borderWidth: 3,
        /**
         * @description Gap between border and pond
         * @type {Number}
         * @default borderGap = 3
         */
        borderGap: 3,
        /**
         * @description Line dash
         * @type {Array<Number>}
         * @default lineDash = [5, 1]
         */
        lineDash: [5, 1],
        /**
         * @description Text color
         * @type {String}
         * @default textColor = '#fff'
         */
        textColor: '#fff',
        /**
         * @description Border radius
         * @type {Number}
         * @default borderRadius = 5
         */
        borderRadius: 5,
        /**
         * @description Local Gradient
         * @type {Boolean}
         * @default localGradient = false
         * @example localGradient = false | true
         */
        localGradient: false,
        /**
         * @description Formatter
         * @type {String}
         * @default formatter = '{value}%'
         */
        formatter: '{value}%'
      },

      mergedConfig: null
    }
  },
  computed: {
    rectWidth () {
      const { mergedConfig, width } = this

      if (!mergedConfig) return 0

      const { borderWidth } = mergedConfig

      return width - borderWidth
    },
    rectHeight () {
      const { mergedConfig, height } = this

      if (!mergedConfig) return 0

      const { borderWidth } = mergedConfig

      return height - borderWidth
    },
    points () {
      const { mergedConfig, width, height } = this

      const halfHeight = height / 2

      if (!mergedConfig) return `0, ${halfHeight} 0, ${halfHeight}`

      const { borderWidth, borderGap, value } = mergedConfig

      const polylineLength = (width - (borderWidth + borderGap) * 2) / 100 * value

      return `
        ${borderWidth + borderGap}, ${halfHeight}
        ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}
      `
    },
    polylineWidth () {
      const { mergedConfig, height } = this

      if (!mergedConfig) return 0

      const { borderWidth, borderGap } = mergedConfig

      return height - (borderWidth + borderGap) * 2
    },
    linearGradient () {
      const { mergedConfig } = this

      if (!mergedConfig) return []

      const { colors } = mergedConfig

      const colorNum = colors.length

      const colorOffsetGap = 100 / (colorNum - 1)

      return colors.map((c, i) => [colorOffsetGap * i, c])
    },
    polylineGradient () {
      const { gradientId1, gradientId2, mergedConfig } = this

      if (!mergedConfig) return gradientId2

      if (mergedConfig.localGradient) return gradientId1

      return gradientId2
    },
    gradient2XPos () {
      const { mergedConfig } = this

      if (!mergedConfig) return '100%'

      const { value } = mergedConfig

      return `${200 - value}%`
    },
    details () {
      const { mergedConfig } = this

      if (!mergedConfig) return ''

      const { value, formatter } = mergedConfig

      return formatter.replace('{value}', value)
    }
  },
  watch: {
    config () {
      const { mergeConfig } = this

      mergeConfig()
    }
  },
  methods: {
    async init () {
      const { initWH, config, mergeConfig } = this

      await initWH()

      if (!config) return

      mergeConfig()
    },
    async initWH () {
      const { $nextTick, $refs } = this

      await $nextTick()

      const { clientWidth, clientHeight } = $refs['percent-pond']

      this.width = clientWidth
      this.height = clientHeight
    },
    mergeConfig () {
      const { config, defaultConfig } = this

      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>