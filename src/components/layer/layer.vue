<template>
  <view class="layer-wrap" @touchmove.stop.prevent="moveHandle">
    <view class="layer-content-box">
      <slot></slot>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      moveHandle() {
        return false;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .layer-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .layer-content-box {
      width: 650rpx;
      min-height: 100rpx;
      background: $color-button-text;
      border-radius: 8rpx;
    }
  }
</style>
