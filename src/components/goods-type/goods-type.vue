<template>
  <view class="goods-type-wrap">
    <view v-for="(food, index) in goodType[0]" class="good-item"
          :key="index" v-if="food.dishMode === 1">
      <view class="good-img">
        <image class="img" :src="food.img"></image>
      </view>
      <view class="good-synopsis">
        <text class="good-name">{{food.dishName}}</text>
        <text class="good-desc">{{food.dishDiscrete}}</text>
        <text class="good-price">￥{{food.price}}</text>
        <view class="cartcontrol-wrapper">
          <cartcontrol :food="food">
          </cartcontrol>
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
            <text class="good-format-btn" @tap.stop="selectFormat(index, item)">选择菜品</text>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';
  import Cartcontrol from '../cartcontrol/cartcontrol';

  export default {
    props: {
      goodType: {
        type: Array,
        default: []
      }
    },
    methods:{
      // 选择菜品
      selectFormat(index, item) {
        this.setFormatListDetails(this.goodType);
        // 点击了哪个套餐
        this.setDishIndex([index, item]);
        // console.log(this.goodType);
        this.setFormatWrapState(false);
        this.setFormatState(true);
      },
      ...mapActions([
        'setFormatListDetails',
        'setDishIndex',
        'setFormatWrapState',
        'setFormatState'
      ])
    },
    computed:{
      // 菜品
      // goodsGroup() {
      //   console.log('弹框', this.getGoodsGroup);
      //   return this.getGoodsGroup;
      // },
      // ...mapGetters([
      //   'getGoodsGroup'
      // ])
    },
    created() {
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
    bottom: 6rpx;
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
  }
</style>
