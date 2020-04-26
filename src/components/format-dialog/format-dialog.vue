<template>
  <view class="format-dialog">
    <viwe class="format-dialog-content vertical-center"
          :class="[getFormatState === false ? 'close-an' : 'open-an']">
      <text class="format-dialog-title">
        {{getDishIndex[1].dishPackageName}}
      </text>
      <!--套餐菜品一-->
      <view class="foods-list-main">
        <text class="foods-list-title">{{foodTypeName[0]}}：</text>
        <view class="foods-list-box">
          <view class="checkbox-item-wrap">
            <text class="checkbox-item"
                  v-for="(list, index) in goodsGroup[0]"
                  @tap="checkBoxOne(index)"
                  :class="{'checkbox-item-curr' : currArrOne.includes(index)}"
                  :key="index">{{list.dishName}}
            </text>
          </view>
        </view>
      </view>
      <!--套餐菜品二-->
      <view class="foods-list-main">
        <text class="foods-list-title">{{foodTypeName[1]}}：</text>
        <view class="foods-list-box">
          <view class="checkbox-item-wrap">
            <text class="checkbox-item"
                  v-for="(list, index) in goodsGroup[1]"
                  @tap="checkBoxTwo(index)"
                  :class="{'checkbox-item-curr': currArrTwo.includes(index)}"
                  :key="index">{{list.dishName}}
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
            {{getDishIndex[1].dishPackagePrice}}
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
  import {showToast} from 'js/util';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    data() {
      return {
        dishIndex: [], // 套餐数据
        foodTypeName: ['荤菜', '素菜'],
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
            showToast('none', `${this.foodTypeName[0]}最多只能选${this._mealMaxNumber}个菜品`, 2000);
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
            showToast('none', `${this.foodTypeName[1]}最多只能选${this._vageMaxNumber}个菜品`, 2000);
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
        this.setFormatState(false);
        setTimeout(() => {
          this.setFormatWrapState(true);
          this.currArrOne = [];
          this.currArrTwo = [];
        }, 530);
      },
      ...mapActions([
        'getGoodsGroup',
        'addGood',
        'setFormatWrapState',
        'setFormatState',
        'setCartShow',
        'setCartAn'
      ])
    },
    computed: {// 荤素菜归类
      goodsGroup() {
        let mealList = [];
        let vageList = [];
        if (this.getFormatListDetails[0]) {
          this.getFormatListDetails[0].forEach(m => {
            if (m.meatOrVegetable === 1) { // 荤菜
              mealList.push(m);
            } else {
              vageList.push(m);
            }
          });
        }
        return [mealList, vageList];
      },
      // 选中的菜品
      selectFoodsArr() {
        let setMeal = [];
        let selectArr = [];
        let mealArr = this.currArrOne;
        let vageArr = this.currArrTwo;
        // 荤菜
        mealArr.forEach(m => {
          let mealNum = this.goodsGroup[0][m];
          selectArr.push(mealNum);
        });
        // // 素菜
        vageArr.forEach(v => {
          let mealNum = this.goodsGroup[1][v];
          selectArr.push(mealNum);
        });

        // 套餐菜品合并入购物车数据
        if (this.getDishIndex[1]) {
          setMeal = Object.assign({}, {goodsFormat: selectArr}, {
            dishId: this.getDishIndex[1].dishPackageId,
            dishName: this.getDishIndex[1].dishPackageName,
            dishDiscrete: this.getDishIndex[1].dishPackageDesc,
            dishMode: 2,
            // periodTimeClassId: this.getDishIndex[1].periodTimeClassId,
            img: '../../static/dish.jpg',
            price: this.getDishIndex[1].dishPackagePrice
          });
        }
        return setMeal;
      },
      // 荤菜可选上限数量
      _mealMaxNumber() {
        if (this.getFormatListDetails[1]) {
          return this.getFormatListDetails[1][this.getDishIndex[0]].meatAmount;
        }
      },
      // 素菜可选上限数量
      _vageMaxNumber() {
        if (this.getFormatListDetails[1]) {
          return this.getFormatListDetails[1][this.getDishIndex[0]].vegetableAmount;
        }
      },
      ...mapGetters([
        'getFormatState',
        'getFormatListDetails',
        'getDishIndex'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .format-dialog {
    position: relative;
    width: 100%;
    height: 100%;
    .format-dialog-content {
      margin-top: -70rpx;
      width: 650rpx;
      height: 888rpx;
      border-radius: 8rpx;
      background: $color-button-text;
      .format-dialog-title {
        margin: 32rpx 0 36rpx 40rpx;
        font-size: $font-size36;
        font-weight: $font-weight-b;
        color: $color-theme-b;
      }
      .foods-list-main {
        width: 570rpx;
        margin: 0 auto 56rpx auto;
        .foods-list-title {
          margin-bottom: 16rpx;
          color: $color-theme;
          font-size: $font-size24;
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
            padding: 24rpx 30rpx;
            margin: 0 25rpx 26rpx 0;
            text-align: center;
            font-size: $font-size22;
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
          font-size: $font-size24;
          .shop-price {
            color: $color-number-text;
            font-size: $font-size32;
            font-weight: $font-weight-b;
          }
          .shop-price-icon {
            margin-top: 10rpx;
            font-size: $font-size20;
          }
        }
        .shop-bottom-right {
          width: 184rpx;
          height: 56rpx;
          line-height: 56rpx;
          text-align: center;
          color: $color-button-text;
          font-size: $font-size24;
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
    animation: openAn .5s ease .2s both;
  }
  .close-an {
    animation: closeAn .5s ease .2s both;
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
