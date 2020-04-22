<template>
  <view class="goods-wraper"
        :class="[getCartAn === true ? 'goods-show-cart' : 'goods-hide-cart']">
    <!--左侧菜单-->
    <scroll-view class="menu-list-wrapper" :show-scrollbar="showScrollbar"
                 :scroll-y="scrolly" :scroll-with-animation="scrollAnimation">
      <view class="menu-item" v-for="(menu, index) in menusLeft" :key="index"
            :class="[currentMenuIndex === index ? 'current':'']"
            @tap="selectMenu(menu, index)">
        <text class="menu-text">{{menu.dishClassName}}</text>
      </view>
    </scroll-view>
    <!--右侧商品-->
    <scroll-view class="goods-list-wrapper"
                 :scroll-into-view="currentGoodId"
                 :show-scrollbar="showScrollbar"
                 :scroll-with-animation="scrollAnimation"
                 :scroll-y="scrolly">
      <view class="goods-list">
        <goods-type :goodType="mergeDishList"></goods-type>
      </view>
      <null v-if="goods.length === 0 || goods === null" nullText="暂无菜品"></null>
    </scroll-view>
    <!--购物车-->
    <view class="shopacart-box" :hidden="getCartShow"
          :class="[getCartAn === true ? 'cart-show' : 'cart-hide']">
      <shopcart></shopcart>
    </view>
    <view :hidden="getShopcartShow" class="shopacart-mask"
          @tap="toggleShopCart"></view>
    <!--Loading组件-->
    <view class="loading-local-wrap" :hidden="loading">
      <view class="loading-box vertical-center">
        <loading-layer :loadingText="loadingText"></loading-layer>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import LoadingLayer from '../loading/loading';
  import GoodsType from '../goods-type/goods-type';
  import Shopcart from '../shopcart/shopcart';
  import Null from '../null/null';
  import {mapGetters, mapActions} from 'vuex';
  import {timeSlot, menuList, foodsList, dishMeal} from 'js/apiConfig';
  import {errState} from 'js/util'

  export default {
    data() {
      return {
        timeSlotId: [], // 早中晚 id
        menusLeft: [],  // 左侧菜单列表数据
        goodsList: [],  // 商品列表数据
        dishMealList: [], // 套餐列表数据
        mergeDishList: [], //菜品、套餐接口数据合并
        currentMenuIndex: 0, //左侧菜单
        currentGoodId: '',  //右侧菜品 id
        showScrollbar: true,  //是否显示滚动条
        scrolly: true,  //允许纵向滚动
        scrollAnimation: true, //使用动画过渡
        loading: false, //默认第一次加载隐藏
        loadingText: '正在加载...'
      };
    },
    computed: {
      foodsParams() {
        return this.timeSlotId[this.getTimeSlot - 1]; // 早中晚id   左侧菜单id
      },
      ...mapGetters([
        'getTimeSlot',
        'getCartGoodsMorning',
        'getCartGoodsNoon',
        'getCartGoodsNight',
        'getCartShow',
        'getCartAn',
        'getShopcartShow'
      ])
    },
    methods: {
      // 点击左侧菜单
      selectMenu(item, index) {
        setTimeout(() => {
          this.loading = false;
          this.currentMenuIndex = index;
          this.menuIndex = index;
          this._foodsRight(item.dishClassId);
        }, 100);
      },
      toggleShopCart() {
        this.setShopcartListState(false);
        setTimeout(() => {
          this.setShopcartShow(true);
        }, 510);
      },
      // 早中晚接口数据
      _timeSlot() {
        const timeSlotData = {
          'hospitalId': '8754362990002',
          'deviceMarker': 'KBS888888',
          'category': 1,
          'type': 1
        }

        timeSlot(timeSlotData).then(res => {
          this.setLoadingState(true);
          this.loading = true;
          this.setTimeSlotData(res.data.data);
          // 缓存早中晚id
          res.data.data.forEach(item => {
            this.timeSlotId.push(item.dishClassId);
          });
        }).catch(err => {
          this.loading = true;
          this.setLoadingState(true);
          // 接口出错提示
          errState();
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
      },
      // 左侧菜单列表数据
      _menuLeft() {
        const menuLeftData = {
          'hospitalId': '8754362990002',
          'category': 1,
          'dishClassId': this.foodsParams  // 早中晚id
        }
        menuList(menuLeftData).then(res => {
          this.setLoadingState(true);
          this.loading = true;
          this.menusLeft = res.data.data;
          this._foodsRight(this.menusLeft[0].dishClassId);
        }).catch(err => {
          this.setLoadingState(true);
          // 接口出错提示
          errState();
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
      },
      // 右侧菜品列表接口请求
      _foodsRight(dishClassId) { // 左侧菜单id
        const foodsRightData = {
          'pageSize': 100,
          'hospitalId': '8754362990002',
          'periodTimeClassId': this.foodsParams, // 早中晚id
          'dishClassId': dishClassId, // 左侧菜品id
          'category': 1,
          'deviceMarker': 'KBS888888'
        }
        foodsList(foodsRightData).then(res => {
          this.loading = true;
          this.goodsList = res.data.data;
          this._dishMeal();  // 套餐接口
          // 接口右侧菜品数据、套餐合并数据
          this.mergeDishList = [this.goodsList, this.dishMealList.dishPackages];
        }).catch(err => {
          this.setLoadingState(true);
          // 接口出错提示
          errState();
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
      },
      // 套餐接口请求
      _dishMeal() {
        const dishMealData = {
          'hospitalId': '8754362990002',
          'deviceMarker': 'KBS888888',
          'category': 1
        }
        dishMeal(dishMealData).then(res => {
          this.dishMealList = res.data.data;
          console.log('套餐', this.dishMealList);
          this.setMerchantInfo(this.dishMealList);
          const _this = this;
          uni.showModal({
            title: '温馨提示',
            content: _this.dishMealList.hintTitle,
            showCancel: false,
            confirmText: '已知悉',
            success: function (res) {
            }
          });
        }).catch(err => {
          this.setLoadingState(true);
          // 接口出错提示
          errState();
          console.log(`https://segmentfault.com/search?q=${err}`);
        });
      },
      ...mapActions([
        'setLoadingState',
        'setTimeSlotData',
        'setMerchantInfo',
        'setLoadingLocal',
        'setShopcartListState',
        'setShopcartShow'
      ])
    },
    watch: {
      foodsParams() {
        this.loading = false;
        this.currentMenuIndex = 0; //左侧菜单样式重置
        this._menuLeft();
      }
    },
    created() {
      this._timeSlot();
    },
    components: {
      LoadingLayer,
      GoodsType,
      Shopcart,
      Null
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .goods-wraper {
    position: absolute;
    display: flex;
    padding-top: 30rpx;
    width: 100%;
    background: $color-button-text;
    overflow: hidden;
  }
  /*购物车隐藏时商品列表的高度*/
  .goods-hide-cart {
    height: calc(100% - 260rpx);
  }
  /*购物车显示时商品列表的高度*/
  .goods-show-cart {
    height: calc(100% - 350rpx);
  }
  .menu-list-wrapper {
    flex: 0 0 160rpx;
    width: 160rpx;
    height: 100%;
    background: $color-background;
  }
  .menu-list-wrapper::-webkit-scrollbar {
    display: none;
  }
  .menu-item {
    display: table;
    padding-left: 20rpx;
    width: 140rpx;
    height: 88rpx;
    color: $color-sub-theme;
    font-size: $font-size24;
    line-height: 88rpx;
  }
  .menu-item.current {
    position: relative;
    z-index: 10;
    margin-top: -1px;
    font-weight: 700;
    background: $color-button-text;
  }
  .menu-item.current:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 8rpx;
    height: 88rpx;
    background: #456EFF;
  }
  .goods-list-wrapper {
    height: 100%;
    flex: 1;
    background: #fff;
  }
  .good-title {
    display: block;
    padding-left: 24rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: $font-size24;
    font-weight: $font-weight-b;
    color: $color-sub-theme;
  }
  .shopacart-box {
    position: fixed;
    left: 0;
    bottom: 98rpx;
    z-index: 50;
    width: 100%;
  }
  .shopacart-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: $color-dialog-background;
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
    background: rgba(0, 0, 0, 0.6);
  }
  .cart-show {
    animation: cartShow .8s ease 0s both;
  }
  .cart-hide {
    animation: cartHide .8s ease 0s both;
  }
  @-webkit-keyframes cartShow {
    from {
      transform: translate3d(0, 130rpx, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @-webkit-keyframes cartHide {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, 130rpx, 0);
    }
  }
</style>
