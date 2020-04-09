<template>
  <view class="index-wrap">
    <view class="header-content-wrap" :hidden="!tabBarState">
      <m-header></m-header>
      <goods></goods>
    </view>
    <!--订单-->
    <view :hidden="tabBarState">
      <order-list class="order-main"></order-list>
    </view>
    <!--底部Tab-->
    <view class="tab-bar-wrapper">
      <tab-bar @tabBarIndex="tabBarIndex"></tab-bar>
    </view>
    <!--套餐规格弹框-->
    <view class="foods-format-wrap" :hidden="getFormatWrapState">
      <format-dialog></format-dialog>
    </view>
    <!--Loading组件-->
    <view class="loading-wrap" :hidden="getLoadingState">
      <loading-layer></loading-layer>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import Header from 'pages/header/header';
  import Goods from 'components/goods/goods';
  import LoadingLayer from 'components/loading/loading';
  import TabBar from 'components/tab-bar/tab-bar';
  import OrderList from 'components/order-list/order-list';
  import formatDialog from 'components/format-dialog/format-dialog';
  import {mapGetters} from 'vuex';

  export default {
    data() {
      return {
        tabBarState: true
      }
    },
    onLoad() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    },
    onShow() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    },
    methods: {
      tabBarIndex(index) {
        if (index === 0) {
          this.tabBarState = true;
        } else {
          this.tabBarState = false;
        }
      }
    },
    computed: {
      ...mapGetters([
        'getLoadingState',
        'getFormatWrapState'
      ])
    },
    components: {
      'm-header': Header,
      LoadingLayer,
      Goods,
      TabBar,
      OrderList,
      formatDialog
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .tab-bar-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
  }
  .foods-format-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%
    background: rgba(0, 0, 0, 0.8);
  }
</style>
