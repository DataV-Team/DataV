<template>
  <div class="border-box-2">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox2'
}
</script>

<style lang="less">
.border-box-2 {
  box-sizing: border-box;
  border-style: solid;
  border-image: url('./img/border.png') 14 fill;
  border-width: 14px;
}
</style>
