<template>
  <div id="other">
    <border-box-7 class="other-item">
      <div class="component">
        <water-level-pond :level="[60, 40]" />
      </div>

      <div class="config-info">
        <div class="title">Water-Level-Pond</div>

        <highlight-code>
&lt;water-level-pond :level="[60, 40]" /&gt;
        </highlight-code>

        <highlight-code>
// level必须为数组
// 可绑定colors属性 非必须 未配置该项自动使用默认色
// 当colors属性为数组时 波浪自动应用渐变色
// noGradient为true时可关闭波浪渐变色效果
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="other-item">
      <div class="component">
        <water-level-pond :level="[60, 40]" type="rect" :waveNum="2" :waveHeight="0.3" />
      </div>

      <div class="config-info">
        <div class="title">Water-Level-Pond</div>

        <highlight-code>
&lt;water-level-pond :level="[60, 40]" type="rect" :waveNum="2" :waveHeight="0.3" /&gt;
        </highlight-code>

        <highlight-code>
// 矩形样式
// waveNum 可设置波峰个数
// waveHeight 可设置波峰高度
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="other-item">
      <div class="component">
        <water-level-pond :level="[60, 40]" type="roundRect" borderColor="rgba(45, 219, 216, 0.5)" />
      </div>

      <div class="config-info">
        <div class="title">Water-Level-Pond</div>

        <highlight-code>
&lt;water-level-pond :level="[60, 40]" type="roundRect" borderColor="rgba(45, 219, 216, 0.5)" /&gt;
        </highlight-code>

        <highlight-code>
// 圆角矩形样式
// 可特殊设置边框颜色 文字与边框颜色同步
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="other-item">
      <div class="component">
        <percent-pond :percent="66" />
      </div>

      <div class="config-info">
        <div class="title">Percent-Pond</div>

        <highlight-code>
&lt;percent-pond :percent="66" /&gt;
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
  name: 'Other',
  data () {
    return {}
  }
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
    flex-shrink: 0;
  }

  .config-info {
    padding: 0px 30px;
    display: flex;
    flex-direction: column;

    .highlight-code {
      margin: -30px 0px;
    }
  }

  .water-level-pond {
    width: 150px;
    height: 200px;
  }

  .percent-pond {
    width: 300px;
    height: 80px;
  }
}
</style>
