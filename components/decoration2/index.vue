<template>
  <div class="decoration-2" :ref="ref">
    <div :class="reverse ? 'reverse' : 'normal'" />
  </div>
</template>

<script>
export default {
  name: 'Decoration2',
  data () {
    return {
      ref: `decoration-2-${(new Date()).getTime()}`,
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
.decoration-2 {

  .reverse, .normal {
    background-color: #3faacb;
  }

  .normal {
    width: 0%;
    height: 1px;
    border-right: 1px solid #fff;
    animation: normal-amt 6s ease-in-out infinite;
  }

  .reverse {
    width: 1px;
    height: 0%;
    border-bottom: 1px solid #fff;
    animation: reverse-amt 6s ease-in-out infinite;
  }

  @keyframes reverse-amt {
    70% {
      height: 100%;
    }

    100% {
      height: 100%;
    }
  }

  @keyframes normal-amt {
    70% {
      width: 100%;
    }

    100% {
      width: 100%;
    }
  }
}
</style>
