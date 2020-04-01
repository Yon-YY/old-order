<template>
  <view>
    <!--购物车菜品-->
    <view class="cartcontrol" v-if="good.dishMode === 1">
      <view class="cart-decrease" @tap="decreaseCartGoods">
        <text class="cart-icon cart-inner"
              :class="[good.goodsNum > 0 ? 'cart-decrease-show':'cart-decrease-hide']"></text>
      </view>
      <text class="cart-count"
            :class="[good.goodsNum > 0 ? 'cart-num-show':'cart-num-hide']">
        {{good.goodsNum}}
      </text>
      <view class="cart-icon cart-add" @tap="addCartGoods"></view>
    </view>
    <view class="dish-remove" v-else-if="good.dishMode === 2" @tap="decreaseCartGoods">移 除</view>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';

  export default {
    props: {
      good: {
        type: Object
      },
      shopcartType: {
        type: Number,
        default: 1
      }
    },
    // created() {
    //   console.log('打印', this.good);
    // },
    methods: {
      // 减
      decreaseCartGoods() {
        this.setTimeSlot(this.shopcartType);
        this.reduceGood(this.good.dishId);
      },
      // 加
      addCartGoods() {
        this.setTimeSlot(this.shopcartType);
        let foodItem = {
          dishId: this.good.dishId,
          dishName: this.good.dishName,
          price: this.good.price,
          img: this.good.img,
          dishMode: this.good.dishMode,
          goodsFormat: this.good.goodsFormat
        }
        this.addGood(foodItem);
      },
      // 移除套餐
      dishRemove(){},
      ...mapActions([
        'setTimeSlot',
        'addGood',
        'reduceGood'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .cartcontrol {
    .good-format-btn {
      width: 104rpx;
      height: 46rpx;
      line-height: 46rpx;
      text-align: center;
      border-radius: 23px;
      color: $color-button-text;
      font-size: $font-size22;
      background-color: $color-background-button;
    }
    animation: cartWrapShow .8s ease .8s both;
    .cart-decrease {
      display: inline-block;
      .cart-inner {
        opacity: 0;
        background: url('../../static/img/reduce-button.png') no-repeat;
        background-size: cover;
      }
      .cart-decrease-show {
        animation: cartDdecreaseShow 1s ease 0s both;
      }
      .cart-decrease-hide {
        animation: cartDdecreaseHide 1.2s ease 0s both;
      }
    }
    .cart-icon {
      width: 46rpx;
      height: 46rpx;
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      padding: 0 6rpx;
      line-height: 46rpx;
      width: 44rpx;
      text-align: center;
      opacity: 0;
      font-size: $font-size36;
      color: $color-highlight-background;
    }
    .cart-num-show {
      animation: cartNumShow .5s ease .3s both;
    }
    .cart-num-hide {
      animation: cartNumHide .3s ease 0s both;
    }
    .cart-add {
      position: relative;
      z-index: 999;
      display: inline-block;
      background: url('../../static/img/add-button.png') no-repeat;
      background-size: cover;
    }
  }
  .dish-remove {
    width: 90rpx;
    height: 42rpx;
    line-height: 44rpx;
    text-align: center;
    border-radius: 23px;
    color: $color-button-text;
    font-size: $font-size22;
    background-color: $color-input-placeholder;
  }
  .ball-box {
    width: 32rpx;
    height: 32rpx;
    position: fixed;
    border-radius: 50%;
    overflow: hidden;
    left: 50%;
    top: 50%;
    z-index: 999;
    .ball-icon {
      width: 100%;
      height: 100%;
      background: $color-background-button;
    }
  }
  @-webkit-keyframes cartWrapShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @-webkit-keyframes cartDdecreaseShow {
    from {
      opacity: 0;
      transform: translate3d(100rpx, 0, 0) rotate(0deg);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(-360deg);
    }
  }
  @-webkit-keyframes cartDdecreaseHide {
    from {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(-360deg);
    }
    to {
      transform: translate3d(160rpx, 0, 0) rotate(0deg);
      opacity: 0;
    }
  }
  @-webkit-keyframes cartNumShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @-webkit-keyframes cartNumHide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
