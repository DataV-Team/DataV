<template>
  <div class="dv-scroll-board" :ref="ref">
    <div class="header" v-if="header.length && mergedConfig">
      <div
        class="header-item"
        v-for="(headerItem, i) in header"
        :key="headerItem + i"
        :style="`
          background-color: ${mergedConfig.headerBGC};
          height: ${mergedConfig.headerHeight}px;
          line-height: ${mergedConfig.headerHeight}px;
          width: ${widths[i]}px;
        `"
        :align="aligns[i]"
        v-html="headerItem"
      />
    </div>

    <div
      v-if="mergedConfig"
      class="rows"
      :style="`height: calc(100% - ${header.length ? mergedConfig.headerHeight : 0}px);`"
    >
      <div
        class="row-item"
        v-for="(row, ri) in rows"
        :key="row.toString() + row.rowIndex"
        :style="`
          height: ${heights[ri]}px;
          line-height: ${heights[ri]}px;
          background-color: ${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
        `"
      >
        <div
          class="ceil"
          v-for="(ceil, ci) in row.ceils"
          :key="ceil + ri + ci"
          :style="`width: ${widths[ci]}px;`"
          :align="aligns[ci]"
          v-html="ceil"
          @click="emitEvent(ri, ci, row, ceil)"
        />

      </div>
    </div>
  </div>
</template>

<script>
import autoResize from '../../mixins/autoResize.js'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'ScrollBoard',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ref: 'scroll-board',

      defaultConfig: {
        /**
         * @description Board header
         * @type {Array<String>}
         * @default header = []
         * @example header = ['column1', 'column2', 'column3']
         */
        header: [],
        /**
         * @description Board data
         * @type {Array<Array>}
         * @default data = []
         * @example header = [['column1Row1', 'column2Row1', 'column3Row1']]
         */
        data: [],
        /**
         * @description Row num
         * @type {Number}
         * @default rowNum = 5
         */
        rowNum: 5,
        /**
         * @description Header background color
         * @type {String}
         * @default headerBGC = '#00BAFF'
         */
        headerBGC: '#00BAFF',
        /**
         * @description Odd row background color
         * @type {String}
         * @default oddRowBGC = '#003B51'
         */
        oddRowBGC: '#003B51',
        /**
         * @description Even row background color
         * @type {String}
         * @default evenRowBGC = '#003B51'
         */
        evenRowBGC: '#0A2732',
        /**
         * @description Scroll wait time
         * @type {Number}
         * @default waitTime = 2000
         */
        waitTime: 2000,
        /**
         * @description Header height
         * @type {Number}
         * @default headerHeight = 35
         */
        headerHeight: 35,
        /**
         * @description Column width
         * @type {Array<Number>}
         * @default columnWidth = []
         */
        columnWidth: [],
        /**
         * @description Column align
         * @type {Array<String>}
         * @default align = []
         * @example align = ['left', 'center', 'right']
         */
        align: [],
        /**
         * @description Show index
         * @type {Boolean}
         * @default index = false
         */
        index: false,
        /**
         * @description Carousel type
         * @type {String}
         * @default carousel = 'single'
         * @example carousel = 'single' | 'page'
         */
        carousel: 'single'
      },

      mergedConfig: null,

      header: [],

      rowsData: [],

      rows: [],

      widths: [],

      heights: [],

      avgHeight: 0,

      aligns: [],

      animationIndex: 0,

      animationHandler: ''
    }
  },
  watch: {
    config () {
      const { stopAnimation, calcData } = this

      stopAnimation()

      calcData()
    }
  },
  methods: {
    afterAutoResizeMixinInit () {
      const { calcData } = this

      calcData()
    },
    onResize () {
      const { mergedConfig, calcWidths, calcHeights } = this

      if (!mergedConfig) return

      calcWidths()

      calcHeights()
    },
    calcData () {
      const { mergeConfig, calcHeaderData, calcRowsData } = this

      mergeConfig()

      calcHeaderData()

      calcRowsData()

      const { calcWidths, calcHeights, calcAligns } = this

      calcWidths()

      calcHeights()

      calcAligns()

      const { animation } = this

      animation(true)
    },
    mergeConfig () {
      let { config, defaultConfig } = this

      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    },
    calcHeaderData () {
      let { header, index } = this.mergedConfig

      if (!header.length) {
        this.header = []

        return
      }

      header = [...header]

      if (index) header.unshift('#')

      this.header = header
    },
    calcRowsData () {
      let { data, index, headerBGC } = this.mergedConfig

      if (index) {
        data = data.map((row, i) => {
          row = [...row]

          const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</spand>`

          row.unshift(indexTag)

          return row
        })
      }

      data = data.map((ceils, i) => ({ ceils, rowIndex: i }))

      this.rowsData = data
      this.rows = data
    },
    calcWidths () {
      const { width, mergedConfig, rowsData } = this

      const { columnWidth } = mergedConfig

      const usedWidth = columnWidth.reduce((all, w) => all + w, 0)

      const columnNum = rowsData[0] ? rowsData[0].ceils.length : 0

      const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length)

      const widths = new Array(columnNum).fill(avgWidth)

      this.widths = deepMerge(widths, columnWidth)
    },
    calcHeights (onresize = false) {
      const { height, mergedConfig, header } = this

      const { headerHeight, rowNum, data } = mergedConfig

      let allHeight = height

      if (header.length) allHeight -= headerHeight

      const avgHeight = allHeight / rowNum

      this.avgHeight = avgHeight

      if (!onresize) this.heights = new Array(data.length).fill(avgHeight)
    },
    calcAligns () {
      const { header, mergedConfig } = this

      const columnNum = header.length

      let aligns = new Array(columnNum).fill('left')

      const { align } = mergedConfig

      this.aligns = deepMerge(aligns, align)
    },
    async animation (start = false) {
      let { avgHeight, animationIndex, mergedConfig, rowsData, animation } = this

      const { waitTime, carousel, rowNum } = mergedConfig

      const rowLength = rowsData.length

      if (rowNum >= rowLength) return

      if (start) await new Promise(resolve => setTimeout(resolve, waitTime))

      const animationNum = carousel === 'single' ? 1 : rowNum

      let rows = rowsData.slice(animationIndex)
      rows.push(...rowsData.slice(0, animationIndex))

      this.rows = rows
      this.heights = new Array(rowLength).fill(avgHeight)

      await new Promise(resolve => setTimeout(resolve, 300))

      this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))

      animationIndex += animationNum

      const back = animationIndex - rowLength
      if (back >= 0) animationIndex = back

      this.animationIndex = animationIndex
      this.animationHandler = setTimeout(animation, waitTime - 300)
    },
    stopAnimation () {
      const { animationHandler } = this

      if (!animationHandler) return

      clearTimeout(animationHandler)
    },
    emitEvent (ri, ci, row, ceil) {
      const { ceils, rowIndex } = row

      this.$emit('click', {
        row: ceils,
        ceil,
        rowIndex,
        columnIndex: ci
      })
    }
  },
  destroyed () {
    const { stopAnimation } = this

    stopAnimation()
  }
}
</script>

<style lang="less">
.text {
  padding: 0 10px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dv-scroll-board {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;

  .header {
    display: flex;
    flex-direction: row;
    font-size: 15px;

    .header-item {
      .text;
      transition: all 0.3s;
    }
  }

  .rows {
    overflow: hidden;

    .row-item {
      display: flex;
      font-size: 14px;
      transition: all 0.3s;
    }

    .ceil {
      .text;
    }

    .index {
      border-radius: 3px;
      padding: 0px 3px;
    }
  }
}
</style>
