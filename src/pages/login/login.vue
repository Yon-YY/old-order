<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view v-if="isCanUser">
      <view>
        <view class='header'>
          <image src='/static/logo.png'></image>
        </view>
        <view class='content'>
          <view>申请获取以下权限</view>
          <text>获得你的公开信息(昵称，头像、地区等)</text>
        </view>
        <button class='bottom' type='primary' open-type="getUserInfo"
                withCredentials="true" lang="zh_CN"
                @getuserinfo="wxGetUserInfo">
          授权登录
        </button>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script type="text/ecmascript-6">
  import {getOpenId} from 'js/apiConfig';

  export default {
    data() {
      return {
        timeStamp: this.$store.getters.getTimeStamp,
        isCanUser: uni.getStorageSync('isCanUser') || true //默认为true
      };
    },
    methods: {
      // 第一授权获取用户信息,按钮触发
      wxGetUserInfo() {
        uni.getUserInfo({
          provider: 'weixin',
          success: function (infoRes) {
            try {
              uni.setStorageSync('isCanUser', false); //记录是否第一次授权  false:表示不是第一次授权
              uni.redirectTo({
                url: '../../pages/index/index',
                animationType: 'slide-in-left'
              });
            } catch (e) {
            }
          },
          fail(res) {
          }
        });
      },
      //登录
      login() {
        uni.showLoading({
          title: '登录中...',
          masK: true
        });
        // 1.wx获取登录用户code
        uni.login({
          provider: 'weixin',
          success: function (loginRes) {
            let code = loginRes.code;
            if (uni.getStorageSync('isCanUser') === false) {
              //非第一次授权获取用户信息
              uni.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {
                  uni.redirectTo({
                    url: '../../pages/index/index',
                    animationType: 'slide-in-left'
                  });
                }
              });
            }
            setTimeout(() => {
              const codeData = {
                code: code,
                sessionId: ''
              }
              getOpenId(codeData).then(res => {
                const userInfoData = JSON.stringify(res.data.data);
                // 缓存后端返回的OpenId、登录过期时间戳等信息
                try {
                  uni.setStorageSync('userInfo', userInfoData);
                  uni.hideLoading();
                } catch (e) {
                }
              }).catch(err => {
                console.log(`https://segmentfault.com/search?q=${err}`);
              });
            }, 500);
          },
        });
      }
    },
    onLoad() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
      this.login();
    },
    onShow() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .header {
    margin: 90rpx 0 90rpx 50rpx;
    border-bottom: 1px solid #ccc;
    text-align: center;
    width: 650rpx;
    height: 300rpx;
    line-height: 450rpx;
  }
  .header image {
    width: 320rpx;
    height: 156rpx;
  }
  .content {
    margin-left: 50rpx;
    margin-bottom: 90rpx;
  }
  .content text {
    display: block;
    color: #9d9d9d;
    margin-top: 40rpx;
    font-size: $font-size24;
  }
  .bottom {
    border-radius: 80rpx;
    margin: 70rpx 50rpx;
    font-size: $font-size36;
  }
</style>
