<template>
  <div
    class="dv-flyline-chart"
    ref="dv-flyline-chart"
    :style="`background-image: url(${mergedConfig ? mergedConfig.bgImgUrl : ''})`"
    @click="consoleClickPos"
  >
    <svg v-if="mergedConfig" :width="width" :height="height">
      <defs>
        <radialGradient
          :id="gradientId"
          cx="50%" cy="50%" r="50%"
        >
          <stop
            offset="0%" stop-color="#fff"
            stop-opacity="1"
          />
          <stop
            offset="100%" stop-color="#fff"
            stop-opacity="0"
          />
        </radialGradient>

        <radialGradient
          :id="gradient2Id"
          cx="50%" cy="50%" r="50%"
        >
          <stop
            offset="0%" stop-color="#fff"
            stop-opacity="0"
          />
          <stop
            offset="100%" stop-color="#fff"
            stop-opacity="1"
          />
        </radialGradient>

        <circle
          v-if="paths[0]"
          :id="`circle${paths[0].toString()}`"
          :cx="paths[0][2][0]"
          :cy="paths[0][2][1]"
        >
          <animate
            attributeName="r"
            :values="`1;${mergedConfig.halo.radius}`"
            :dur="mergedConfig.halo.duration / 10 + 's'"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            :dur="mergedConfig.halo.duration / 10 + 's'"
            repeatCount="indefinite"
          />
        </circle>
      </defs>

      <image
        v-if="paths[0]"
        :xlink:href="mergedConfig.centerPointImg.url"
        :width="mergedConfig.centerPointImg.width"
        :height="mergedConfig.centerPointImg.height"
        :x="paths[0][2][0] - mergedConfig.centerPointImg.width / 2"
        :y="paths[0][2][1] - mergedConfig.centerPointImg.height / 2"
      />

      <mask :id="`maskhalo${paths[0].toString()}`">
        <use
          v-if="paths[0]"
          :xlink:href="`#circle${paths[0].toString()}`"
          :fill="`url(#${gradient2Id})`"
        />
      </mask>

      <use
        v-if="paths[0] && mergedConfig.halo.show"
        :xlink:href="`#circle${paths[0].toString()}`"
        :fill="mergedConfig.halo.color"
        :mask="`url(#maskhalo${paths[0].toString()})`"
      />

      <g
        v-for="(path, i) in paths"
        :key="i"
      >
        <defs>
          <path
            :id="`path${path.toString()}`"
            :ref="`path${i}`"
            :d="`M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`"
            fill="transparent"
          />
        </defs>

        <use
          :xlink:href="`#path${path.toString()}`"
          :stroke-width="mergedConfig.lineWidth"
          :stroke="mergedConfig.orbitColor"
        />

        <use
          v-if="lengths[i]"
          :xlink:href="`#path${path.toString()}`"
          :stroke-width="mergedConfig.lineWidth"
          :stroke="mergedConfig.flylineColor"
          :mask="`url(#mask${unique}${path.toString()})`"
        >
          <animate
            attributeName="stroke-dasharray"
            :from="`0, ${lengths[i]}`"
            :to="`${lengths[i]}, 0`"
            :dur="times[i] || 0"
            repeatCount="indefinite"
          />
        </use>

        <mask :id="`mask${unique}${path.toString()}`">
          <circle cx="0" cy="0" :r="mergedConfig.flylineRadius" :fill="`url(#${gradientId})`">
            <animateMotion
              :dur="times[i] || 0"
              :path="`M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`"
              rotate="auto"
              repeatCount="indefinite"
            />
          </circle>
        </mask>

        <image
          :xlink:href="mergedConfig.pointsImg.url"
          :width="mergedConfig.pointsImg.width"
          :height="mergedConfig.pointsImg.height"
          :x="path[0][0] - mergedConfig.pointsImg.width / 2"
          :y="path[0][1] - mergedConfig.pointsImg.height / 2"
        />

        <text
          :style="`fontSize:${mergedConfig.text.fontSize}px;`"
          :fill="mergedConfig.text.color"
          :x="path[0][0] + mergedConfig.text.offset[0]"
          :y="path[0][1] + mergedConfig.text.offset[1]"
        >
          {{ texts[i] }}
        </text>

      </g>
    </svg>
  </div>
</template>

<script>
import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

import { randomExtend, getPointDistance, uuid } from '../../../util/index'

import autoResize from '../../../mixin/autoResize'

