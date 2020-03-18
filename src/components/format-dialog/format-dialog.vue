<template>
  <view class="format-dialog">
    <viwe class="format-dialog-content vertical-center"
          :class="[getFormatState === false ? 'close-an' : 'open-an']">
      <text class="format-dialog-title">
        {{getFormatListDetails.goodsName}}
      </text>
      <!--套餐菜品一-->
      <view class="foods-list-main">
        <text class="foods-list-title">{{formatList[0].typeName}}：</text>
        <view class="foods-list-box">
          <view class="checkbox-item-wrap">
            <text class="checkbox-item"
                  v-for="(list, index) in formatList[0].goodsList"
                  @tap="checkBoxOne(index)"
                  :class="{'checkbox-item-curr' : currArrOne.includes(index)}"
                  :key="index">{{list.goodsName}}
            </text>
          </view>
        </view>
      </view>
      <!--套餐菜品二-->
      <view class="foods-list-main">
        <text class="foods-list-title">{{formatList[1].typeName}}：</text>
        <view class="foods-list-box">
          <view class="checkbox-item-wrap">
            <text class="checkbox-item"
                  v-for="(list, index) in formatList[1].goodsList"
                  @tap="checkBoxTwo(index)"
                  :class="{'checkbox-item-curr': currArrTwo.includes(index)}"
                  :key="index">{{list.goodsName}}
            </text>
          </view>
        </view>
      </view>
      <!--总价及购物车按钮-->
      <view class="shop-details-bottom">
        <view class="shop-bottom-left">
          总价
          <text class="shop-price shop-price-icon">￥</text>
          <text class="shop-price shop-price-num">
            {{getFormatListDetails.price}}
          </text>
        </view>
        <view class="shop-bottom-right" @tap="joinShopcart">加入购物车</view>
      </view>
    </viwe>
    <view class="format-dialog-close item-center" @tap="closeformatWrap">
      <text class="dialog-close-icon"></text>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import {showToast} from '../../common/js/util';
  import {mapGetters, mapActions} from 'vuex';
  import {foodsList} from '../../common/js/foodsList';

  export default {
    data() {
      return {
        formatList: [],
        currArrOne: [],
        currArrTwo: []
      };
    },
    methods: {
      // 荤菜
      checkBoxOne(index) {
        if (this.currArrOne.includes(index)) {
          this.currArrOne = this.currArrOne.filter(item => item !== index);
        } else {
          if (this.currArrOne.length >= this._mealMaxNumber) {
            showToast('none', `${this.formatList[0].typeName}最多只能选${this._mealMaxNumber}个菜品`, 2000);
            return;
          } else {
            this.currArrOne.push(index);
          }
        }
      },
      // 素菜
      checkBoxTwo(index) {
        if (this.currArrTwo.includes(index)) {
          this.currArrTwo = this.currArrTwo.filter(item => item !== index);
        } else {
          if (this.currArrTwo.length >= this._vageMaxNumber) {
            showToast('none', `${this.formatList[1].typeName}最多只能选${this._vageMaxNumber}个菜品`, 2000);
            return;
          } else {
            this.currArrTwo.push(index);
          }
        }
      },
      // 加入购物车
      joinShopcart() {
        if (this.currArrOne.length === 0 || this.currArrTwo.length === 0) {
          showToast('none', '请您先选择菜品', 2000);
          return;
        } else if (this.currArrOne.length < this._mealMaxNumber || this.currArrTwo.length < this._vageMaxNumber) {
          showToast('none', '您选择的菜品与套餐不匹配', 2000);
          return;
        }
        // 已选的菜品
        // this.selectFoodsArr;
        this.addGood(this.selectFoodsArr);
        // 关闭弹层
        this.closeformatWrap();
        // 关闭弹层置空已选菜品缓存
        setTimeout(() => {
          this.currArrOne = [];
          this.currArrTwo = [];
        }, 1000);

        // 显示购物车
        this.setCartShow(false);
        this.setCartAn(true);
      },
      closeformatWrap() {
        setTimeout(() => {
          this.setFormatWrapState(true);
        }, 510);
        this.setFormatState(false);
      },
      ...mapActions([
        'addGood',
        'setFormatWrapState',
        'setFormatState',
        'setCartShow',
        'setCartAn'
      ])
    },
    created() {
      this.formatList = foodsList.data;
    },
    computed: {
      // 选中的菜品
      selectFoodsArr() {
        let setMeal = {};
        let selectArr = [];
        let mealArr = this.currArrOne;
        let vageArr = this.currArrTwo;
        // 荤菜
        mealArr.forEach(m => {
          let mealNum = this.formatList[0].goodsList[m];
          selectArr.push(mealNum);
        });
        // 素菜
        vageArr.forEach(v => {
          let mealNum = this.formatList[1].goodsList[v];
          selectArr.push(mealNum);
        });
        // return selectArr;
        // 套餐菜品合并入购物车数据
        setMeal = Object.assign({}, {goodsFormat: selectArr}, {
          goodsId: this.getFormatListDetails.goodsId,
          goodsCategoryId: this.getFormatListDetails.goodsCategoryId,
          goodsName: this.getFormatListDetails.goodsName,
          price: this.getFormatListDetails.price,
          img: this.getFormatListDetails.img,
          dishesType: this.getFormatListDetails.dishesType
        });
        return setMeal;
      },
      // 荤菜可选上限数量
      _mealMaxNumber() {
        if (this.getFormatListDetails) {
          return this.getFormatListDetails.mealNum;
        }
      },
      // 素菜可选上限数量
      _vageMaxNumber() {
        if (this.getFormatListDetails) {
          return this.getFormatListDetails.vageNum;
        }
      },
      ...mapGetters([
        'getFormatState',
        'getFormatListDetails'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/variable.styl";
  .format-dialog {
    position: relative;
    width: 100%;
    height: 100%;
    .format-dialog-content {
      margin-top: -70rpx;
      width: 650rpx;
      height: 888rpx;
      background: $color-button-text;
      border-radius: 8rpx;
      .format-dialog-title {
        margin: 32rpx 0 36rpx 40rpx;
        font-style: $font-size-large-xxx;
        font-weight: $font-weight-b;
        color: $color-theme-b;
      }
      .foods-list-main {
        width: 570rpx;
        margin: 0 auto 56rpx auto;
        .foods-list-title {
          margin-bottom: 16rpx;
          color: $color-theme;
          font-size: $font-size-medium;
        }
        .foods-list-box {
          width: 102%;
          height: 216rpx;
          justify-content: space-between;
          overflow-y: auto;
          overflow-x: hidden;
          .checkbox-item-wrap {
            display: flex;
            flex-wrap: wrap;
            width: 102%;
          }
          .checkbox-item {
            padding: 15rpx 26rpx;
            margin: 0 25rpx 26rpx 0;
            text-align: center;
            font-size: $font-size-small;
            color: $color-text;
            white-space: nowrap;
            border-radius: 8rpx;
            border: 1px solid #E8E9EC;
          }
          .checkbox-item-curr {
            color: $color-button-text;
            background: $color-background-button;
          }
        }
      }
      .shop-details-bottom {
        position: absolute;
        bottom: 40rpx;
        left: 40rpx;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        width: 88%;
        .shop-bottom-left {
          display: flex;
          align-items: center;
          color: $color-text;
          font-size: $font-size-medium;
          .shop-price {
            color: $color-number-text;
            font-size: $font-size-large-xx;
            font-weight: $font-weight-b;
          }
          .shop-price-icon {
            margin-top: 10rpx;
            font-size: $font-size-small-s;
          }
        }
        .shop-bottom-right {
          width: 184rpx;
          height: 56rpx;
          line-height: 56rpx;
          text-align: center;
          color: $color-button-text;
          font-size: $font-size-medium;
          background: $color-background-button;
          border-radius: 28rpx;
        }
      }
    }
    .format-dialog-close {
      top: 88%;
      width: 66rpx;
      height: 66rpx;
      .dialog-close-icon {
        width: 100%;
        height: 100%;
        background: url('../../static/img/layer-close.png') no-repeat;
        background-size: cover;
      }
    }
  }
  .open-an {
    animation: openAn .5s ease 0s both;
  }
  .close-an {
    animation: closeAn .5s ease 0s both;
  }
  @-webkit-keyframes closeAn {
    from {
      transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
      opacity: 1;
    }
    to {
      transform: translate3d(-50%, -50%, 0) scale3d(.7, .7, .7);
      opacity: 0;
    }
  }
  @-webkit-keyframes openAn {
    from {
      transform: translate3d(-50%, -50%, 0) scale3d(.7, .7, .7);
      opacity: 0;
    }
    to {
      transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
      opacity: 1;
    }
  }
</style>
