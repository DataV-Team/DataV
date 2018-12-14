<template>
  <div id="border-box">
    <border-box-1 class="border-box-item">
      <div class="title">Border-Box-1</div>
      <highlight-code>
&lt;border-box-1&gt;&lt;/border-box-1&gt;
      </highlight-code>
    </border-box-1>

    <border-box-2 class="border-box-item">
      <div class="title">Border-Box-2</div>
      <highlight-code>
&lt;border-box-2&gt;&lt;/border-box-2&gt;
      </highlight-code>
    </border-box-2>

    <border-box-3 class="border-box-item">
      <div class="title">Border-Box-3</div>
      <highlight-code>
&lt;border-box-3&gt;&lt;/border-box-3&gt;
      </highlight-code>
    </border-box-3>

    <border-box-4 class="border-box-item">
      <div class="title">Border-Box-4</div>
      <highlight-code>
&lt;border-box-4&gt;&lt;/border-box-4&gt;
      </highlight-code>
    </border-box-4>

    <border-box-4 class="border-box-item" :reverse="true">
      <div class="title">Border-Box-4(reverse)</div>
      <highlight-code>
&lt;border-box-4 :reverse="true" &gt;&lt;/border-box-4&gt;
      </highlight-code>
    </border-box-4>

    <border-box-5 class="border-box-item">
      <div class="title">Border-Box-5</div>
      <highlight-code>
&lt;border-box-5&gt;&lt;/border-box-5&gt;
      </highlight-code>
    </border-box-5>

    <border-box-5 class="border-box-item" :reverse="true">
      <div class="title">Border-Box-5(reverse)</div>
      <highlight-code>
&lt;border-box-5 :reverse="true" &gt;&lt;/border-box-5&gt;
      </highlight-code>
    </border-box-5>

    <border-box-6 class="border-box-item">
      <div class="title">Border-Box-6</div>
      <highlight-code>
&lt;border-box-6&gt;&lt;/border-box-6&gt;
      </highlight-code>
    </border-box-6>

    <border-box-7 class="border-box-item">
      <div class="title">Border-Box-7</div>
      <highlight-code>
&lt;border-box-7&gt;&lt;/border-box-7&gt;
      </highlight-code>
    </border-box-7>
  </div>
</template>

<script>
export default {
  name: 'BorderBox'
}
</script>

<style lang="less">
#border-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-bottom: 100px;

  .border-box-item {
    position: relative;
    width: 50%;
    height: 300px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      text-indent: 0px;
    }
  }
}
</style>
