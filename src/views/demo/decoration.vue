<template>
  <div id="decoration">
    <border-box-7 class="decoration-container">
      <decoration-1 class="decoration d1 center" />

      <div class="title">Decoration-1</div>
      <highlight-code>
&lt;decoration-1 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-2 class="decoration d2 center" />
      <div class="title">Decoration-2</div>
      <highlight-code>
&lt;decoration-2 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-2 class="decoration d2r center" :reverse="true" />
      <div class="title">Decoration-2(reverse)</div>
      <highlight-code>
&lt;decoration-2 :reverse="true" /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-3 class="decoration d3 center" />
      <div class="title">Decoration-3</div>
      <highlight-code>
&lt;decoration-3 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-4 class="decoration d4 center" />
      <div class="title">Decoration-4</div>
      <highlight-code>
&lt;decoration-4 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-4 class="decoration d4r center" :reverse="true" />
      <div class="title">Decoration-4(reverse)</div>
      <highlight-code>
&lt;decoration-4 :reverse="true" /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-5 class="decoration d4r center" />
      <div class="title">Decoration-5</div>
      <highlight-code>
&lt;decoration-5 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-6 class="decoration d4r center" />
      <div class="title">Decoration-6</div>
      <highlight-code>
&lt;decoration-6 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <decoration-7 class="decoration d4r center">Decoration</decoration-7>
      <div class="title">Decoration-7</div>
      <highlight-code>
&lt;decoration-7&gt;Decoration&lt;dtn-7 /&gt;
      </highlight-code>
    </border-box-7>

    <border-box-7 class="decoration-container">
      <loading class="decoration center" />
      <div class="title">Loading</div>
      <highlight-code>
&lt;loading /&gt;
      </highlight-code>
    </border-box-7>
  </div>
</template>

<script>
export default {
  name: 'DecorationDemo'
}
</script>

<style lang="less">
#decoration {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 100px;

  .decoration-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 20px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      text-indent: 0;
    }
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
