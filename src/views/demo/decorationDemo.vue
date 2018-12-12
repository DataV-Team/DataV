<template>
  <div id="decoration-demo">
    <border-box-6 class="decoration-container">
      <decoration-1 class="decoration d1 center" />
      decoration-1
    </border-box-6>

    <border-box-6 class="decoration-container">
      <decoration-2 class="decoration d2 center" />
      decoration-2
    </border-box-6>

    <border-box-6 class="decoration-container">
      <decoration-2 class="decoration d2r center" :reverse="true" />
      decoration-2(reverse)
    </border-box-6>

    <border-box-6 class="decoration-container">
      <decoration-3 class="decoration d3 center" />
      decoration-3
    </border-box-6>

    <border-box-6 class="decoration-container">
      <decoration-4 class="decoration d4 center" />
      decoration-4
    </border-box-6>

    <border-box-6 class="decoration-container">
      <decoration-4 class="decoration d4r center" :reverse="true" />
      decoration-4(reverse)
    </border-box-6>

    <border-box-6 class="decoration-container">
      <loading class="decoration center" />
      loading
    </border-box-6>
  </div>
</template>

<script>
export default {
  name: 'DecorationDemo'
}
</script>

<style lang="less">
#decoration-demo {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  .decoration-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 20px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    line-height: 40px;
  }

  .decoration {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .center {
    top: 50%;
    left: 50%;
  }

  .d1 {
    width: 200px;
  }

  .d2 {
    width: 300px;
  }

  .d2r {
    height: 300px;
  }

  .d3 {
    width: 200px;
  }

  .d4 {
    height: 300px;
  }

  .d4r {
    width: 300px;
  }
}
</style>
