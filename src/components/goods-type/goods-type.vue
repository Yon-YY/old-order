<template>
  <view class="goods-type-wrap">
    <view v-for="(food, index) in goodType[0]" class="good-item"
          :key="index" v-if="food.dishMode === 1">
      <view class="good-img">
        <block v-if="food.img !== ''">
          <image class="img" lazy-load="true" :src="food.img"></image>
        </block>
        <block v-else>
          <image class="img" src="../../static/load-default.jpg"></image>
        </block>
      </view>
      <view class="good-synopsis">
        <text class="good-name">{{food.dishName}}</text>
        <text class="good-desc">{{food.dishDiscrete}}</text>
        <text class="good-price">￥{{food.price}}</text>
        <view class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
          <!--遮罩，是否能点餐-->
          <view class="is-reserve" :hidden="isReserveShow"
                @tap="isReserve"></view>
        </view>
      </view>
    </view>
    <block v-if="goodType[0][0].dishMode === 2">
      <view v-for="(item, index) in goodType[1]" class="good-item"
            :key="item.dishPackageId">
        <view class="good-img">
          <image class="img" src="../../static/dish.jpg"></image>
        </view>
        <view class="good-synopsis">
          <text class="good-name">{{item.dishPackageName}}</text>
          <text class="good-desc">{{item.dishPackageDesc}}</text>
          <text class="good-price">￥{{item.dishPackagePrice}}</text>
          <view class="cartcontrol-wrapper">
            <text class="good-format-btn" @tap.stop="selectFormat(index, item)">
              选择菜品
            </text>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex';
  import Cartcontrol from '../cartcontrol/cartcontrol';
  import {showToast, zeroize} from 'js/util';

  export default {
    props: {
      goodType: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        timeOfDay: ['早餐', '午餐', '晚餐']
      };
    },
    methods: {
      // 选择菜品
      selectFormat(index, item) {
        // 每个时间段限制只能点一份套餐
        if (this.isDishExist[this.getTimeSlot - 1] !== 0) {
          showToast('none', `${this.timeOfDay[this.getTimeSlot - 1]}时段只能点一份套餐`, 3000);
          return;
        }

        this.setFormatListDetails(this.goodType);
        // 点击了哪个套餐
        this.setDishIndex([index, item]);
        this.setFormatWrapState(false);
        this.setFormatState(true);
      },
      // 友好弹框提示
      layerBox(contText) {
        uni.showModal({
          title: '温馨提示',
          content: contText,
          showCancel: false,
          confirmText: '确 定',
          success: function (res) {
          }
        });
      },
      isReserve() {
        this.layerBox('抱歉，当前时间段不能点餐，不便之处敬请谅解！');
      },
      ...mapActions([
        'setFormatListDetails',
        'setDishIndex',
        'setFormatWrapState',
        'setFormatState'
      ])
    },
    computed: {
      // 是否可下单点餐
      isReserveShow() {
        // const merchantInfo = this.getMerchantInfo;
        const merchantInfo = {
          businessDinnerEndTime: "15:00",
          businessDinnerStartTime: "",
          businessLunchEndTime: "",
          businessLunchStartTime: "08:00",
          singleMode: 2,
          stoppingOrder: 0
        };
        // 时间个位数时前面补0 zeroize
        const systemDate = `${zeroize(new Date().getHours())}:${zeroize(new Date().getMinutes())}`;
        // stoppingOrder(0 接单, 1停止接单)
        if (merchantInfo.stoppingOrder === 0) {
          // 时间段接单
          // singleMode(1 时间段接单，2为全天接单)
          if (merchantInfo.singleMode === 2) {
            // 如果时间段全为空，默认全天接单
            if (merchantInfo.businessDinnerEndTime == '' && merchantInfo.businessDinnerStartTime == '' && merchantInfo.businessLunchEndTime == '' && merchantInfo.businessLunchStartTime == '') {
              return true;
            }
            // 如果全天接单模式，上午开始时间不能为空
            if (merchantInfo.businessLunchStartTime == '') {
              return;
            }
            if (merchantInfo.businessLunchStartTime <= systemDate && systemDate <= merchantInfo.businessDinnerEndTime) {
              return true;
            } else {
              return false;
            }
          } else {
            if ((merchantInfo.businessLunchStartTime <= systemDate && systemDate <= merchantInfo.businessLunchEndTime) || (merchantInfo.businessDinnerStartTime <= systemDate && systemDate <= merchantInfo.businessDinnerEndTime)) {
              return true;
            } else {
              return false;
            }
          }
        }
      },
      // 检查每个时间段是否已选过套餐
      isDishExist() {
        let dishExistArr = [0, 0, 0];
        if (this.getTimeSlot === 1) {
          this.getCartGoodsMorning.forEach(morning => {
            if (morning.goodsFormat.length !== 0) {
              dishExistArr[0] = morning.goodsFormat.length;
            }
          });
        }
        if (this.getTimeSlot === 2) {
          this.getCartGoodsNoon.forEach(noon => {
            if (noon.goodsFormat.length !== 0) {
              dishExistArr[1] = noon.goodsFormat.length;
            }
          });
        }
        if (this.getTimeSlot === 3) {
          this.getCartGoodsNight.forEach(night => {
            if (night.goodsFormat.length !== 0) {
              dishExistArr[2] = night.goodsFormat.length;
            }
          });
        }
        return dishExistArr;
      },
      ...mapGetters([
        'getMerchantInfo',
        'getTimeSlot',
        'getCartGoodsMorning',
        'getCartGoodsNoon',
        'getCartGoodsNight'
      ])
    },
    components: {
      Cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .goods-type-wrap {
    flex: 1;
  }
  .good-item {
    position: relative;
    display: flex;
    padding-bottom 20rpx;
    margin: 0 24rpx 20rpx 24rpx;
  }
  .good-item:last-child {
    margin-bottom: 60rpx;
  }
  .good-img {
    flex: 0 0 160rpx;
    margin-right: 24rpx;
  }
  .good-img > .img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .good-synopsis {
    flex: 1;
  }
  .good-name {
    margin: 8rpx 0 14rpx 0;
    height: 32rpx;
    line-height: 32rpx;
    font-size: $font-size32;
    font-weight: bold;
    color: $color-text;
  }
  .good-desc, .good-extre {
    display: block;
    min-height: 22rpx;
    line-height: 22rpx;
    font-size: $font-size22;
    color: $color-theme;
  }
  .good-desc {
    margin-bottom: 8rpx;
  }
  .good-price {
    margin-top: 22rpx;
    font-size: $font-size32;
    color: $color-number-text;
    font-weight: 700;
    line-height: 32rpx;
  }
  .cartcontrol-wrapper {
    position: absolute;
    right: 6rpx;
    bottom: 20rpx;
    .is-reserve {
      position: absolute;
      top: 0;
      left 0;
      width: 100%;
      height: 100%;
    }
    .good-format-btn {
      width: 120rpx;
      height: 52rpx;
      line-height: 52rpx;
      text-align: center;
      border-radius: 23px;
      color: $color-button-text;
      font-size: $font-size24;
      background-color: $color-background-button;
    }
  }
</style>
