<template>
  <view class="order-food-list">
    <view class="order-foods-wrap">
      <text v-if="titleState" class="list-item-title">{{listItemTitle}}
      </text>
      <view class="foods-list-scroll">
        <view class="foods-list-item" v-for="(food, index) in foodsList"
              :key="index">
          <view class="foods-list">
            <image class="food-img" :src="food.img"></image>
            <text class="food-name">{{food.dishName}}</text>
          </view>
          <view class="foods-list">
            <text class="food-num">×{{food.sumCount}}</text>
            <text class="food-price" v-if="food.mealMode === 1">￥{{food.price}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="other-wrap margin-top">
      <text class="other-text">配送费</text>
      <text class="other-amount">￥0</text>
    </view>
    <view class="other-wrap border-bottom">
      <text class="other-text">包装费</text>
      <text class="other-amount">￥0</text>
    </view>
    <view class="order-total">
      共{{totalCount}}件菜品
      , 小计
      <text class="total-amount">¥{{payAmount}}元</text>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      foodsList: {
        type: Array,
        default: []
      },
      titleState: {
        type: Boolean,
        default: false
      },
      listItemTitle: {
        type: String,
        default: ''
      },
      payAmount: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalCount() {
        let goodsNum = 0;
        this.foodsList.forEach(food => {
          goodsNum += food.sumCount;
        });
        return goodsNum;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .order-food-list {
    .order-foods-wrap {
      padding: 0 20rpx 0 40rpx;
      .list-item-title {
        padding-top: 32rpx;
        margin-bottom: 32rpx;
        font-size: $font-size32;
        color: $color-theme-b;
        font-weight: bold;
      }
      .foods-list-scroll {
        height: 300rpx;
        overflow-y: scroll;
        .foods-list-item {
          display: flex;
          justify-content: space-between;
          margin: 40rpx 0;
          .foods-list {
            display: flex;
            align-items: center;
            font-size: $font-size26;
            color: $color-theme-b;
            .food-img {
              display: block;
              width: 120rpx;
              height: 120rpx;
            }
            .food-name {
              margin-left: 24rpx;
            }
            .food-num {
              width: 60rpx;
              font-size: $font-size24;
            }
            .food-price {
              width: 100rpx;
              margin-left: 50rpx;
              font-weight: bold;
            }
          }
        }
        .foods-list-item:last-child {
          margin-bottom: 0;
        }
      }
    }
    .other-wrap {
      margin: 0 40rpx;
      display: flex;
      justify-content: space-between;
      font-size: $font-size26;
      &.border-bottom {
        padding: 40rpx 0;
        border-bottom: 1px $color-background solid;
      }
      .other-amount {
        font-weight: bold;
      }
    }
    .margin-top {
      margin-top: 40rpx;
    }
    .order-total {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 40rpx 0;
      margin: 0 40rpx;
      color: $color-sub-theme;
      font-size: $font-size24;
      .total-amount {
        padding-left: 8rpx;
        font-size: $font-size32;
        font-weight: bold;
        color: $color-sub-theme;
      }
    }
  }
</style>
