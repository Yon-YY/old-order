<template>
  <view class="tab-bar-wrapper">
    <view class="tab-box" v-for="(menu, index) in menuTexts"
          @click="menuCurrt(index)"
          :class="[iconCurrtIndex === index ?'tab-box-currt':'']"
          :key="index">
      <text class="icon"
            :class="[iconCurrtIndex === index ?'icon-currt':'icon-default']"></text>
      <text class="text">{{menu}}</text>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      iconCurrt: {
        type: Number,
        detail: 0
      }
    },
    data() {
      return {
        menuTexts: ['首页', '订单'],
        // tabCurrt: 0,
        iconCurrtIndex: this.iconCurrt
      }
    },
    methods: {
      menuCurrt(index) {
        this.iconCurrtIndex = index;
        // this.iconCurrtIndex[1] = index;
        this.$emit('tabBarIndex', index);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .tab-bar-wrapper {
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 98rpx;
    background: $color-button-text;
    .tab-box {
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 200rpx;
      width: 200rpx;
      height: 64rpx;
      box-sizing: border-box;
      .text {
        display: inline-block;
        margin-left: 30rpx;
        font-size: $font-size-medium;
      }
    }
    .tab-box-currt {
      border-radius: 45px;
      color: $color-background-button;
      background: $color-tab-background;
    }
    .tab-box:first-child {
      margin-right: 120rpx;
      .icon {
        display: inline-block;
        width: 48rpx;
        height: 42rpx;
      }
      .icon-default {
        background: url("../../static/img/home.png") no-repeat;
        background-size: cover;
      }
      .icon-currt {
        background: url("../../static/img/home-currt.png") no-repeat;
        background-size: cover;
      }
    }
    .tab-box:last-child {
      .icon {
        display: inline-block;
        width: 36rpx;
        height: 46rpx;
      }
      .icon-default {
        background: url("../../static/img/order.png") no-repeat;
        background-size: cover;
      }
      .icon-currt {
        background: url("../../static/img/order-currt.png") no-repeat;
        background-size: cover;
      }
    }
  }
</style>
