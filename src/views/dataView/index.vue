<template>
  <div class="datav-page">
    <border-box-1>
      <div class="welcome">Welcome Data View Page</div>
    </border-box-1>
  </div>
</template>

<script>
export default {
  name: 'DatavPage'
}
</script>

<style lang="less">
.datav-page {
  width: 100%;
  height: 100%;
  color: #fff;

  .border-box-1 {
    width: 100%;
    height: 100%;
    font-size: 100px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .welcome {
      margin-top: -100px;
    }
  }
}
</style>
