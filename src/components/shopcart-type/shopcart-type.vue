<template>
  <view class="shopcart-type-wrap">
    <text class="food-type">{{foodTypeText}}</text>
    <view class="shopcart-good-list"
          v-for="(food, index) in shopcartType"
          :key="index">
      <view class="good-img">
        <image class="img" :src="food.img"></image>
      </view>
      <view class="good-synopsis">
        <text class="good-name">{{food.goodsName}}</text>
        <text class="good-price">￥{{food.price}}</text>
        <view class="cartcontrol-wrapper">
          <cartcontrol-type :good="food" :shopcartType="cartType"></cartcontrol-type>
        </view>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import CartcontrolType from '../../components/cartcontrol-type/cartcontrol-type';
  import {mapActions} from 'vuex';

  export default {
    props: {
      shopcartType: {
        type: Array,
        default: []
      },
      foodTypeText: {
        type: String,
        default: '早餐'
      },
      cartType: {
        type: Number,
        default: 1
      }
    },
    methods: {
      ...mapActions([
        'setTimeSlot'
      ])
    },
    components: {
      CartcontrolType
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .shopcart-type-wrap {
    .food-type {
      padding: 30rpx 40rpx 20rpx 40rpx;
      font-size: $font-size24;
      color: $color-text;
      border-bottom: 1px solid rgba(245, 247, 250, .9);
      background: rgba(245, 247, 250, .5);
    }
    .shopcart-good-list {
      position: relative;
      display: flex;
      padding: 24rpx 40rpx 15rpx 40rpx;
      margin-bottm: 20rpx;
      .good-img {
        flex: 0 0 128rpx;
        margin-right: 24rpx;
        & > .img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .good-synopsis {
        position: relative;
        flex: 1;
        font-size: $font-size32;
        .good-name {
          margin: 16rpx 0 10rpx 0;
          height: 32rpx;
          line-height: 32rpx;
          font-weight: bold;
          color: $color-text;
        }
        .good-price {
          margin-top: 22rpx;
          color: $color-number-text;
          font-weight: 700;
          line-height: 32rpx;
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 6rpx;
          bottom: 16rpx;
        }
      }
    }
  }
</style>
