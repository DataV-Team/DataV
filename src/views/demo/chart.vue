<template>
  <div id="chart">
    <side-nav :nav="navData" />

    <attention />

    <column-chart-demo />

    <polyline-chart-demo />

    <!-- <border-box-7 class="chart-item">
      <point-chart :data="pointChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;point-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
data: {
}
        </highlight-code>
      </div>
    </border-box-7> -->

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
  ringFillColor: ['rgba(61, 231, 201, 0.1)'],
  ringFillType: 'mulCover', // 非必须 设置环线填充颜色类型为mulCover
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

    <border-box-7 class="chart-item">
      <capsule-chart :data="capsuleChartData" class="chart" />

      <div class="config-info">
        <div class="title">Capsule-Chart</div>
        <highlight-code>
&lt;capsule-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  // 必填项
  data: [
    {
      value: 85,
      title: '收费系统'
    },...
  ],
  // 必填项 依次循环使用
  color: ['#00baff', '#3de7c9', ...]
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item" :reverse="true">
      <arc-ring-chart :data="arcRingChartData" class="chart" />
      <div class="config-info">
        <div class="title">Arc-Ring-Chart</div>

        <highlight-code>
&lt;capsule-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  // 必填项
  data: [
    {
      value: 38,
      title: '监控系统'
    },...
  ],
  // 必填项 依次循环使用
  color: ['#00c0ff', '#3de7c9', ...]
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <concentric-arc-chart :data="concentricArcChartData" class="chart" />

      <div class="config-info">
        <div class="title">Concentric-Arc-Chart</div>

        <highlight-code>
&lt;concentric-arc-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  // 必填项
  data: [
    {
      value: 0.38,
      title: '8小时以内'
    },...
  ],
  // 必填项 多个颜色自动生成渐变色
  color: ['#00c0ff', '#3de7c9']
  arcArea: [0.3, 0.7],           // 非必须
  arcGap: 5,                     // 非必须
  fontSize: 12                   // 非必须
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item" :reverse="true">
      <ring-chart :data="ringChart1" class="chart" />

      <div class="config-info">
        <div class="title">Ring-Chart</div>

        <highlight-code>
&lt;ring-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  // 必填项
  data: [
    {
      value: 1315,
      title: '收费站'
    },...
  ],
  // 必填项 依次循环使用
  color: ['#00baff', '#3de7c9'],
  // 为false时 无动态效果
  active: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <ring-chart :data="ringChart2" class="chart" />

      <div class="config-info">
        <div class="title">Ring-chart</div>

        <highlight-code>
&lt;ring-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      value: 1315,
      title: '收费站'
    },...
  ],
  // 非必须 依次循环使用
  color: ['#00baff', '#3de7c9'],
  // 为true时 有动态效果
  active: false,
  // 非必须 该项可设置百分比精度 active为false时无效
  // fixed: 2
}
        </highlight-code>
      </div>
    </border-box-7>

    <!-- <highlight-code class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData" class="chart" />

      <div class="config-info">
        <div class="header">Polyline-chart</div>
        <pre>
        </pre>
      </div>
    </highlight-code> -->

  </div>
</template>

<script>
import attention from './chart/attention.vue'

import columnChartDemo from './chart/columnChartDemo'

import polylineChartDemo from './chart/polylineChartDemo'

export default {
  name: 'Chart',
  components: {
    attention,
    columnChartDemo,
    polylineChartDemo
  },
  data () {
    return {
      navData: [
        {
          title: 'Attention',
          target: 'attention'
        },
        {
          title: 'Column-Chart',
          target: 'column-chart'
        },
        {
          title: 'Polyline-Chart',
          target: 'polyline-chart'
        },
        {
          title: 'Radar-Chart',
          target: 'radar-chart'
        }
      ],

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
        ringFillType: 'mulCover',
        ringFillColor: ['rgba(61, 231, 201, 0.1)'],
        ringLineType: 'line',
        ringLineColor: 'rgba(156, 244, 233, 0.2)',
        rayLineOffset: Math.PI * -1.5,
        radius: 0.8,
        max: 550
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

      capsuleChartData: {
        data: [
          {
            value: 85,
            title: '收费系统'
          },
          {
            value: 44,
            title: '通信系统'
          },
          {
            value: 125,
            title: '监控系统'
          },
          {
            value: 110,
            title: '供配电系统'
          },
          {
            value: 66,
            title: '其他'
          }
        ],
        color: [
          '#00baff',
          '#3de7c9',
          '#ffffff',
          '#ffc53d',
          '#469f4b'
        ]
      },

      arcRingChartData: {
        data: [
          {
            value: 19,
            title: '监控系统'
          },
          {
            value: 16,
            title: '收费系统'
          },
          {
            value: 24,
            title: '通信系统'
          },
          {
            value: 14,
            title: '供配电系统'
          },
          {
            value: 27,
            title: '其他'
          }
        ],
        color: ['#00c0ff', '#3de7c9', '#fff']
      },

      concentricArcChartData: {
        data: [
          {
            value: 0.38,
            title: '8小时以内'
          },
          {
            value: 0.57,
            title: '24小时以内'
          },
          {
            value: 0.7,
            title: '48小时以内'
          },
          {
            value: 0.78,
            title: '72小时以内'
          },
          {
            value: 0.22,
            title: '大于72小时'
          }
        ],
        color: ['#00c0ff', '#3de7c9'],
        arcArea: [0.3, 0.7],
        arcGap: 5,
        fontSize: 12
      },

      ringChart1: {
        data: [
          {
            value: 1315,
            title: '收费站'
          },
          {
            value: 415,
            title: '监控中心'
          },
          {
            value: 90,
            title: '道路外场'
          },
          {
            value: 317,
            title: '其他'
          }
        ],
        color: [
          '#00baff',
          '#3de7c9',
          '#ffffff',
          '#ffc53d',
          '#469f4b'
        ],
        active: true
      },

      ringChart2: {
        data: [
          {
            value: 1315,
            title: '收费站'
          },
          {
            value: 415,
            title: '监控中心'
          },
          {
            value: 90,
            title: '道路外场'
          },
          {
            value: 317,
            title: '其他'
          }
        ],
        color: [
          '#00baff',
          '#3de7c9',
          '#ffffff',
          '#ffc53d',
          '#469f4b'
        ],
        active: false
      },

      colors: ''
    }
  }
}
</script>

<style lang="less">
#chart {
  display: flex;
  flex-direction: column;

  .chart-item {
    width: 80%;
    min-height: 300px;
    display: flex;
    flex-direction: row;
    margin: 20px 0px;
    margin-left: 20%;
    align-items: center;
  }

  .chart {
    width: 400px;
    height: 300px;
    flex-shrink: 0;
  }

  .config-info {
    padding: 0px 30px;
    display: flex;
    flex-direction: column;

    .highlight-code {
      margin: -30px 0px;
    }
  }
}
</style>
