<template>
  <view>
    <view class="cartcontrol" v-if="food.dishMode === 1">
      <view class="cart-decrease" @tap="decreaseCart">
        <text class="cart-icon cart-inner"
              :class="[_food.sumCount > 0 ? 'cart-decrease-show':'cart-decrease-hide']"></text>
      </view>
      <text class="cart-count"
            :class="[_food.sumCount > 0 ? 'cart-num-show':'cart-num-hide']">
        {{_food.sumCount}}
      </text>
      <view class="cart-icon cart-add" @tap="touchOnGoods"></view>
    </view>
    <!--小球动画-->
    <view class="ball-box" :hidden="hide_good_box"
          :style="[{left: bus_x +'px', top: bus_y +'px'}]">
      <view class="ball-icon"></view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex';
  import {pierreBezier} from 'js/shopcartBeizer';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        hide_good_box: true,
        wWidth: 0,
        hHeight: 0,
        busPos: {},
        finger: {},
        topPoint: {},
        linePos: null,
        bus_x: 0,
        bus_y: 0,
        timer: null
      };
    },
    mounted() {
      const _self = this;
      uni.getSystemInfo({
        success: (res) => {
          _self.wWidth = res.windowWidth;
          _self.hHeight = res.windowHeight;
        }
      });
      this.busPos['x'] = 70;
      this.busPos['y'] = this.hHeight * 0.9;
    },
    watch: {
      // 监听购物车中商品数量
      watchGoodsContcat: {
        handler(newVal, oldVal) {
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
      },
      // 监听购物车已不存在该商品
      _food: {
        handler(newVal, oldVal) {
          if (newVal.sumCount === undefined) {
            this._food.sumCount = 0;
          }
        },
        deep: true
      }
    },
    computed: {
      watchGoodsContcat() {
        let goodsContcat = [...this.getCartGoodsMorning, ...this.getCartGoodsNoon, ...this.getCartGoodsNight];
        // console.log('goodsContcat', goodsContcat);
        return goodsContcat;
      },
      _food() {
        switch (this.getTimeSlot) {
          case 1:
            let foodsMorning = {};
            this.getCartGoodsMorning.forEach(morning => {
              if (morning.dishId === this.food.dishId) {
                foodsMorning = morning;
              }
            });
            return foodsMorning;
            break;
          case 2:
            let foodsNoon = {};
            this.getCartGoodsNoon.forEach(noon => {
              if (noon.dishId === this.food.dishId) {
                foodsNoon = noon;
              }
            });
            return foodsNoon;
            break;
          case 3:
            let foodsNight = {};
            this.getCartGoodsNight.forEach(night => {
              if (night.dishId === this.food.dishId) {
                foodsNight = night;
              }
            });
            return foodsNight;
            break;
        }
      },
      ...mapGetters([
        'getTimeSlot',
        'getCartGoodsMorning',
        'getCartGoodsNoon',
        'getCartGoodsNight'
      ])
    },
    methods: {
      // 减
      decreaseCart() {
        this.reduceGood(this.food.dishId);
      },
      // 加
      touchOnGoods(e) {
        // 如果good_box正在运动
        if (!this.hide_good_box) return;
        let topPoint = {};
        this.finger['x'] = e.touches['0'].clientX - 10;
        this.finger['y'] = e.touches['0'].clientY - 10;

        if (this.finger['y'] < this.busPos['y']) {
          topPoint['y'] = this.finger['y'] - 150;
        } else {
          topPoint['y'] = this.busPos['y'] - 150;
        }
        topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

        if (this.finger['x'] > this.busPos['x']) {
          topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
        } else {
          topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
        }
        this.linePos = pierreBezier([this.busPos, topPoint, this.finger], 25);
        this.startAnimation();
      },
      startAnimation() {
        let index = 0;
        let bezier_points = this.linePos['bezier_points'];
        this.hide_good_box = false;
        this.bus_x = this.finger['x'];
        this.bus_y = this.finger['y'];
        index = bezier_points.length;
        this.timer = setInterval(() => {
          index--;
          this.bus_x = bezier_points[index]['x'];
          this.bus_y = bezier_points[index]['y'];
          if (index < 1) {
            clearInterval(this.timer);
            this.hide_good_box = true;
            let foodItem = {
              dishId: this.food.dishId,
              dishClassId: this.food.dishClassId,
              periodTimeClassId: this.food.periodTimeClassId,
              dishName: this.food.dishName,
              price: this.food.price,
              img: this.food.img,
              dishMode: this.food.dishMode,
              goodsFormat: this.food.goodsFormat
            }
            this.addGood(foodItem);
            this.setCartShow(false);
            this.setCartAn(true);
          }
        }, 27);
      },
      ...mapActions([
        'setTimeSlot',
        'addGood',
        'reduceGood',
        'setCartShow',
        'setCartAn',
        'setShopcartListState',
        'setShopcartShow'
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
      font-size: $font-size20;
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
      font-size: $font-size-large-xxx;
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
