<template>
  <view class="submit-order">
    <view class="address-view">
      <view class="address-input" @tap="editAddress">
        <text class="address-phone-text">{{_addressTips}}</text>
        <text class="address-icon"></text>
      </view>
      <text class="contact-phone"
            v-if="addressText !== ''">
        {{addressName}}（{{radioSexText[_radioSex - 1]}}）{{addressPhone}}
      </text>
      <text class="address-text">{{addressText}}</text>
      <view class="give-time-wrap">
        <text class="give-hint">送达时间</text>
        <text class="give-time">预计明天就餐时间点送达</text>
      </view>
    </view>
    <!--编辑地址弹层-->
    <view class="layer-wrap address-phone-edit" :hidden="editAddressLayer">
      <layer
          :class="[editAddressLayer === true ? 'close-layer-an' : 'open-layer-an']">
        <text class="title">订餐详细地址</text>
        <view class="give-address-box">
          <view class="give-address-item">
            <text class="address-name">地址</text>
            <input class="order-edit-input address-input" type="text"
                   placeholder="详细地址" v-model="valAddressText">
            <view class="input-clear address-input-clear"
                  v-if="valAddressText !== ''">
              <text class="clear-icon" @tap="clearAddressVal"></text>
            </view>
          </view>
          <view class="give-address-item">
            <text class="address-name">姓名</text>
            <input class="order-edit-input name-input" type="text"
                   placeholder="姓名" v-model="valAddressName">
            <view class="input-clear name-input-clear"
                  v-if="valAddressName !== ''">
              <text class="clear-icon" @tap="clearNameVal"></text>
            </view>
          </view>
          <view class="give-address-item">
            <text class="address-name">手机</text>
            <input class="order-edit-input iphone-input" type="number"
                   placeholder="手机号码" @blur="testPhone"
                   v-model="valAddressPhone">
            <view class="input-clear phone-input-clear"
                  v-if="valAddressPhone !== ''">
              <text class="clear-icon" @tap="clearPhoneVal"></text>
            </view>
          </view>
          <view class="select-sex">
            <van-radio-group class="select-sex-box" v-model="radioSex">
              <van-radio @tap="radioSex = radioSexArr[0]"
                         class="sex-radio sex-m" :name="radioSexArr[0]">
                {{radioSexText[0]}}
              </van-radio>
              <van-radio @tap="radioSex = radioSexArr[1]"
                         class="sex-radio sex-w" :name="radioSexArr[1]">
                {{radioSexText[1]}}
              </van-radio>
            </van-radio-group>
          </view>
          <view class="edit-button-wrap">
            <text class="edit-btn edit-cancel-btn" @tap="editAddreesCancel">取消
            </text>
            <text class="edit-btn edit-confirm-btn" @tap="editAddreesConfirm">
              确认
            </text>
          </view>
        </view>
      </layer>
    </view>
    <view class="food-list-box">
      <order-foodlist :foodsList="_foodsList"></order-foodlist>
    </view>
    <view class="order-remarks border-top" @tap="editRemarks">
      <text class="remarks-text">订单备注</text>
      <view class="remarks-right">
        <text class="remarks-content">{{remarksText}}</text>
        <text class="remarks-icon"></text>
      </view>
    </view>
    <!--编辑订单备注弹层-->
    <view class="layer-wrap order-remarks-edit" :hidden="editRemarksLayer">
      <layer
          :class="[editRemarksLayer === true ? 'close-layer-an' : 'open-layer-an']">
        <text class="title">备注信息</text>
        <view class="give-address-box">
          <view class="give-address-item">
            <text class="address-name">备注</text>
            <input class="order-edit-input address-input" type="text"
                   placeholder="备注内容" v-model="valRemarksText">
            <view class="input-clear remarks-input-clear"
                  v-if="valRemarksText !== ''">
              <text class="clear-icon" @tap="clearRemarksVal"></text>
            </view>
          </view>
          <view class="edit-button-wrap">
            <text class="edit-btn edit-cancel-btn" @tap="editRemarksCancel">取消
            </text>
            <text class="edit-btn edit-confirm-btn" @tap="editRemarksConfirm">
              确认
            </text>
          </view>
        </view>
      </layer>
    </view>
    <view class="order-remarks payment-remarks">
      <text class="remarks-text">支付方式</text>
      <view class="remarks-right">
        <text class="payment-icon"></text>
        <text class="remarks-content">微信支付</text>
      </view>
    </view>
    <view class="payment-box">
      <text class="payment-amount">￥{{_totalPrice}}</text>
      <text class="payment-btn" @tap="confirmPayment">确认支付</text>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import OrderFoodlist from 'components/order-foodlist/order-foodlist';
  import Layer from 'components/layer/layer';
  import {mapGetters, mapActions} from 'vuex';
  import {addressDefault, submitOrder} from '../../common/js/apiConfig';
  import {validatePhone, showToast} from '../../common/js/util';

  export default {
    data() {
      return {
        foodsList: [],
        addressTips: ['添加送餐地址及联系方式', '编辑送餐地址及联系方式'], // 地址提示文字
        valAddressText: '', // 地址输入框
        valAddressName: '', // 姓名输入框
        valAddressPhone: '', // 手机输入框
        valRemarksText: '', // 备注输入框
        addressText: '', // 地址
        addressName: '', // 姓名
        addressPhone: '', // 手机
        remarksText: '备注', // 备注
        radioSexArr: ['1', '2'], // 男女
        radioSexText: ['先生', '女士'], // 男女
        radioSex: '1', // 默认选择男
        editAddressLayer: true, // 编辑地址弹层状态
        editRemarksLayer: true // 编辑备注弹层状态
      };
    },
    methods: {
      // 编辑地址
      editAddress() {
        this.valAddressText = this.addressText;
        this.valAddressName = this.addressName;
        this.valAddressPhone = this.addressPhone;
        this.editAddressLayer = false;
      },
      // 地址弹层取消
      editAddreesCancel() {
        this.editAddressLayer = true;
      },
      // 清空地址
      clearAddressVal() {
        this.valAddressText = '';
      },
      clearNameVal() {
        this.valAddressName = '';
      },
      clearPhoneVal() {
        this.valAddressPhone = '';
      },
      // 地址弹层确认
      editAddreesConfirm() {
        this.addressText = this.valAddressText;
        this.addressName = this.valAddressName;
        this.addressPhone = this.valAddressPhone;
        // 验证手机号码
        if (this.valAddressPhone === '') {
          showToast('none', '联系电话不能为空', 1500);
          return;
        }
        this.editAddressLayer = true;
      },
      testPhone() {
        validatePhone(this.valAddressPhone);
        // 提示框消失后清空input
        setTimeout(() => {
          this.valAddressPhone = '';
        }, 1600);
      },
      // 编辑备注
      editRemarks() {
        if (this.remarksText === '备注') {
          this.valRemarksText = '';
        } else {
          this.valRemarksText = this.remarksText;
        }
        this.editRemarksLayer = false;
      },
      // 备注弹层取消
      editRemarksCancel() {
        this.editRemarksLayer = true;
      },
      // 清空备注内容
      clearRemarksVal() {
        this.valRemarksText = '';
      },
      // 备注弹层确定
      editRemarksConfirm() {
        this.remarksText = this.valRemarksText;
        this.editRemarksLayer = true;
      },
      // 确认支付
      confirmPayment() {
        if (this.addressText === '' || this.addressName == '') {
          showToast('none', '先填写送餐地址及联系方式', 3000);
          return;
        }
        // 设置购物车动画
        this.setShopcartListState(true);
        let dataSet = [];
        this._foodsList.forEach(food => {
          let goodsIds = [];
          if (food.goodsFormat.length === 0) {
            goodsIds.push(food.goodsId);
          } else {
            food.goodsFormat.forEach(format => {
              goodsIds.push(format.goodsId);
            });
          }
          dataSet.push({
            "dishesType": food.dishesType,
            "goodsCategoryId": food.goodsCategoryId,
            "goodsId": goodsIds,
            "goodsNum": food.goodsNum,
            "timeOfDay": food.timeOfDay
          });
        });
        if (this.remarksText === '备注') {
          this.remarksText = '';
        }
        const submitData = Object.assign({}, {goodsOrderDetails: dataSet}, {
          "hospitalId": "1",
          "merchantId": this.getMerchantIdStr,
          "orderAddress": this.addressText,
          "orderLinkman": this.addressName,
          "orderRemark": this.remarksText,
          "phone": this.addressPhone,
          "userId": "333333"
        });
        console.log('提交后台', submitData);
        submitOrder(submitData).then(res => {
          console.log(res);
        });
      },
      ...mapActions([
        'setShopcartListState'
      ])
    },
    watch: {
      remarksText(val) {
        if (val === '') {
          this.remarksText = '备注';
        }
      }
    },
    computed: {
      _addressTips() {
        if (this.addressText === '' || this.addressText === null) {
          return this.addressTips[0];
        } else {
          return this.addressTips[1];
        }
      },
      _radioSex() {
        return this.radioSex;
      },
      _foodsList() {
        let goodsContcat = [...this.getCartGoodsMorning, ...this.getCartGoodsNoon, ...this.getCartGoodsNight];
        // console.log('初始', goodsContcat);
        return this.foodsList = goodsContcat;
      },
      _totalPrice() {
        let total = 0;
        this._foodsList.forEach(food => {
          total += food.price * food.goodsNum;
        });
        return total;
      },
      ...mapGetters([
        'getCartGoodsMorning',
        'getCartGoodsNoon',
        'getCartGoodsNight',
        'getMerchantIdStr'
      ])
    },
    created() {
      const addressData = {
        'userId': '333333',
        'merchantId': this.getMerchantIdStr
      }
      addressDefault(addressData).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          // console.log(data);
          this.addressText = data.address;
          this.addressName = data.linkman;
          this.addressPhone = data.phone;
        }
      });
    },
    components: {
      OrderFoodlist,
      Layer
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .submit-order {
    padding: 32rpx 0 96rpx 0;
    min-height: calc(100vh - 128rpx);
    background: $color-button-text;
    .input-clear {
      position: absolute;
      right: 3%;
      bottom: 25rpx;
      z-index: 999;
      width: 36rpx;
      height: 36rpx;
      background: #999;
      border-radius: 50%;
      .clear-icon {
        width: 100%;
        height: 100%;
        background: url('../../static/img/layer-close.png') no-repeat;
        background-size: cover;
      }
    }
    .address-view {
      padding: 0 40rpx;
      border-bottom: 16rpx $color-background solid;
      .address-input {
        display: flex;
        justify-content: space-between;
        .address-phone-text {
          font-size: $font-size-large-xx;
          font-weight: bold;
          color: $color-background-button;
        }
        .address-icon {
          width: 16rpx;
          height: 28rpx;
          background: url('../../static/img/triangle-right.png') no-repeat;
          background-size: cover;
        }
      }
      .contact-phone {
        margin: 16rpx 0;
        font-size: $font-size-medium;
        color: $color-sub-theme;
      }
      .address-text {
        font-size: $font-size-medium;
        color: $color-sub-theme;
      }
      .give-time-wrap {
        display: flex;
        justify-content: space-between;
        padding: 32rpx 0;
        margin-top: 32rpx;
        border-top: 1px $color-background solid;
        font-size: $font-size-medium-x;
        .give-hint {
          color: $color-theme-b;
          font-weight: bold;
        }
        .give-time {
          color: $color-background-button;
          font-weight: $font-weight-b;
        }
      }
    }
    .layer-wrap {
      .title {
        padding: 24rpx 0;
        margin-top: 26rpx;
        text-align: center;
        color: $color-theme-b;
        font-size: $font-size-large-xx;
        font-weight: bold;
      }
      .give-address-box {
        padding: 0 20rpx;
        margin-bottom: 48rpx;
        font-size: $font-size-medium-x;
        .give-address-item {
          position: relative;
          margin: 26rpx 0;
          .address-name {
            padding: 16rpx 0;
          }
          .order-edit-input {
            padding: 15rpx 10rpx;
            background: $color-background;
            border-radius: 8rpx;
            border: 1px solid #E8E9EC;
          }
        }
        .edit-button-wrap {
          display: flex;
          justify-content: space-around;
          padding: 20rpx 0;
          margin-top: 70rpx;
          .edit-btn {
            width: 200rpx;
            line-height: 70rpx;
            text-align: center;
            border-radius: 8rpx;
            color: $color-button-text;
          }
          .edit-cancel-btn {
            background: $color-input-placeholder;
          }
          .edit-confirm-btn {
            background: $color-background-button;
          }
        }
      }
    }
    .border-top {
      border-top: 16rpx $color-background solid;
    }
    .order-remarks {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 40rpx;
      font-size: $font-size-medium-x;
      .remarks-text {
        flex: 0 0 200rpx;
      }
      .remarks-right {
        display: flex;
        .remarks-content {
          line-height: 36rpx;
          font-weight: bold;
        }
        .remarks-icon {
          flex: 0 0 16rpx;
          width: 16rpx;
          height: 28rpx;
          margin-left: 40rpx;
          background: url('../../static/img/triangle-right.png') no-repeat;
          background-size: cover;
        }
        .payment-icon {
          margin-right: 16rpx;
          width: 32rpx;
          height: 26rpx;
          margin-left: 40rpx;
          background: url('../../static/img/we-chat.png') no-repeat;
          background-size: cover;
        }
      }
    }
    .payment-remarks {
      padding: 32rpx 0;
      margin: 0 40rpx;
      border-top: 1rpx $color-background solid;
    }
    .payment-box {
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      height: 88rpx;
      line-height: 88rpx;
      color: $color-button-text;
      .payment-amount {
        padding-left: 40rpx;
        width: 510rpx;
        font-size: $font-size-large-xxx;
        background: $color-text;
      }
      .payment-btn {
        width: 202rpx;
        text-align: center;
        font-size: $font-size-medium-x;
        background: $color-background-button;
      }
    }
  }
</style>
