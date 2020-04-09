<template>
  <view class="loading-box">
    <image class="loading-icon" src="../../static/img/loading.gif"></image>
    <text class="loading-text">{{loadingText}}</text>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      loadingText: {
        type: String,
        default: '正在载入...'
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .loading-icon {
      width: 100rpx;
      height: 100rpx;
    }
    .loading-text {
      margin-top: 30rpx;
      font-size: $font-size26;
      color: $color-button-text;
    }
  }
</style>
