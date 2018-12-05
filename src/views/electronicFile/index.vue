<template>
  <div id="electronic-file">
    <ef-header />

    <border-box-1 class="content">
      <border-box-3 class="left">
        this is left
      </border-box-3>

      <div class="right">
        <div class="right-top">
          <border-box-3 class="right-top-left">
            this is right top left
          </border-box-3>

          <div class="right-top-right">
            <border-box-3 class="right-top-right-one">
              this is right top right one
            </border-box-3>

            <border-box-4 class="right-top-right-two">
              this is right top right two
            </border-box-4>
          </div>
        </div>

        <border-box-4 class="right-bottom">
          this is right bottom
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

<style lang="less">
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
  }

  .right-top-right {
    flex: 1;
    margin-left: 10px;
  }

  .right-top-right-one, .right-top-right-two {
    height: 50%;
  }

  .right-top-right-one {
    margin-bottom: 5px;
  }

  .right-top-right-two {
    margin-top: 5px;
  }

  .right-bottom {
    flex: 1;
  }
}
</style>
