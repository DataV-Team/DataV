<template>
  <div class="for-slot">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ForSlot'
}
</script>

<style lang="less">
.for-slot {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}
</style>
