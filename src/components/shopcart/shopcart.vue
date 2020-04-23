<template>
  <view class="shopcart">
    <view class="content">
      <view class="content-left" @tap="toggleShopCart">
        <text class="time-slot-icon" :class="timeSlotIcon"></text>
        <view class="logo-wrapper">
          <text class="icon-shopping-cart"></text>
          <view class="num">{{totalCount}}</view>
        </view>
        <view class="price" :class="[totalCount > 0 ? 'enough' : '']">
          ￥{{totalPrice}}
        </view>
      </view>
      <view class="content-right">
        <view class="pay" @tap="payment"
              :class="[totalCount > 0 ? 'enough' : 'not-enough']">
          去支付
        </view>
      </view>
    </view>
    <view class="shopcart-list" :hidden="getShopcartListState"
          :class="[getShopcartShow ? 'shopcart-hide' : 'shopcart-show']">
      <view class="list-header" :hidden="getShopcartListState">
        <text class="title">已选商品</text>
        <view class="empty" @tap="emptyShopcart">
          <text class="clear-iocn"></text>
          清空
        </view>
      </view>
      <view class="list-content">
        <!--早餐-->
        <shopcart-type v-if="getCartGoodsMorning.length > 0"
                       :shopcartType="_cartGoodsContcat[0]"
                       :foodTypeText="foodTypeText[0]"
                       :cartType="cartType[0]"></shopcart-type>
        <!--午餐-->
        <shopcart-type v-if="getCartGoodsNoon.length > 0"
                       :shopcartType="_cartGoodsContcat[1]"
                       :foodTypeText="foodTypeText[1]"
                       :cartType="cartType[1]"></shopcart-type>
        <!--晚餐-->
        <shopcart-type v-if="getCartGoodsNight.length > 0"
                       :shopcartType="_cartGoodsContcat[2]"
                       :foodTypeText="foodTypeText[2]"
                       :cartType="cartType[2]"></shopcart-type>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import ShopcartType from '../shopcart-type/shopcart-type';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    data() {
      return {
        foodTypeText: ['早餐', '午餐', '晚餐'],
        cartType: [1, 2, 3]
      };
    },
    watch: {
      watchGoodsContcat: {
        handler(newVal, oldVal) {
          // if (newVal.length === 0) {
          //   // 设置购物车动画
          //   this.setShopcartListState(true);
          //   this.setShopcartShow(true);
          // }
          if (newVal.length === 0) {
            // 设置购物车动画
            this.setShopcartListState(true);
            this.setShopcartShow(true);
            // 定时器作用： 为购物车动画留出执行动画时间
            this.setCartAn(false);
            setTimeout(() => {
              this.setCartShow(true);
            }, 750);
          }
        },
        deep: true
      }
    },
    computed: {
      timeSlotIcon() {
        switch (this.getTimeSlot) {
          case 1:
            return 'morning-icon';
            break;
          case 2:
            return 'noon-icon';
            break;
          case 3:
            return 'night-icon';
            break;
        }
      },
      watchGoodsContcat() {
        let goodsContcat = [...this.getCartGoodsMorning, ...this.getCartGoodsNoon, ...this.getCartGoodsNight];
        return goodsContcat;
      },
      _cartGoodsContcat() {
        let cartGoods = [this.getCartGoodsMorning, this.getCartGoodsNoon, this.getCartGoodsNight];
        return cartGoods;
      },
      totalPrice() {
        let total = 0;
        this.getCartGoodsMorning.forEach(food => {
          total += food.price * food.sumCount;
        });
        this.getCartGoodsNoon.forEach(food => {
          total += food.price * food.sumCount;
        });
        this.getCartGoodsNight.forEach(food => {
          total += food.price * food.sumCount;
        });
        // 金额四舍五入且保留两位小数点
        return Math.round(total * 100) / 100;
      },
      totalCount() {
        let sumCount = 0;
        this.getCartGoodsMorning.forEach(food => {
          sumCount += food.sumCount;
        });
        this.getCartGoodsNoon.forEach(food => {
          sumCount += food.sumCount;
        });
        this.getCartGoodsNight.forEach(food => {
          sumCount += food.sumCount;
        });
        return sumCount;
      },
      ...mapGetters([
        'getTimeSlot',
        'getCartGoodsMorning',
        'getCartGoodsNoon',
        'getCartGoodsNight',
        'getShopcartListState',
        'getShopcartShow'
      ])
    },
    methods: {
      // 支付
      payment() {
        const _self = this;
        // 显示loading组件
        this.setLoadingState(false);
        uni.navigateTo({
          url: '../../pages/submit-order/submit-order',
          animationDuration: 200,
          success() {
            // 隐藏loading组件
            setTimeout(() => {
              _self.setLoadingState(true);
            }, 2000);
          }
        });
      },
      // 清空购物车
      emptyShopcart() {
        // 设置购物车动画
        this.setShopcartListState(true);
        this.setShopcartShow(true);
        this.setCartGoodsMorning([]);
        this.setCartGoodsNoon([]);
        this.setCartGoodsNight([]);
      },
      toggleShopCart() {
        if (this.getShopcartShow === true) {
          this.setShopcartListState(false);
        } else {
          setTimeout(() => {
            this.setShopcartListState(true);
          }, 510);
        }
        this.setShopcartShow(!this.getShopcartShow);
      },
      ...mapActions([
        'setLoadingState',
        'setCartGoodsMorning',
        'setCartGoodsNoon',
        'setCartGoodsNight',
        'setCartShow',
        'setCartAn',
        'setShopcartListState',
        'setShopcartShow'
      ])
    },
    components: {
      ShopcartType
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .shopcart {
    width: 100%;
    .content {
      display: flex;
      height: 88rpx;
      font-size: 0;
      background: $color-theme-b;
      color: rgba(255, 255, 255, .4);
    }
    .content-left {
      position: relative;
      flex: 1;
    }
    .time-slot-icon {
      position: absolute;
      top: 12rpx;
      left: 28rpx;
      width: 64rpx;
      height: 64rpx;
    }
    .morning-icon {
      background: url('../../static/img/time-morning.png') no-repeat;
      background-size: cover;
    }
    .noon-icon {
      background: url('../../static/img/time-noon.png') no-repeat;
      background-size: cover;
    }
    .night-icon {
      background: url('../../static/img/time-night.png') no-repeat;
      background-size: cover;
    }
    .logo-wrapper {
      display: inline-block;
      position: relative;
      width: 90rpx;
      height: 104rpx;
      margin: -15rpx 0 0 120rpx;
    }
    .icon-shopping-cart {
      width: 100%;
      height: 100%;
      background: url('../../static/img/shopcart-icon.png') no-repeat;
      background-size: cover;
    }
    .num {
      position: absolute;
      bottom: 16rpx;
      right: -12rpx;
      width: 32rpx;
      height: 32rpx;
      line-height 32rpx;
      text-align: center;
      border-radius: 50%;
      font-size: $font-size24;
      color: $color-button-text;
      background: $color-circular-background;
    }
    .price {
      display: inline-block;
      vertical-align: top;
      margin: 30rpx 0 0 40rpx;
      font-size: $font-size36;
      font-weight: $font-weight-b;
      box-sizing: border-box;
      &.enough {
        color: $color-button-text;
      }
    }
    .content-right {
      flex: 0 0 200rpx;
      width: 200rpx;
    }
    .pay {
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      font-size: $font-size26;
      font-weight: $font-weight-b;
      &.not-enough {
        background: $color-theme;
      }
      &.enough {
        color: $color-button-text;
        background: $color-background-button;
      }
    }
    .shopcart-list {
      position: absolute;
      left: 0;
      bottom: 88rpx;
      z-index: -1;
      padding-bottom: 35rpx;
      width: 100%;
      background: $color-button-text;
      .list-header {
        display: flex;
        justify-content: space-between;
        padding: 0 40rpx;
        height: 95rpx;
        line-height: 95rpx;
        font-size: $font-size24;
        border-bottom: 1px solid #E8E9EC;
        .title {
          color: $color-input-placeholder;
        }
        .empty {
          display: flex;
          align-items: center;
          color: $color-theme-b;
          .clear-iocn {
            margin-right: 16rpx;
            width: 28rpx;
            height: 30rpx;
            background: url('../../static/img/clear-shopcart.png') no-repeat;
            background-size: cover;
          }
        }
      }
      .list-content {
        max-height: 436rpx;
        overflow-y: auto;
        .shopcart-good-list {
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
        }
        .good-synopsis {
          position: relative;
          flex: 1;
          font-size: $font-size-large32;
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
  }
  .shopcart-show {
    animation: shopCartShow .5s ease 0s both;
  }
  .shopcart-hide {
    animation: shopCarthide .5s ease 0s both;
  }
  @-webkit-keyframes shopCartShow {
    from {
      transform: translate3d(0, 100%, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @-webkit-keyframes shopCarthide {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
