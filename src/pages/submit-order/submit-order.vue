<template>
  <view class="submit-order">
    <view class="desc-state-text">
      <text class="back-home-icon" @tap="home"></text>
      <text class="back-home-text" @tap="home">首页</text>
    </view>
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
    <view class="order-remarks border-top">
      <text class="remarks-text">订单备注</text>
      <view class="remarks-right" @tap="editRemarks">
        <text class="remarks-content">{{remarksText}}</text>
        <text class="remarks-icon"></text>
      </view>
      <view class="checkbox-list">
        <text v-for="(item, index) in checkboxData" class="checkbox-item"
              @tap="checkIndexs(item, index)"
              :class="[checkboxIndex.indexOf(index) !== -1 ? 'checkbox-color' : '']"
              :key="index">{{item.remarkLable}}
        </text>
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
      <view class="payment-main" :hidden="successBtn">
        <text class="payment-amount">￥{{_totalPrice}}</text>
        <text class="payment-btn" @tap="confirmPayment">确认支付</text>
      </view>
    </view>
    <!--订单提交成功弹框-->
    <view :hidden="orderSuccess">
      <success-layer class="success-layer-box" :isHidden="orderSuccess"
                     @checkOrder="checkOrder"></success-layer>
    </view>
    <view class="pay-mask" :hidden="payState" @tap="toPay"></view>
  </view>
</template>

