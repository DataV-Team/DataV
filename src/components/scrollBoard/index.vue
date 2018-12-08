<template>
  <div class="scroll-board">

    <loading v-if="!data" />

    <template v-else>
      <div :class="`scroll-item ${item.index % 2 === 0 ? 'deep' : 'light'} ${fade && index === 0 && 'fade'}`"
        v-for="(item, index) in scrollData"
        :key="item.title + index"
        :style="`height: ${100 / (data.showItemNum || 5)}%`">
        <div class="index">{{ item.index }}</div>
        <div class="title">{{ item.title }}</div>
        <div class="info">{{ item.info }}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'scroll-board',
  props: ['data'],
  data () {
    return {
      dealAfterData: [],

      fade: false,
      scrollData: [],
      currentTopIndex: 0,

      autoScrollHandler: ''
    }
  },
  watch: {
    data () {
      const { init, autoScrollHandler } = this

      this.fade = false
      this.currentTopIndex = 0

      autoScrollHandler && clearTimeout(autoScrollHandler)

      init()
    }
  },
  methods: {
    init () {
      const { data, getDealAfterData, getCurrentScrollData } = this

      if (!data) return

      getDealAfterData()

      getCurrentScrollData()
    },
    getDealAfterData () {
      const { data: { data } } = this

      this.dealAfterData = data.map(({ title, info }, i) => ({ index: i + 1, title, info }))
    },
    getCurrentScrollData () {
      const { dealAfterData, data: { showItemNum }, currentTopIndex, doFade } = this

      if (dealAfterData.length < showItemNum) return

      const tempArray = dealAfterData.slice(currentTopIndex, currentTopIndex + showItemNum + 1)

      const appendNum = showItemNum - tempArray.length + 1

      tempArray.push(...dealAfterData.slice(0, appendNum))

      this.scrollData = tempArray

      this.autoScrollHandler = setTimeout(doFade, 1500)
    },
    doFade () {
      const { reGetCurrentScrollData } = this

      this.fade = true

      this.autoScrollHandler = setTimeout(reGetCurrentScrollData, 1500)
    },
    reGetCurrentScrollData () {
      const { getCurrentScrollData, dealAfterData, currentTopIndex } = this

      this.fade = false

      const tempNextIndex = currentTopIndex + 1

      this.currentTopIndex = (tempNextIndex === dealAfterData.length ? 0 : tempNextIndex)

      getCurrentScrollData()
    }
  },
  created () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.scroll-board {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .fade {
    height: 0% !important;
  }

  .deep {
    background-color: rgba(9, 37, 50, 0.4);
  }

  .light {
    background-color: rgba(10, 32, 50, 0.3);
  }

  .scroll-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 1s;
    overflow: hidden;

    .index {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      background-color: #00baff;
      margin-left: 10px;
    }

    .title {
      font-size: 12px;
      width: 25%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .info {
      font-size: 14px;
    }
  }
}
</style>
