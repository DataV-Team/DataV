<template>
  <div class="label-line">
    <div class="label-item"
      v-for="(labelItem, i) in label"
      :key="labelItem">
      <div :style="`background-color: ${colors[i % colors.length]};`"></div>
      <div>{{ labelItem }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabelLine',
  props: ['label', 'colors']
}
</script>

<style lang="less">
.label-line {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 10px;

  .label-item {
    height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 5px 5px 5px;

    :nth-child(1) {
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
</style>
