<template>
  <div class="border-box-5" :ref="ref">
    <svg :class="`svg-container  ${reverse && 'reverse'}`">
      <polyline class="line-1" :points="`8, 5 ${width - 5}, 5 ${width - 5}, ${height - 100}
        ${width - 100}, ${height - 5} 8, ${height - 5} 8, 5`" />
      <polyline class="line-2" :points="`3, 5 ${width - 20}, 5 ${width - 20}, ${height - 60}
        ${width - 74}, ${height - 5} 3, ${height - 5} 3, 5`" />
      <polyline class="line-3" :points="`50, 13 ${width - 35}, 13`" />
      <polyline class="line-4" :points="`15, 20 ${width - 35}, 20`" />
      <polyline class="line-5" :points="`15, ${height - 20} ${width - 110}, ${height - 20}`" />
      <polyline class="line-6" :points="`15, ${height - 13} ${width - 110}, ${height - 13}`" />
    </svg>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox5',
  data () {
    return {
      ref: `border-box-5-${(new Date()).getTime()}`,
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

<style lang="less">
.border-box-5 {
  position: relative;
  box-sizing: border-box;
  padding: 20px;

  .reverse {
    transform: rotate(180deg);
  }

  .svg-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    polyline {
      fill: none;
    }
  }

  .line-1 {
    stroke-width: 1;
    stroke: fade(#fff, 35);
  }

  .line-2 {
    stroke: fade(#fff, 20);
  }

  .line-3, .line-6 {
    stroke-width: 5;
    stroke: fade(#fff, 15);
  }

  .line-4, .line-5 {
    stroke-width: 2;
    stroke: fade(#fff, 15);
  }

}
</style>
