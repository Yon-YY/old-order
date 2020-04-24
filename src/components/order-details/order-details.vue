<template>
  <view class="order-details-wrap" @tap="selectHide">
    <view class="desc-state-text">
      <text class="desc-state" :class="_orderStateText">
        {{orderReceived.orderTypeText}}
      </text>
      <text class="desc-time" v-if="orderDetails.orderType === 5">
        预计明天就餐时间点送达
      </text>
    </view>
    <view class="order-details-box">
      <order-foodlist :titleState="titleState"
                      :listItemTitle="listItemTitle"
                      :foodsList="orderDetails.dishList"
                      :payAmount="orderReceived.payAmount"></order-foodlist>
    </view>
    <view class="order-message-wrap">
      <text class="order-message-title">订单信息</text>
      <view class="massage-item">
        <text class="left-text">订单编号</text>
        <text class="right-text">{{orderDetails.orderNo}}</text>
      </view>
      <view class="massage-item">
        <text class="left-text">支付时间</text>
        <text class="right-text">{{_timeConver}}</text>
      </view>
      <view class="massage-item">
        <text class="left-text">支付方式</text>
        <text class="right-text">微信支付</text>
      </view>
      <view class="contact-merchant" @tap="call">
        <text class="contact-icon"></text>
        致电商家
      </view>
    </view>
    <view class="desc-message-wrap">
      <text class="desc-message-title">配送信息</text>
      <view class="desc-item">
        <text class="desc-left">配送地址</text>
        <text class="desc-right">{{orderDetails.orderAddress}}
          {{orderDetails.userName}} {{orderDetails.phone}}
        </text>
      </view>
      <view class="desc-item">
        <text class="desc-left">订单备注</text>
        <text class="desc-right">{{remarks}}</text>
      </view>
      <text class="cancel-order"
            v-if="orderDetails.orderPayType === 3 || orderDetails.orderType === 1 || orderDetails.orderType === 3 || orderDetails.orderType === 4"
            @tap="cancelOrderTap">取消订单
      </text>
      <text class="refund" @tap="refund"
            v-if="orderDetails.orderType === 4 || orderDetails.orderType === 5 || orderDetails.orderType === 6 || orderDetails.orderType === 10 || orderDetails.orderType === 11">
        退款
      </text>
      <view class="layer-wrap" :hidden="applyNotes">
        <layer
            :class="[applyNotes === true ? 'close-layer-an' : 'open-layer-an']">
          <view class="apply-notes-main vertical-center">
            <text class="apply-notes-title">申请退款</text>
            <view class="refund-select-main">
              <text class="refund-text">退款原因</text>
              <view class="select-main-wrap">
                <input class="select-main" disabled="true" :value="refundSelect"
                       @tap.stop="selectedShow"/>
                <text class="select-icon"
                      :class="[isSelectShow === false ? 'icon-open' : 'icon-close']"></text>
                <view :hidden="!isSelectShow">
                  <view class="item-list"
                        :class="[isSelectShow === true ? 'select-show' : 'select-hide']">
                    <text class="item-text" @tap="selection(select)"
                          v-for="(select, index) in refundExplainArr"
                          :key="index">{{select.refundReason}}
                    </text>
                  </view>
                </view>
              </view>
            </view>
            <view class="textarea-main">
              <text class="textarea-title">退款说明</text>
              <textarea name="" class="textarea-text"
                        :maxlength="targetNum"
                        @input="descTextarea"
                        v-model="desc"></textarea>
              <text class="textarea-num">限制{{remnant}} / {{targetNum}}字以内
              </text>
              <view class="textarea-button-wrap">
                <text class="textarea-btn textarea-cancel-btn"
                      @tap="applyNotesCancel">取消
                </text>
                <text class="textarea-btn textarea-confirm-btn"
                      @tap="applyNotesConfirm">确认
                </text>
              </view>
            </view>
          </view>
        </layer>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import OrderFoodlist from '../order-foodlist/order-foodlist';
  import {mapGetters, mapActions} from 'vuex';
  import {showToast, timeStampDate} from 'js/util';
  import {
    orderDetailsRefund,
    cancelOrder,
    refundExplain,
    orderRefund
  } from 'js/apiConfig';

  // import {ordersDetails} from 'js/orderDetails';

  export default {
    data() {
      return {
        orderReceived: {}, // 接收上一个页面传入的对象
        orderDetails: {},
        remarks: '', // 备注
        titleState: true,
        listItemTitle: '商品信息',
        applyNotes: true, // 申请退款框显隐
        isSelectShow: false, // 下拉框显隐
        refundExplainArr: [], // 退款原因
        refundSelect: '请选择', // 下拉框选中内容
        selectCache: {}, // 缓存下拉框选中的对象，提交信息时获取
        desc: '', // 退款说明
        targetNum: 100, // 最多可输入字数
        remnant: 100, // 倒计数
      };
    },
    methods: {
      call() {
        uni.makePhoneCall({
          phoneNumber: this._merchantPhone
        });
      },
      // 取消订单
      cancelOrderTap() {
        const _this = this;
        const cancelData = {
          orderId: this.orderReceived.orderId,
          orderType: this.orderReceived.orderType,
          deviceMarker: 'KBS888888',
          category: 1,
          appType: 2
        }
        uni.showModal({
          title: '温馨提示',
          content: '您确定取消该订单？',
          cancelText: '取 消',
          confirmText: '确 定',
          success: function (res) {
            if (res.confirm) {
              uni.showLoading({
                title: '正在取消订单',
                mask: true
              });
              cancelOrder(cancelData).then(cancelResult => {
                uni.hideLoading();
                console.log('取消', cancelResult);
                uni.showToast({
                  title: '订单取消成功',
                  duration: 2000,
                  success: function (res) {
                    setTimeout(() => {
                      // 跳转后清空购物车
                      _this.clearShopcart();
                      uni.reLaunch({
                        url: '../../pages/index/index'
                      });
                    }, 2500);
                  }
                });
              }).catch(err => {
                console.log(`https://segmentfault.com/search?q=${err}`);
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      },
      refund() {
        this.applyNotes = false;
      },
      selectedShow() {
        this.isSelectShow = !this.isSelectShow;
      },
      selection(select) {
        this.refundSelect = select.refundReason;
        this.selectCache = select;
        this.isSelectShow = false;
      },
      selectHide() {
        this.isSelectShow = false;
      },
      descTextarea() {
        let txtNum = this.desc.length;
        this.remnant = this.targetNum - txtNum;
      },
      // 申请退款弹框取消
      applyNotesCancel() {
        this.applyNotes = true;
        this.desc = '';
        this.remnant = 100;
        this.refundSelect = '请选择';
        this.selectCache = {};
      },
      // 申请退款弹框确定
      applyNotesConfirm() {
        if (Object.keys(this.selectCache).length === 0) {
          showToast('none', '请选择退款原因', 3000);
          return;
        }
        if (this.desc === '') {
          showToast('none', '请填写退款说明', 3000);
          return;
        }
        const refundData = {
          orderId: this.orderReceived.orderId,
          userId: uni.getStorageSync('userId'),
          refundReasonId: this.selectCache.refundReasonId, // 退款原因id
          refunds: this.desc, // 退款说明
          deviceMarker: 'KBS888888',
          appType: 2
        }
        orderRefund(refundData).then(res => {
          console.log('提交', res);
          if (res.data.code === '200') {
            showToast('success', '退款申请提交成功', 3000);
            // 提交后重新初始化
            setTimeout(() => {
              this.applyNotes = true;
              this.desc = '';
              this.remnant = 100;
            }, 1800);
          } else {
            uni.showModal({
              title: '温馨提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            });
          }
        }).catch(err => {
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
      },
      clearShopcart() {
        // 设置购物车动画
        this.setShopcartListState(true);
        this.setShopcartShow(true);
        // 返回首页清空数据
        this.setCartGoodsMorning([]);
        this.setCartGoodsNoon([]);
        this.setCartGoodsNight([]);
      },
      ...mapActions([
        'setShopcartListState',
        'setCartGoodsMorning',
        'setCartGoodsNoon',
        'setCartGoodsNight',
        'setShopcartShow'
      ])
    },
    computed: {
      _merchantPhone() {
        return this.getMerchantInfo.merchantPhone;
      },
      _timeConver() {
        return timeStampDate(this.orderDetails.orderValidPayTime);
      },
      _orderStateText() {
        const state = this.orderDetails.orderType;
        if (state === 1 || state === 3 || state === 5 || state === state === 6 || state === 7) {
          return 'desc-state-active';
        } else {
          return '';
        }
      },
      ...mapGetters([
        'getMerchantInfo'
      ])
    },
    onLoad(params) {
      // 接收上一个页面传入的对象
      this.orderReceived = JSON.parse(decodeURIComponent(params.item));
      if (this.orderReceived) {
        const explainData = {
          'deviceMarker': 'KBS888888'
        }
        // 退款原因
        refundExplain(explainData).then(res => {
          this.refundExplainArr = res.data.data;
        }).catch(err => {
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
        const refundData = {
          'deviceMarker': 'KBS888888',
          'orderId': this.orderReceived.orderId
        }
        // 订单详情
        orderDetailsRefund(refundData).then(res => {
          this.orderDetails = res.data.data;
          // 备注截取最后一个逗号
          const remarkStr = this.orderDetails.remark;
          this.remarks = remarkStr.substring(0, remarkStr.lastIndexOf(','));
        }).catch(err => {
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
      }
    },
    components: {
      OrderFoodlist
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .order-details-wrap {
    .desc-state-text {
      padding: 0 40rpx;
      color: $color-text;
      background: $color-button-text;
      .desc-state {
        padding: 20rpx 0;
        font-weight: $font-weight-b;
        font-size: $font-size36;
        &.desc-state-active {
          color: $color-background-button;
        }
      }
      .desc-time {
        padding-bottom: 24rpx;
        font-size: $font-size26;
      }
    }
    .order-details-box {
      margin: 24rpx;
      background: $color-button-text;
      border-radius: 16rpx;
    }
    .order-message-wrap, .desc-message-wrap {
      padding: 40rpx;
      margin: 24rpx;
      background: $color-button-text;
      font-size: $font-size26;
      border-radius: 16rpx;
      .order-message-title, .desc-message-title {
        margin-bottom: 40rpx;
        color: $color-text;
        font-weight: bold;
        font-size: $font-size32;
      }
      .massage-item, .desc-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40rpx;
        font-size: $font-size24;
        .left-text, .desc-left {
          color: $color-theme;
        }
        .right-text, .desc-right {
          line-height: 36rpx;
          color: $color-theme-b;
        }
      }
      .contact-merchant {
        display: flex;
        justify-content: flex-end;
        padding-top: 40rpx;
        border-top: $color-background 1px solid;
        .contact-icon {
          flex: 0 0 32rpx;
          margin-right: 25rpx;
          width: 32rpx;
          height: 32rpx;
          background: url('../../static/img/phone-iocn.png') no-repeat;
          background-size: cover;
        }
      }
      .cancel-order {
        margin: 160rpx auto 0 auto;
        width: 66%;
        line-height: 56rpx;
        color: $color-theme;
        text-align: center;
        border: 1px solid #e4e7ed;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .refund {
        margin-top: 160rpx;
        width: 110rpx;
        line-height: 48rpx;
        color: $color-theme;
        text-align: center;
        border: 1px solid #e4e7ed;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .apply-notes-main {
        width: 80%;
        padding: 0 30rpx;
        border-radius: 8rpx;
        background: $color-button-text;
        .apply-notes-title {
          padding: 24rpx 0;
          margin: 26rpx 0 35rpx 0;
          text-align: center;
          color: $color-theme-b;
          font-size: $font-size34;
          font-weight: bold;
        }
        .refund-select-main {
          display: flex;
          margin: 20rpx 0;
          font-size: $font-size26;
          .refund-text {
            display: flex;
            align-items: center;
            margin-right: 20rpx;
          }
          .select-main-wrap {
            position: relative;
            .select-main {
              padding: 8rpx 50rpx 8rpx 20rpx;
              border: $color-theme 1px solid;
              border-radius: 4px;
            }
            .select-icon {
              position: absolute;
              top: 50%;
              right: 26rpx;
              transform: translate3d(0, -50%, 0) rotate(90deg);
              width: 12rpx;
              height: 24rpx;
              background: url('../../static/img/triangle-right.png') no-repeat;
              background-size: cover;
            }
            .item-list {
              position: absolute;
              z-index: 999;
              margin-top: 30rpx;
              width: 99%;
              height: 0;
              border: 1px solid #e4e7ed;
              border-radius: 4px;
              background-color: $color-button-text;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
              .item-text {
                padding: 20rpx;
              }
            }
            .item-list::before {
              content: '';
              position: absolute;
              top: -16rpx;
              left: 33rpx;
              z-index: 950;
              width: 0;
              height: 0;
              border-left: 12rpx solid transparent;
              border-right: 12rpx solid transparent;
              border-bottom: 17rpx solid #fff;
            }
            .item-list::after {
              content: '';
              position: absolute;
              top: -20rpx;
              left: 30rpx;
              z-index: 900;
              width: 0;
              height: 0;
              border-left: 15rpx solid transparent;
              border-right: 15rpx solid transparent;
              border-bottom: 20rpx solid #e4e7ed;
            }
          }
        }
        .textarea-main {
          margin-top: 50rpx;
          display: flex;
          flex-wrap: wrap;
          .textarea-title {
            padding-bottom: 10rpx;
          }
          .textarea-text {
            padding: 20rpx;
            margin: 0 auto;
            width: 100%;
            height: 200rpx;
            resize: none;
            font-size: $font-size26;
            border: 1px solid $color-theme;
            border-radius: 5px;
          }
          .textarea-num {
            display: flex;
            justify-content: flex-end;
            margin: 15rpx 40rpx 20rpx 0;
            font-size: $font-size22;
          }
          .textarea-button-wrap {
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin: 50rpx 0;
            .textarea-btn {
              width: 200rpx;
              line-height: 70rpx;
              text-align: center;
              border-radius: 8rpx;
              color: $color-button-text;
            }
            .textarea-cancel-btn {
              background: $color-input-placeholder;
            }
            .textarea-confirm-btn {
              background: $color-background-button;
            }
          }
        }
      }
    }
    .desc-message-wrap {
      margin-bottom: 40rpx;
    }
  }
  .select-show {
    animation: selectShow .5s ease 0s both;
  }
  .select-hide {
    animation: selectHide .5s ease 0s both;
  }
  @-webkit-keyframes selectShow {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: auto;
      opacity: 1;
    }
  }
  @-webkit-keyframes selectHide {
    from {
      height: auto;
      opacity: 1;
    }
    to {
      height: 0;
      opacity: 0;
    }
  }
  .icon-open {
    animation: iconOpen .3s ease 0s both;
  }
  .icon-close {
    animation: iconClose .3s ease 0s both;
  }
  @-webkit-keyframes iconOpen {
    from {
      -webkit-transform: translate3d(0, -50%, 0) rotate(-90deg);
      -webkit-transform-origin: center center;
    }
    to {
      -webkit-transform: translate3d(0, -50%, 0) rotate(90deg);
      -webkit-transform-origin: center center;
    }
  }
  @-webkit-keyframes iconClose {
    from {
      -webkit-transform: translate3d(0, -50%, 0) rotate(90deg);
      -webkit-transform-origin: center center;
    }
    to {
      -webkit-transform: translate3d(0, -50%, 0) rotate(-90deg);
      -webkit-transform-origin: center center;
    }
  }
</style>
