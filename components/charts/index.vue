<template>
  <div class="dv-charts-container" :ref="ref">
    <div class="charts" :ref="chartRef" />

    <div class="charts-slot-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '../../mixins/autoResize.js'

import Charts from '@jiaminghi/charts'

export default {
  name: 'Charts',
  mixins: [autoResize],
  props: {
    option: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      ref: `charts-container-${(new Date()).getTime()}`,
      chartRef: `chart-${(new Date()).getTime()}`,

      chart: null
    }
  },
  watch: {
    option () {
      let { chart, option } = this

      if (!option) option = {}

      chart.setOption(option)
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

<style lang="less">
.dv-charts-container {
  position: relative;
  width: 100%;
  height: 100%;

  .charts {
    width: 100%;
    height: 100%;
  }

  .charts-slot-content {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>
