<template>
  <div id="electronic-file">
    <div class="header">
      <div class="left">{{ technicalSupport }}</div>
      <div class="middle">{{ chart10Name }}</div>
      <border-box-2 class="right">
        综合管理台
      </border-box-2>
    </div>

    <border-box-1 class="content">
      <border-box-3 class="left">
        <div class="left-title">{{ chart1Name }}</div>

        <div class="left-device-num"><div>设备运行总数</div><div>{{ chart1Data ? multipleSum(...chart1Data.data.map(({ value }) => value)) : 0 }}</div></div>
        <capsule-chart class="left-chart" :data="chart1Data" />

        <decoration-2 class="left-d2" />

        <div class="station-name">{{ chart2Name }}</div>
        <div class="left-device-num"><div>设备运行总数</div><div>{{ chart2Data ? multipleSum(...chart2Data.data.map(({ value }) => value)) : 0 }}</div></div>
        <ring-chart class="left-chart" :data="chart2Data" />

        <div class="station-name">{{ chart3Name }}</div>
        <div class="left-device-num"><div>设备运行总数</div><div>{{ chart3Data ? multipleSum(...chart3Data.data.map(({ value }) => value)) : 0}}</div></div>
        <capsule-chart class="left-chart" :data="chart3Data" />
      </border-box-3>

      <div class="right">
        <div class="right-top">
          <border-box-3 class="right-top-left">
            <div class="rtl-header">
              <decoration-1 class="dl" />
              <div class="rtl-title">机电设备总数</div>
              <decoration-1 class="dr" />
            </div>

            <div class="rtl-device-num">
              <div class="device-num-container">
                设备总数<number-show :number="chart10Data ? multipleSum(...chart10Data.data.map(({ value }) => value)) : 0" />
              </div>
            </div>

            <div class="rtl-chart-container">
              <div class="device-num-container">
                <div class="num-item">
                  <div>{{ chart10Data.data[0].value }}</div>
                  <div>{{ chart10Data.data[0].title }}</div>
                </div>
                <div class="num-item">
                  <div>{{ chart10Data.data[1].value }}</div>
                  <div>{{ chart10Data.data[1].title }}</div>
                </div>
              </div>

              <ring-chart :data="chart10Data" />

              <div class="device-num-container">
                <div class="num-item">
                  <div>{{ chart10Data.data[2].value }}</div>
                  <div>{{ chart10Data.data[2].title }}</div>
                </div>
                <div class="num-item">
                  <div>{{ chart10Data.data[3].value }}</div>
                  <div>{{ chart10Data.data[3].title }}</div>
                </div>
              </div>
            </div>

          </border-box-3>

          <div class="right-top-right">
            <border-box-3 class="right-top-right-one">
              <div class="rtr-title">{{ chart9Name }}</div>

              <div class="rtr-chart-container">
                <div class="device-num">
                  <div>{{ chart9Data ? multipleSum(...chart9Data.data.map(({ value }) => value)) : 0 }}</div>
                  <div>设备运行总数</div>
                </div>

                <capsule-chart class="rtr-chart" :data="chart9Data" />
              </div>
            </border-box-3>

            <border-box-4 class="right-top-right-two" :reverse="true">
              <div class="rtr-title">{{ chart8Name }}</div>

              <div class="rtr-chart-container">
                <div class="device-num">
                  <div>{{ chart8Data ? multipleSum(...chart8Data.data.map(({ value }) => value)) : 0}}</div>
                  <div>设备运行总数</div>
                </div>

                <ring-chart class="rtr-chart" :data="chart8Data" />
              </div>
            </border-box-4>
          </div>
        </div>

        <border-box-4 class="right-bottom">
          <div class="rb-item">
            <div class="station-name">{{ chart4Name }}</div>
            <ring-chart :data="chart4Data" />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">{{ chart5Name }}</div>
            <ring-chart :data="chart5Data" />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">{{ chart6Name }}</div>
            <ring-chart :data="chart6Data" />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">{{ chart7Name }}</div>
            <ring-chart :data="chart7Data" />
          </div>
        </border-box-4>

      </div>

    </border-box-1>
  </div>
</template>

