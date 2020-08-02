<template>
  <div class="dv-scroll-board" :ref="ref">
    <div class="header" v-if="header.length && mergedConfig" :style="`background-color: ${mergedConfig.headerBGC};`">
      <div
        class="header-item"
        v-for="(headerItem, i) in header"
        :key="`${headerItem}${i}`"
        :style="`
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
      :style="`height: ${height - (header.length ? mergedConfig.headerHeight : 0)}px;`"
    >
      <div
        class="row-item"
        v-for="(row, ri) in rows"
        :key="`${row.toString()}${row.scroll}`"
        :style="`
          height: ${heights[ri]}px;
          line-height: ${heights[ri]}px;
          background-color: ${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
        `"
      >
        <div
          class="ceil"
          v-for="(ceil, ci) in row.ceils"
          :key="`${ceil}${ri}${ci}`"
          :style="`width: ${widths[ci]}px;`"
          :align="aligns[ci]"
          v-html="ceil"
          @click="emitEvent('click', ri, ci, row, ceil)"
          @mouseenter="handleHover(true, ri, ci, row, ceil)"
          @mouseleave="handleHover(false)"
        />

      </div>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvScrollBoard',
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
         * @description index Header
         * @type {String}
         * @default indexHeader = '#'
         */
        indexHeader: '#',
        /**
         * @description Carousel type
         * @type {String}
         * @default carousel = 'single'
         * @example carousel = 'single' | 'page'
         */
        carousel: 'single',
        /**
         * @description Pause scroll when mouse hovered
         * @type {Boolean}
         * @default hoverPause = true
         * @example hoverPause = true | false
         */
        hoverPause: true
      },

      mergedConfig: null,

      header: [],

      rowsData: [],

      /* 数据段区间索引 */
      rowsDataIndexs: [],

      /* 数据段字典 */
      rowsDataDir: {},

      /* 字典个数 */
      dirCount: 0,

      /* 字典限制的最大长度 */
      dirTotalCount: 200,

      rows: [],

      widths: [],

      heights: [],

      avgHeight: 0,

      aligns: [],

      animationIndex: 0,

      animationHandler: '',

      updater: 0
    }
  },
  watch: {
    config () {
      const { stopAnimation, calcData } = this

      stopAnimation()

      this.animationIndex = 0

      calcData()
    }
  },
  methods: {
    handleHover(enter, ri, ci, row, ceil){
      const { mergedConfig, emitEvent, stopAnimation, animation } = this

      if (enter) emitEvent('mouseover', ri, ci, row, ceil)
      if (!mergedConfig.hoverPause) return

      if (enter) {
        stopAnimation()
      } else {
        animation(true)
      }
    },
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
      let { header, index, indexHeader} = this.mergedConfig

      if (!header.length) {
        this.header = []

        return
      }

      header = [...header]

      if (index) header.unshift(indexHeader)

      this.header = header
    },
    calcRowsData () {
      let { data, index, headerBGC, rowNum } = this.mergedConfig

      if (index) {
        data = data.map((row, i) => {
          row = [...row]

          const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`

          row.unshift(indexTag)

          return row
        })
      }

      data = data.map((ceils, i) => ({ ceils, rowIndex: i }))

      const rowLength = data.length

      if (rowLength > rowNum && rowLength < 2 * rowNum) {
        data = [...data, ...data]
      }

      data = data.map((d, i) => ({ ...d, scroll: i }))

      this.rowsData = data
      this.rowsDataIndexs = this.splitBlockIndexs(data, rowNum * 5)
      this.rows = data
    },
    calcWidths () {
      const { width, mergedConfig, rowsData } = this

      const { columnWidth, header } = mergedConfig

      const usedWidth = columnWidth.reduce((all, w) => all + w, 0)

      let columnNum = 0
      if (rowsData[0]) {
        columnNum = rowsData[0].ceils.length
      } else if (header.length) {
        columnNum = header.length
      }

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
      let { avgHeight, animationIndex, mergedConfig, rowsData, rowsDataIndexs, animation, updater } = this

      const { waitTime, carousel, rowNum } = mergedConfig

      const rowLength = rowsData.length

      if (rowNum >= rowLength) return

      if (start) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
        if (updater !== this.updater) return
      }

      const animationNum = carousel === 'single' ? 1 : rowNum

      let key = this.isWhoBlock(rowsDataIndexs, animationIndex)
      let rowsData2 = this.getCurrentAndNextBlock(
        rowsData,
        rowsDataIndexs,
        key
      )
      let blockIndex = this.calcBlockIndexByIndex(key, animationIndex)
      let rows = rowsData2.slice(blockIndex)
      rows.push(...rowsData2.slice(0, blockIndex))

      this.rows = rows
      this.heights = new Array(this.rows.length).fill(avgHeight)

      await new Promise(resolve => setTimeout(resolve, 300))
      if (updater !== this.updater) return

      this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))

      animationIndex += animationNum

      const back = animationIndex - rowLength
      if (back >= 0) animationIndex = back

      this.animationIndex = animationIndex
      this.animationHandler = setTimeout(animation, waitTime - 300)
    },
    stopAnimation () {
      const { animationHandler, updater } = this

      this.updater = (updater + 1) % 999999

      if (!animationHandler) return

      clearTimeout(animationHandler)
    },
    emitEvent (type, ri, ci, row, ceil) {
      const { ceils, rowIndex } = row

      this.$emit(type, {
        row: ceils,
        ceil,
        rowIndex,
        columnIndex: ci
      })
    },

    /* 数据分帧 */
    splitBlock(data = [], rank) {
      let index = 0
      let startIndex = 0
      let endIndex = 0
      rank = rank || 100
      let rowsDataObj = {}
      while (index < data.length) {
        startIndex = index
        endIndex = startIndex + rank
        if (endIndex > data.length) {
          rowsDataObj[`${startIndex}-${data.length - 1}`] = data.splice(
            startIndex
          )
          break
        }

        rowsDataObj[`${startIndex}-${endIndex - 1}`] = data.slice(
          index,
          (index += rank)
        )
      }

      return rowsDataObj
    },

    /* 数据索引分帧 */
    splitBlockIndexs(data = [], rank) {
      let index = 0
      let startIndex = 0
      let endIndex = 0
      rank = rank || 100
      let rowsDataIndexs = []
      while (index < data.length) {
        startIndex = index
        endIndex = startIndex + rank
        if (endIndex > data.length) {
          rowsDataIndexs.push(`${startIndex}-${data.length - 1}`)
          break
        }

        rowsDataIndexs.push(`${startIndex}-${endIndex - 1}`)
        index += rank
      }

      return rowsDataIndexs
    },

    /* 判断索引在某个段数据帧之间 */
    isWhoBlock(dataIndexs, index) {
      for (const key of dataIndexs) {
        const [start, end] = key.split("-")
        if (index >= Number(start) && index <= Number(end)) {
          return key
        }
      }

      /* 返回第一个数据帧段 */
      return dataIndexs[0]
    },

    /* 计算索引在这段数据帧中的索引 */
    calcBlockIndexByIndex(key, index) {
      const [start, end] = key.split("-")
      const blockIndex = index - start
      return blockIndex
    },

    /* 返回当前段的数据帧和下一帧的数据帧 */
    getCurrentAndNextBlock(data, keys, key) {
      let index = keys.findIndex(str => str === key) + 1

      if (index > keys.length - 1) {
        index = 0
      }

      let nextKey = keys[index]
      const currentData = this.getBlockByKey(data, key)
      const nextData = this.getBlockByKey(data, nextKey)
      return [...currentData, ...nextData]
    },

    /* 获取该段数据帧中的数据 */
    getBlockByKey(data, key) {
      if (this.rowsDataDir[key]) {
        return this.rowsDataDir[key]
      } else if (this.dirCount > this.dirTotalCount * 1.5) {  /* 当数据分段的字典中的key的个数大于 限制的总个数的1.5倍时 */
        this.clearPartRowsDataDir()
      }

      const [start, end] = key.split("-")
      this.rowsDataDir[key] = data.slice(Number(start), Number(end) + 1)
      this.dirCount ++
      return this.rowsDataDir[key]
    },

    /* 清除部分缓存 */
    clearPartRowsDataDir () {
        const cur = parseInt(this.dirCount / 2)
        this.dirCount -= cur
        while(cur) {
          /* 开始清空 */
          const key = this.rowsDataIndexs[cur--]
          this.rowsDataDir[key] = null
        }
    }
  },
  destroyed () {
    const { stopAnimation } = this

    stopAnimation()
  }
}
</script>