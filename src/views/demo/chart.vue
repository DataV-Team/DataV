<template>
  <div id="chart">
    <side-nav :nav="navData" />

    <attention />

    <column-chart-demo />

    <polyline-chart-demo />

    <point-chart-demo />

    <radar-chart-demo />

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

import pointChartDemo from './chart/pointChartDemo'

import radarChartDemo from './chart/radarChartDemo'

export default {
  name: 'Chart',
  components: {
    attention,
    columnChartDemo,
    polylineChartDemo,
    pointChartDemo,
    radarChartDemo
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
          title: 'Point-Chart',
          target: 'point-chart'
        },
        {
          title: 'Radar-Chart',
          target: 'radar-chart'
        }
      ],

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