<script>
export default {
  name: 'ElectronicFile',
  data () {
    return {
      technicalSupport: '技术支持：河南东方世纪交通科技股份有限公司',
      chart10Name: '机电设备电子档案',

      // 左边第一个图表数据
      chart1Name: '收费站',
      chart1Data: {
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

      // 左边第二个图表数据
      chart2Name: '收费站',
      chart2Data: {
        data: [
          {
            value: 37,
            title: '收费系统'
          },
          {
            value: 12,
            title: '通信系统'
          },
          {
            value: 105,
            title: '监控系统'
          },
          {
            value: 62,
            title: '供配电系统'
          },
          {
            value: 29,
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

      // 左边第三个图表数据
      chart3Name: '收费站',
      chart3Data: {
        data: [
          {
            value: 119,
            title: '收费系统'
          },
          {
            value: 88,
            title: '通信系统'
          },
          {
            value: 55,
            title: '监控系统'
          },
          {
            value: 101,
            title: '供配电系统'
          },
          {
            value: 15,
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

      // 底部第一个图表数据
      chart4Name: '收费站',
      chart4Data: {
        data: [
          {
            value: 45,
            title: '收费系统'
          },
          {
            value: 75,
            title: '通信系统'
          },
          {
            value: 96,
            title: '监控系统'
          },
          {
            value: 16,
            title: '供配电系统'
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

      // 底部第一个图表数据
      chart5Name: '收费站',
      chart5Data: {
        data: [
          {
            value: 129,
            title: '收费系统'
          },
          {
            value: 15,
            title: '通信系统'
          },
          {
            value: 22,
            title: '监控系统'
          },
          {
            value: 64,
            title: '供配电系统'
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

      // 底部第一个图表数据
      chart6Name: '收费站',
      chart6Data: {
        data: [
          {
            value: 88,
            title: '收费系统'
          },
          {
            value: 57,
            title: '通信系统'
          },
          {
            value: 23,
            title: '监控系统'
          },
          {
            value: 110,
            title: '供配电系统'
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

      // 底部第一个图表数据
      chart7Name: '收费站',
      chart7Data: {
        data: [
          {
            value: 15,
            title: '收费系统'
          },
          {
            value: 110,
            title: '通信系统'
          },
          {
            value: 23,
            title: '监控系统'
          },
          {
            value: 66,
            title: '供配电系统'
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

      // 右边第二个图表数据
      chart8Name: '收费站',
      chart8Data: {
        data: [
          {
            value: 100,
            title: '收费系统'
          },
          {
            value: 57,
            title: '通信系统'
          },
          {
            value: 66,
            title: '监控系统'
          },
          {
            value: 32,
            title: '供配电'
          },
          {
            value: 12,
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

      // 右边第一个图表数据
      chart9Name: '收费站',
      chart9Data: {
        data: [
          {
            value: 80,
            title: '收费系统'
          },
          {
            value: 12,
            title: '通信系统'
          },
          {
            value: 126,
            title: '监控系统'
          },
          {
            value: 36,
            title: '供配电系统'
          },
          {
            value: 8,
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

      // 右边顶部图表数据
      chart10Data: {
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

      color: [
        '#00baff',
        '#3de7c9',
        '#ffffff',
        '#ffc53d',
        '#469f4b'
      ],

      path: '/rest/datav/device/interface/list',
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
      const { $http: { get }, color } = this

      return get(url).then(({ code, data }) => {
        if (code === 'success') {
          this[`chart${number}Name`] = data.name
          this[`chart${number}Data`] = {
            data: data.data,
            color,
            active: !(number === 2 || number === 8)
          }
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

<style lang="less" scoped>
#electronic-file {
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
    flex-direction: row;
  }

  .left {
    width: 22%;

    .left-title {
      height: 35px;
      font-size: 32px;
      text-align: center;
      line-height: 35px;
      margin-bottom: 30px;
    }

    .left-device-num {
      height: 35px;

      div {
        height: 35px;
        float: left;
        line-height: 35px;
      }

      :nth-child(1) {
        font-size: 16px;
        text-indent: 20px;
      }

      :nth-child(2) {
        font-size: 34px;
        color: rgb(9, 109, 217);
        font-weight: bold;
        margin-left: 30px;
      }
    }

    .station-name {
      height: 30px;
      line-height: 30px;
      text-indent: 20px;
      font-size: 16px;
    }

    .left-chart {
      width: 100%;
      height: calc(~"(100% - 252px) / 3");
    }

    .left-d2 {
      width: 90%;
      height: 2px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .right-top {
    display: flex;
    flex-direction: row;
    height: 65%;
  }

  .right-top-left {
    width: 65%;

    .rtl-header {
      position: relative;
      height: 50px;
      font-size: 32px;
      line-height: 50px;
      text-align: center;
      overflow: hidden;

      .decoration-1 {
        position: absolute;
        top: -20px;
        width: 250px;

        &.dl {
          left: 0px;
        }

        &.dr {
          right: 0px;
        }
      }
    }

    .rtl-device-num {
      display: flex;
      height: 70px;
      justify-content: space-around;
      line-height: 70px;
      margin-top: 50px;

      .device-num-container {
        font-size: 32px;

        .number-show {
          margin-left: 20px;
        }
      }
    }

    .rtl-chart-container {
      height: calc(~"100% - 170px");
      display: flex;
      flex-direction: row;

      .device-num-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 120px 0px;

        .num-item {
          height: 50px;
          line-height: 50px;
          display: flex;
          flex-direction: row;
          font-family: "Microsoft Yahei", Arial, sans-serif;

          :nth-child(1) {
            font-size: 34px;
            text-indent: 35px;
            font-weight: bold;
          }

          :nth-child(2) {
            font-size: 24px;
            margin-left: 20px;
          }
        }
      }

      .ring-chart {
        width: 330px;
      }
    }
  }

  .right-top-right {
    flex: 1;
    margin-left: 10px;

    .rtr-title {
      height: 25px;
      line-height: 25px;
      font-size: 24px;
      font-weight: bold;
    }

    .rtr-chart-container {
      flex: 1;
      height: calc(~"100% - 25px");
      display: flex;
      flex-direction: row;

      .device-num {
        width: 30%;

        div {
          text-align: center;
        }

        :nth-child(1) {
          color: rgb(9, 109, 217);
          font-weight: bold;
          font-size: 34px;
          height: 100px;
          line-height: 100px;
          margin-top: 30px;
        }

        :nth-child(2) {
          font-size: 16px;
        }
      }

      .rtr-chart {
        flex: 1;
        height: 100%;
      }
    }
  }

  .right-top-right-one, .right-top-right-two {
    height: calc(~"50% - 5px");
  }

  .right-top-right-one {
    margin-bottom: 5px;
  }

  .right-top-right-two {
    margin-top: 5px;
  }

  .right-bottom {
    flex: 1;
    display: flex;
    flex-direction: row;

    .rb-item {
      flex: 1;

      .station-name {
        font-size: 20px;
        text-align: center;
        margin-top: 20px;
        height: 30px;
        line-height: 30px;
      }

      .ring-chart {
        height: calc(~"100% - 50px");
      }
    }

    .rb-d2 {
      width: 2px;
      height: 100%;
      margin-top: 10px;
    }
  }
}
</style>
