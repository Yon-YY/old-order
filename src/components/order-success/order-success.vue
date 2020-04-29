<template>
  <view class="order-details-wrap">
    <view class="desc-state-text">
      <text class="back-home-icon" @tap="home"></text>
      <text class="back-home-text" @tap="home">首页</text>
    </view>
    <view class="order-details-box">
      <order-foodlist :titleState="titleState"
                      :listItemTitle="listItemTitle"
                      :foodsList="orderReceived.dishList"
                      :payAmount="payAmount"></order-foodlist>
    </view>
    <view class="order-message-wrap">
      <text class="order-message-title">订单信息</text>
      <view class="massage-item">
        <text class="left-text">订单编号</text>
        <text class="right-text">{{orderNo}}</text>
      </view>
      <view class="massage-item">
        <text class="left-text">支付时间</text>
        <text class="right-text">{{_timeConver}}</text>
      </view>
      <view class="massage-item">
        <text class="left-text">支付方式</text>
        <text class="right-text">微信支付</text>
      </view>
      <view class="contact-merchant" @tap="call">
        <text class="contact-icon"></text>
        致电商家
      </view>
    </view>
    <view class="desc-message-wrap">
      <text class="desc-message-title">配送信息</text>
      <view class="desc-item">
        <text class="desc-left">配送地址</text>
        <text class="desc-right">{{orderReceived.orderAddress}}
          {{orderReceived.userName}} {{orderReceived.phone}}
        </text>
      </view>
      <view class="desc-item">
        <text class="desc-left">订单备注</text>
        <text class="desc-right">{{orderReceived.remark}}</text>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import OrderFoodlist from '../order-foodlist/order-foodlist';
  import {mapActions} from 'vuex';
  import {timeStampDate} from 'js/util';

  export default {
    data() {
      return {
        orderNo: uni.getStorageSync('orderNo'),
        orderReceived: {}, // 接收上一个页面传入的对象
        dishList: {},
        payAmount: uni.getStorageSync('payAmount'), // 总价
        titleState: true,
        listItemTitle: '订单信息',
        remarks: '', // 备注
      };
    },
    methods: {
      home() {
        const _this = this;
        uni.showLoading({
          title: '正在加载...',
          mask: true
        });
        setTimeout(() => {
          uni.reLaunch({
            url: '../../pages/index/index',
            success() {
              uni.hideLoading();
              _this.setTabBarState([0, false]);
            }
          }, 1000);
        });
      },
      call() {
        uni.makePhoneCall({
          phoneNumber: this.orderReceived.phone
        });
      },
      ...mapActions([
        'setTabBarState'
      ])
    },
    computed: {
      _timeConver() {
        return timeStampDate(new Date().getTime());
      },
    },
    components: {
      OrderFoodlist
    },
    onLoad(params) {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
      // 接收上一个页面传入的对象
      this.orderReceived = JSON.parse(JSON.parse(decodeURIComponent(params.item)));
    },
    onShow() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .order-details-wrap {
    .desc-state-text {
      display: flex;
      padding: 30rpx 0;
      color: $color-text;
      background: $color-button-text;
      .back-home-icon {
        margin-left: 25rpx;
        width: 46rpx;
        height: 40rpx;
        background: url('../../static/img/home-currt.png') no-repeat;
        background-size: cover;
      }
      .back-home-text {
        display: flex;
        align-items: center;
        padding-left: 10rpx;
        font-size: $font-size26;
      }
    }
    .order-details-box {
      margin: 24rpx;
      background: $color-button-text;
      border-radius: 16rpx;
    }
    .order-message-wrap, .desc-message-wrap {
      padding: 40rpx;
      margin: 24rpx;
      background: $color-button-text;
      font-size: $font-size26;
      border-radius: 16rpx;
      .order-message-title, .desc-message-title {
        margin-bottom: 40rpx;
        color: $color-text;
        font-weight: bold;
        font-size: $font-size32;
      }
      .massage-item, .desc-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40rpx;
        font-size: $font-size24;
        .left-text, .desc-left {
          line-height: 36rpx;
          color: $color-theme;
        }
        .right-text, .desc-right {
          line-height: 36rpx;
          color: $color-theme-b;
        }
      }
      .contact-merchant {
        display: flex;
        justify-content: flex-end;
        padding-top: 40rpx;
        border-top: $color-background 1px solid;
        .contact-icon {
          flex: 0 0 32rpx;
          margin-right: 25rpx;
          width: 32rpx;
          height: 32rpx;
          background: url('../../static/img/phone-iocn.png') no-repeat;
          background-size: cover;
        }
      }
    }
    .desc-message-wrap {
      margin-bottom: 40rpx;
    }
    .loading-local-wrap {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      width: 100%;
      height: 100%
    }
    .loading-box {
      border-radius: 10rpx;
      width: 180rpx;
      height: 190rpx;
      background: rgba(0, 0, 0, 0.6);
    }
  }
</style>
