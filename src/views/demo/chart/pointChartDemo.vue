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
  data: [
    {
      data: [
        '', '',
        [280, 265, 240, 200, 180],...
      ]
    },
    {
      data: [
        '', '', '', '', '',
        '', '', '', '', '',
        [357, 222, 82, 355],...
      ]
    }
  ],
  x: {
    data: [ '', '',
      '西峡', '', '', '周口', '', '',
      '南阳', '', '', '驻马店', '', '',
      '郑州', '', '', '洛阳', '', ''
    ],
    grid: true,
    gridLineType: 'dashed',
    gridLineDash: [2, 2]
  },
  y: {
    min: 0,
    num: 6,
    max: 500
  }
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <point-chart :data="pointChartData2" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Point-Chart</div>
        <highlight-code>
&lt;point-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  data: [
    {
      data: ...,
      // 非必须 设置该项 点内部自动透明
      // 如果设置了fillColor 其应该为16进制色 否则无法进行透明计算
      opacity: 0.5
    },
    {
      data: ...,
      // 非必须 设置局部点半径
      radius: 5,
      // 非必须 设置边线颜色
      edgeColor: '#ff5ca9',
      // 非必须 设置点内部填充色
      fillColor: 'rgba(0, 186, 255, 0.5)'
    }
  ],
  // 非必须 设置全局点半径
  radius: 4
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
            data: [
              '', '',
              [280, 265, 240, 200, 180],
              [320, 200, 190, 255, 260],
              [330, 222, 190, 255, 270],
              [325, 260, 220, 190, 255],
              [300, 245, 215, 255, 270],
              [280, 250, 190, 255, 270]
            ]
          },
          {
            data: [
              '', '',
              '', '',
              '', '',
              '', '',
              '', '',
              [357, 222, 82, 355],
              [56, 25, 156],
              [70, 251, 425, 300, 278, 315],
              [79, 52, 40, 250, 160],
              [70, 251, 425, 300, 278, 315],
              [79, 52, 40, 180, 240],
              [79, 52, 40],
              [60, 56, 56],
              '', ''
            ]
          }
        ],
        x: {
          data: [ '', '',
            '西峡', '', '',
            '周口', '', '',
            '南阳', '', '',
            '驻马店', '', '',
            '郑州', '', '',
            '洛阳', '', ''
          ],
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2]
        },
        y: {
          min: 0,
          num: 6,
          max: 500
        },
        labelLine: {
          data: ['同期', '环期'],
          type: 'rectangle'
        }
      },

      pointChartData2: {
        data: [
          {
            data: [
              '', '',
              [280, 265, 240, 200, 180],
              [320, 200, 190, 255, 260],
              [330, 222, 190, 255, 270],
              [325, 260, 220, 190, 255],
              [300, 245, 215, 255, 270],
              [280, 250, 190, 255, 270]
            ],
            opacity: 0.5
          },
          {
            data: [
              '', '',
              '', '',
              '', '',
              '', '',
              '', '',
              [357, 222, 82, 355],
              [56, 25, 156],
              [70, 251, 425, 300, 278, 315],
              [79, 52, 40, 250, 160],
              [70, 251, 425, 300, 278, 315],
              [79, 52, 40, 180, 240],
              [79, 52, 40],
              [60, 56, 56],
              '', ''
            ],
            radius: 5,
            edgeColor: '#ff5ca9',
            fillColor: 'rgba(0, 186, 255, 0.5)'
          }
        ],
        x: {
          data: [ '', '',
            '西峡', '', '',
            '周口', '', '',
            '南阳', '', '',
            '驻马店', '', '',
            '郑州', '', '',
            '洛阳', '', ''
          ],
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2]
        },
        y: {
          min: 0,
          num: 6,
          max: 500
        },
        labelLine: {
          data: ['同期', '环期'],
          type: 'rectangle'
        },
        radius: 4
      },

      colors: ''
    }
  }
}
</script>

<style lang="less">

</style>
