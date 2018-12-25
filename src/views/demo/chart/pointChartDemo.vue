<template>
  <div>
    <border-box-7 class="chart-item">
      <point-chart :data="pointChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Point-Chart</div>
        <highlight-code>
&lt;point-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
data: {
}
        </highlight-code>
      </div>
    </border-box-7>

    <div id="radar-chart" />
  </div>
</template>

<script>
export default {
  name: 'PointChartDemo',
  data () {
    return {
      pointChartData1: {
        data: [
          {
            data: [123, 156, 290, 400, 169, 435]
          },
          {
            data: [
              [230, 123, 56],
              [111, 22, 66],
              [56, 25, 156],
              [79, 52, 40],
              [60, 56, 56],
              [23, 45, 78]
            ]
          },
          {
            data: [15, 20, 27, 35, 27, 17],
            againstAxis: true
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
        },
        ax: {
        },
        ay: {
        }
      },

      colors: ''
    }
  }
}
</script>

<style lang="less">

</style>
