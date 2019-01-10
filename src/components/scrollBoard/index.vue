<template>
  <div class="scroll-board" :ref="ref">

    <loading v-if="!data" />

    <template v-else>
      <div class="title-container"
        v-if="titleData"
        :style="`background-color:${titleTrueBG};`">
        <div :class="`title-item ${textTrueAlign[ti]}`"
          v-for="(title, ti) in titleData" :key="title + ti"
          :style="`width: ${columnTrueWidth[ti]};`">
          {{ title }}
        </div>
      </div>

      <div class="row-container">
        <div :class="`row-item ${row.fade && 'fade'}`"
          :style="`height: ${rowHeight}%;background-color:${row.index % 2 === 0 ? evenTrueBG : oddTrueBG};`"
          v-for="(row, ri) in scrollData"
          :key="row.data + ri">

          <div :class="`row-item-info ${textTrueAlign[ii]}`"
            v-for="(info, ii) in row.data"
            :key="info + Math.random()">

            <div @click="emitClickEvent(row, ii)" :class="`rii-width ${ii === 0 && index && 'index-container'}`" :style="`width: ${columnTrueWidth[ii]};`">
              <template v-if="ii === 0 && index">
                <div class="index" :style="`background-color:${titleTrueBG};`">{{ info }}</div>
              </template>

              <span v-else v-html="info" />
            </div>

          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'scroll-board',
  props: ['data', 'index', 'html', 'rowNum', 'titleBG', 'waitTime', 'oddBG', 'evenBG', 'columnWidth', 'textAlign', 'carousel'],
  data () {
    return {
      ref: `scroll-board-${(new Date()).getTime()}`,
      container: '',
      containerWH: [],

      reAnimationTimer: '',
      doFadeTimer: '',

      defaultRowNum: 5,
      defaultTitleBG: '#00BAFF',
      defaultOddBG: '#003B51',
      defaultEvenBG: '#0A2732',

      defaultWaitTime: 2000,

      rowTrueNum: '',
      rowHeight: '',
      titleTrueBG: '',
      oddTrueBG: '',
      evenTrueBG: '',
      columnTrueWidth: [],
      textTrueAlign: [],

      currentIndex: 0,

      allRowNum: 0,
      allColumnNum: 0,
      titleData: '',
      allRowData: [],
      scrollData: []
    }
  },
  watch: {
    data (d) {
      const { init } = this

      d && init()
    }
  },
  methods: {
    init () {
      const { data, initDom, stopAnimation, dealData, calcConfig, getCurrentScrollData } = this

      initDom()

      if (!data) return

      stopAnimation()

      dealData()

      calcConfig()

      getCurrentScrollData(true)
    },
    initDom () {
      const { $refs, ref } = this

      const container = this.container = $refs[ref]

      this.containerWH[0] = container.clientWidth
      this.containerWH[1] = container.clientHeight
    },
    dealData () {
      const { data: { data, title }, index, deepClone } = this

      if (title) (this.titleData = index ? ['', ...title] : [...title])

      this.allRowData = deepClone(data).map((row, i) =>
        ({ index: i + 1, data: index ? [i + 1, ...row] : row }))
    },
    calcConfig () {
      const { calcAllRowColumnNum, calcRowNum, calcRowHeight } = this

      calcAllRowColumnNum()

      calcRowNum()

      calcRowHeight()

      const { calcTitleBG, oddAndEvenRowBG, calcColumnWidth } = this

      calcTitleBG()

      oddAndEvenRowBG()

      calcColumnWidth()

      const { calcTextAlign } = this

      calcTextAlign()
    },
    calcAllRowColumnNum () {
      const { data: { data }, index } = this

      this.allRowNum = data.length

      this.allColumnNum = data[0].length + (index ? 1 : 0)
    },
    calcRowNum () {
      const { rowNum, defaultRowNum } = this

      this.rowTrueNum = parseInt(rowNum || defaultRowNum)
    },
    calcRowHeight () {
      const { rowTrueNum } = this

      this.rowHeight = 100 / rowTrueNum
    },
    calcTitleBG () {
      const { titleBG, defaultTitleBG } = this

      this.titleTrueBG = titleBG || defaultTitleBG
    },
    oddAndEvenRowBG () {
      const { oddBG, evenBG, defaultOddBG, defaultEvenBG } = this

      this.oddTrueBG = oddBG || defaultOddBG
      this.evenTrueBG = evenBG || defaultEvenBG
    },
    calcColumnWidth () {
      const { columnWidth, allColumnNum, filterNull, multipleSum, containerWH: [allWidth] } = this

      const userSetColumnWidth = columnWidth || []

      const setColumnData = filterNull(userSetColumnWidth)

      const useWidth = multipleSum(...setColumnData.map(w => parseInt(w)))

      const avgNum = allColumnNum - setColumnData.length

      const avgWidth = (allWidth - useWidth) / avgNum + 'px'

      this.columnTrueWidth = new Array(allColumnNum).fill(0).map((t, i) =>
        userSetColumnWidth[i] ? `${userSetColumnWidth[i]}px` : avgWidth)
    },
    calcTextAlign () {
      const { textAlign, allColumnNum, index } = this

      const userSetTextAlign = textAlign || []

      const textTrueAlign = new Array(allColumnNum).fill('left').map((d, i) =>
        userSetTextAlign[i] || d)

      index && textTrueAlign.unshift('')

      this.textTrueAlign = textTrueAlign
    },
    getCurrentScrollData (init = false) {
      init && (this.currentIndex = 0)

      const { currentIndex, rowTrueNum, allRowData, deepClone, carousel } = this

      let dealAfterRowData = deepClone(allRowData).map(row => ({ ...row, fade: false }))

      if (init && allRowData.length < rowTrueNum) {
        this.scrollData = dealAfterRowData

        return
      }

      const needNum = carousel === 'page' ? rowTrueNum * 2 : rowTrueNum + 1

      const tempScrollData = dealAfterRowData.slice(currentIndex, currentIndex + needNum)

      let stillNum = needNum - tempScrollData.length

      while (stillNum) {
        tempScrollData.push(...deepClone(dealAfterRowData).slice(0, stillNum))

        stillNum = needNum - tempScrollData.length
      }

      this.scrollData = tempScrollData

      const { doFade, waitTime, defaultWaitTime } = this

      this.doFadeTimer = setTimeout(doFade, waitTime || defaultWaitTime)
    },
    doFade () {
      const { rowTrueNum, carousel, scrollData, allRowNum, currentIndex } = this

      if (carousel === 'page') {
        scrollData.forEach((item, i) => i < rowTrueNum && (item.fade = true))

        const tempIndex = currentIndex + rowTrueNum

        const minus = tempIndex - allRowNum

        this.currentIndex = minus >= 0 ? minus : tempIndex
      } else {
        scrollData[0].fade = true

        this.currentIndex = currentIndex + 1 === allRowNum ? 0 : currentIndex + 1
      }

      const { getCurrentScrollData } = this

      this.reAnimationTimer = setTimeout(getCurrentScrollData, 1000)
    },
    emitClickEvent ({ data, index }, columnIndex) {
      this.$emit('click', { data, rowIndex: index, columnIndex: columnIndex + 1 })
    },
    stopAnimation () {
      const { reAnimationTimer, doFadeTimer } = this

      reAnimationTimer && clearTimeout(reAnimationTimer)
      doFadeTimer && clearTimeout(doFadeTimer)
    }
  },
  mounted () {
    const { init } = this

    init()
  },
  destroyed () {
    const { stopAnimation } = this

    stopAnimation()
  }
}
</script>

<style lang="less">
.scroll-board {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .title-container {
    height: 35px;
    font-size: 14px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
  }

  .title-item {
    display: flex;
    align-items: center;

    &.left {
      justify-content: flex-start;
    }

    &.right {
      justify-content: flex-end;
    }

    &.center {
      justify-content: center;
    }
  }

  .row-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .row-item {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    transition: all 0.5s;
    overflow: hidden;

    &.fade {
      height: 0% !important;
      color: transparent;
      visibility: hidden;
    }
  }

  .row-item-info {
    position: relative;
    display: flex;
    vertical-align: middle;
    align-items: center;
    vertical-align:middle;
    font-size: 13px;

    &.left {
      text-align: left;
    }

    &.right {
      text-align: right;
    }

    &.center {
      text-align: center;
    }
  }

  .rii-width {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .index-container {
    display: flex;
    justify-content: center;
  }

  .index {
    font-size: 12px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
