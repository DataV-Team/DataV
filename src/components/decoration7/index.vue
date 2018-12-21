<template>
  <div class="decoration-7">
    <img src="./img/decoration.png" />
    <slot></slot>
    <img class="reverse" src="./img/decoration.png" />
  </div>
</template>

<script>
export default {
  name: 'Decoration7'
}
</script>

<style lang="less">
.decoration-7 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .reverse {
    transform: rotate(180deg);
  }
}
</style>
