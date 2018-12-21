<template>
  <div class="label-line">
    <div class="label-item"
      v-for="(labelItem, i) in labelData"
      :key="labelItem">
      <div :class="type" :style="`background-color: ${labelColor[i % labelColorNum]};`"></div>
      <div>{{ labelItem }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabelLine',
  props: ['label', 'colors'],
  data () {
    return {
      labelData: [],
      labelColor: [],
      labelColorNum: 0,
      type: 'rect'
    }
  },
  watch: {
    label () {
      const { init } = this

      init()
    },
    colors () {
      const { init } = this

      init()
    }
  },
  methods: {
    init () {
      const { label, colors } = this

      if (!label) return

      const { data, color, type } = label

      if (!data) return

      this.labelData = data

      let trueColor = color || colors

      typeof trueColor === 'string' && (trueColor = [trueColor])

      this.labelColor = trueColor

      this.labelColorNum = trueColor.length

      this.type = type || 'rect'
    }
  },
  mounted () {
    const { init } = this

    init()
  }
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
  }

  .rect {
    width: 10px;
    height: 10px;
    margin-right: 5px;
  }

  .rectangle {
    width: 30px;
    height: 10px;
    margin-right: 5px;
  }
}
</style>
