<template>
  <div id="manage-desk">
    <div class="header">
      <div class="left">{{ technicalSupport }}</div>
      <div class="middle">{{ topMiddleTitle }}</div>
      <border-box-2 class="right">
        设备档案馆
      </border-box-2>
    </div>

    <border-box-1 class="content">
      <div class="top">
        <div class="top-left">
          <div class="top-left-title-1">
            当月维修任务量
            <decoration-3 />
          </div>

          <div class="top-left-title-2">
            <decoration-3 />
            运维人均工作量
          </div>

          <border-box-5 class="top-left-box-1">
            <div class="tlb-text">
              <div>{{ chart1Data.monthSum }}</div>
              <div class="small-text">{{ chart1Data.lastMonthSum }}</div>
              <div class="small-text">{{ chart1Data.lastYearMonthSum }}</div>
            </div>
          </border-box-5>

          <border-box-5 class="top-left-box-2" :reverse="true">
            <div class="tlb-text">
              <div>{{ chart1Data.personDayAvg }}</div>
              <div class="small-text">{{ chart1Data.personLastMonthDayAvg }}</div>
              <div class="small-text">{{ chart1Data.personLastYearMonthDayAvg }}</div>
            </div>
          </border-box-5>
        </div>

        <div class="top-right">
          <polyline-chart :data="chart2Data">
            <div class="title-item">
              设备完好率月趋势
              <decoration-3 />
            </div>
          </polyline-chart>

          <polyline-chart :data="chart3Data">
            <div class="title-item">
              设备故障月趋势
              <decoration-3 />
            </div>
          </polyline-chart>
        </div>
      </div>

      <div class="bottom">
        <border-box-6 class="bottom-left">
          <decoration-4 class="bottom-left-decoration-1" />
          <decoration-4 class="bottom-left-decoration-2" />

          <div class="bottom-left-item">
            <div class="bli-title">机电设备完好率</div>
            <div class="bli-value left-value">{{ chart4Data.deviceNormalPercent }}</div>
            <arc-ring-chart class="bli-chart" :data="chart4Data.data" />
          </div>
          <div class="bottom-left-item">
            <div class="bli-title">任务维修平均用时</div>
            <div class="bli-value right-value">{{ chart5Data.avgTime}}</div>
            <concentric-arc-chart class="bli-chart" :data="chart5Data.data" />
          </div>
        </border-box-6>

        <div class="bottom-right">
          <border-box-6 class="bottom-right-item">
            <div class="title-item">
              <img src="./img/1.png" />人员贡献排行榜
            </div>

            <scroll-board :data="chart6Data" />
          </border-box-6>

          <border-box-6 class="bottom-right-item">
            <div class="title-item">
              <img src="./img/2.png" />故障设备排行榜
            </div>

            <scroll-board :data="chart7Data" />
          </border-box-6>

          <border-box-6 class="bottom-right-item">
            <div class="title-item">
              <img src="./img/3.png" />常见故障排行榜
            </div>

            <scroll-board :data="bottomRightScrollBorad3Data" />
          </border-box-6>

          <border-box-6 class="bottom-right-item">
            <div class="title-item">
              <img src="./img/4.png" />故障位置排行榜
            </div>

            <scroll-board :data="chart9Data" />
          </border-box-6>
        </div>
      </div>
    </border-box-1>
  </div>
</template>

