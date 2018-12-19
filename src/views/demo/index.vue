<template>
  <div class="demo">
    <div class="menu-bar">
      <div :class="`menu-item ${activeIndex === index && 'active'}`"
        v-for="(item, index) in menuData"
        :key="item.title"
        @click="$router.push({ name: item.routerName }) & (activeIndex = index)">
        {{ item.title }}
      </div>
    </div>

    <div class="router-container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  data () {
    return {
      activeIndex: 0,

      menuData: [
        {
          title: 'Document',
          routerName: 'document'
        },
        {
          title: 'Border-Box',
          routerName: 'borderBox'
        },
        {
          title: 'Decoration',
          routerName: 'decoration'
        },
        {
          title: 'Chart',
          routerName: 'chart'
        },
        {
          title: 'Other',
          routerName: 'other'
        },
        {
          title: 'Show',
          routerName: 'show'
        }
      ]
    }
  },
  methods: {
    initActiveIndex () {
      const { $route: { name }, menuData } = this

      this.activeIndex = menuData.findIndex(({ routerName }) => routerName === name)
    }
  },
  created () {
    const { initActiveIndex } = this

    initActiveIndex()
  }
}
</script>

<style lang="less">
.demo {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/bg.png');
  background-size: 100%;
  color: #fff;

  .menu-bar {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 10px 0px;
  }

  .active {
    border-bottom: 3px solid #0084ff;
  }

  .menu-item {
    width: 120px;
    text-align: center;
    margin: 0px 20px;
    cursor: pointer;
    z-index: 9;

    &:hover {
      border-bottom: 3px solid #0084ff;
    }

    &:active {
      color: #0084ff;
    }
  }

  .router-container {
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding: 70px 100px 0px 100px;
    box-sizing: border-box;
  }
}
</style>
