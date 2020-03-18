<template>
  <view>
    <!--快餐-->
    <view class="cartcontrol"
          v-if="food.dishesType === 1">
      <view class="cart-decrease" @tap="decreaseCart">
        <text class="cart-icon cart-inner"
              :class="[_food.goodsNum > 0 ? 'cart-decrease-show':'cart-decrease-hide']"></text>
      </view>
      <text class="cart-count"
            :class="[_food.goodsNum > 0 ? 'cart-num-show':'cart-num-hide']">
        {{_food.goodsNum}}
      </text>
      <view class="cart-icon cart-add" @tap="touchOnGoods"></view>
    </view>
    <!--套餐-->
    <view class="cartcontrol"
          v-else-if="food.dishesType === 2">
      <text class="good-format-btn" @tap.stop="selectFormat">选规格</text>
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
      goods: {
        type: Array,
        default: []
      },
      goodIndex: {
        type: Number,
        default: 0
      },
      foodIndex: {
        type: Number,
        default: 0
      },
      food: {
        type: Object
      }
    },
    data() {
      return {
        foodsChild: this.food,
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
      this.busPos['x'] = 50;
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
              1
            }, 750);
          }
        },
        deep: true
      },
      // 监听购物车已不存在该商品
      _food: {
        handler(newVal, oldVal) {
          if (newVal.goodsNum === undefined) {
            this._food.goodsNum = 0;
          }
        },
        deep: true
      }
    },
    computed: {
      _food() {
        switch (this.getTimeSlot) {
          case 1:
            let foodsMorning = {};
            this.getCartGoodsMorning.forEach(morning => {
              if (morning.goodsId === this.food.goodsId) {
                foodsMorning = morning;
              }
            });
            return foodsMorning;
            break;
          case 2:
            let foodsNoon = {};
            this.getCartGoodsNoon.forEach(noon => {
              if (noon.goodsId === this.food.goodsId) {
                foodsNoon = noon;
              }
            });
            return foodsNoon;
            break;
          case 3:
            let foodsNight = {};
            this.getCartGoodsNight.forEach(night => {
              if (night.goodsId === this.food.goodsId) {
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
        this.reduceGood(this.food.goodsId);
      },
      // 规格
      selectFormat() {
        this.setFormatListDetails(this.goods[this.goodIndex].goodsList[this.foodIndex]);
        this.setFormatWrapState(false);
        this.setFormatState(true);
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
              goodsId: this.food.goodsId,
              goodsCategoryId: this.food.goodsCategoryId,
              goodsName: this.food.goodsName,
              price: this.food.price,
              img: this.food.img,
              dishesType: this.food.dishesType,
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
        'setFormatWrapState',
        'setFormatState',
        'setCartShow',
        'setCartAn',
        'setShopcartListState',
        'setShopcartShow',
        'setFormatListDetails'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "../../common/stylus/variable.styl";
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