<script>
export default {
  name: 'ManageDesk',
  data () {
    return {
      technicalSupport: '技术支持：河南东方世纪交通科技股份有限公司',
      topMiddleTitle: '机电运维管理台',

      // 上部左边卡片数据
      chart1Data: {
        monthSum: 0,
        lastMonthSum: 81,
        lastYearMonthSum: 0,
        personDayAvg: 0.1,
        personLastMonthDayAvg: 0.3,
        personLastYearMonthDayAvg: 0
      },

      // 上部右边第一个图表数据
      chart2Data: {
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
          }
        ],
        color: ['#00baff'],
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
        labelLine: ['设备完好率']
      },

      // 上部右边第二个图表数据
      chart3Data: {
        data: [
          {
            data: [
              5, '', '', '',
              2, '', '', '',
              4, '', '', '',
              2, '', '', '',
              2, '', '', '',
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
              '', 2, '', '',
              '', 2
            ]
          },
          {
            data: [
              '', '', 3, '',
              '', '', 2, '',
              '', '', 2, '',
              '', '', 2, '',
              '', '', 2, '',
              '', '', 2
            ]
          },
          {
            data: [
              '', '', '', 3,
              '', '', '', 2,
              '', '', '', 2,
              '', '', '', 2,
              '', '', '', 3,
              '', '', '', 2
            ]
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
        color: ['#00baff', '#3de7c9', '#44f23a', '#342432']
      },

      // 底部左边第一个图表数据
      chart4Data: {
        data: {
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
        deviceNormalPercent: 99.01
      },

      // 底部左边第二个图表数据
      chart5Data: {
        data: {
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
        avgTime: 55.1
      },

      // 底部右边第一个滚动榜单数据
      chart6Data: {
        data: [
          {
            title: '赵亚伟',
            info: '月累计排除故障: 3起'
          },
          {
            title: '刘川',
            info: '月累计排除故障: 3起'
          },
          {
            title: '方扛',
            info: '月累计排除故障: 3起'
          },
          {
            title: '孙鹏飞',
            info: '月累计排除故障: 3起'
          },
          {
            title: '仲文豪',
            info: '月累计排除故障: 2起'
          },
          {
            title: '李东洋',
            info: '月累计排除故障: 2起'
          },
          {
            title: '贾果果',
            info: '月累计排除故障: 1起'
          },
          {
            title: '魏振正',
            info: '月累计排除故障: 1起'
          }
        ],
        showItemNum: 5
      },

      // 底部右边第二个滚动榜单数据
      chart7Data: {
        data: [
          {
            title: '液晶显示器',
            info: '月累计: 2起'
          },
          {
            title: '车牌识别仪',
            info: '月累计: 2起'
          },
          {
            title: '自动栏杆机',
            info: '月累计: 2起'
          },
          {
            title: '称重仪表',
            info: '月累计: 2起'
          },
          {
            title: '收费键盘',
            info: '月累计: 2起'
          }
        ],
        showItemNum: 5
      },

      // 底部右边第三个滚动榜单数据
      bottomRightScrollBorad3Data: {
        data: [
          {
            title: '栏杆机不能抬起',
            info: '月累计: 5起'
          },
          {
            title: '栏杆机落杆',
            info: '月累计: 3起'
          },
          {
            title: '光端机故障',
            info: '月累计: 2起'
          },
          {
            title: '票据打印机',
            info: '月累计: 2起'
          },
          {
            title: '视频无图像',
            info: '月累计: 2起'
          },
          {
            title: '视频花屏',
            info: '月累计: 1起'
          },
          {
            title: '车牌识别仪',
            info: '月累计: 1起'
          }
        ],
        showItemNum: 5
      },

      // 底部右边第四个滚动榜单数据
      chart9Data: {
        data: [
          {
            title: '收费广场',
            info: '发生故障: 3起'
          },
          {
            title: '外场道路',
            info: '发生故障: 3起'
          },
          {
            title: '运维分中心',
            info: '发生故障: 3起'
          },
          {
            title: '服务区',
            info: '发生故障: 3起'
          },
          {
            title: '其他',
            info: '发生故障: 2起'
          }
        ],
        showItemNum: 4
      },

      path: '/rest/datav/manage/interface/list',
      paths: []
    }
  },
  methods: {
    async init () {
      const { getAllPaths, getChartsData } = this

      await getAllPaths()

      await getChartsData()
    },
    getAllPaths () {
      const { path, $http: { get } } = this

      return get(path).then(({ code, data }) => {
        if (code === 'success') {
          this.paths = data.interfaces

          this.topMiddleTitle = data.title
        } else {
          console.error('数据返回异常!')
        }
      }).catch(e => {
        console.error('DataV接口数据异常!')
      })
    },
    getChartsData () {
      const { paths, getChartData, getChartsData } = this

      return Promise.all(paths.map(path => getChartData(path))).then(e => setTimeout(getChartsData, 30000))
    },
    async getChartData ({ number, url }) {
      const { $http: { get } } = this

      if (!url) return

      return get(url).then(({ code, data }) => {
        if (code === 'success') {
          this[`chart${number}Data`] = data
        } else {
          console.error(`${number}接口异常`)
        }
      }).catch(e => console.error(`${number}接口异常`))
    }
  },
  created () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
#manage-desk {
  width: 100%;
  height: 100%;

  .header {
    position: relative;
    height: 80px;

    .left, .middle, .right {
      position: absolute;
    }

    .left {
      left: 35px;
      bottom: 0px;
      font-size: 20px;
      color: rgba(1, 134, 187, 0.91);
    }

    .middle {
      font-size: 33px;
      left: 50%;
      bottom: 0px;
      transform: translateX(-50%);
    }

    .right {
      width: 140px;
      font-size: 18px;
      right: 130px;
      bottom: -20px;
      text-align: center;
    }
  }

  .content {
    height: calc(~"100% - 80px");
    display: flex;
    flex-direction: column;
  }

  .top {
    width: 100%;
    height: 35%;
    margin-top: 20px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: row;
  }

  .bottom {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .top-left, .bottom-left {
    width: 32%;
    height: 100%;
  }

  .top-left {
    position: relative;

    .top-left-title-1, .top-left-title-2 {
      position: absolute;
      font-size: 20px;
      width: 170px;
    }

    .top-left-title-1 {
      left: 51%;
      text-align: right;
      top: 20px;
    }

    .top-left-title-2 {
      right: 51%;
      text-align: left;
      bottom: 20px;
    }

    .border-box-5 {
      position: absolute;
      width: 48%;
      height: 60%;
    }

    .tlb-text {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      :nth-child(1) {
        color: #00c0ff;
        font-size: 48px;
        font-weight: bold;

        &::after {
          font-size: 30px;
          font-weight: bold;
          color: #fff;
          margin-left: 10px;
        }
      }

      .small-text {
        font-size: 16px;
        margin: 10px 0px;

        &::before {
          margin-right: 40px;
        }
      }

      :nth-child(2) {

        &::before {
          content: '同期';
        }
      }

      :nth-child(3) {

        &::before {
          content: '环期';
        }
      }
    }

    .top-left-box-1 {
      top: 0px;
      left: 0px;

      .tlb-text {
        left: 40px;
      }

      .tlb-text :nth-child(1)::after {
        content: '件'
      }
    }

    .top-left-box-2 {
      bottom: 0px;
      right: 0px;

      .tlb-text {
        right: 40px;
      }

      .tlb-text :nth-child(1)::after {
        content: '件 / 日'
      }
    }
  }

  .top-right, .bottom-right {
    flex: 1;
    margin-left: 30px;
  }

  .top-right {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .polyline-chart {
      width: 40%;
    }

    .title-item {
      position: absolute;
      right: 0px;
      width: 180px;
      font-size: 20px;
      text-align: right;
    }
  }

  .bottom-left {
    position: relative;
    display: flex;

    .bottom-left-decoration-1, .bottom-left-decoration-2 {
      position: absolute;
      height: 42%;
      left: 50%;
      margin-left: -3px;
    }

    .bottom-left-decoration-1 {
      top: 8%;
      transform: rotate(180deg);
    }

    .bottom-left-decoration-2 {
      bottom: 8%;
    }
  }

  .bottom-left-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: center;

    .bli-title {
      height: 80px;
      font-size: 20px;
      line-height: 80px;
    }

    .bli-value {
      height: 80px;
      line-height: 80px;
      font-size: 48px;
      color: rgb(0, 192, 255);
      font-weight: bold;

      &::after {
        color: #fff;
        font-size: 30px;
        font-weight: normal;
      }

      &.left-value {
        &::after {
          content: '%'
        }
      }

      &.right-value {
        &::after {
          content: '小时'
        }
      }
    }

    .bli-chart {
      height: 50%;
    }
  }

  .bottom-right {
    display: flex;
    flex-direction: row;
  }

  .bottom-right-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 -5px;
    padding: 20px 25px;

    .title-item {
      height: 50px;
      line-height: 50px;
      margin-bottom: 20px;
      font-size: 20px;

      img {
        height: 40px;
        width: 40px;
        vertical-align: middle;
        margin-left: 20px;
        margin-right: 5px;
      }
    }

    .scroll-board {
    }
  }
}
</style>
