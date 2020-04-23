<template>
  <view class="index-wrap">
    <view class="notify-mask" :hidden="notifyShow"
          @tap="hideNotify"></view>
    <view class="news-wrap"
          :class="[tabBarState === false ? 'heightShow' : 'heightHide']"
          @tap="showNotify">
      <view class="news-notify"
            :class="[notifyShow === true ? 'notify-hide' : 'notify-show' ]"
            @tap.stop="hideNotify">
        <text class="notify-text">
          {{getMerchantInfo.nutritionCanteenDinnerTime}}
        </text>
      </view>
      <van-notice-bar delay="0" speed="30"
                      :text="getMerchantInfo.nutritionCanteenDinnerTime"/>
      <text class="news-icon"></text>
    </view>
    <view class="header-content-wrap" :hidden="tabBarState">
      <uni-header></uni-header>
      <goods></goods>
    </view>
    <!--订单-->
    <view v-if="tabBarState">
      <order-list class="order-main"></order-list>
    </view>
    <!--底部Tab-->
    <view class="tab-bar-wrapper">
      <tab-bar @tabBarIndex="tabBarIndex"></tab-bar>
    </view>
    <!--套餐选择菜品弹框-->
    <view class="foods-format-wrap" :hidden="getFormatWrapState">
      <format-dialog></format-dialog>
    </view>
    <!--Loading组件-->
    <view class="loading-wrap" :hidden="getLoadingState">
      <loading-layer></loading-layer>
    </view>
    <!--骨架屏遮罩-->
    <view class="transition-wrap">
      <uni-transition></uni-transition>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import Header from 'pages/header/header';
  import Goods from 'components/goods/goods';
  import LoadingLayer from 'components/loading/loading';
  import TabBar from 'components/tab-bar/tab-bar';
  import OrderList from 'components/order-list/order-list';
  import FormatDialog from 'components/format-dialog/format-dialog';
  import Transition from 'components/transition/transition';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    data() {
      return {
        tabBarState: false,
        notifyShow: true
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
      showNotify() {
        this.notifyShow = false;
      },
      hideNotify() {
        this.notifyShow = true;
      },
      tabBarIndex(index) {
        if (index === 0) {
          this.tabBarState = false;
        } else {
          this.tabBarState = true;
        }
      },
      ...mapActions([
        'setLoadingState'
      ])
    },
    computed: {
      ...mapGetters([
        'getLoadingState',
        'getMerchantInfo',
        'getFormatWrapState'
      ])
    },
    components: {
      'uni-header': Header,
      LoadingLayer,
      Goods,
      TabBar,
      OrderList,
      FormatDialog,
      'uni-transition': Transition
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .news-wrap {
    position: relative;
    z-index: 999;
    &.heightShow {
      height 30px;
    }
    &.heightHide {
      height 0;
    }
    .news-icon {
      position: absolute;
      top: 15rpx;
      left: 15rpx;
      width: 32rpx;
      height: 32rpx;
      background: url('../../static/img/news-icon.png') no-repeat;
      background-size: cover;
    }
    .news-notify {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      padding: 20rpx;
      line-height: 36rpx;
      background: #fffbe8;
      .notify-text {
        font-size: $font-size26;
        color: #ed6a0c;
      }
    }
  }
  .notify-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 990;
  }
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
  .notify-show {
    animation: notifyShow .3s ease-out 0s both;
  }
  .notify-hide {
    animation: notifyHide .3s ease-out 0s both;
  }
  @-webkit-keyframes notifyShow {
    from {
      transform: translate3d(0, -150rpx, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @-webkit-keyframes notifyHide {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, -150rpx, 0);
    }
  }
</style>
