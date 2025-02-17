<template>
  <view class="order-item-wrap">
    <view @tap="viewDetails(item)" class="order-item-box"
          v-for="(item, index) in _orderItem"
          :key="index">
      <view class="item-row font-size-26">
        <view class="row-right">
          <text class="food-title">{{item.orderAddress}}</text>
          <text class="title-icon"></text>
        </view>
        <text class="row-left"
              :class="[item.orderType === 1 || item.orderType === 3 || item.orderType === 6 ? 'state-vigilant' : 'state-text']">
          {{orderTypeText[item.orderType - 1]}}
        </text>
      </view>
      <text class="order-time">{{item.createTime}}</text>
      <view class="item-row font-size-24">
        <view class="row-right">
          <text class="food-title food-num">{{item.dishList[0].dishName}}</text>
          等{{item.dishList.length}}件商品
        </view>
        <view class="row-left">
          <text class="food-amount">￥{{item.payAmount}}</text>
        </view>
      </view>
      <view class="btn-state-wrap">
        <text class="order-btn-state play" v-if="item.orderType === 1">去支付
        </text>
        <text class="order-btn-state details" v-else>订单详情
        </text>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';
  import {timeStampDate} from 'js/util';

  export default {
    data() {
      return {
        orderTypeText: ['等待支付', '超时未支付', '等待接单', '超时未接单', '等待配送', '订单配送', '商家取消订单', '订单完成', '用户取消订单', '用户申请退款', '商家驳回退款', '再次申请退款', '商家同意退款', '支付过期', '', '現金支付']
      };
    },
    props: {
      orderItem: {
        type: Array,
        default: []
      }
    },
    computed: {
      // 处理时间戳
      _orderItem() {
        this.orderItem.forEach(item => {
          item.createTime = timeStampDate(item.orderCreateTime);
        });
        return this.orderItem;
      }
    },
    methods: {
      // 查看订单详情
      viewDetails(item) {
        const _self = this;
        // 显示loading组件
        this.setLoadingState(false);
        this.$set(item, 'orderTypeText', this.orderTypeText[item.orderType - 1]);
        const itemVal = encodeURIComponent(JSON.stringify(item));
        uni.navigateTo({
          url: `../../components/order-details/order-details?item=${itemVal}`,
          animationType: 'slide-in-left',
          animationDuration: 200,
          success() {
            // 隐藏loading组件
            setTimeout(() => {
              _self.setLoadingState(true);
            }, 800);
          }
        });
      },
      ...mapActions([
        'setLoadingState'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .order-item-wrap {
    .order-item-box {
      padding: 24rpx 32rpx 32rpx 32rpx;
      margin-bottom: 24rpx;
      background: $color-button-text;
      border-radius: 16rpx;
      .font-size-26 {
        font-size: $font-size26;
      }
      .font-size-24 {
        font-size: $font-size24;
      }
      .item-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .row-right {
          display: flex;
          color: $color-text;
          .food-num {
            margin-right: 14rpx;
          }
          .title-icon {
            margin-left: 16rpx;
            width: 16rpx;
            height: 28rpx;
            background: url('../../static/img/triangle-right.png') left center no-repeat;
            background-size: 80% 80%;
          }
        }
        .state-text {
          color: $color-theme;
        }
        .state-vigilant {
          color: $color-background-button;
        }
      }
      .order-time {
        margin: 14rpx 0 30rpx 0;
        color: $color-theme;
        font-size: $font-size22;
      }
      .btn-state-wrap {
        display: flex;
        justify-content: flex-end;
        padding-top: 32rpx;
        margin-top: 25rpx;
        border-top: 1px $color-background solid;
        .order-btn-state {
          width: 136rpx;
          height: 48rpx;
          line-height: 49rpx;
          text-align: center;
          border-radius: 8rpx;
          font-size: $font-size22;
        }
        .play {
          color: $color-button-text;
          border: 1px solid $color-background-button;
          background: $color-background-button;
        }
        .details {
          color: $color-text;
          border: 1px solid $color-input-placeholder;
        }
      }
    }
  }
</style>
