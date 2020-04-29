<template>
  <view class="order-success-wrap  vertical-center" :hidden="isHidden">
    <layer
        :class="[isHidden === true ? 'close-layer-an' : 'open-layer-an']">
      <view class="success-layer-main">
        <text class="success-icon"></text>
        <text class="success-text">订单提交成功！</text>
        <view class="success-button-wrap">
          <text class="success-btn home-btn" @tap="backHome">返回首页</text>
          <text class="success-btn check-btn" @tap="checkOrder">订单详情</text>
        </view>
      </view>
    </layer>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';

  export default {
    props: {
      isHidden: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        _isHidden: this.isHidden
      };
    },
    methods: {
      backHome() {
        const _this = this;
        uni.showLoading({
          title: '正在加载...',
          mask: true
        });
        setTimeout(() => {
          uni.reLaunch({
            url: '../../pages/index/index',
            success: function () {
              uni.hideLoading();
              _this.setTabBarState([0, false]);
            }
          });
        }, 1000);
        this.$emit('backHome');
      },
      checkOrder() {
        this._isHidden = true;
        this.$emit('checkOrder');
      },
      ...mapActions([
        'setTabBarState'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .order-success-wrap {
    width: 80%;
    .success-layer-main {
      padding-top: 30rpx;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      background: $color-button-text;
      .success-icon {
        margin: 50rpx auto;
        width: 150rpx;
        height: 150rpx;
        background: url('../../static/img/success.png') no-repeat;
        background-size: cover;
      }
      .success-text {
        width: 100%;
        text-align: center;
        font-size: $font-size36;
      }
      .success-button-wrap {
        display: flex;
        justify-content: space-around;
        padding: 20rpx 0;
        margin: 100rpx 0 40rpx 0;
        .success-btn {
          width: 200rpx;
          line-height: 70rpx;
          text-align: center;
          border-radius: 8rpx;
          color: $color-button-text;
        }
        .home-btn {
          background: $color-input-placeholder;
        }
        .check-btn {
          background: $color-background-button;
        }
      }
    }
  }
</style>
