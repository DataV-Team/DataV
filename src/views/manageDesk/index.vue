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
              <div>22.0</div>
              <div class="small-text">66</div>
              <div class="small-text">0</div>
            </div>
          </border-box-5>

          <border-box-5 class="top-left-box-2" :reverse="true">
            <div class="tlb-text">
              <div>0.1</div>
              <div class="small-text">66</div>
              <div class="small-text">0</div>
            </div>
          </border-box-5>
        </div>
      </div>

      <div class="bottom">
        <div class="bottom-left"></div>
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
      topMiddleTitle: '漯周界-机电运维管理台'
    }
  }
}
</script>

<style lang="less">
@import url('../../assets/style/manageDesk.less');

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
      font-size: @MDHLFS;
      color: @MDHLTC;
    }

    .middle {
      font-size: @MDHMFS;
      font-weight: bold;
      left: 50%;
      bottom: 0px;
      transform: translateX(-50%);
    }

    .right {
      width: 140px;
      font-size: @MDHRFS;
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
    box-shadow: 0 0 3px red;
    width: 100%;
    height: 35%;
    margin-top: 20px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: row;
  }

  .bottom {
    flex: 1;
    box-shadow: 0 0 3px green;
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
}
</style>
