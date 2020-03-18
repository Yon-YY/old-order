<template>
  <view class="search-box">
    <view v-for="(good, id) in list" :key="id"
          class="goods-list">
      <view class="goods-list-box" v-for="(food, index) in good.goodsList"
            :key="index">
        <!--早餐-->
        <view class="good-item">
          <view class="good-img">
            <image class="img" :src="food.img"></image>
          </view>
          <view class="good-synopsis">
          </view>
        </view>
      </view>
    </view>
    <null v-if="list.length === 0 || list === null"
          nullText="没有查找到相关菜品"></null>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex';

  export default {
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        timeSlotText: ['早', '午', '晚']
      };
    },
    methods: {

    },
    components: {
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .search-box {
    position: absolute;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 90%;
    border-bottom-left-radius: 16rpx;
    border-bottom-right-radius: 16rpx;
    overflow-y: auto;
    background: $color-button-text;
    box-shadow: 0 16rpx 20rpx rgba(0, 0, 0, .3);
    opacity: 0;
    .good-item {
      position: relative;
      display: flex;
      padding-bottom 20rpx;
      margin: 20rpx 40rpx;
    }
    .good-item:last-child {
      margin-bottom: 0;
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
      font-size: $font-size-large-xx;
      font-weight: bold;
      color: $color-text;
    }
    .good-desc, .good-extre {
      display: block;
      line-height: 22rpx;
      font-size: $font-size-small;
      color: $color-theme;
    }
    .good-desc {
      margin-bottom: 8rpx;
    }
    .good-price {
      margin-top: 22rpx;
      font-size: $font-size-large-xx;
      color: $color-number-text;
      font-weight: 700;
      line-height: 32rpx;
    }
    .time-slot-text {
      position: absolute;
      bottom: 30rpx;
      right: 260rpx;
      width: 40rpx;
      height: 40rpx;
      line-height 40rpx;
      text-align: center;
      border-radius: 50%;
      font-size: $font-size-small;
      color: $color-button-text;
      background: rgba(69, 110, 255, .3);
    }
    .add-cart-wrap {
      position: absolute;
      bottom: 20rpx;
      right: 0;
      .add-good {
        width: 150rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        color: $color-button-text;
        font-size: $font-size-medium;
        background: $color-background-button;
        border-radius: 22rpx;
      }
    }
  }
  .search-box-show {
    animation: searchBoxShow .8s ease 0s both;
  }
  .search-box-hide {
    animation: searchBoxHide .8s ease 0s both;
  }
  @-webkit-keyframes searchBoxShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @-webkit-keyframes searchBoxHide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
