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
        <!--授权登录未过期时不显示授权按钮-->
        <view :hidden="isOverdue">
          <button class='bottom' type='primary' open-type="getUserInfo"
                  withCredentials="true" lang="zh_CN"
                  @getuserinfo="wxGetUserInfo">
            授权登录
          </button>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <!--Loading组件-->
    <view class="loading-local-wrap" :hidden="loading">
      <view class="loading-box vertical-center">
        <loading-layer :loadingText="loadingText"></loading-layer>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import LoadingLayer from 'components/loading/loading';
  import {getOpenId, userId} from 'js/apiConfig';

  export default {
    data() {
      return {
        timeStamp: this.$store.getters.getTimeStamp,
        isOverdue: uni.getStorageSync('isOverdue') || false, // 授权登录按钮显隐状态
        isCanUser: uni.getStorageSync('isCanUser') || true, //默认为true
        loadingText: '加载中...',
        loading: true
      };
    },
    methods: {
      // 第一授权获取用户信息,按钮触发
      wxGetUserInfo() {
        const _this = this;
        this.loading = false;
        uni.getUserInfo({
          provider: 'weixin',
          success: function (infoRes) {
            uni.setStorageSync('isOverdue', true);
            // console.log('登录', infoRes)
            try {
              uni.setStorageSync('isCanUser', false); //记录是否第一次授权  false:表示不是第一次授权
              uni.redirectTo({
                url: '../../pages/index/index',
                animationType: 'none',
                success() {
                  _this.loading = true;
                }
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
        const _this = this;
        uni.showLoading({
          title: '登录中...',
          mask: true
        });
        // 1.wx获取登录用户code
        uni.login({
          provider: 'weixin',
          success: function (loginRes) {
            let code = loginRes.code;
            const entTime = uni.getStorageSync('userInfo');
            if (uni.getStorageSync('isCanUser') === false && JSON.parse(entTime).entTime > new Date().getTime()) {
              console.log('登录未过期');
              //非第一次授权获取用户信息
              uni.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {
                  uni.redirectTo({
                    url: '../../pages/index/index',
                    animationType: 'none',
                    success() {
                      _this.loading = true;
                    }
                  });
                }
              });
            } else {
              console.log('登录已过期');
              _this.isOverdue = false;
              uni.setStorageSync('isCanUser', '');
              setTimeout(() => {
                const codeData = {
                  code: code,
                  sessionId: ''
                }
                getOpenId(codeData).then(res => {
                  const userInfoData = JSON.stringify(res.data.data);
                  try {
                    // 缓存后端返回的OpenId、登录过期时间戳等信息
                    uni.setStorageSync('userInfo', userInfoData);
                    uni.hideLoading();
                  } catch (e) {
                  }
                }).catch(err => {
                  console.log(`https://segmentfault.com/search?q=${err}`);
                });
              }, 500);
            }
          },
        });
      }
    },
    components: {
      LoadingLayer
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
  .loading-local-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%
  }
  .loading-box {
    border-radius: 10rpx;
    width: 180rpx;
    height: 190rpx;
    background: rgba(0, 0, 0, 0.4);
  }
</style>
