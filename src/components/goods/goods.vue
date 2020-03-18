<template>
  <view class="goods-wraper"
        :class="[getCartAn === true ? 'goods-show-cart' : 'goods-hide-cart']">
    <!--左侧菜单-->
    <scroll-view class="menu-list-wrapper" :show-scrollbar="showScrollbar"
                 :scroll-y="scrolly" :scroll-with-animation="scrollAnimation">
      <view class="menu-item" v-for="(menu, index) in goods" :key="index"
            :class="[currentMenuIndex === index ? 'current':'']"
            @tap="selectMenu(menu, index)">
        <text class="menu-text">{{menu.goodsCategoryName}}</text>
      </view>
    </scroll-view>
    <!--右侧商品-->
    <scroll-view class="goods-list-wrapper"
                 :scroll-into-view="currentGoodId"
                 :show-scrollbar="showScrollbar"
                 :scroll-with-animation="scrollAnimation"
                 :scroll-y="scrolly" @scroll="scrollGoods">
      <view v-for="(good, id) in goods" :key="good.goodsCategoryId"
            class="goods-list">
        <!--点击左侧菜单，右侧滚动到相应类别（必须绑定 id 否则无效）-->
        <text class="good-title" :id="`menu${good.goodsCategoryId}`">
          {{good.goodsCategoryName}}
        </text>
        <view v-for="(food, index) in good.goodsList" class="good-item"
              :key="index">
          <view class="good-img">
            <image class="img" :src="food.img"></image>
          </view>
          <view class="good-synopsis">
            <text class="good-name">{{food.goodsName}}</text>
            <text class="good-desc">{{food.goodsDescribe}}</text>
            <text class="good-price">￥{{food.price}}</text>
            <view class="cartcontrol-wrapper">
              <cartcontrol :goods="goods"
                           :goodIndex="id"
                           :foodIndex="index"
                           :food="food">
              </cartcontrol>
            </view>
          </view>
        </view>
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
  </view>
</template>

<script type="text/ecmascript-6">
  import Cartcontrol from 'components/cartcontrol/cartcontrol';
  import Shopcart from '../shopcart/shopcart';
  import {mapGetters, mapActions} from 'vuex';
  import {goodsList} from 'js/goodsList';

  export default {
    data() {
      return {
        goods: [],  // 数据
        goodsListHeight: 0, //右侧菜品列表内容总高度
        heightArrs: [], // 列表分类距离屏幕 scrollTop
        lastActive: 0,  // 标志位
        currentMenuIndex: 0, //左侧菜单
        currentGoodId: '',  //右侧菜品 id
        showScrollbar: true,  //是否显示滚动条
        scrolly: true,  //允许纵向滚动
        scrollAnimation: true, //使用动画过渡
      };
    },
    computed: {
      goodsParams() {
        return [this.getMerchantIdStr, this.getTimeSlot];
      },
      ...mapGetters([
        'getLoadingState',
        'getLoadingLocal',
        'getMerchantIdStr',
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
          this.currentGoodId = `menu${item.goodsCategoryId}`;
          this.currentMenuIndex = index;
        }, 100);
      },
      // 滚动右侧商品列表
      scrollGoods(e) {
        const scrollTop = e.detail.scrollTop;
        const scorllArr = this.heightArrs;
        if (scrollTop >= scorllArr[scorllArr.length - 1] - (this.goodsListHeight / 2)) {
          return;
        } else {
          for (let i = 0; i < scorllArr.length; i++) {
            if (scrollTop >= 0 && scrollTop < scorllArr[0]) {
              if (0 != this.lastActive) {
                this.currentMenuIndex = 0;
                this.lastActive = 0;
              }
            } else if (scrollTop >= scorllArr[i - 1] && scrollTop < scorllArr[i]) {
              if (i != this.lastActive) {
                this.currentMenuIndex = i;
                this.lastActive = i;
              }
            }
          }
        }
      },
      toggleShopCart() {
        this.setShopcartListState(false);
        setTimeout(() => {
          this.setShopcartShow(true);
        }, 510);
      },
      ...mapActions([
        'setLoadingLocal',
        'setShopcartListState',
        'setShopcartShow'
      ])
    },
    mounted() {
      const _self = this;
      setTimeout(() => {
        uni.getSystemInfo({
          success: (res) => {
            let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后设备的rpx与px的比例 最后获得转化后得rpx单位的窗口高度
            // 头部内容高度324  底部高度 186(购物车高度 88   底部Bar高度 98)
            _self.goodsListHeight = windowHeight - (324 + 186);
          }
        });
        let heightArr = [];
        let h = 0;
        //创建节点选择器
        const goodList = uni.createSelectorQuery().in(this);
        //选择id
        goodList.selectAll('.goods-list').boundingClientRect(res => {
          res.forEach(item => {
            h += item.height;
            heightArr.push(h);
          });
          _self.heightArrs = heightArr;
        }).exec();
      }, 2000);
    },
    created() {
      console.log(goodsList.data);
      this.goods = goodsList.data;
    },
    components: {
      Cartcontrol,
      Shopcart
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .goods-wraper {
    position: absolute;
    display: flex;
    width: 100%;
    background: $color-button-text;
    overflow: hidden;
  }
  /*购物车隐藏时商品列表的高度*/
  .goods-hide-cart {
    height: calc(100% - 422rpx);
  }
  /*购物车显示时商品列表的高度*/
  .goods-show-cart {
    height: calc(100% - 510rpx);
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
  .good-item {
    position: relative;
    display: flex;
    padding-bottom 20rpx;
    margin: 0 24rpx 20rpx 24rpx;
  }
  .good-item:last-child {
    margin-bottom: 0;
  }
  .good-img {
    flex: 0 0 160rpx;
    margin-right: 24rpx;
  }
  .good-img > .img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .good-synopsis {
    flex: 1;
  }
  .good-name {
    margin: 8rpx 0 14rpx 0;
    height: 32rpx;
    line-height: 32rpx;
    font-size: $font-size32;
    font-weight: bold;
    color: $color-text;
  }
  .good-desc, .good-extre {
    display: block;
    line-height: 22rpx;
    font-size: $font-size22;
    color: $color-theme;
  }
  .good-desc {
    margin-bottom: 8rpx;
  }
  .good-price {
    margin-top: 22rpx;
    font-size: $font-size32;
    color: $color-number-text;
    font-weight: 700;
    line-height: 32rpx;
  }
  .cartcontrol-wrapper {
    position: absolute;
    right: 6rpx;
    bottom: 6rpx
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
