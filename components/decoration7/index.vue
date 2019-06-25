<template>
  <div class="dv-decoration-7">
    <svg width="21px" height="20px">
      <polyline
        stroke-width="4"
        fill="transparent"
        stroke="#1dc1f5"
        points="10, 0 19, 10 10, 20"
      />
      <polyline
        stroke-width="2"
        fill="transparent"
        stroke="#1dc1f5"
        points="2, 0 11, 10 2, 20"
      />
    </svg>
    <slot></slot>
    <svg width="21px" height="20px">
      <polyline
        stroke-width="4"
        fill="transparent"
        stroke="#1dc1f5"
        points="11, 0 2, 10 11, 20"
      />
      <polyline
        stroke-width="2"
        fill="transparent"
        stroke="#1dc1f5"
        points="19, 0 10, 10 19, 20"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Decoration7'
}
</script>

<style lang="less">
.dv-decoration-7 {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
