<template>
  <div id="border-box-demo">
    <border-box-1 class="border-box-item">
      border-box-1
    </border-box-1>

    <border-box-2 class="border-box-item">
      <border-box-2 class="bbi-2">border-box-2</border-box-2>
    </border-box-2>

    <border-box-3 class="border-box-item">
      border-box-3
    </border-box-3>

    <border-box-4 class="border-box-item">
      border-box-4
    </border-box-4>

    <border-box-4 class="border-box-item" :reverse="true">
      border-box-4(reverse)
    </border-box-4>

    <border-box-5 class="border-box-item">
      border-box-5
    </border-box-5>

    <border-box-5 class="border-box-item" :reverse="true">
      border-box-5(reverse)
    </border-box-5>

    <border-box-6 class="border-box-item">
      <border-box-6 class="bbi-6">border-box-6</border-box-6>
      <border-box-6 class="bbi-6">border-box-6</border-box-6>
      <border-box-6 class="bbi-6">border-box-6</border-box-6>
      <border-box-6 class="bbi-6">border-box-6</border-box-6>
    </border-box-6>
  </div>
</template>

<script>
export default {
  name: 'BorderBoxDemo'
}
</script>

<style lang="less">
#border-box-demo {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .border-box-item {
    position: relative;
    width: 50%;
    height: 300px;
    text-align: center;
    line-height: 300px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .bbi-2 {
    position: absolute;
    width: 200px;
    height: 80px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 50px;
  }

  .bbi-6 {
    width: 25%;
    height: 100%;
    float: left;
  }
}
</style>
