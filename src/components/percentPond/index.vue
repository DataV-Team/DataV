<template>
  <div class="percent-pond">
    <div class="percent-text">
      <span :style="`margin-left: ${percent * (width - 2) / 100 + 6}px`">{{ percent || 0 }}%</span>
    </div>

    <div class="percent-container">
      <div class="p-decoration-box" />
      <div class="p-svg-container" :ref="ref">
        <svg :width="width" :height="height">
          <defs>
            <linearGradient id="linear">
              <stop v-for="lc in linearGradient" :key="lc[0]"
                :offset="lc[0]"
                :stop-color="lc[1]" />
            </linearGradient>
          </defs>

          <polyline :stroke-width="height - 1"
            stroke="url(#linear)"
            :points="`1, ${height * 0.5} ${percent * (width - 2) / 100}, ${height * 0.5 + 0.0001}`" />
        </svg>
      </div>
      <div class="p-decoration-box" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PercentPond',
  props: ['percent', 'colors'],
  data () {
    return {
      ref: `percent-pond-${(new Date()).getTime()}`,
      width: 0,
      height: 0,

      defaultColor: ['#00BAFF', '#3DE7C9'],

      linearGradient: []
    }
  },
  watch: {
    colors () {
      const { calcLinearColor } = this

      calcLinearColor()
    }
  },
  methods: {
    init () {
      const { $nextTick, $refs, ref, calcLinearColor } = this

      $nextTick(e => {
        this.width = $refs[ref].clientWidth
        this.height = $refs[ref].clientHeight
      })

      calcLinearColor()
    },
    calcLinearColor () {
      const { colors, defaultColor } = this

      let trueColor = colors || defaultColor

      typeof trueColor === 'string' && (trueColor = [trueColor, trueColor])

      const colorNum = trueColor.length

      const colorOffsetGap = 100 / (colorNum - 1)

      this.linearGradient = trueColor.map((c, i) => [colorOffsetGap * i, c])
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.percent-pond {
  display: flex;
  flex-direction: column;

  .percent-text {
    height: 30px;
    font-size: 15px;
    flex-shrink: 0;

    span {
      position: relative;
      box-shadow: 0 0 3px gray;
      padding: 0px 5px;
      display: inline-block;
      transform: translateX(-50%);

      &::after {
        position: absolute;
        display: block;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 0px;
        height: 0px;
        border-width: 8px;
        border-style: solid;
        border-color: fade(gray, 50) transparent transparent transparent;
      }
    }
  }

  .percent-container {
    flex: 1;
    display: flex;
    flex-direction: row;

    .p-decoration-box {
      width: 3px;
      flex-shrink: 0;
      box-shadow: 0 0 3px gray;
    }

    .p-svg-container {
      flex: 1;
      margin: 0px 3px;
      box-shadow: 0 0 3px gray;

      polyline {
        fill: none;
        stroke-dasharray: 5, 1;
      }
    }
  }
}
</style>
