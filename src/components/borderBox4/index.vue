<template>
  <div class="border-box-4" :ref="ref">
    <svg :class="`border-svg-container ${reverse && 'reverse'}`">
      <polyline class="line-1" :points="`145, ${height - 5} 40, ${height - 5} 10, ${height - 35}
        10, 40 40, 5 150, 5 170, 20 ${width - 15}, 20`"/>
      <polyline class="line-2" :points="`245, ${height - 1} 36, ${height - 1} 14, ${height - 23}
        14, ${height - 100}`" />
      <polyline class="line-3" :points="`7, ${height - 40} 7, ${height - 75}`" />
      <polyline class="line-4" :points="`28, 24 13, 41 13, 64`" />
      <polyline class="line-5" :points="`5, 45 5, 140`" />
      <polyline class="line-6" :points="`14, 75 14, 180`" />
      <polyline class="line-7" :points="`55, 11 147, 11 167, 26 250, 26`" />
      <polyline class="line-8" :points="`158, 5 173, 16`" />
      <polyline class="line-9" :points="`200, 17 ${width - 10}, 17`" />
      <polyline class="line-10" :points="`385, 17 ${width - 10}, 17`" />
    </svg>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox4',
  data () {
    return {
      ref: `border-box-4-${(new Date()).getTime()}`,
      width: 0,
      height: 0
    }
  },
  props: ['reverse'],
  methods: {
    init () {
      const { $nextTick, $refs, ref } = this

      $nextTick(e => {
        this.width = $refs[ref].clientWidth
        this.height = $refs[ref].clientHeight
      })
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less" scoped>
.border-box-4 {
  position: relative;
  box-sizing: border-box;
  padding: 30px;

  .reverse {
    transform: rotate(180deg);
  }

  .border-svg-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;

    polyline {
      fill: none;
    }
  }

  .sred {
    stroke: red;
  }

  .sblue {
    stroke: fade(blue, 80);
  }

  .sw1 {
    stroke-width: 1;
  }

  .sw3 {
    stroke-width: 3px;
    stroke-linecap: round;
  }

  .line-1 {
    .sred;
    .sw1;
  }

  .line-2 {
    .sblue;
    .sw1;
  }

  .line-3 {
    .sred;
    .sw3;
  }

  .line-4 {
    .sred;
    .sw3;
  }

  .line-5 {
    .sred;
    .sw1;
  }

  .line-6 {
    .sblue;
    .sw1;
  }

  .line-7 {
    .sblue;
    .sw1;
  }

  .line-8 {
    .sblue;
    .sw3;
  }

  .line-9 {
    .sred;
    .sw3;
    stroke-dasharray: 100 250;
  }

  .line-10 {
    .sblue;
    .sw1;
    stroke-dasharray: 80 270;
  }
}
</style>
