<template>
  <div>
    <border-box-7 class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Polyline-chart</div>

        <highlight-code>
&lt;polyline-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 折线图与柱状图折线部分相似
data: [
  {
    data: [32, 30, 55, 24, 33, 25],
    lineColor: '#3de7c9'
  }
],
x: {
  data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
},
showValueText: true,
// 非必需 数值展示位置偏移量
valueTextOffset: [10, -5]
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <polyline-chart :data="polylineChartData2" class="chart" />

      <div class="config-info">
        <div class="title">Polyline-chart</div>

        <highlight-code>
&lt;polyline-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      data: [
        99.81, 99.42, 99.56, 99.23, 99.62,
        99.36, 99.56, '', 99.81, 99.56, ...
      ],
      lineType: 'dashed',
      lineDash: [2, 2],
      lineColor: '#277dfb',
      pointColor: '#3de7c9',
      fillColor: ['rgba(40, 125, 252, 0.3)', 'rgba(40, 125, 252, 0)']
    },
    {
      data: [
        97.81, 97.42, 97.56, 97.23, 97.62,
        97.36, 97.56, '', 97.81, 97.56, ...
      ],
      fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)'],
      type: 'smoothline'
    }
  ],
  x: {
    data: [
      '10/01', '', '10/03', '', '10/05', '',
      '10/07', '', '10/09', '', '10/11', '', ...
    ]
  },
  y: {
    min: 96,
    max: 100,
    // 数据精度 数据最大最小差值较小时 建议设置精度
    fixed: 2,
    num: 10,
    unit: '%'
  }
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData3" class="chart" />

      <div class="config-info">
        <div class="title">Polyline-chart</div>

        <highlight-code>
&lt;polyline-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      data: [2, 2.5, 3, 6, 3, 2.5, 2],
      fillColor: ['rgba(255, 38, 214, 0.5)', 'rgba(40, 82, 255, 0.1)']
    },
    {
      data: [3, 2, 4, 5, 4, 2, 3],
      type: 'smoothline'
    }
  ],
  x: {
    data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07']
  },
  // 非必需 不贴合坐标轴绘制
  boundaryGap: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <div id="point-chart" />
  </div>
</template>

<script>
export default {
  name: 'PolylineChartDemo',
  data () {
    return {
      polylineChartData1: {
        data: [
          {
            data: [32, 30, 55, 24, 33, 25],
            lineColor: '#3de7c9'
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
        },
        labelLine: {
          data: ['车流量'],
          color: ['#3de7c9'],
          type: 'rectangle'
        },
        showValueText: true,
        valueTextOffset: [10, -5]
      },

      polylineChartData2: {
        data: [
          {
            data: [
              99.81, 99.42, 99.56, 99.23, 99.62,
              99.36, 99.56, '', 99.81, 99.56,
              99.42, 99.56, '', '', 99.36,
              99.42, '', 99.56, '', '',
              99.56, 99.23, 99.62
            ],
            lineType: 'dashed',
            lineDash: [2, 2],
            lineColor: '#277dfb',
            pointColor: '#3de7c9',
            fillColor: ['rgba(40, 125, 252, 0.3)', 'rgba(40, 125, 252, 0)']
          },
          {
            data: [
              97.81, 97.42, 97.56, 97.23, 97.62,
              97.36, 97.56, '', 97.81, 97.56,
              97.42, 97.56, '', '', 97.36,
              97.42, '', 97.56, '', '',
              97.56, 97.23, 97.62
            ],
            fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)'],
            type: 'smoothline'
          }
        ],
        x: {
          data: [
            '10/01', '', '10/03', '', '10/05', '',
            '10/07', '', '10/09', '', '10/11', '',
            '10/13', '', '10/15', '', '10/17', '',
            '10/19', '', '10/21', '', '10/23'
          ]
        },
        y: {
          min: 96,
          max: 100,
          fixed: 2,
          num: 10,
          unit: '%'
        },
        labelLine: {
          data: ['同期', '环期'],
          color: ['#275afe', '#3de7c9'],
          type: 'rectangle'
        }
      },

      polylineChartData3: {
        data: [
          {
            data: [2, 2.5, 3, 6, 3, 2.5, 2],
            fillColor: ['rgba(255, 38, 214, 0.5)', 'rgba(40, 82, 255, 0.1)']
          },
          {
            data: [3, 2, 4, 5, 4, 2, 3],
            type: 'smoothline'
          }
        ],
        x: {
          data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07']
        },
        labelLine: {
          data: ['同期', '环期'],
          color: ['#ff2db8', '#3de7c9'],
          type: 'rectangle'
        },
        color: ['#00baff', '#3de7c9', '#ffc53d', '#342432'],
        boundaryGap: true
      },

      colors: ''
    }
  }
}
</script>

<style lang="less">

</style>
