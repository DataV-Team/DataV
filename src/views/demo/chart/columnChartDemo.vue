<template>
  <div>
    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData1" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    {
      data: [150, 290, 420, 200, 350, 219],
      fillColor: ['#247efc', '#ff2fdb'],
      // 非必需 强制该列数据值标签颜色
      // inherit 即为继承本列颜色 继承优先级为 fillColor lineColor colors
      valueTextColor: 'inherit'
    }
  ],
  x: {
    data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
  },
  y: {
    unit: '辆'
  },
  labelLine: {
    color: '#2b7bfb',
    data: ['车流量'],
    type: 'rectangle'
  },
  // 非必需 展示数据值标签
  showValueText: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData2" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  y: {
    grid: true,
    gridLineType: 'dashed',
    gridLineDash: [2, 2],
    num: 6
  },
  showColumnBG: true,
  columnBGColor: 'rgba(100, 100, 100, 0.3)'
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData3" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  data: [
    {
      data: [150, 290, 420, 200, 350, 219],
      fillColor: '#247efc'
    },
    {
      data: [
        [35, 70, 40],
        [74, 180, 45],
        [37, 200, 145],
        [35, 89, 30],
        [65, 100, 48],
        [55, 90, 70]
      ],
      fillColor: ['#ff2fdb', '#e3b4a2', '#fafb5d']
    }
  ]
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData4" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data:{
  data: [
    {
      data: [150, 290, 420, 200, 350, 219],
      fillColor: ['#247efc', '#ff2fdb']
    },
    {
      data: [130, 313, 392, 180, 400, 188],
      fillColor: ['#00BAFF', '#3DE7C9']
    }
  ],
  // 非必须 指定圆角柱
  roundColumn: true,
  // 非必须 指定柱间间隔
  spaceBetween: true,
  //  非必须 指定局部渐变
  localGradient: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData5" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: [
  {
    data: [150, 290, 420, 200, 350, 219],
    fillColor: ['#247efc', '#ff2fdb'],
    // 非必须 指定左边梯形柱 该属性在单柱数据生效 且不能设置roundColumn
    type: 'leftEchelon'
  },
  {
    data: [130, 313, 392, 180, 400, 188],
    fillColor: ['#00BAFF', '#3DE7C9'],
    // 非必须 指定右边梯形柱
    type: 'rightEchelon'
  },
  // 非必须 显示数值
  showValueText: true,
  // 非必须 设置全局数据值标签颜色
  valueTextColor: '#bbb'
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData6" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  data: [
    ...
    {
      ...
      type: 'polyline',
      againstAxis: true,
      lineColor: '#ff2fdb',
      pointColor: '#3de7c9'
    }
  ],
  x: {
    offset: 40,
    // 旋转角度
    rotate: 20
  },
  y: {
    tagAfter: 'ml'
  },
  ay: {
    afterTag: '°C'
  }
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData7" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  data: [
    {
      data: [330, 290, 330, 400, 330, 290, 330],
      fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)']
    },
    {
      data: [260, 265, 280, 450, 280, 265, 260],
      type: 'smoothline',
      lineType: 'dashed',
      againstAxis: true,
      lineColor: '#3de7c9',
      fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)']
    }
  ]
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData8" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  x: {
    unit: '辆',
    grid: true,
    gridLineType: 'dashed',
    gridLineDash: [2, 2]
  },
  y: {
    data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
  },
  // 非必须 水平图
  horizon: true
}
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="chart-item">
      <column-chart :data="columnChartData9" :colors="colors" class="chart" />

      <div class="config-info">
        <div class="title">Column-Chart</div>
        <highlight-code>
&lt;column-chart :data="data" :colors="colors" /&gt;
        </highlight-code>

        <highlight-code>
// 相同配置不再赘述
data: {
  x: {
    noAxisLine: true,
    noAxisTag: true,
    offset: 10
  },
  y: {
    noAxisLine: true,
    noAxisTag: true,
    offset: 1
  },
  showValueText: true,
  // 非必须 设置数值文字颜色
  valueTextColor: '#fff',
  // 非必须 设置数值文字相对偏移量
  valueTextOffset: [0, 15]
}
        </highlight-code>
      </div>
    </border-box-7>

    <div id="polyline-chart" />
  </div>
</template>

