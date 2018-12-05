<template>
  <div id="electronic-file">
    <ef-header />

    <border-box-1 class="content">
      <border-box-3 class="left">
        <div class="left-title">豫皖省界站</div>

        <div class="left-device-num"><div>设备运行总数</div><div>310</div></div>
        <capsule-chart class="left-chart" />

        <decoration-2 class="left-d2" />

        <div class="station-name">纸店收费站</div>
        <div class="left-device-num"><div>设备运行总数</div><div>120</div></div>
        <ring-chart class="left-chart" />

        <div class="station-name">沈丘收费站</div>
        <div class="left-device-num"><div>设备运行总数</div><div>188</div></div>
        <capsule-chart class="left-chart" />
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
                设备总数<number-show :number="2137" />
              </div>
            </div>

            <div class="rtl-chart-container">
              <div class="device-num-container">
                <div class="num-item">
                  <div>1315</div>
                  <div>收费站</div>
                </div>
                <div class="num-item">
                  <div>415</div>
                  <div>监控中心</div>
                </div>
              </div>

              <capsule-chart />

              <div class="device-num-container">
                <div class="num-item">
                  <div>90</div>
                  <div>道路外场</div>
                </div>
                <div class="num-item">
                  <div>317</div>
                  <div>其他</div>
                </div>
              </div>
            </div>

          </border-box-3>

          <div class="right-top-right">
            <border-box-3 class="right-top-right-one">
              <div class="rtr-title">漯周界高速监控中心</div>

              <div class="rtr-chart-container">
                <div class="device-num">
                  <div>415</div>
                  <div>设备运行总数</div>
                </div>

                <capsule-chart class="rtr-chart" />
              </div>
            </border-box-3>

            <border-box-4 class="right-top-right-two" :reverse="true">
              <div class="rtr-title">漯周界高速服务区</div>

              <div class="rtr-chart-container">
                <div class="device-num">
                  <div>70</div>
                  <div>设备运行总数</div>
                </div>

                <ring-chart class="rtr-chart" />
              </div>
            </border-box-4>
          </div>
        </div>

        <border-box-4 class="right-bottom">
          <div class="rb-item">
            <div class="station-name">项城收费站</div>
            <capsule-chart />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">周口收费站</div>
            <capsule-chart />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">谭庄收费站南</div>
            <capsule-chart />
          </div>

          <decoration-2 class="rb-d2" :reverse="true"/>

          <div class="rb-item">
            <div class="station-name">谭庄收费站北</div>
            <capsule-chart />
          </div>
        </border-box-4>

      </div>

    </border-box-1>
  </div>
</template>

<script>
import efHeader from './header'

export default {
  name: 'ElectronicFile',
  components: {
    efHeader
  }
}
</script>

<style lang="less" scoped>
@import url('../../assets/style/index.less');

#electronic-file {
  width: 100%;
  height: 100%;

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

          :nth-child(1) {
            font-size: 34px;
            text-indent: 35px;
          }

          :nth-child(2) {
            font-size: 34px;
            margin-left: 20px;
          }
        }
      }

      .capsule-chart {
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

      .capsule-chart {
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
