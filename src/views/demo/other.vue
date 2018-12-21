<template>
  <div id="other">
    <border-box-7 class="other-item">
      <div class="component">
        <scroll-board :index="true" :data="scrollBoardData1" :columnWidth="[50, 50, 50]" :textAlign="['center', 'center']" />
      </div>

      <div class="config-info">
        <div class="title">Water-Level-Pond</div>

        <highlight-code>
&lt;scroll-board :data="data" :index="true" :columnWidth="columnWidth" :textAlign="textAlign" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [ // 必须 每行数据的数组长度应保持一致
    ['张三', '男', '这里是地址'],
    ['李四', '女', '这里是地址'],
    ['王五', '男', '这里是地址'],
    ['赵六', '女', '这里是地址'],
    ['钱七', '男', '这里是地址'],
    ['孙八', '女', '这里是地址'],
    ['杨九', '男', '这里是地址'],
    ['吴十', '女', '这里是地址']
  ]
}
// 非必须 设置每一栏的宽度 允许插入空位 空位均分宽度
columnWidth: [50, 50, 50]
// 非必须 设置每一栏的对齐方式 允许插入空位 默认居左
textAlign: ['center', 'center']
// index 非必须 属性为真时 自动添加序号
// rowNum 非必须 可以设置展示行数
// oddBG 非必须 可以设置奇数行背景色
// evenBG 非必须 可以设置偶数行背景色
// titBG 非必须 可设置表头背景色
// carousel 非必须 设置为page 滚动时整页滚动
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="other-item">
      <div class="component">
        <scroll-board :data="scrollBoardData2" carousel="page" :columnWidth="[50, 50]" :textAlign="['center', 'center']" />
      </div>

      <div class="config-info">
        <div class="title">Water-Level-Pond</div>

        <highlight-code>
&lt;scroll-board :data="data" carousel="page" :columnWidth="columnWidth" :textAlign="textAlign" /&gt;
        </highlight-code>

        <highlight-code>
data: {
  data: [
    ['张三', '男', '这里是地址'],
    ['李四', '女', '这里是地址'],
    ['王五', '男', '这里是地址'],
    ['赵六', '女', '这里是地址'],
    ['钱七', '男', '这里是地址'],
    ['孙八', '女', '这里是地址'],
    ['杨九', '男', '这里是地址'],
    ['吴十', '女', '这里是地址']
  ],
  // 非必须 添加此项自动生成表头
  title: ['姓名', '性别', '地址']
}
columnWidth: [50, 50]
textAlign: ['center', 'center']
        </highlight-code>
      </div>
    </border-box-7>

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
        <percent-arc :percent="66" :ringLineWidth="10" :arcLineWidth="20" arcType="round">66</percent-arc>
      </div>

      <div class="config-info">
        <div class="title">Percent-Arc</div>

        <highlight-code>
&lt;percent-arc :percent="66" :ringLineWidth="10" :arcLineWidth="20" arcType="round"&gt;66&lt;percent-arc/&gt;
        </highlight-code>

        <highlight-code>
// 内置slot 可以置入任意元素
// percent 必须 设置弧度程度
// arcType 非必须 设置是否为圆角弧形 round | butt
// raidus 非必须 设置环半径
// ringLineWidth 非必须 设置环线宽度
// arcLineWidth 非必须 设置弧线宽度
// ringColor 非必须 设置环线颜色 只能设置一种颜色
// arcColor 非必须 设置弧线颜色 可以设置多种 多种自动渐变
        </highlight-code>
      </div>
    </border-box-7>

    <border-box-7 class="other-item">
      <div class="component">
        <percent-arc :percent="66" ringColor="#c7166f" :arcColor="['#2755fe', '#ff12cb']">66</percent-arc>
      </div>

      <div class="config-info">
        <div class="title">Percent-Arc</div>

        <highlight-code>
&lt;percent-arc :percent="66" ringColor="#c7166f" :arcColor="['#2755fe', '#ff12cb']"&gt;66&lt;percent-arc/&gt;
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
    return {
      scrollBoardData1: {
        data: [
          ['张三', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['李四', '女', '这里是地址这里是地址这里是地址这里是地址'],
          ['王五', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['赵六', '女', '这里是地址这里是地址这里是地址这里是地址'],
          ['钱七', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['孙八', '女', '这里是地址这里是地址这里是地址这里是地址'],
          ['杨九', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['吴十', '女', '这里是地址这里是地址这里是地址这里是地址']
        ]
      },
      scrollBoardData2: {
        data: [
          ['张三', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['李四', '女', '这里是地址这里是地址这里是地址这里是地址'],
          ['王五', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['赵六', '女', '这里是地址这里是地址这里是地址这里是地址'],
          ['钱七', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['孙八', '女', '这里是地址这里是地址这里是地址这里是地址'],
          ['杨九', '男', '这里是地址这里是地址这里是地址这里是地址'],
          ['吴十', '女', '这里是地址这里是地址这里是地址这里是地址']
        ],
        title: ['姓名', '性别', '地址']
      }
    }
  }
}
</script>

<style lang="less">
#other {
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

  .scroll-board {
    width: 350px;
    height: 200px;
  }

  .water-level-pond {
    width: 150px;
    height: 200px;
  }

  .percent-pond {
    width: 300px;
    height: 80px;
  }

  .percent-arc {
    width: 200px;
    height: 200px;
    font-size: 50px;
    color: aqua;
  }
}
</style>
