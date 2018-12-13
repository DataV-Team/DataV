<template>
  <div id="chart">
    <border-box-4 class="chart-item">
      <capsule-chart :data="capsuleChartData" class="chart" />

      <div class="config-info">
        <div class="header">Capsule-Chart</div>
        <pre>
data: {
  data: [
    {
      value: 85,
      title: '收费系统'
    },...
  ],
  color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b']
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item" :reverse="true">
      <arc-ring-chart :data="arcRingChartData" class="chart" />
      <div class="config-info">
        <div class="header">Arc-Ring-Chart</div>
        <pre>
data: {
  data: [
    {
      value: 38,
      title: '监控系统'
    },...
  ],
  color: ['#00c0ff', '#3de7c9', '#fff']
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item">
      <concentric-arc-chart :data="concentricArcChartData" class="chart" />

      <div class="config-info">
        <div class="header">Concentric-Arc-Chart</div>
        <pre>
data: {
  data: [
    {
      value: 0.38,
      title: '8小时以内'
    },...
  ],
  color: ['#00c0ff', '#3de7c9'], // 多个颜色 即可产生对应渐变色
  arcArea: [0.3, 0.7],           // 非必须
  arcGap: 5,                     // 非必须
  fontSize: 12                   // 非必须
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item" :reverse="true">
      <ring-chart :data="ringChart1" class="chart" />

      <div class="config-info">
        <div class="header">Ring-Chart</div>
        <pre>
data: {
  data: [
    {
      value: 1315,
      title: '收费站'
    },...
  ],
  color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
  active: true      // 为false时 无动态效果
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item">
      <ring-chart :data="ringChart2" class="chart" />

      <div class="config-info">
        <div class="header">Ring-chart</div>
        <pre>
data: {
  data: [
    {
      value: 1315,
      title: '收费站'
    },...
  ],
  color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
  active: false      // 为true时 有动态效果
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData1" class="chart" />

      <div class="config-info">
        <div class="header">Polyline-chart</div>
        <pre>
data: {
  data: [
    {
      // 存在空位时 该点忽略
      data: [99.81, 99.42, 99.56, 99.23, 99.62, 99.36, 99.56, '', 99.81, 99.56,
        99.56, '', '', 99.36, 99.42, '', 99.56, '', '', 99.56, 99.23, 99.62],
      // 配置此项 将进行颜色填充 非必须
      fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
      // 配置此项可更改数据点颜色 不配置 自动才用全局颜色 非必须
      pointColor: '#00db95',
      // 配置此项可更改数据线颜色 不配置 自动采用全局颜色 并进行透明度处理 比数据点颜色略低 非必须
      lineColor: '#ffc53d',
      // 默认为折线 可选项有 polyline 折线 | smoothline 平滑曲线 | column 柱状 非必须
      type: 'polyline'
      dashed: true // 默认为false 实线 非必须
    },...
  ],
  color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
  x: {
    // 必填项 不想显示底部刻度 可以全留空位
    data: [ '10/01', '', '10/03', '', '10/05', '', '10/07', '', '10/09', '', '10/11', '',
      '10/13', '', '10/15', '', '10/17', '', '10/19', '', '10/21', '', '10/23' ],
    unit: '%'       // 单位展示 非必须
    // fontSize: 20 // x轴刻度字体大小 非必须
    // offset: 30   // x轴向上偏移 此处未配置 非必须
  },
  y: {
    min: 96,    // y轴最小值 未配置则自动根据数据计算 非必须
    max: 100,   // y轴最大值 未配置则自动根据数据计算 非必须
    fixed: 2,   // y轴刻度
    num: 10,    // 刻度个数 默认为10 数据范围不足10则自动缩减 非必须
    unit: '%'   // 单位展示 非必须
    // fontSize: 20     // x轴刻度字体大小 非必须
    // offset: 30       // x轴向上偏移 此处未配置 非必须
  },
  // boundaryGap: false // 配置为true 将不贴合边界进行绘制 非必须
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item">
      <polyline-chart :data="polylineChartData2" class="chart" />

      <div class="config-info">
        <div class="header">Polyline-chart</div>
        <pre>
data: {
  data: [
    {
      data: [99.81, 99.42, 99.56, 99.23, 99.62, 99.36, 99.56, '', 99.81, 99.56,
        99.42, 99.56, '', '', 99.36, 99.42, '', 99.56, '', '', 99.56, 99.23, 99.62],
      fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)'],
      pointColor: '#00db95',
      type: 'polyline'
    },
    {
      data: [97.81, 97.42, 97.56, 97.23, 97.62, 97.36, 97.56, '', 97.81, 97.56,
        97.42, 97.56, '', '', 97.36, 97.42, '', 97.56, '', '', 97.56, 97.23, 97.62],
      fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)'],
      type: 'smoothline'
    }
  ],
  color: ['#00baff', '#3de7c9', '#ffffff', '#ffc53d', '#469f4b'],
  x: {
    data: ['10/01', '', '10/03', '', '10/05', '', '10/07', '', '10/09', '', '10/11', '',
      '10/13', '', '10/15', '', '10/17', '', '10/19', '', '10/21', '', '10/23']
  },
  y: {
    fixed: 2,
    unit: '%'
  },
  boundaryGap: true
}
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData3" class="chart" />

      <div class="config-info">
        <div class="header">Polyline-chart</div>
        <pre>
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
        </pre>
      </div>
    </border-box-4>

    <border-box-4 class="chart-item">
      <polyline-chart :data="polylineChartData4" class="chart" />

      <div class="config-info">
        <div class="header">Polyline-chart</div>
        <pre>
data: [
  {
    data: [5, '', '', '', 2, '', '', '', 4, '', '', '',
      2, '', '', '', 3, '', '', '', 2],
    dashed: true
  },
  {
    data: ['', 4, '', '', '', 3, '', '', '', 4, '', '',
      '', 2, '', '', '', 1, '', '', '', 2 ],
    fillColor: ['rgba(61, 231, 201, 0.5)', 'rgba(61, 231, 201, 0.1)']
  },
  {
    data: ['', '', 3, '', '', '', 2, '', '', '', 1, '',
      '', '', 2, '', '', '', 1, '', '', '', 2],
    type: 'smoothline',
    fillColor: ['rgba(255, 197, 61, 0.4)', 'rgba(255, 197, 61, 0.1)']
  },
  {
    data: ['', '', '', 3, '', '', '', 1, '', '', '', 5,
      '', '', '', 2, '', '', '', 4, '', '', '', 2],
    type: 'column',
    columnColor: ['rgba(52, 36, 50, 0.8)', 'rgba(52, 36, 50, 0.4)']
  }
],
x: {
  data: ['', '', '', '', '', '', '10/07', '', '', '', '', '', '', '10/14',
    '', '', '', '', '', '', '10/21', '', '', '']
},
y: {
  max: 6,
  min: 0,
  num: 6,
  unit: '单位'
},
labelLine: ['收费系统', '收费系统', '监控系统', '供配电系统'],
color: ['#00baff', '#3de7c9', '#ffc53d', '#342432']
}
        </pre>
      </div>
    </border-box-4>

    <!-- <border-box-4 class="chart-item" :reverse="true">
      <polyline-chart :data="polylineChartData" class="chart" />

      <div class="config-info">
        <div class="header">Polyline-chart</div>
        <pre>
        </pre>
      </div>
    </border-box-4> -->

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
            data: [
              5, '', '', '',
              2, '', '', '',
              4, '', '', '',
              2, '', '', '',
              3, '', '', '',
              2
            ],
            dashed: true
          },
          {
            data: [
              '', 4, '', '',
              '', 3, '', '',
              '', 4, '', '',
              '', 2, '', '',
              '', 1, '', '',
              '', 2
            ],
            fillColor: ['rgba(61, 231, 201, 0.5)', 'rgba(61, 231, 201, 0.1)']
          },
          {
            data: [
              '', '', 3, '',
              '', '', 2, '',
              '', '', 1, '',
              '', '', 2, '',
              '', '', 1, '',
              '', '', 2
            ],
            type: 'smoothline',
            fillColor: ['rgba(255, 197, 61, 0.4)', 'rgba(255, 197, 61, 0.1)']
          },
          {
            data: [
              '', '', '', 3,
              '', '', '', 1,
              '', '', '', 5,
              '', '', '', 2,
              '', '', '', 4,
              '', '', '', 2
            ],
            type: 'column',
            columnColor: ['rgba(52, 36, 50, 0.8)', 'rgba(52, 36, 50, 0.4)']
          }
        ],
        x: {
          data: [
            '', '', '', '', '', '', '10/07',
            '', '', '', '', '', '', '10/14',
            '', '', '', '', '', '', '10/21',
            '', '', ''
          ]
        },
        y: {
          max: 6,
          min: 0,
          num: 6,
          unit: '单位'
        },
        labelLine: ['收费系统', '收费系统', '监控系统', '供配电系统'],
        color: ['#00baff', '#3de7c9', '#ffc53d', '#342432']
      }
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
  }

  .chart {
    width: 400px;
    height: 300px;
    flex-shrink: 0;
  }

  .config-info {
    padding: 0px 30px;
    font-size: 15px;

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}
</style>
