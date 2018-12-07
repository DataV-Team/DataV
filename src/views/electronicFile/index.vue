<template>
  <div id="electronic-file">
    <div class="header">
      <div class="left">{{ technicalSupport }}</div>
      <div class="middle">{{ topMiddleTitle }}</div>
      <border-box-2 class="right">
        综合管理台
      </border-box-2>
    </div>

    <border-box-1 class="content">
      <border-box-3 class="left">
        <div class="left-title">{{ leftchart1StationName }}</div>

        <div class="left-device-num"><div>设备运行总数</div><div>{{ leftchart1Data ? multipleSum(...leftchart1Data.data.map(({ value }) => value)) : 0 }}</div></div>
        <capsule-chart class="left-chart" :data="leftchart1Data" />

        <decoration-2 class="left-d2" />

        <div class="station-name">{{ leftchart2StationName }}</div>
        <div class="left-device-num"><div>设备运行总数</div><div>{{ leftchart2Data ? multipleSum(...leftchart2Data.data.map(({ value }) => value)) : 0 }}</div></div>
        <ring-chart class="left-chart" :data="leftchart2Data" />

        <div class="station-name">{{ leftchart3StationName }}</div>
        <div class="left-device-num"><div>设备运行总数</div><div>{{ leftchart3Data ? multipleSum(...leftchart3Data.data.map(({ value }) => value)) : 0}}</div></div>
        <capsule-chart class="left-chart" :data="leftchart3Data" />
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
                设备总数<number-show :number="rightTopChartData ? multipleSum(...rightTopChartData.data.map(({ value }) => value)) : 0" />
              </div>
            </div>

            <div class="rtl-chart-container">
              <div class="device-num-container">
                <div class="num-item">
                  <div>{{ rightTopChartData.data[0].value }}</div>
                  <div>{{ rightTopChartData.data[0].title }}</div>
                </div>
                <div class="num-item">
                  <div>{{ rightTopChartData.data[1].value }}</div>
                  <div>{{ rightTopChartData.data[1].title }}</div>
                </div>
              </div>

              <ring-chart :data="rightTopChartData" />

              <div class="device-num-container">
                <div class="num-item">
                  <div>{{ rightTopChartData.data[2].value }}</div>
                  <div>{{ rightTopChartData.data[2].title }}</div>
                </div>
                <div class="num-item">
                  <div>{{ rightTopChartData.data[3].value }}</div>
                  <div>{{ rightTopChartData.data[3].title }}</div>
                </div>
              </div>
            </div>

          </border-box-3>

          <div class="right-top-right">
            <border-box-3 class="right-top-right-one">
              <div class="rtr-title">{{ rightchart1StationName }}</div>

              <div class="rtr-chart-container">
                <div class="device-num">
                  <div>{{ rightchart1Data ? multipleSum(...rightchart1Data.data.map(({ value }) => value)) : 0 }}</div>
                  <div>设备运行总数</div>
                </div>

                <capsule-chart class="rtr-chart" :data="rightchart1Data" />
              </div>
            </border-box-3>

            <border-box-4 class="right-top-right-two" :reverse="true">
              <div class="rtr-title">{{ rightchart2StationName }}</div>

              <div class="rtr-chart-container">
                <div class="device-num">
                  <div>{{ rightchart2Data ? multipleSum(...rightchart2Data.data.map(({ value }) => value)) : 0}}</div>
                  <div>设备运行总数</div>
                </div>

                <ring-chart class="rtr-chart" :data="rightchart2Data" />
              </div>
            </border-box-4>
          </div>
        </div>

        <border-box-4 class="right-bottom">
          <div class="rb-item">
            <div class="station-name">{{ bottomChart1StationName }}</div>
            <ring-chart :data="bottomChart1Data" />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">{{ bottomChart2StationName }}</div>
            <ring-chart :data="bottomChart2Data" />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">{{ bottomChart3StationName }}</div>
            <ring-chart :data="bottomChart3Data" />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">{{ bottomChart4StationName }}</div>
            <ring-chart :data="bottomChart4Data" />
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
      topMiddleTitle: '漯周界-机电设备电子档案',

      // 左边第一个图表数据
      leftchart1StationName: '豫宛省界站',
      leftchart1Data: {
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
      leftchart2StationName: '纸店收费站',
      leftchart2Data: {
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
      leftchart3StationName: '沈丘收费站',
      leftchart3Data: {
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

      // 右边顶部图表数据
      rightTopChartData: {
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

      // 右边第一个图表数据
      rightchart1StationName: '漯周界高速监控中心',
      rightchart1Data: {
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

      // 右边第二个图表数据
      rightchart2StationName: '漯周界高速服务区',
      rightchart2Data: {
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

      // 底部第一个图表数据
      bottomChart1StationName: '项城收费站',
      bottomChart1Data: {
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
      bottomChart2StationName: '周口收费站',
      bottomChart2Data: {
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
      bottomChart3StationName: '谭庄收费站南',
      bottomChart3Data: {
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
      bottomChart4StationName: '谭庄收费站北',
      bottomChart4Data: {
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
      }
    }
  },
  methods: {},
  created () {}
}
</script>

<style lang="less" scoped>
@import url('../../assets/style/electroniceFile.less');

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
      font-size: @EFHLFS;
      color: @EFHLTC;
    }

    .middle {
      font-size: @EFHMFS;
      left: 50%;
      bottom: 0px;
      transform: translateX(-50%);
    }

    .right {
      width: 140px;
      font-size: @EFHRFS;
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
      font-size: @EFLTFS;
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
        font-size: @EFDNTFS;
        text-indent: 20px;
      }

      :nth-child(2) {
        font-size: @EFDNNFS;
        color: @EFNC;
        font-weight: bold;
        margin-left: 30px;
      }
    }

    .station-name {
      height: 30px;
      line-height: 30px;
      text-indent: 20px;
      font-size: @EFLSFS;
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
      font-size: @EFRTLHFS;
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
        font-size: @EFRTLDNFS;

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
            font-size: @EFRTLNINFS;
            text-indent: 35px;
            font-weight: bold;
          }

          :nth-child(2) {
            font-size: @EFRTLNITFS;
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
      font-size: @EFRTRTFS;
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
          color: @EFNC;
          font-weight: bold;
          font-size: @EFDNNFS;
          height: 100px;
          line-height: 100px;
          margin-top: 30px;
        }

        :nth-child(2) {
          font-size: @EFDNTFS;
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
        font-size: @EFBSNFS;
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
