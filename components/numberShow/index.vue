<template>
  <div class="number-show">
    <div class="number-itme" v-for="(n, i) in number.toString()" :key="`${n}-${i}`">
      {{ n }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberShow',
  props: ['number']
}
</script>

<style lang="less">
.number-show {
  display: inline-block;

  .number-itme {
    display: inline-block;
    height: 70px;
    padding: 0 20px;
    line-height: 70px;
    text-align: center;
    background-color: rgba(4, 49, 128, 0.6);
    margin-right: 20px;
    color: rgb(8, 229, 255);
    font-weight: bold;
    font-size: 45px;
  }
}
</style>
