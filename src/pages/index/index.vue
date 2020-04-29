<template>
  <view class="index-wrap">
    <view class="notify-mask" :hidden="notifyShow"
          @tap="hideNotify"></view>
    <view class="news-wrap"
          :class="[getTabBarState[1] === false ? 'heightShow' : 'heightHide']"
          @tap="showNotify">
      <view class="news-notify"
            :class="[notifyShow === true ? 'notify-hide' : 'notify-show' ]"
            @tap.stop="hideNotify">
        <text class="notify-text">
          {{notifyText}}
        </text>
      </view>
      <van-notice-bar delay="0" speed="30"
                      :text="notifyText"/>
      <text class="news-icon"></text>
    </view>
    <view class="header-content-wrap" :hidden="getTabBarState[1]">
      <uni-header></uni-header>
      <goods></goods>
    </view>
    <!--订单-->
    <view v-if="getTabBarState[1]">
      <order-list class="order-main"></order-list>
    </view>
    <!--底部Tab-->
    <view class="tab-bar-wrapper">
      <tab-bar :iconCurrt="getTabBarState[0]"
               @tabBarIndex="tabBarIndex"></tab-bar>
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
  import {mapGetters, mapActions} from 'vuex';

  export default {
    data() {
      return {
        notifyShow: true
      }
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
          this.setTabBarState([0, false]);
        } else {
          this.setTabBarState([1, true]);
        }
      },
      ...mapActions([
        'setLoadingState',
        'setTabBarState'
      ])
    },
    computed: {
      notifyText() {
        if (this.getMerchantInfo.nutritionCanteenDinnerTime === '') {
          return '欢迎您使用点餐小程序，祝您用餐愉快！';
        } else {
          return this.getMerchantInfo.nutritionCanteenDinnerTime;
        }
      },
      ...mapGetters([
        'getLoadingState',
        'getTabBarState',
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
      FormatDialog
    },
    onLoad() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    },
    onShow() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    },
    // 分享
    onShareAppMessage(res) {
      if (res.from === 'button') {// 来自页面内分享按钮
        console.log(res.target)
      }
      return {
        title: '吃饭方便又快捷，快用手机下单点餐吧~',
        path: '/pages/login/login', //页面 path
        content: '',
        desc: '', //自定义分享描述
        imageUrl: '/static/share-img.jpg'
      }
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
