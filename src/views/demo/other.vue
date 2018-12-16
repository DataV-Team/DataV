<template>
  <div id="other">
    <border-box-7 class="other-item">
      <div class="component">
        <percent-pond :percent="66" />
      </div>

      <div class="config-info">
        <div class="title">Percent-Pond</div>

        <highlight-code>
&lt;percent-pond :percent="1399" /&gt;
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="other-item">
      <div class="component">
        <number-show :number="1399" />
      </div>

      <div class="config-info">
        <div class="title">Number-Show</div>

        <highlight-code>
&lt;number-show :number="1399" /&gt;
        </highlight-code>
      </div>
    </border-box-7>
  </div>
</template>

<script>
export default {
  name: 'Other'
}
</script>

<style lang="less">
#other {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .other-item {
    width: 80%;
    margin-left: 20%;
    min-height: 300px;
    align-items: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }

  .component {
    width: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .config-info {
    padding: 0px 30px;
    display: flex;
    flex-direction: column;

    .highlight-code {
      margin: -30px 0px;
    }
  }

  .percent-pond {
    width: 300px;
    height: 80px;
  }
}
</style>