export default {
  name: 'DvFlylineChart',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    dev: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const id = uuid()
    return {
      ref: 'dv-flyline-chart',
      unique: Math.random(),
      maskId: `flyline-mask-id-${id}`,
      maskCircleId: `mask-circle-id-${id}`,
      gradientId: `gradient-id-${id}`,
      gradient2Id: `gradient2-id-${id}`,

      defaultConfig: {
        /**
         * @description Flyline chart center point
         * @type {Array<Number>}
         * @default centerPoint = [0, 0]
         */
        centerPoint: [0, 0],
        /**
         * @description Flyline start points
         * @type {Array<Array<Number>>}
         * @default points = []
         * @example points = [[10, 10], [100, 100]]
         */
        points: [],
        /**
         * @description Flyline width
         * @type {Number}
         * @default lineWidth = 1
         */
        lineWidth: 1,
        /**
         * @description Orbit color
         * @type {String}
         * @default orbitColor = 'rgba(103, 224, 227, .2)'
         */
        orbitColor: 'rgba(103, 224, 227, .2)',
        /**
         * @description Flyline color
         * @type {String}
         * @default orbitColor = '#ffde93'
         */
        flylineColor: '#ffde93',
        /**
         * @description K value
         * @type {Number}
         * @default k = -0.5
         * @example k = -1 ~ 1
         */
        k: -0.5,
        /**
         * @description Flyline curvature
         * @type {Number}
         * @default curvature = 5
         */
        curvature: 5,
        /**
         * @description Flyline radius
         * @type {Number}
         * @default flylineRadius = 100
         */
        flylineRadius: 100,
        /**
         * @description Flyline animation duration
         * @type {Array<Number>}
         * @default duration = [20, 30]
         */
        duration: [20, 30],
        /**
         * @description Relative points position
         * @type {Boolean}
         * @default relative = true
         */
        relative: true,
        /**
         * @description Back ground image url
         * @type {String}
         * @default bgImgUrl = ''
         * @example bgImgUrl = './img/bg.jpg'
         */
        bgImgUrl: '',
        /**
         * @description Text configuration
         * @type {Object}
         */
        text: {
          /**
           * @description Text offset
           * @type {Array<Number>}
           * @default offset = [0, 15]
           */
          offset: [0, 15],
          /**
           * @description Text color
           * @type {String}
           * @default color = '#ffdb5c'
           */
          color: '#ffdb5c',
          /**
           * @description Text font size
           * @type {Number}
           * @default fontSize = 12
           */
          fontSize: 12
        },
        /**
         * @description Halo configuration
         * @type {Object}
         */
        halo: {
          /**
           * @description Weather to show halo
           * @type {Boolean}
           * @default show = true
           * @example show = true | false
           */
          show: true,
          /**
           * @description Halo animation duration (10 = 1s)
           * @type {Number}
           * @default duration = 30
           */
          duration: 30,
          /**
           * @description Halo color
           * @type {String}
           * @default color = '#fb7293'
           */
          color: '#fb7293',
          /**
           * @description Halo max radius
           * @type {Number}
           * @default radius = 120
           */
          radius: 120
        },
        /**
         * @description Center point img configuration
         * @type {Object}
         */
        centerPointImg: {
          /**
           * @description Center point img width
           * @type {Number}
           * @default width = 40
           */
          width: 40,
          /**
           * @description Center point img height
           * @type {Number}
           * @default height = 40
           */
          height: 40,
          /**
           * @description Center point img url
           * @type {String}
           * @default url = ''
           */
          url: ''
        },
        /**
         * @description Points img configuration
         * @type {Object}
         * @default radius = 120
         */
        pointsImg: {
          /**
           * @description Points img width
           * @type {Number}
           * @default width = 15
           */
          width: 15,
          /**
           * @description Points img height
           * @type {Number}
           * @default height = 15
           */
          height: 15,
          /**
           * @description Points img url
           * @type {String}
           * @default url = ''
           */
          url: ''
        }
      },

      mergedConfig: null,

      paths: [],
      lengths: [],
      times: [],
      texts: []
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
    async calcData () {
      const { mergeConfig, createFlylinePaths, calcLineLengths } = this

      mergeConfig()

      createFlylinePaths()

      await calcLineLengths()

      const { calcTimes, calcTexts } = this

      calcTimes()

      calcTexts()
    },
    mergeConfig () {
      let { config, defaultConfig } = this

      const mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})

      const { points } = mergedConfig

      mergedConfig.points = points.map(item => {
        if (item instanceof Array) {
          return { position: item, text: '' }
        }

        return item
      })

      this.mergedConfig = mergedConfig
    },
    createFlylinePaths () {
      const { getPath, mergedConfig, width, height } = this

      let { centerPoint, points, relative } = mergedConfig

      points = points.map(({ position }) => position)

      if (relative) {
        centerPoint = [width * centerPoint[0], height * centerPoint[1]]
        points = points.map(([x, y]) => [width * x, height * y])
      }

      this.paths = points.map(point => getPath(centerPoint, point))
    },
    getPath (center, point) {
      const { getControlPoint } = this

      const controlPoint = getControlPoint(center, point)

      return [point, controlPoint, center]
    },
    getControlPoint ([sx, sy], [ex, ey]) {
      const { getKLinePointByx, mergedConfig } = this

      const { curvature, k } = mergedConfig

      const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2]

      const distance = getPointDistance([sx, sy], [ex, ey])

      const targetLength = distance / curvature
      const disDived = targetLength / 2

      let [dx, dy] = [mx, my]

      do {
        dx += disDived
        dy = getKLinePointByx(k, [mx, my], dx)[1]
      } while (getPointDistance([mx, my], [dx, dy]) < targetLength)

      return [dx, dy]
    },
    getKLinePointByx (k, [lx, ly], x) {
      const y = ly - k * lx + k * x

      return [x, y]
    },
    async calcLineLengths () {
      const { $nextTick, paths, $refs } = this

      await $nextTick()

      this.lengths = paths.map((foo, i) => $refs[`path${i}`][0].getTotalLength())
    },
    calcTimes () {
      const { duration, points } = this.mergedConfig

      this.times = points.map(foo => randomExtend(...duration) / 10)
    },
    calcTexts () {
      const { points } = this.mergedConfig

      this.texts = points.map(({ text }) => text)
    },
    consoleClickPos ({ offsetX, offsetY }) {
      const { width, height, dev } = this

      if (!dev) return

      const relativeX = (offsetX / width).toFixed(2)
      const relativeY = (offsetY / height).toFixed(2)

      console.warn(`dv-flyline-chart DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`)
    }
  }
}
</script>