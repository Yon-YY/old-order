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
        SessionKey: '',
        OpenId: '',
        nickName: null,
        avatarUrl: null,
        isCanUser: uni.getStorageSync('isCanUser') || true //默认为true
      };
    },
    methods: {
      //第一授权获取用户信息===》按钮触发
      wxGetUserInfo() {
        let _this = this;
        uni.getUserInfo({
          provider: 'weixin',
          success: function (infoRes) {
            console.log('打印信息：', infoRes);
            _this.nickName = infoRes.userInfo.nickName; //昵称
            _this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
            try {
              uni.setStorageSync('isCanUser', false);//记录是否第一次授权  false:表示不是第一次授权
              _this.updateUserInfo();
            } catch (e) {

            }
          },
          fail(res) {
          }
        });
      },
      //登录
      login() {
        let _this = this;
        uni.showLoading({
          title: '登录中...'
        });
        // 1.wx获取登录用户code
        wx.login({
          provider: 'weixin',
          success: function (loginRes) {
            let code = loginRes.code;
            // if (!_this.isCanUser) {
            //   //非第一次授权获取用户信息
            //   uni.getUserInfo({
            //     provider: 'weixin',
            //     success: function (infoRes) {
            //       //获取用户信息后向调用信息更新方法
            //       _this.nickName = infoRes.userInfo.nickName; //昵称
            //       _this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
            //       _this.updateUserInfo();//调用更新信息方法
            //     }
            //   });
            // }
            //2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
            console.log(code);
            // const codeData = {
            //   code: loginRes.code.toString(),
            //   sessionId: ''
            // }
            // getOpenId(codeData).then(res => {
            //   console.log('code返回', res);
            //   uni.hideLoading();
            // }).catch(err => {
            //   console.log(`https://segmentfault.com/search?q=${err}`);
            // });
            wx.request({
              url: 'http://192.168.9.42:8081/wecat/getWecatOpenId',
              data: {
                code: code,
                sessionId: ''
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: (res) => {
                console.log(res);
                //openId、或SessionKdy存储//隐藏loading
                uni.hideLoading();
              }
            });
          },
        });
      },
      //向后台更新信息
      updateUserInfo() {
        // let _this = this;
        // uni.request({
        //   url: 'url',//服务器端地址
        //   data: {
        //     appKey: this.$store.state.appKey,
        //     customerId: _this.customerId,
        //     nickName: _this.nickName,
        //     headUrl: _this.avatarUrl
        //   },
        //   method: 'POST',
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: (res) => {
        //     if (res.data.state == "success") {
        //       uni.reLaunch({//信息更新成功后跳转到小程序首页
        //         url: '/pages/index/index'
        //       });
        //     }
        //   }
        // });
      }
    },
    onLoad() {
      this.login();
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
