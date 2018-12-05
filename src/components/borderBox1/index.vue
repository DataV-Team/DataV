<template>
  <div class="border-box-1">
    <img class="flash-left-top" src="./img/border.gif">
    <img class="flash-right-top" src="./img/border.gif">
    <img class="flash-left-bottom" src="./img/border.gif">
    <img class="flash-right-bottom" src="./img/border.gif">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox1'
}
</script>

<style lang="less">
.border-box-1 {
  position: relative;
  box-sizing: border-box;
  min-width: 300px;
  min-height: 300px;
  padding: 35px;
  overflow: hidden;

  .flash-left-top, .flash-right-top, .flash-left-bottom, .flash-right-bottom {
    position: absolute;
    width: 250px;
  }

  .flash-left-top {
    top: 0px;
    left: -70px;
  }

  .flash-right-top {
    top: 0px;
    right: -70px;
    transform: rotateY(180deg);
  }

  .flash-left-bottom {
    bottom: 0px;
    left: -70px;
    transform: rotateX(180deg);
  }

  .flash-right-bottom {
    bottom: 0px;
    right: -70px;
    transform: rotate(180deg);
  }
}
</style>
