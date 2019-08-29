<template>
  <div class="dv-border-box-10">
    <svg
      width="150px"
      height="150px"
      :key="item"
      v-for="item in border"
      :class="`${item} border`"
    >
      <polygon
        fill="#d3e1f8"
        points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DvBorderBox10',
  data () {
    return {
      border: ['left-top', 'right-top', 'left-bottom', 'right-bottom']
    }
  }
}
</script>