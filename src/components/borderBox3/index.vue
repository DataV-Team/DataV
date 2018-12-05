<template>
  <div class="border-box-3">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox3'
}
</script>

<style lang="less">
.border-box-3 {
  box-sizing: border-box;
  border-style: solid;
  border-image: url('./img/border.png') 17 24 18 19 fill;
  border-width: 24px;
}
</style>
