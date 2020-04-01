<template>
  <view class="order-details-wrap">
    <view class="desc-state-text">
      <text class="desc-state" :class="_orderStateText">
        {{orderReceived.orderTypeText}}
      </text>
      <text class="desc-time" v-if="orderDetails.orderType === 5">
        预计明天就餐时间点送达
      </text>
    </view>
    <view class="order-details-box">
      <order-foodlist :titleState="titleState"
                      :listItemTitle="listItemTitle"
                      :foodsList="orderDetails.dishList"
                      :payAmount="orderReceived.payAmount"></order-foodlist>
    </view>
    <view class="order-message-wrap">
      <text class="order-message-title">订单信息</text>
      <view class="massage-item">
        <text class="left-text">订单号码</text>
        <text class="right-text">{{orderDetails.orderNo}}</text>
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
        <text class="desc-right">{{orderDetails.orderAddress}}
          {{orderDetails.userName}} {{orderDetails.phone}}
        </text>
      </view>
      <view class="desc-item">
        <text class="desc-left">订单备注</text>
        <text class="desc-right">{{orderDetails.orderRemark}}</text>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import OrderFoodlist from '../order-foodlist/order-foodlist';
  import {timeStampDate} from 'js/util';
  import {orderDetailsMsg} from 'js/apiConfig';

  // import {ordersDetails} from 'js/orderDetails';

  export default {
    data() {
      return {
        orderReceived: {}, // 接收上一个页面传入的对象
        orderDetails: {},
        titleState: true,
        listItemTitle: '商品信息'
      };
    },
    methods: {
      call() {
        uni.makePhoneCall({
          phoneNumber: this.orderDetails.phone
        });
      }
    },
    // created() {
    //     const data = {
    //       'goodsOrderId': '1020878323795890176'
    //     }
    //     orderDetails(data).then(res => {
    //       this.orderDetails = res.data.data
    //       // console.log(this.orderDetails);
    //     });
    //   this.orderDetails = ordersDetails.data;
    //   console.log('详情', this.orderDetails);
    // },
    computed: {
      _timeConver(){
        return timeStampDate(this.orderDetails.orderValidPayTime);
      },
      _orderStateText() {
        const state = this.orderDetails.orderType;
        if (state === 1 || state === 3 || state === 5 || state === state === 6 || state === 7) {
          return 'desc-state-active';
        } else {
          return '';
        }
      }
    },
    onLoad(params) {
      // 接收上一个页面传入的对象
      this.orderReceived = JSON.parse(decodeURIComponent(params.item));
      if (this.orderReceived) {
        const data = {
          'deviceMarker': 'KBS1806260769',
          'orderId': this.orderReceived.orderId
        }
        orderDetailsMsg(data).then(res => {
          this.orderDetails = res.data.data
        });
      }
    },
    components: {
      OrderFoodlist
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .order-details-wrap {
    .desc-state-text {
      padding: 0 40rpx;
      color: $color-text;
      background: $color-button-text;
      .desc-state {
        padding: 20rpx 0;
        font-weight: $font-weight-b;
        font-size: $font-size36;
        &.desc-state-active {
          color: $color-background-button;
        }
      }
      .desc-time {
        padding-bottom: 24rpx;
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
  }
</style>
