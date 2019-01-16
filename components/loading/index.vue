<template>
  <div class="loading">
    <img class="loading-img" src="./img/loading.png">
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="less">
.loading {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  .loading-img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    margin-left: -15px;
    margin-top: -15px;
    transform: rotate(0deg);
    animation: round 1s linear infinite;
  }

  @keyframes round {
    to {
      transform: rotate(360deg)
    }
  }
}
</style>
