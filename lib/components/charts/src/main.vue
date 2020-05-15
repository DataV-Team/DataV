<template>
  <div class="dv-charts-container" :ref="ref">
    <div class="charts-canvas-container" :ref="chartRef" />
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import Charts from '@jiaminghi/charts'

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
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
   });
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