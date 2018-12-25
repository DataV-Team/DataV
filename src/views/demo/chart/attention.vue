<template>
  <border-box-7 class="attention" id="attention">
    <div class="title">Attention</div>

    <div class="title">Colors</div>

    <div class="text-info">
      下列组件颜色配置均绑定在节点的colors属性上
    </div>

    <div class="text-info">
      若未绑定将自动使用默认配色
    </div>

    <div class="text-info">
      colors所绑变量应为hex十六进制色的数组,示例如下
    </div>

    <highlight-code>
&lt;chart :data="data" :colors="color" /&gt;
    </highlight-code>

    <highlight-code>
// 修改默认配色方案 可直接修改./src/config/color.js
colors: ['#9cf4a7', '#66d7ee', '#eee966', '#a866ee', '#ee8f66', '#ee66aa']
// 数组内颜色将自动循环使用
    </highlight-code>

    <div class="text-info">
      如在特殊颜色配置属性中使用colors关键字,将自动将该属性配置指向colors
    </div>

    <div class="text-info">
      下列组件均不再展示colors属性绑定的变量
    </div>

    <div class="title">Axis</div>

    <div class="text-info">
      下列组件中多有使用坐标轴 坐标轴配置如下
    </div>

    <highlight-code class="center-code">
// 坐标轴分为四部分 x y ax ay
// ax ay 即为x y轴相对的坐标轴
// 如果要使ax ay生效 data中应配置 againstAxis: true
axisData: {
data: [
  { // 该组数据基于 x y 轴
    data: [123, 123, 123, '', 123]
  },
  { // 改组数据基于 ax
    data: [123, 123, 123, '', 123],
    againstAxis: true
  }
],
x: {
  // 必须 x轴展示标签
  data: ['label1', 'label2', 'label3', 'label4'],
  // 非必须 单位
  unit: '单位',
  // 非必须 禁止绘制该轴坐标线
  noAxisLine: true,
  // 非必须 禁止绘制该轴展示标签
  noAxisTag: true,
  // 非必须 该轴偏移量
  offset: 30,
  // 非必须 是否绘制网格
  grid: true,
  // 非必须 设置网格线条为虚线
  gridType: 'dashed',
  // 非必须 网格虚线dashed
  gridLineDash: [2, 2],
  // 非必须 网格颜色 多个则循环使用
  gridColor: 'colors' | '#123456' | ['#123', '#456']
  // 非必须 设置该轴标签before字符
  tagBefore: 'before',
  // 非必须 设置该轴标签after字符
  tagAfter: 'after',
  // 非必须 设置x轴 展示标签旋转度数 仅在x轴有效
  rotate: 20
},
// y轴 也可设置data 设置data 下列专有配置自动失效
y: {
  // 非必须 强制最大值
  max: 999,
  // 非必须 强制最小值
  min: 0,
  // 非必须 强制数值展示个数
  num: 5,
  // 非必须 设置数据精度
  fixed: 2
},
// 非必须 水平坐标轴 配置该项 x y数据应对调
// 并非所有图表有效
horizon: true
}
// 具体见示例
    </highlight-code>

    <div class="title">Label-Line</div>

    <div class="text-info">
      下列组件中多有使用坐标轴 坐标轴常用配置如下
    </div>

    <highlight-code class="center-code">
// label-line 即图标底部标签
labelLineData: {
  // 必须 标签文字
  data: ['标签1', '标签2', ...],
  // 非必须 设置标签前置色块颜色 多个则循环使用
  color: '#2b7bfb',
  // 非必须 设置标签前置色块形状 rectangle 长方形 rect正方形
  type: 'rectangle'
}
// 具体见示例
    </highlight-code>

    <div id="column-chart" />
  </border-box-7>
</template>

<script>
export default {
  name: 'Attention'
}
</script>

<style lang="less">
#attention {
  width: 80%;
  margin-left: 20%;
  text-align: center;
  margin-bottom: 20px;

  .highlight-code {
    margin: -40px 0px;
  }

  .center-code {
    text-align: left;
    padding: 0px 100px;
    width: 500px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
</style>
