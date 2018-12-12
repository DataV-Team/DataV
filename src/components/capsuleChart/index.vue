<template>
  <div class="capsule-chart">

    <loading v-if="!data" />

    <template v-else>
      <div class="label-column">
        <div v-for="item in data.data" :key="item.title">{{ item.title }}</div>
        <div>&nbsp;</div>
      </div>

      <div class="capsule-container">
        <div class="capsule-item" v-for="(capsule, index) in capsuleData" :key="index">
          <div :style="`width: ${capsule * 100}%; background-color: ${data.color[index % data.data.length]};`"></div>
        </div>
        <div class="unit-label">
          <div class="unit-container">
            <div v-for="(unit, index) in unitData" :key="unit + index">{{ unit }}</div>
          </div>
          <div class="unit-text">单位</div>
        </div>
      </div>

      <div class="for-solt">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CapsuleChart',
  props: ['data'],
  data () {
    return {
      capsuleData: [],
      unitData: []
    }
  },
  watch: {
    data () {
      const { init } = this

      init()
    }
  },
  methods: {
    init () {
      const { data, calcCapsuleAndUnitData } = this

      if (!data) return

      calcCapsuleAndUnitData()
    },
    calcCapsuleAndUnitData () {
      const { data: { data } } = this

      const capsuleData = data.map(({ value }) => value)

      const maxValue = Math.max(...capsuleData)

      this.capsuleData = capsuleData.map(v => maxValue ? v / maxValue : 0)

      const oneSixth = maxValue / 5

      this.unitData = new Array(6).fill(0).map((v, i) => Math.ceil(i * oneSixth))
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.capsule-chart {
  position: relative;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 10px;

  .label-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 10px;
    text-align: right;
    font-size: 12px;

    div {
      height: 20px;
      line-height: 20px;
    }
  }

  .capsule-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .capsule-item {
    box-shadow: 0 0 3px #999;
    height: 10px;
    margin: 5px 0px;
    border-radius: 5px;
    width: calc(~"100% - 50px");

    div {
      height: 8px;
      margin-top: 1px;
      border-radius: 5px;
      transition: all 0.3s;
    }
  }

  .unit-label {
    display: flex;
    flex-direction: row;
    line-height: 20px;
    font-size: 12px;
  }

  .unit-text {
    width: 40px;
    text-align: right;
  }

  .unit-container {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .for-solt {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
}
</style>
