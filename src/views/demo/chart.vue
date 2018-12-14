<template>
  <div id="chart">
    <border-box-7 class="chart-item">
      <radar-chart :data="radarChartData" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Radar-Chart</div>
        <highlight-code>
&lt;radar-chart :data="data" :colors="color" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  // 必填项
  data: [
    {
      // 必填项
      data: [180, 250, 300, 500, 600]
      // 非必须 可单独配置填充及线条颜色
      // color: '#f92655',
      // 非必需 可设置线条为虚线
      dashed: true
    },
    {
      data: [210, 330, 450, 261, 448]
    }, ...
  ],
  label: {
    // 必填项 空值自动跳过
    data: ['石家庄', '周口', '南阳', '驻马店', '郑州'],
    // 非必须 可配置label颜色
    // color: '#fff'
  },
  // 非必须 不配置此项 图例下不会显示label标签
  labelLine: ['同期', '环期'],
  // 非必须 可配置图例最大半径比例
  // radius: 0.8,
  // 非必需 可配置雷达环个数
  // circleNum: 6
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

      radarChartData: {
        data: [
          {
            data: [180, 250, 300, 500, 600],
            dashed: true
          },
          {
            data: [210, 330, 450, 261, 299]
          }
        ],
        label: {
          data: ['石家庄', '周口', '南阳', '驻马店', '郑州'],
          color: '#f92672',
          fontSize: 12
        },
        labelLine: ['同期', '环期'],
        circleColor: '#f92672',
        rayLineColor: '#f92672',
        rayLineOffset: Math.PI * 1,

      },

      colors: ['#00baff', '#3de7c9']
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
