<template>
  <div id="chart">
    <side-nav :nav="navData" />

    <border-box-7 class="attention" id="attention">
      <div class="title">Attention</div>

      <div class="text-info">
        下列组件颜色配置均绑定在节点的colors属性上
      </div>

      <div class="text-info">
        若未绑定将自动使用默认配色
      </div>

      <div class="text-info">
        colors所绑变量应为hex十六进制色的数组,示例如下
      </div>

      <highlight-code>
&lt;chart :data="data" :colors="color" /&gt;
      </highlight-code>

      <highlight-code>
// 修改默认配色方案 可直接修改./src/config/color.js
colors: ['#9cf4a7', '#66d7ee', '#eee966', '#a866ee', '#ee8f66', '#ee66aa']
// 数组内颜色将自动循环使用
      </highlight-code>

      <div class="text-info">
        如在特殊颜色配置属性中使用colors关键字,将自动将该属性配置指向colors
      </div>

      <div class="text-info">
        下列组件均不再展示colors属性绑定的变量
      </div>
    </border-box-7>

    <border-box-7 class="chart-item" id="column-chart">
      <column-chart :data="columnChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: []
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item" id="radar-chart">
      <radar-chart :data="radarChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Radar-Chart</div>
        <highlight-code>
&lt;radar-chart :data="data" :colors="colors" /&gt;
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
  labelLine: ['同期', '环期'] // 非必须 不配置此项 则不展示底部label
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
data: {
  // 相同配置不再赘述
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
data: {
  // 相同配置不再赘述
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

    <border-box-7 class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData1" class="chart" />

      <div class="config-info">
        <div class="title">Polyline-chart</div>

        <highlight-code>
&lt;polyline-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      // 必填项 存在空位时 该点忽略
      data: [99.81, '', ..., '', 99.23, 99.62],
      // 非必须 配置此项 将进行颜色填充
      fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
      // 非必须 配置此项可更改数据点颜色
      pointColor: '#00db95',
      // 非必须 配置此项可更改线条颜色
      lineColor: '#ffc53d',
      // 非必须 默认为折线
      // 可选项有 polyline 折线 | smoothline 平滑曲线 | column 柱状
      type: 'polyline'
      // 默认为false 实线 非必须
      dashed: true
    },...
  ],
  // 非必须 依次循环使用
  color: ['#00baff', '#3de7c9', ...],
  x: {
    // 必填项 不想显示底部刻度 可以全留空位
    data: [ '10/01', '', ..., '', '10/23' ],
    // unit: '日期'     // 非必须 单位展示
    // fontSize: 20     // 非必须 x轴刻度字体大小
    // offset: 30       // 非必须 x轴向上偏移 此处未配置
  },
  y: {
    min: 96,            // 非必须 y轴最小值 未配置则自动根据数据计算
    max: 100,           // 非必须 y轴最大值 未配置则自动根据数据计算
    fixed: 2,           // 非必须 y轴刻度精度
    num: 10,            // 非必须刻度个数 默认为10 数据范围不足10则自动缩减
    unit: '%'           // 非必须 单位展示
    // fontSize: 20     // 非必须 x轴刻度字体大小
    // offset: 30       // 非必须 x轴向上偏移
  },
  // boundaryGap: false // 非必须 配置为true 将不贴合边界进行绘制
}
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
      data: [99.81, ..., 99.81, 99.56],
      fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
      pointColor: '#00db95',
      type: 'polyline'
    },
    {
      data: [97.81, ..., 97.23, 97.62],
      fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)'],
      type: 'smoothline'
    }
  ],
  color: ['#00baff', '#3de7c9', ...],
  x: {
    data: ['10/01', '', ..., '', '10/23']
  },
  y: {
    fixed: 2,
    unit: '%'
  },
  boundaryGap: true
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
      data: [99.81, 99.42, 99.56, 99.23, 99.62, 99.36, 99.56],
      columnColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
      type: 'column'
    },
    {
      data: [97.81, 97.42, 97.56, 100.23, 97.62, 97.36, 97.56],
      fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)'],
      type: 'smoothline'
    }
  ],
  color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
  x: {
    data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07']
  },
  y: {
    fixed: 2,
    unit: '%'
  },
  boundaryGap: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <polyline-chart :data="polylineChartData4" class="chart" />

      <div class="config-info">
        <div class="title">Polyline-chart</div>

        <highlight-code>
&lt;polyline-chart :data="data" /&gt;
        </highlight-code>

        <highlight-code>
