<template>
  <div class="dv-charts-container" :ref="ref">
    <div class="charts-canvas-container" :ref="chartRef" />
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import Charts from '@jiaminghi/charts'

import { getUuid } from '../../../util'

export default {
  name: 'DvCharts',
  mixins: [autoResize],
  props: {
    option: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const uuid = getUuid();
    return {
      ref: `charts-container-${uuid}`,
      chartRef: `chart-${uuid}`,

      chart: null
    }
  },
  watch: {
    option () {
      let { chart, option } = this

      if (!chart) return

      if (!option) option = {}

      chart.setOption(option, true)
    }
  },
  methods: {
    afterAutoResizeMixinInit () {
      const { initChart } = this

      initChart()
    },
    initChart () {
      const { $refs, chartRef, option } = this

      const chart = this.chart = new Charts($refs[chartRef])

      if (!option) return

      chart.setOption(option)
    },
    onResize () {
      const { chart } = this

      if (!chart) return

      chart.resize()
    }
  }
}
</script>