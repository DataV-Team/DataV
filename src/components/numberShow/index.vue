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
@import url('../../assets/style/index.less');

.number-show {
  display: inline-block;

  .number-itme {
    display: inline-block;
    height: 70px;
    padding: 0 20px;
    line-height: 70px;
    text-align: center;
    background-color: @NSIBC;
    margin-right: 20px;
    color: @NSINC;
    font-weight: bold;
    font-size: @NSIFS;
  }
}
</style>