data: [
        data: [
          {
            data: [3, 4.5, 4, 6, 5, 4, 3],
            dashed: true
          },
          {
            data: [0.5, 1, 0.8, 3, 2, 1.5, 0.5],
            fillColor: ['rgba(61, 231, 201, 0.5)', 'rgba(61, 231, 201, 0.1)']
          },
          {
            data: [1, 3, 2, 4, 3, 2, 1],
            type: 'smoothline',
            fillColor: ['rgba(255, 197, 61, 0.4)', 'rgba(255, 197, 61, 0.1)']
          },
          {
            data: [2, 2.5, 3, 5, 4, 3, 2],
            type: 'column',
            columnColor: ['rgba(52, 36, 50, 0.8)', 'rgba(52, 36, 50, 0.4)']
          }
        ],
        x: {
          data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07']
        },
        y: {
          max: 6,
          min: 0,
          unit: '单位'
        },
        labelLine: ['收费系统', '收费系统', '监控系统', '供配电系统'],
        color: ['#00baff', '#3de7c9', '#ffc53d', '#342432'],
        boundaryGap: true
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
export default {
  name: 'Chart',
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
          title: 'Radar-Chart',
          target: 'radar-chart'
        }
      ],

      columnChartData1: {
        data: [
          {
            data: [180, 290, 420, 200, 350, 219]
          },
          {
            data: [
              [45, 32, 66],
              [122, 49, 218],
              [40, 129, 216],
              [45, 66, 45],
              [110, 120, 201],
              [23, 40, 12]
            ]
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
          grid: true,
          gridType: 'dashed',
          unit: '次',
          min: 0,
          max: 600
        },
        columnType: 'butt',
        showColumnBG: true
      },

      // columnChartData1: {
      //   data: [
      //     [180, 290, 420, 200, 350, 219],
      //     [
      //       [45, 32, 66],
      //       [122, 49, 218],
      //       [40, 129, 216],
      //       [45, 66, 45],
      //       [110, 120, 201],
      //       [23, 40, 12]
      //     ]
      //   ],
      //   x: {
      //     grid: true,
      //     unit: '次',
      //     min: 0,
      //     max: 600
      //   },
      //   y: {
      //     data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'],
      //     grid: true
      //   },
      //   columnBG: 'rgba(250, 250, 250, 0.2)',
      //   roundColumn: true,
      //   horizon: true
      // },

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
        labelLine: ['同期', '环期']
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
        labelLine: ['同期', '环期'],
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
        labelLine: ['同期', '环期'],
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
        labelLine: ['同期', '环期'],
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

      polylineChartData1: {
        data: [
          {
            data: [
              99.81, 99.42, 99.56, 99.23, 99.62,
              99.36, 99.56, '', 99.81, 99.56,
              99.42, 99.56, '', '', 99.36,
              99.42, '', 99.56, '', '',
              99.56, 99.23, 99.62
            ],
            fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
            pointColor: '#00db95',
            lineColor: '#ffc53d',
            type: 'polyline',
            dashed: true
          }
        ],
        color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
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
        }
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
            fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
            pointColor: '#00db95',
            type: 'polyline'
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
        color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
        x: {
          data: [
            '10/01', '', '10/03', '', '10/05', '',
            '10/07', '', '10/09', '', '10/11', '',
            '10/13', '', '10/15', '', '10/17', '',
            '10/19', '', '10/21', '', '10/23'
          ]
        },
        y: {
          fixed: 2,
          unit: '%'
        },
        boundaryGap: true
      },

      polylineChartData3: {
        data: [
          {
            data: [99.81, 99.42, 99.56, 99.23, 99.62, 99.36, 99.56],
            columnColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
            type: 'column'
          },
          {
            data: [97.81, 97.42, 97.56, 100.23, 97.62, 97.36, 97.56],
            fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)'],
            type: 'smoothline'
          }
        ],
        color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
        x: {
          data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07']
        },
        y: {
          fixed: 2,
          unit: '%'
        },
        boundaryGap: true
      },

      polylineChartData4: {
        data: [
          {
            data: [3, 4.5, 4, 6, 5, 4, 3],
            dashed: true
          },
          {
            data: [0.5, 1, 0.8, 3, 2, 1.5, 0.5],
            fillColor: ['rgba(61, 231, 201, 0.5)', 'rgba(61, 231, 201, 0.1)']
          },
          {
            data: [1, 3, 2, 4, 3, 2, 1],
            type: 'smoothline',
            fillColor: ['rgba(255, 197, 61, 0.4)', 'rgba(255, 197, 61, 0.1)']
          },
          {
            data: [2, 2.5, 3, 5, 4, 3, 2],
            type: 'column',
            columnColor: ['rgba(52, 36, 50, 0.8)', 'rgba(52, 36, 50, 0.4)']
          }
        ],
        x: {
          data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07']
        },
        y: {
          max: 6,
          min: 0,
          unit: '单位'
        },
        labelLine: ['收费系统', '收费系统', '监控系统', '供配电系统'],
        color: ['#00baff', '#3de7c9', '#ffc53d', '#342432'],
        boundaryGap: true
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

  .attention {
    width: 80%;
    margin-left: 20%;
    text-align: center;

    .highlight-code {
      margin: -40px 0px;
    }
  }

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