<script type="text/ecmascript-6">
  import OrderFoodlist from 'components/order-foodlist/order-foodlist';
  import Layer from 'components/layer/layer';
  import SuccessLayer from 'components/success-layer/success-layer';
  import {mapGetters, mapActions} from 'vuex';
  import {validatePhone, showToast, overdueRemind, strTrim} from 'js/util';
  import {params} from 'js/config';
  import {
    addressDefault,
    getRemark,
    submitOrder,
    cancelOrder,
    orderStatus
  } from 'js/apiConfig';

  export default {
    data() {
      return {
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
        checkboxData: [],   // 备注标签数据
        checkboxIndex: [], // 选中的备注标签index
        checkCont: [], // 选中的备注标签内容
        editAddressLayer: true, // 编辑地址弹层状态
        editRemarksLayer: true, // 编辑备注弹层状态
        orderSuccess: true, // 订单提交成功弹框
        submitData: {}, // 提交的数据，用于传数据到跳转页面
        payState: true,
        successBtn: false // 提交成功，隐藏支付按钮
      };
    },
    methods: {
      // 返回首页
      home() {
        const _this = this;
        uni.showModal({
          title: '温馨提示',
          content: '是否离开此页面返回首页？',
          cancelText: '否',
          confirmText: '是',
          success: function (res) {
            if (res.confirm) {
              uni.showLoading({
                title: '正在加载...',
                mask: true
              });
              setTimeout(() => {
                uni.reLaunch({
                  url: '../../pages/index/index',
                  success() {
                    uni.hideLoading();
                    _this.setTabBarState([0, false]);
                  }
                });
              }, 500);
            } else if (res.cancel) {
              console.log('用户点击否');
            }
          }
        });
      },
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
        // 取消后清空输入框
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
        if (strTrim(this.valAddressText) === '') {
          this.valAddressText = '';
          showToast('none', '请填写送餐地址', 1500);
          return;
        }
        if (strTrim(this.valAddressName) === '') {
          this.valAddressName = '';
          showToast('none', '请填写联系人', 1500);
          return;
        }
        // 验证手机号码
        if (strTrim(this.valAddressPhone) === '') {
          this.valAddressPhone = '';
          showToast('none', '联系电话不能为空', 1500);
          return;
        } else if (!/^1[3456789]\d{9}$/.test(this.valAddressPhone)) {// 验证手机号
          showToast('none', '输入的手机号码无效', 1500);
          return;
        } else {
          this.addressText = this.valAddressText;
          this.addressName = this.valAddressName;
          this.addressPhone = this.valAddressPhone;
          this.editAddressLayer = true;
        }
      },
      testPhone() {
        // 提示框消失后清空input
        validatePhone(this.valAddressPhone);
      },
      // 编辑备注
      editRemarks() {
        if (strTrim(this.remarksText) === '备注') {
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
      // 选择备注标签的index
      checkIndexs(item, index) {
        let indexIndex = this.checkboxIndex.indexOf(index);
        if (indexIndex == -1) {
          this.checkboxIndex.push(index);
        } else {
          this.checkboxIndex.splice(indexIndex, 1);
        }
      },
      // 确认支付
      confirmPayment() {
        const _this = this;
        this.payState = false;
        if (uni.getStorageSync('userInfo')) {
          const entTime = JSON.parse(uni.getStorageSync('userInfo')).entTime;
          if (entTime < new Date().getTime()) {
            console.log('登录已过期');
            overdueRemind();
            // uni.showModal({
            //   title: '温馨提示',
            //   content: '用户尚未登录或登录已过期，是否重新登录',
            //   cancelText: '否',
            //   confirmText: '是',
            //   success: function (res) {
            //     if (res.confirm) {
            //       uni.setStorageSync('isCanUser', true); // 设置登录状态
            //       uni.reLaunch({
            //         url: '../../pages/login/login',
            //         animationType: 'none'
            //       });
            //     } else if (res.cancel) {
            //       console.log('用户点击取消');
            //     }
            //   }
            // });
          } else {
            console.log('登录未过期');
            // 设置购物车动画
            this.setShopcartListState(true);
            let merge = [];
            let dishFood = [];
            let dataSet = [];
            this._foodsList.forEach(food => {
              if (food.goodsFormat.length !== 0) {
                food.goodsFormat.forEach(format => {
                  dishFood.push({
                    dishId: format.dishId,
                    dishName: format.dishName,
                    img: format.img,
                    sumCount: 1,
                    price: format.price,
                    periodTimeClassId: format.periodTimeClassId,
                    dishClassId: format.dishClassId
                  });
                });
              } else {
                dataSet.push({
                  dishId: food.dishId,
                  dishName: food.dishName,
                  img: food.img,
                  sumCount: food.sumCount,
                  price: food.price,
                  periodTimeClassId: food.periodTimeClassId,
                  dishClassId: food.dishClassId
                });
              }
              // 菜品和套餐中的菜品合并
              merge = [...dishFood, ...dataSet];
            });
            if (this.remarksText === '备注') {
              this.valRemarksText = '';
            }
            // 备注标签选中的内容
            this.checkboxIndex.forEach(index => {
              this.checkCont.push(this.checkboxData[index].remarkLable);
            });
            // 缓存总金额，传到查看订单详情
            uni.setStorageSync('payAmount', this._totalPrice);
            // 提交订单支付
            let remarkStr = '';
            if (this.valRemarksText === '') {
              remarkStr = this.checkCont.toString();
            } else {
              if (this.checkCont.toString() === '') {
                remarkStr = this.valRemarksText;
              } else {
                remarkStr = `${this.checkCont.toString()},${this.valRemarksText}`;
              }
            }
            const openId = JSON.parse(uni.getStorageSync('userInfo')).openId;
            const mergeParam = Object.assign({}, {dishList: merge}, params);
            setTimeout(() => {
              const submitData = Object.assign({}, mergeParam, {
                remark: remarkStr, // 备注
                orderAddress: this.addressText,
                phone: this.addressPhone,
                userId: uni.getStorageSync('userId'),
                userName: this.addressName,
                orderDesc: '',
                merchantId: this.getMerchantInfo.merchantId,
                openId: openId
              });
              console.log('提交后台', submitData);
              // _this.orderSuccess = false;
              // 跳转页面时传输
              this.submitData = submitData;
              uni.showLoading({
                title: '请稍后...',
                mask: true
              });
              submitOrder(submitData).then(res => {
                console.log('成功', res);
                uni.hideLoading();
                const payData = res.data.data;
                uni.setStorageSync('orderNo', payData.orderNo);
                // 缓存支付信息，用于再次支付
                uni.requestPayment({
                  provider: 'wxpay',
                  signType: 'MD5',
                  orderInfo: JSON.stringify(submitData),
                  timeStamp: payData.timeStamp,
                  nonceStr: payData.nonceStr,
                  package: payData.package,
                  paySign: payData.paySign,
                  success: function (res) {
                    _this.orderSuccess = false;
                    _this.payState = true;
                    _this.successBtn = true;
                    // 隐藏购物车
                    _this.setCartShow(true);
                    _this.setCartAn(false);
                    // 订单提交成功，清空购物车
                    _this.clearShopcart();
                    console.log('success:' + JSON.stringify(res));
                    const stateData = Object.assign({}, params, {
                      orderNo: payData.orderNo
                    });
                    orderStatus(stateData).then(state => {
                      console.log('状态', state);
                    }).catch(err => {
                      console.log(`https://segmentfault.com/search?q=${err}`);
                    });
                  },
                  fail: function (err) {  // 取消支付
                    const payParams = {
                      provider: 'wxpay',
                      signType: 'MD5',
                      orderInfo: JSON.stringify(submitData),
                      timeStamp: payData.timeStamp,
                      nonceStr: payData.nonceStr,
                      package: payData.package,
                      paySign: payData.paySign,
                      orderNo: payData.orderNo
                    };
                    try {
                      uni.setStorageSync('payParams', payParams);
                      // 缓存详情继续支付需要参数
                      uni.setStorageSync('submitData', JSON.stringify(submitData));
                    } catch (e) {
                      // error
                    }
                    console.log('fail:' + JSON.stringify(err));
                  }
                });
              }).catch(err => {
                console.log(`https://segmentfault.com/search?q=${err}`);
              });
            }, 50);
          }
        }
      },
      toPay() {
        const _this = this;
        uni.showModal({
          title: '温馨提示',
          content: '该订单已有未支付，是否前往支付？',
          cancelText: '否',
          confirmText: '是',
          success: function (res) {
            if (res.confirm) {
              uni.showLoading({
                title: '前往支付...',
                mask: true
              });
              setTimeout(() => {
                // 跳转后清空购物车
                _this.clearShopcart();
                uni.reLaunch({
                  url: '../../pages/index/index',
                  success: function (res) {
                    uni.hideLoading();
                    _this.setTabBarState([1, true]);
                  }
                });
              }, 500);
            } else if (res.cancel) {
              uni.showModal({
                title: '温馨提示',
                content: '是否稍后再支付该订单？',
                cancelText: '否',
                confirmText: '是',
                success: function (res) {
                  if (res.confirm) {
                    uni.showLoading({
                      title: '加载中...',
                      mask: true
                    });
                    setTimeout(() => {
                      // 跳转后清空购物车
                      _this.clearShopcart();
                      uni.reLaunch({
                        url: '../../pages/index/index',
                        success: function (cancel) {
                          uni.hideLoading();
                          // 隐藏购物车
                          _this.setTimeSlot(1); // 跳转后初始化数据
                          _this.setCartShow(true);
                          _this.setCartAn(false);
                          _this.setTabBarState([0, false]);
                        }
                      });
                    }, 500);
                  } else if (res.cancel) {
                    console.log('用户点击否');
                  }
                }
              });
              console.log('用户点击否');
            }
          }
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
      // 查看成功提交的订单详情
      checkOrder() {
        this.orderSuccess = true;
        uni.showLoading({
          title: '正在加载...',
          mask: true
        });
        try {
          const itemVal = encodeURIComponent(JSON.stringify(uni.getStorageSync('submitData')));
          setTimeout(() => {
            uni.reLaunch({
              url: `../../components/order-success/order-success?item=${itemVal}`,
              success: function () {
                uni.hideLoading();
              }
            });
          }, 1000);
        } catch (e) {
        }
      },
      ...mapActions([
        'setShopcartListState',
        'setTabBarState',
        'setCartGoodsMorning',
        'setCartGoodsNoon',
        'setCartGoodsNight',
        'setShopcartShow',
        'setTimeSlot',
        'setCartAn',
        'setCartShow'
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
        // 总金额
        let total = 0;
        this._foodsList.forEach(food => {
          total += food.price * food.sumCount;
        });
        // 金额四舍五入且保留两位小数点
        return Math.round(total * 100) / 100;
      },
      ...mapGetters([
        'getCartGoodsMorning',
        'getCartGoodsNoon',
        'getCartGoodsNight',
        'getMerchantInfo'
      ])
    },
    created() {
      // 地址接口
      const addressData = Object.assign({}, params, {
        // hospitalId: '8754362990002',
        // deviceMarker: 'KBS888888',
        userId: uni.getStorageSync('userId')
      });
      addressDefault(addressData).then(res => {
        if (res.data.code === '200') {
          // 隐藏遮罩
          this.maskSate = true;
          const data = res.data.data;
          if (data.infectedPatchId === null) {
            data.infectedPatchId = '';
          }
          if (data.orderAddress === null) {
            data.orderAddress = '';
          }
          if (data.orderPersonName === null) {
            data.orderPersonName = '';
          }
          if (data.phone === null) {
            data.phone = '';
          }
          this.addressText = data.orderAddress;
          this.addressName = data.orderPersonName;
          this.addressPhone = data.phone;
        }
      }).catch(err => {
        console.log(`https://segmentfault.com/search?q=${err}`);
      });
      // 备注标签
      getRemark().then(res => {
        this.checkboxData = res.data.data;
      }).catch(err => {
        console.log(`https://segmentfault.com/search?q=${err}`);
      });
    },
    components: {
      OrderFoodlist,
      Layer,
      SuccessLayer
    },
    onLoad() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    },
    onShow() {
      // 隐藏左上角返回首页按钮
      uni.hideHomeButton();
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .submit-order {
    .desc-state-text {
      position: fixed;
      top: 35%;
      right: 20rpx;
      z-index: 888;
      padding: 7rpx;
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      color: $color-background-button;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
      .back-home-icon {
        margin: 8rpx auto 0 auto;
        width: 36rpx;
        height: 30rpx;
        background: url('../../static/img/home-currt.png') no-repeat;
        background-size: cover;
      }
      .back-home-text {
        display: flex;
        justify-content: center;
        padding-top: 10rpx;
        font-size: $font-size22;
      }
    }
    padding: 32rpx 0 96rpx 0;
    min-height: calc(100vh - 128rpx);
    background: $color-button-text;
    .input-clear {
      position: absolute;
      right: 3%;
      bottom: 22rpx;
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
            padding: 15rpx 70rpx 15rpx 10rpx;
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
      flex-wrap: wrap;
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
      .checkbox-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20rpx;
        .checkbox-item {
          padding: 12rpx 18rpx;
          margin: 0 20rpx 20rpx 0;
          text-align: center;
          font-size: $font-size22;
          border: $color-theme 1px solid;
          border-radius: 8rpx;
        }
        .checkbox-color {
          color: $color-button-text;
          border: #fff 1px solid;
          background: #007aff;
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
      z-index: 1000;
      height: 88rpx;
      line-height: 88rpx;
      color: $color-button-text;
      .payment-main {
        display: flex;
        width: 100%;
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
    .success-layer-box {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      width: 100vw;
      height: 100vh;
      background: $color-dialog-background;
    }
    .pay-mask {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2000;
      width: 100vw;
      height: 100vh;
    }
  }
</style>
