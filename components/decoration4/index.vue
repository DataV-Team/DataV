<template>
  <div :class="`decoration-4 ${reverse ? 'reverse' : 'normal'}`" :ref="ref">
    <svg :class="`svg-container ${reverse ? 'ani-width' : 'ani-height'}`">
      <template v-if="!reverse">
        <polyline class="lighter-line" :points="`3, 5 3, ${height - 5}`" />
        <polyline class="bolder-line" :points="`3, 5 3, ${height - 5}`" />
      </template>

      <template v-else>
        <polyline class="lighter-line" :points="`5, 3 ${width - 5},3`" />
        <polyline class="bolder-line" :points="`5, 3 ${width - 5},3`" />

        <!-- <polyline class="lighter-line" :points="`5, 3 ${width - 5},3`" />
        <polyline class="bolder-line" :points="`5, 3 ${width - 5},3`" /> -->
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Decoration4',
  data () {
    return {
      ref: `decoration-4-${(new Date()).getTime()}`,
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
.decoration-4 {
  position: relative;

  &.normal {
    width: 6px;
  }

  &.reverse {
    height: 6px;
  }

  .svg-container {
    position: absolute;

    &.ani-height {
      width: 100%;
      height: 0%;
      animation: ani-height 3s ease-in-out infinite;
    }

    &.ani-width {
      width: 0%;
      height: 100%;
      animation: ani-width 3s ease-in-out infinite;
    }

    polyline {
      fill: none;
      stroke: fade(gray, 25);
    }
  }

  .lighter-line {
    stroke-width: 1px;
  }

  .bolder-line {
    stroke-width: 3px;
    stroke-dasharray: 20, 80;
    stroke-dashoffset: -30;
  }

  @keyframes ani-height {
    70% {
      height: 100%;
    }

    100% {
      height: 100%;
    }
  }

  @keyframes ani-width {
    70% {
      width: 100%;
    }

    100% {
      width: 100%;
    }
  }
}
</style>
