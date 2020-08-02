<template>
  <div class="dv-scroll-ranking-board" :ref="ref">
    <div
      class="row-item"
      v-for="(item, i) in rows"
      :key="item.toString() + item.scroll"
      :style="`height: ${heights[i]}px;`"
    >
      <div class="ranking-info">
        <div class="rank">No.{{ item.ranking }}</div>
        <div class="info-name" v-html="item.name" />
        <div class="ranking-value">{{ item.value + mergedConfig.unit }}</div>
      </div>

      <div class="ranking-column">
        <div
          class="inside-column"
          :style="`width: ${item.percent}%;`"
        >
          <div class="shine" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default { 
  name: 'DvScrollRankingBoard',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ref: 'scroll-ranking-board',

      defaultConfig: {
        /**
         * @description Board data
         * @type {Array<Object>}
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
         * @description Scroll wait time
         * @type {Number}
         * @default waitTime = 2000
         */
        waitTime: 2000,
        /**
         * @description Carousel type
         * @type {String}
         * @default carousel = 'single'
         * @example carousel = 'single' | 'page'
         */
        carousel: 'single',
        /**
         * @description Value unit
         * @type {String}
         * @default unit = ''
         * @example unit = 'ton'
         */
        unit: '',
        /**
         * @description Auto sort by value
         * @type {Boolean}
         * @default sort = true
         */
        sort: true
      },

      mergedConfig: null,

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

      heights: [],

      animationIndex: 0,

      animationHandler: '',

      updater: 0
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
      const { mergedConfig, calcHeights } = this

      if (!mergedConfig) return

      calcHeights(true)
    },
    calcData () {
      const { mergeConfig, calcRowsData } = this

      mergeConfig()

      calcRowsData()

      const { calcHeights } = this

      calcHeights()

      const { animation } = this

      animation(true)
    },
    mergeConfig () {
      let { config, defaultConfig } = this

      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    },
    calcRowsData () {
      let { data, rowNum, sort } = this.mergedConfig

      sort && data.sort(({ value: a }, { value: b }) => {
        if (a > b) return -1
        if (a < b) return 1
        if (a === b) return 0
      })

      const value = data.map(({ value }) => value)
      
      const min = Math.min(...value) || 0

      // abs of min
      const minAbs = Math.abs(min)

      const max = Math.max(...value) || 0

      // abs of max
      const maxAbs = Math.abs(max)

      const total = max + minAbs

      data = data.map((row, i) => ({ ...row, ranking: i + 1, percent: (row.value + minAbs) / total * 100 }))

      const rowLength = data.length

      if (rowLength > rowNum && rowLength < 2 * rowNum) {
        data = [...data, ...data]
      }

      data = data.map((d, i) => ({ ...d, scroll: i }))

      this.rowsData = data
      this.rowsDataIndexs = this.splitBlockIndexs(data, rowNum * 5)
      this.rows = data
    },
    calcHeights (onresize = false) {
      const { height, mergedConfig } = this

      const { rowNum, data } = mergedConfig

      const avgHeight = height / rowNum

      this.avgHeight = avgHeight

      if (!onresize) this.heights = new Array(data.length).fill(avgHeight)
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

<style lang="less">
@color: #1370fb;

.dv-scroll-ranking-board {
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: hidden;

  .row-item {
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  .ranking-info {
    display: flex;
    width: 100%;
    font-size: 13px;

    .rank {
      width: 40px;
      color: @color;
    }

    .info-name {
      flex: 1;
    }
  }

  .ranking-column {
    border-bottom: 2px solid fade(@color, 50)
    margin-top: 5px;

    .inside-column {
      position: relative;
      height: 6px;
      background-color: @color;
      margin-bottom: 2px;
      border-radius: 1px;
      overflow: hidden;
    }

    .shine {
      position: absolute;
      left: 0%;
      top: 2px;
      height: 2px;
      width: 50px;
      transform: translateX(-100%)
      background: radial-gradient(rgb(40, 248, 255) 5%, transparent 80%)
      animation: shine 3s ease-in-out infinite alternate;
    }
  }
}

@keyframes shine {
  80% {
    left: 0%;
    transform: translateX(-100%)
  }

  100% {
    left: 100%;
    transform: translateX(0%)
  }
}
</style>
