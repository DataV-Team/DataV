<template>
  <div class="header">
    <div class="left">技术支持：河南东方世纪交通科技股份有限公司</div>
    <div class="middle">漯周界-机电设备电子档案</div>
    <border-box-2 class="right">
      综合管理台
    </border-box-2>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="less">
@import url('../../assets/style/index.less');

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
</style>
