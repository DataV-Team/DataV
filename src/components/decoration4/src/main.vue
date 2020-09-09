<template>
  <div class="dv-decoration-4" :ref="ref">
    <div
      :class="`container ${reverse ? 'reverse' : 'normal'}`"
      :style="reverse ? `width:${width}px;height:5px;animation-duration:${dur}s` : `width:5px;height:${height}px;animation-duration:${dur}s`"
    >
      <svg :width="reverse ? width : 5" :height="reverse ? 5 : height">
        <polyline
          :stroke="mergedColor[0]"
          :points="reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`"
        />
        <polyline
          class="bold-line"
          :stroke="mergedColor[1]"
          stroke-width="3"
          stroke-dasharray="20, 80"
          stroke-dashoffset="-30"
          :points="reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import autoResize from '../../../mixin/autoResize'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'

import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

export default {
  name: 'DvDecoration4',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    reverse: {
      type: Boolean,
      default: false
    },
    dur: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      ref: 'decoration-4',

      defaultColor: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)'],

      mergedColor: []
    }
  },
  watch: {
    color () {
      const { mergeColor } = this

      mergeColor()
    }
  },
  methods: {
    mergeColor () {
      const { color, defaultColor } = this

      this.mergedColor = deepMerge(deepClone(defaultColor, true), color || [])
    }
  },
  mounted () {
    const { mergeColor } = this

    mergeColor()
  }
}
</script>

<style lang="less">
.dv-decoration-4 {
  position: relative;
  width: 100%;
  height: 100%;

  .container {
    display: flex;
    overflow: hidden;
    position: absolute;
    flex: 1;
  }

  .normal {
    animation: ani-height ease-in-out infinite;
    left: 50%;
    margin-left: -2px;
  }

  .reverse {
    animation: ani-width ease-in-out infinite;
    top: 50%;
    margin-top: -2px;
  }

  @keyframes ani-height {
    0% {
      height: 0%;
    }

    70% {
      height: 100%;
    }

    100% {
      height: 100%;
    }
  }

  @keyframes ani-width {
    0% {
      width: 0%;
    }
    
    70% {
      width: 100%;
    }

    100% {
      width: 100%;
    }
  }
}
</style>
