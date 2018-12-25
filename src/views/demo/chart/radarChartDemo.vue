<template>
  <div>
    <border-box-7 class="chart-item">
      <radar-chart :data="radarChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Radar-Chart</div>
        <highlight-code>
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      data: [450, 50, 450, 50, 450, 50] // 必须
    },
    {
      data: [50, 450, 50, 450, 50, 450]
    }, ...
  ],
  label: {
    data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'] // 必须
  },
  // 非必须 不配置该项则不绘制底部label
  labelLine: {
    data: ['同期', '环期']
  }
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <radar-chart :data="radarChartData2" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Radar-Chart</div>
        <highlight-code>
&lt;radar-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      data: [450, 50, 450, 50, 450, 50],
      dashed: true // 非必须 为真时绘制虚线
    },
    {
      data: [50, 450, 50, 450, 50, 450],
      lineColor: '#9cf4df', // 非必须 可配置改数据线条颜色
      fillColor: 'rgba(238, 233, 108, 0.5)' // 非必须 可配置改数据填充颜色
    }
  ],
  label: {
    data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'],
    color: 'colors', // 非必须 可配置文字颜色
    fontSize: 10 // 非必须 可配置文字大小
  },
  labelLine: ['同期', '环期'],
  rayLineType: 'dashed', // 非必须 设置径向射线为虚线
  rayLineColor: 'colors', // 非必须 设置径向射线颜色
  ringNum: 5, // 非必填 设置环线个数
  ringType: 'polyline', // 非必须 设置环线为折线
  ringFillType: 'cover', // 非必须 设置环线填充颜色类型为cover
  ringFillColor: ['rgba(61, 231, 201, 0.3)', 'rgba(61, 231, 201, 0.1)'], // 非必须 设置环线填充色
  ringLineType: 'line', // 非必须 设置环线线条为实线
  ringLineColor: 'rgba(156, 244, 233, 0.2)', // 非必须 设置环线线条颜色
  rayLineOffset: Math.PI * -1.5, // 非必须 设置雷达图旋转偏移
  radius: 0.8, // 非必须 设置雷达图最大环线半径
  max: 550 // 非必须 设置雷达图数据最大值
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <radar-chart :data="radarChartData3" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Radar-Chart</div>
        <highlight-code>
&lt;radar-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  data: [
    {
      data: [....],
      // 非必须 设置该列数据值标签颜色为继承
      valueTextColor: 'inherit'
    }
  ],
  ringFillColor: ['rgba(61, 231, 201, 0.1)'],
  ringFillType: 'mulCover', // 非必须 设置环线填充颜色类型为mulCover
  showValueText: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <radar-chart :data="radarChartData4" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Radar-Chart</div>
        <highlight-code>
&lt;radar-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  ringFillColor: ['rgba(61, 231, 201, 0.1)'],
  ringFillType: 'ring', // 非必须 设置环线填充颜色类型为ring
}
        </highlight-code>
      </div>
    </border-box-7>
  </div>
</template>

<script>
export default {
  name: 'RadarChartDemo',
  data () {
    return {
      radarChartData1: {
        data: [
          {
            data: [450, 50, 450, 50, 450, 50]
          },
          {
            data: [50, 450, 50, 450, 50, 450]
          }
        ],
        label: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        labelLine: {
          data: ['同期', '环期']
        }
      },

      radarChartData2: {
        data: [
          {
            data: [450, 50, 450, 50, 450, 50],
            dashed: true
          },
          {
            data: [50, 450, 50, 450, 50, 450],
            lineColor: '#9cf4df',
            fillColor: 'rgba(238, 233, 108, 0.5)'
          }
        ],
        label: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'],
          color: 'colors',
          fontSize: 10
        },
        labelLine: {
          data: ['同期', '环期']
        },
        rayLineType: 'dashed',
        rayLineColor: 'colors',
        ringNum: 5,
        ringType: 'polyline',
        ringFillType: 'cover',
        ringFillColor: ['rgba(61, 231, 201, 0.3)', 'rgba(61, 231, 201, 0.1)'],
        ringLineType: 'line',
        ringLineColor: 'rgba(156, 244, 233, 0.2)',
        rayLineOffset: Math.PI * -1.5,
        radius: 0.8,
        max: 550
      },

      radarChartData3: {
        data: [
          {
            data: [450, 50, 450, 50, 450, 50],
            valueTextColor: 'inherit'
          },
          {
            data: [50, 450, 50, 450, 50, 450],
            valueTextColor: 'inherit'
          }
        ],
        label: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'],
          color: 'colors',
          fontSize: 10
        },
        labelLine: {
          data: ['同期', '环期']
        },
        rayLineType: 'dashed',
        rayLineColor: 'colors',
        ringNum: 5,
        ringType: 'polyline',
        ringFillType: 'mulCover',
        ringFillColor: ['rgba(61, 231, 201, 0.1)'],
        ringLineType: 'line',
        ringLineColor: 'rgba(156, 244, 233, 0.2)',
        rayLineOffset: Math.PI * -1.5,
        radius: 0.8,
        max: 550,
        showValueText: true
      },

      radarChartData4: {
        data: [
          {
            data: [450, 50, 450, 50, 450, 50]
          },
          {
            data: [50, 450, 50, 450, 50, 450]
          }
        ],
        label: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'],
          color: 'colors',
          fontSize: 10
        },
        labelLine: {
          data: ['同期', '环期']
        },
        rayLineType: 'dashed',
        rayLineColor: 'colors',
        ringNum: 5,
        ringType: 'polyline',
        ringFillType: 'ring',
        ringFillColor: ['rgba(61, 231, 201, 0.3)', 'rgba(61, 231, 201, 0.1)'],
        ringLineType: 'line',
        ringLineColor: 'rgba(156, 244, 233, 0.2)',
        rayLineOffset: Math.PI * -1.5,
        radius: 0.8,
        max: 550
      },

      colors: ''
    }
  }
}
</script>

<style lang="less">

</style>
