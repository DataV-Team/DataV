<template>
  <div class="dv-decoration-5" :ref="ref">
    <svg :width="width" :height="height">
      <polyline
        fill="transparent"
        :stroke="mergedColor[0]"
        stroke-width="3"
        :points="line1Points"
      >
        <animate
          attributeName="stroke-dasharray"
          attributeType="XML"
          :from="`0, ${line1Length / 2}, 0, ${line1Length / 2}`"
          :to="`0, 0, ${line1Length}, 0`"
          :dur="`${dur}s`"
          begin="0s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.4,1,0.49,0.98"
          repeatCount="indefinite"
        />
      </polyline>
      <polyline
        fill="transparent"
        :stroke="mergedColor[1]"
        stroke-width="2"
        :points="line2Points"
      >
        <animate
          attributeName="stroke-dasharray"
          attributeType="XML"
          :from="`0, ${line2Length / 2}, 0, ${line2Length / 2}`"
          :to="`0, 0, ${line2Length}, 0`"
          :dur="`${dur}s`"
          begin="0s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines=".4,1,.49,.98"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { getPolylineLength } from '@jiaminghi/charts/lib/util'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvDecoration5',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    dur: {
      type: Number,
      default: 1.2
    }
  },
  data () {
    return {
      ref: 'decoration-5',

      line1Points: '',
      line2Points: '',

      line1Length: 0,
      line2Length: 0,

      defaultColor: ['#3f96a5', '#3f96a5'],

      mergedColor: []
    }
  },
  watch: {
    color () {
      const { mergeColor } = this

      mergeColor()
    }
  },
  methods: {
    afterAutoResizeMixinInit () {
      const { calcSVGData } = this

      calcSVGData()
    },
    calcSVGData () {
      const { width, height } = this

      let line1Points = [
        [0, height * 0.2], [width * 0.18, height * 0.2], [width * 0.2, height * 0.4], [width * 0.25, height * 0.4],
        [width * 0.27, height * 0.6], [width * 0.72, height * 0.6], [width * 0.75, height * 0.4],
        [width * 0.8, height * 0.4], [width * 0.82, height * 0.2], [width, height * 0.2]
      ]

      let line2Points = [
        [width * 0.3, height * 0.8], [width * 0.7, height * 0.8]
      ]

      const line1Length = getPolylineLength(line1Points)
      const line2Length = getPolylineLength(line2Points)

      line1Points = line1Points.map(point => point.join(',')).join(' ')
      line2Points = line2Points.map(point => point.join(',')).join(' ')

      this.line1Points = line1Points
      this.line2Points = line2Points

      this.line1Length = line1Length
      this.line2Length = line2Length
    },
    onResize () {
      const { calcSVGData } = this

      calcSVGData()
    },
    mergeColor () {
      const { color, defaultColor } = this

      this.mergedColor = deepMerge(deepClone(defaultColor, true), color || [])
    }
  },
  mounted () {
    const { mergeColor } = this

    mergeColor()
  }
}
</script>