<script>
export default {
  name: 'ColumnChartDemo',
  data () {
    return {
      columnChartData1: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: ['#247efc', '#ff2fdb'],
            valueTextColor: 'inherit'
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
          unit: '辆'
        },
        labelLine: {
          color: '#2b7bfb',
          data: ['车流量'],
          type: 'rectangle'
        },
        showValueText: true
      },

      columnChartData2: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: ['#247efc', '#ff2fdb']
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
          unit: '辆',
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2],
          num: 6
        },
        labelLine: {
          color: '#2b7bfb',
          data: ['车流量'],
          type: 'rectangle'
        },
        showColumnBG: true,
        columnBGColor: 'rgba(100, 100, 100, 0.3)'
      },

      columnChartData3: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: '#247efc'
          },
          {
            data: [
              [35, 70, 40],
              [74, 180, 45],
              [37, 200, 145],
              [35, 89, 30],
              [65, 100, 48],
              [55, 90, 70]
            ],
            fillColor: ['#ff2fdb', '#e3b4a2', '#fafb5d']
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
          unit: '万元',
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2],
          min: 0
        },
        labelLine: {
          color: ['#247efc', '#ff2fdb', '#e3b4a2', '#fafb5d'],
          data: ['玩具', '食品', '服装', '电器'],
          type: 'rectangle'
        },
        showColumnBG: true,
        columnBGColor: 'rgba(100, 100, 100, 0.3)'
      },

      columnChartData4: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: ['#247efc', '#ff2fdb']
          },
          {
            data: [130, 313, 392, 180, 400, 188],
            fillColor: ['#00BAFF', '#3DE7C9']
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2],
          unit: '辆'
        },
        labelLine: {
          color: ['#ff2fdb', '#3DE7C9'],
          data: ['同期', '环期'],
          type: 'rectangle'
        },
        roundColumn: true,
        spaceBetween: true,
        localGradient: true
      },

      columnChartData5: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: ['#247efc', '#ff2fdb'],
            type: 'leftEchelon'
          },
          {
            data: [130, 313, 392, 180, 400, 188],
            fillColor: ['#00BAFF', '#3DE7C9'],
            type: 'rightEchelon'
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        y: {
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2],
          unit: '辆',
          num: 7
        },
        labelLine: {
          color: ['#ff2fdb', '#3DE7C9'],
          data: ['同期', '环期'],
          type: 'rectangle'
        },
        showValueText: true,
        spaceBetween: true,
        valueTextColor: '#bbb'
      },

      columnChartData6: {
        data: [
          {
            data: [175, 125, 90, 130, 45, 65, 65, 47, 50, 52, 45, 37],
            fillColor: ['#247efc', '#ff2fdb']
          },
          {
            data: [210, 142, 128, 142, 63, 72, 68, 57, 54, 60, 49, 42],
            fillColor: ['#00BAFF', '#3DE7C9']
          },
          {
            data: [23, 18, 16, 14, 10, 8, 6, 6, 6, 6, 6, 5],
            type: 'polyline',
            againstAxis: true,
            lineColor: '#ff2fdb',
            pointColor: '#3de7c9'
          }
        ],
        x: {
          data: [
            '一月份', '二月份',
            '三月份', '四月份',
            '五月份', '六月份',
            '七月份', '八月份',
            '九月份', '十月份',
            '十一月份', '十二月份'
          ],
          offset: 40,
          rotate: 20
        },
        y: {
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2],
          min: 0,
          max: 250,
          num: 6,
          tagAfter: 'ml'
        },
        ay: {
          min: 0,
          max: 25,
          num: 6,
          tagAfter: '°C'
        },
        labelLine: {
          color: ['#ff2fdb', '#3DE7C9'],
          data: ['同期', '环期'],
          type: 'rectangle'
        },
        roundColumn: true,
        localGradient: true,
        spaceBetween: true
      },

      columnChartData7: {
        data: [
          {
            data: [330, 290, 330, 400, 330, 290, 330],
            fillColor: ['rgba(0, 186, 255, 0.3)', 'rgba(0, 186, 255, 0)']
          },
          {
            data: [260, 265, 280, 450, 280, 265, 260],
            type: 'smoothline',
            lineType: 'dashed',
            againstAxis: true,
            lineColor: '#3de7c9',
            fillColor: ['rgba(0, 219, 149, 0.3)', 'rgba(0, 219, 149, 0)']
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳', '漯河']
        },
        y: {
          unit: '辆',
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2],
          num: 6,
          min: 0,
          max: 500
        },
        labelLine: {
          color: '#2b7bfb',
          data: ['车流量'],
          type: 'rectangle'
        },
        ay: {
          num: 6,
          min: 100,
          max: 500
        }
      },

      columnChartData8: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: ['#247efc', '#ff2fdb'],
            type: 'leftEchelon'
          },
          {
            data: [130, 313, 392, 180, 400, 188],
            fillColor: ['#00BAFF', '#3DE7C9'],
            type: 'rightEchelon'
          }
        ],
        x: {
          unit: '辆',
          grid: true,
          gridLineType: 'dashed',
          gridLineDash: [2, 2]
        },
        y: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳']
        },
        labelLine: {
          color: '#2b7bfb',
          data: ['车流量'],
          type: 'rectangle'
        },
        horizon: true,
        showColumnBG: true,
        localGradient: true,
        spaceBetween: true
      },

      columnChartData9: {
        data: [
          {
            data: [150, 290, 420, 200, 350, 219],
            fillColor: ['#247efc', '#ff2fdb']
          }
        ],
        x: {
          data: ['西峡', '周口', '南阳', '驻马店', '郑州', '洛阳'],
          noAxisLine: true,
          noAxisTag: true,
          offset: 10
        },
        y: {
          noAxisLine: true,
          noAxisTag: true,
          offset: 1
        },
        labelLine: {
          color: '#2b7bfb',
          data: ['车流量'],
          type: 'rectangle'
        },
        showColumnBG: true,
        showValueText: true,
        valueTextColor: '#fff',
        valueTextOffset: [0, 15]
      },

      colors: ''
    }
  }
}
</script>

<style lang="less">

</style>
