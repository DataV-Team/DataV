<template>
  <div class="dv-capsule-chart">
    <template v-if="mergedConfig">
      <div class="label-column" v-if="mergedConfig.yAxis.show">
        <div 
          v-for="item in mergedConfig.data" 
          :key="item.name" 
          :style="`font-size: ${mergedConfig.yAxis.fontSize}px; color: ${mergedConfig.yAxis.fill};`"
        >{{ item.name }}</div>
        <div>&nbsp;</div>
      </div>

      <div class="capsule-container">
        <div class="capsule-item" v-for="(capsule, index) in capsuleLength" :key="index">
          <div
            class="capsule-item-column"
            :style="`width: ${capsule * 100}%; background-color: ${mergedConfig.colors[index % mergedConfig.colors.length]};`"
          >
            <div
              v-if="mergedConfig.value.show"
              class="capsule-item-value"
              :style="`font-size: ${mergedConfig.value.fontSize}px; color: ${mergedConfig.value.fill};`"
            >{{ capsuleValue[index] }}</div>
          </div>
        </div>

        <div class="unit-label" v-if="mergedConfig.xAxis.show">
          <div
            v-for="(label, index) in labelData"
            :key="label + index"
            :style="`font-size: ${mergedConfig.xAxis.fontSize}px; color: ${mergedConfig.xAxis.fill};`"
          >{{ label }}</div>
        </div>
      </div>

      <div class="unit-text" v-if="mergedConfig.unit">{{ mergedConfig.unit }}</div>
    </template>
  </div>
</template>

<script>
import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvCapsuleChart',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultConfig: {
        /**
         * @description Capsule chart data
         * @type {Array<Object>}
         * @default data = []
         * @example data = [{ name: 'foo1', value: 100 }, { name: 'foo2', value: 100 }]
         */
        data: [],
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default color = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293']
         * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: [
          '#37a2da',
          '#32c5e9',
          '#67e0e3',
          '#9fe6b8',
          '#ffdb5c',
          '#ff9f7f',
          '#fb7293'
        ],
        /**
         * @description Chart unit
         * @type {String}
         * @default unit = ''
         */
        unit: '',
        /**
         * @description item value style
         * @type {Object}
         */
        value: {
        /**
          * @description Show item value
          * @type {Boolean}
          * @default show = false
          */
          show: false,
        /**
          * @description item value fontSize
          * @type {Number}
          * @default fontSize = 12
          */  
          fontSize: 12,
        /**
          * @description item value color
          * @type {Number}
          * @default fill = '#fff'
          */  
          fill: '#fff'
        },
        /**
         * @description xAxis style
         * @type {Object}
         */
        xAxis: {
        /**
          * @description Show xAxis text
          * @type {Boolean}
          * @default show = true
          */
          show: true,
        /**
          * @description xAxis text fontSize
          * @type {Number}
          * @default fontSize = 12
          */  
          fontSize: 12,
        /**
          * @description xAxis text color
          * @type {Number}
          * @default fill = '#fff'
          */  
          fill: '#fff'
        },
        /**
         * @description yAxis style
         * @type {Object}
         */
        yAxis: {
        /**
          * @description Show yAxis text
          * @type {Boolean}
          * @default show = true
          */
          show: true,
        /**
          * @description yAxis text fontSize
          * @type {Number}
          * @default fontSize = 12
          */  
          fontSize: 12,
        /**
          * @description yAxis text color
          * @type {Number}
          * @default fill = '#fff'
          */  
          fill: '#fff'
        }
      },

      mergedConfig: null,

      capsuleLength: [],
      capsuleValue: [],
      labelData: [],
      labelDataLength: []
    }
  },
  watch: {
    config() {
      const { calcData } = this

      calcData()
    }
  },
  methods: {
    calcData() {
      const { mergeConfig, calcCapsuleLengthAndLabelData } = this

      mergeConfig()

      calcCapsuleLengthAndLabelData()
    },
    mergeConfig() {
      let { config, defaultConfig } = this

      this.mergedConfig = deepMerge(
        deepClone(defaultConfig, true),
        config || {}
      )
    },
    calcCapsuleLengthAndLabelData() {
      const { data } = this.mergedConfig

      if (!data.length) return

      const capsuleValue = data.map(({ value }) => value)

      const maxValue = Math.max(...capsuleValue)

      this.capsuleValue = capsuleValue

      this.capsuleLength = capsuleValue.map(v => (maxValue ? v / maxValue : 0))

      const oneFifth = maxValue / 5

      const labelData = Array.from(
        new Set(new Array(6).fill(0).map((v, i) => Math.ceil(i * oneFifth)))
      )

      this.labelData = labelData

      this.labelDataLength = Array.from(labelData).map(v =>
        maxValue ? v / maxValue : 0
      )
    }
  },
  mounted() {
    const { calcData } = this

    calcData()
  }
}
</script>