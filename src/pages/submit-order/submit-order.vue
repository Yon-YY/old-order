<template>
  <view class="submit-order">
    <view class="address-view">
      <view class="address-input" @tap="editAddress">
        <text class="address-phone-text">{{_addressTips}}</text>
        <text class="address-icon"></text>
      </view>
      <text class="contact-phone"
            v-if="addressText !== ''">
        {{addressName}}（{{addressPhone}}）
      </text>
      <text class="address-text">{{addressText}}</text>
      <view class="give-time-wrap">
        <text class="give-hint">送达时间</text>
        <text class="give-time">预计明天就餐时间点送达</text>
      </view>
      <!--遮罩层，不能点击填写，防止后台接口返回数据时，用户填写好的姓名、地址和号码信息被刷新掉-->
      <view class="address-mask" :hidden="maskSate" @tap="clickMask"></view>
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
      <order-foodlist :foodsList="_foodsList"
                      :payAmount="_totalPrice"></order-foodlist>
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
  import {addressDefault, submitOrder} from 'js/apiConfig';
  import {validatePhone, showToast} from 'js/util';

  export default {
    data() {
      return {
        // timeStamp: this.$store.getters.getTimeStamp,
        foodsList: [],
        addressTips: ['添加送餐地址及联系方式', '编辑送餐地址及联系方式'], // 地址提示文字
        maskSate: false, // 遮罩
        valAddressText: '', // 地址输入框
        valAddressName: '', // 姓名输入框
        valAddressPhone: '', // 手机输入框
        valRemarksText: '', // 备注输入框
        addressText: '', // 地址
        addressName: '', // 姓名
        addressPhone: '', // 手机
        remarksText: '备注', // 备注
        editAddressLayer: true, // 编辑地址弹层状态
        editRemarksLayer: true // 编辑备注弹层状态
      };
    },
    methods: {
      // 遮罩
      clickMask() {
        showToast('none', '网络开小差，请稍后', 1500);
      },
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
        // 验证手机号
        if (!/^1[3456789]\d{9}$/.test(this.valAddressPhone)) {
          showToast('none', '输入的手机号码无效', 1500);
          return;
        }
        this.editAddressLayer = true;

      },
      testPhone() {
        // 提示框消失后清空input
        validatePhone(this.valAddressPhone);
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
        if (uni.getStorageSync('userInfo')) {
          const entTime = JSON.parse(uni.getStorageSync('userInfo')).entTime;
          if (entTime < new Date().getTime()) {
            console.log('登录已过期');
            uni.showModal({
              title: '温馨提示',
              content: '用户尚未登录或登录已过期，是否重新登录',
              cancelText:'否',
              confirmText:'是',
              success: function (res) {
                if (res.confirm) {
                  uni.setStorageSync('isCanUser', true); // 设置登录状态
                  uni.reLaunch({
                    url: '../../pages/login/login',
                    animationType: 'slide-in-right'
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
            return;
          } else {
            console.log('登录未过期');
            // if (this.addressText === '' || this.addressName === '') {
            //   showToast('none', '请填写送餐地址及联系电话', 3000);
            //   return;
            // }
            // 设置购物车动画
            this.setShopcartListState(true);
            let merge = [];
            let dishFood = [];
            let dataSet = [];
            this._foodsList.forEach(food => {
              if (food.goodsFormat.length !== 0) {
                food.goodsFormat.forEach(format => {
                  dishFood.push({
                    'dishId': format.dishId,
                    'dishName': format.dishName,
                    'img': format.img,
                    'sumCount': 1,
                    'price': format.price,
                    'periodTimeClassId': format.periodTimeClassId,
                    'dishClassId': format.dishClassId
                  });
                });
              } else {
                dataSet.push({
                  'dishId': food.dishId,
                  'dishName': food.dishName,
                  'img': food.img,
                  'sumCount': food.sumCount,
                  'price': food.price,
                  'periodTimeClassId': food.periodTimeClassId,
                  'dishClassId': food.dishClassId
                });
              }
              // 菜品和套餐中的菜品合并
              merge = [...dishFood, ...dataSet];
            });
            if (this.remarksText === '备注') {
              this.remarksText = '';
            }
            // 提交订单支付
            setTimeout(() => {
              const submitData = Object.assign({}, {dishList: merge}, {
                'hospitalId': '8754362990002',
                'remark': this.remarksText,
                'orderAddress': this.addressText,
                'deviceMarker': 'KBS1806260769',
                'phone': this.addressPhone,
                'userId': '5489076532003',
                'userName': this.addressName,
                'orderDesc': '',
                'deviceId': '',
                'category': 1,
                // 'merchantId': this.getMerchantIdStr
                'merchantId': '868576736852660224'
                // 'dishList':[]
              });
              console.log('提交后台', submitData);
              submitOrder(submitData).then(res => {
                console.log('成功', res);
              });
            }, 50);
          }
        }
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
      _foodsList() {
        let goodsContcat = [...this.getCartGoodsMorning, ...this.getCartGoodsNoon, ...this.getCartGoodsNight];
        // console.log('初始', goodsContcat);
        return this.foodsList = goodsContcat;
      },
      _totalPrice() {
        let total = 0;
        this._foodsList.forEach(food => {
          total += food.price * food.sumCount;
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
      // 地址接口
      const addressData = {
        'hospitalId': '8754362990002',
        'deviceMarker': 'KBS1806260769',
        'userId': '990423437216927744'
      }
      addressDefault(addressData).then(res => {
        if (res.data.code === '200') {
          // 隐藏遮罩
          this.maskSate = true;
          const data = res.data.data;
          // console.log(data);
          this.addressText = data.orderAddress;
          this.addressName = data.orderPersonName;
          this.addressPhone = data.phone;
        }
      }).catch(err => {
        console.log(`https://segmentfault.com/search?q=${err}`);
      });
      ;
    },
    components: {
      OrderFoodlist,
      Layer
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
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
      /*position: relative;*/
      padding: 0 40rpx;
      border-bottom: 16rpx $color-background solid;
      .address-input {
        display: flex;
        justify-content: space-between;
        .address-phone-text {
          font-size: $font-size32;
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
        font-size: $font-size24;
        color: $color-sub-theme;
      }
      .give-time-wrap {
        display: flex;
        justify-content: space-between;
        padding: 32rpx 0;
        margin-top: 32rpx;
        border-top: 1px $color-background solid;
        font-size: $font-size26;
        .give-hint {
          color: $color-theme-b;
          font-weight: bold;
        }
        .give-time {
          color: $color-background-button;
          font-weight: $font-weight-b;
        }
      }
      .address-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 176rpx;
      }
    }
    .layer-wrap {
      .title {
        padding: 24rpx 0;
        margin-top: 26rpx;
        text-align: center;
        color: $color-theme-b;
        font-size: $font-size32;
        font-weight: bold;
      }
      .give-address-box {
        padding: 0 20rpx;
        margin-bottom: 48rpx;
        font-size: $font-size26;
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
      font-size: $font-size26;
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
        font-size: $font-size36;
        background: $color-text;
      }
      .payment-btn {
        width: 202rpx;
        text-align: center;
        font-size: $font-size26;
        background: $color-background-button;
      }
    }
  }
</style>
