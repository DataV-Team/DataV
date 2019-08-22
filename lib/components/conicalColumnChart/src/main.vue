<template>
  <div class="dv-conical-column-chart" :ref="ref">
    <svg :width="width" :height="height">
      <g
        v-for="(item, i) in column"
        :key="i"
      >
        <path
          :d="item.d"
          :fill="mergedConfig.columnColor"
        />
        <text
          :style="`fontSize:${mergedConfig.fontSize}px`"
          :fill="mergedConfig.textColor"
          :x="item.x"
          :y="height - 4"
        >
          {{ item.name }}
        </text>
        <image
          v-if="mergedConfig.img.length"
          :xlink:href="mergedConfig.img[i % mergedConfig.img.length]"
          :width="mergedConfig.imgSideLength"
          :height="mergedConfig.imgSideLength"
          :x="item.x - mergedConfig.imgSideLength / 2"
          :y="item.y - mergedConfig.imgSideLength"
        />
        <text
          v-if="mergedConfig.showValue"
          :style="`fontSize:${mergedConfig.fontSize}px`"
          :fill="mergedConfig.textColor"
          :x="item.x"
          :y="item.textY"
        >
          {{ item.value }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvConicalColumnChart',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ref: 'conical-column-chart',

      defaultConfig: {
        /**
         * @description Chart data
         * @type {Array<Object>}
         * @default data = []
         */
        data: [],
        /**
         * @description Chart img
         * @type {Array<String>}
         * @default img = []
         */
        img: [],
        /**
         * @description Chart font size
         * @type {Number}
         * @default fontSize = 12
         */
        fontSize: 12,
        /**
         * @description Img side length
         * @type {Number}
         * @default imgSideLength = 30
         */
        imgSideLength: 30,
        /**
         * @description Column color
         * @type {String}
         * @default columnColor = 'rgba(0, 194, 255, 0.4)'
         */
        columnColor: 'rgba(0, 194, 255, 0.4)',
        /**
         * @description Text color
         * @type {String}
         * @default textColor = '#fff'
         */
        textColor: '#fff',
        /**
         * @description Show value
         * @type {Boolean}
         * @default showValue = false
         */
        showValue: false
      },

      mergedConfig: null,

      column: []
    }
  },
  watch: {
    config () {
      const { calcData } = this

      calcData()
    }
  },
  methods: {
    afterAutoResizeMixinInit () {
      const { calcData } = this

      calcData()
    },
    onResize () {
      const { calcData } = this

      calcData()
    },
    calcData () {
      const { mergeConfig, initData, calcSVGPath } = this

      mergeConfig()

      initData()

      calcSVGPath()
    },
    mergeConfig () {
      const { defaultConfig, config } = this

      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    },
    initData () {
      const { mergedConfig } = this
      let { data } = mergedConfig

      data = deepClone(data, true)

      data.sort(({ value: a }, { value: b }) => {
        if (a > b) return -1
        if (a < b) return 1
        if (a === b) return 0
      })

      const max = data[0] ? data[0].value : 10

      data = data.map(item => ({
        ...item,
        percent: item.value / max
      }))

      mergedConfig.data = data
    },
    calcSVGPath () {
      const { mergedConfig, width, height } = this

      const { imgSideLength, fontSize, data } = mergedConfig

      const itemNum = data.length
      const gap = width / (itemNum + 1)

      const useAbleHeight = height - imgSideLength - fontSize - 5
      const svgBottom = height - fontSize - 5

      this.column = data.map((item, i) => {
        const { percent } = item

        const middleXPos = gap * (i + 1)
        const leftXPos = gap * i
        const rightXpos = gap * (i + 2)

        const middleYPos = svgBottom - useAbleHeight * percent
        const controlYPos = useAbleHeight * percent * 0.6 + middleYPos

        const d = `
          M${leftXPos}, ${svgBottom}
          Q${middleXPos}, ${controlYPos} ${middleXPos},${middleYPos}
          M${middleXPos},${middleYPos}
          Q${middleXPos}, ${controlYPos} ${rightXpos},${svgBottom}
          L${leftXPos}, ${svgBottom}
          Z
        `

        const textY = (svgBottom + middleYPos) / 2 + fontSize / 2

        return {
          ...item,
          d,
          x: middleXPos,
          y: middleYPos,
          textY
        }
      })
    }
  }
}
</script>