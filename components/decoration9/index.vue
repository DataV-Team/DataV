<template>
  <div class="dv-decoration-9" :ref="ref">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">
      <defs>
        <polygon :id="polygonId" points="15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5" />
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        stroke="rgba(3, 166, 224, 0.5)"
        stroke-width="10"
        stroke-dasharray="80, 100, 30, 100"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        stroke="rgba(3, 166, 224, 0.8)"
        stroke-width="6"
        stroke-dasharray="50, 66, 100, 66"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;-360 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="38"
        fill="transparent"
        stroke="rgba(3, 166, 224, 0.2)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />

      <use
        v-for="(foo, i) in new Array(20).fill(0)"
        :key="i"
        :xlink:href="`#${polygonId}`"
        stroke="rgba(3, 166, 224, 0.6)"
        :fill="Math.random() > 0.4 ? 'transparent' : 'rgba(3, 166, 224, 0.8)'"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          dur="3s"
          :begin="`${i * 0.15}s`"
          repeatCount="indefinite"
        />
      </use>

      <circle
        cx="50"
        cy="50"
        r="26"
        fill="transparent"
        stroke="rgba(3, 166, 224, 0.2)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />
    </svg>

    <slot></slot>
  </div>
</template>

<script>
import autoResize from '../../mixins/autoResize.js'

export default {
  name: 'Decoration9',
  mixins: [autoResize],
  data () {
    return {
      ref: 'decoration-9',

      polygonId: `decoration-9-polygon-${(new Date()).getTime()}`,

      svgWH: [100, 100],

      svgScale: [1, 1]
    }
  },
  methods: {
    afterAutoResizeMixinInit () {
      const { calcScale } = this

      calcScale()
    },
    calcScale () {
      const { width, height, svgWH } = this

      const [w, h] = svgWH

      this.svgScale = [width / w, height / h]
    },
    onResize () {
      const { calcScale } = this

      calcScale()
    }
  }
}
</script>

<style lang="less">
.dv-decoration-9 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    position: absolute;
    left: 0px;
    top: 0px;
    transform-origin: left top;
  }
}
</style>
