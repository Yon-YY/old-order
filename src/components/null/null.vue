<template>
  <view class="null-box">
    <image class="null-icon" src="../../static/img/null-man.png"></image>
    <text class="null-text">{{nullText}}</text>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      nullText: {
        type: String,
        default: '暂无数据'
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .null-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .null-icon {
      width: 200rpx;
      height: 220rpx;
    }
    .null-text {
      margin-top: 40rpx;
      font-size: $font-size26;
      color: $color-theme;
    }
  }
</style>
