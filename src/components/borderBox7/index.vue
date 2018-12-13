<template>
  <div class="border-box-7" :ref="ref">
    <svg class="svg-container">
      <polyline class="line-width-2" :points="`0, 25 0, 0 25, 0`" />
      <polyline class="line-width-2" :points="`${width - 25}, 0 ${width}, 0 ${width}, 25`" />
      <polyline class="line-width-2" :points="`${width - 25}, ${height} ${width}, ${height} ${width}, ${height - 25}`" />
      <polyline class="line-width-2" :points="`0, ${height - 25} 0, ${height} 25, ${height}`" />

      <polyline class="line-width-5" :points="`0, 10 0, 0 10, 0`" />
      <polyline class="line-width-5" :points="`${width - 10}, 0 ${width}, 0 ${width}, 10`" />
      <polyline class="line-width-5" :points="`${width - 10}, ${height} ${width}, ${height} ${width}, ${height - 10}`" />
      <polyline class="line-width-5" :points="`0, ${height - 10} 0, ${height} 10, ${height}`" />
    </svg>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox7',
  data () {
    return {
      ref: `border-box-7-${(new Date()).getTime()}`,
      width: 0,
      height: 0
    }
  },
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
@color: fade(gray, 30);

.border-box-7 {
  position: relative;
  box-shadow: inset 0 0 40px fade(@color, 30);
  box-sizing: border-box;
  border: 1px solid @color;
  padding: 10px;

  .svg-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    polyline {
      fill: none;
      stroke-linecap: round;
    }
  }

  .line-width-2 {
    stroke: @color;
    stroke-width: 2;
  }

  .line-width-5 {
    stroke: fade(gray, 50);
    stroke-width: 5;
  }
}
</style>
