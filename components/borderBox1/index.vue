<template>
  <div class="dv-border-box-1">
    <img class="dv-flash-left-top" src="./img/border.gif">
    <img class="dv-flash-right-top" src="./img/border.gif">
    <img class="dv-flash-left-bottom" src="./img/border.gif">
    <img class="dv-flash-right-bottom" src="./img/border.gif">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BorderBox1'
}
</script>

<style lang="less">
.dv-border-box-1 {
  position: relative;
  box-sizing: border-box;
  min-width: 300px;
  min-height: 300px;
  padding: 35px;
  overflow: hidden;

  .dv-flash-left-top, .dv-flash-right-top, .dv-flash-left-bottom, .dv-flash-right-bottom {
    position: absolute;
    width: 250px;
  }

  .dv-flash-left-top {
    top: 0px;
    left: -70px;
  }

  .dv-flash-right-top {
    top: 0px;
    right: -70px;
    transform: rotateY(180deg);
  }

  .dv-flash-left-bottom {
    bottom: 0px;
    left: -70px;
    transform: rotateX(180deg);
  }

  .dv-flash-right-bottom {
    bottom: 0px;
    right: -70px;
    transform: rotate(180deg);
  }
}
</style>
