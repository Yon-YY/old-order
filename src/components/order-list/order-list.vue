<template>
  <view class="list-wrap">
    <view class="header-tab-box">
      <tab :tabLists="tabTitleText" @tabIndex="tabOrderList"
           class="nav-tab"></tab>
    </view>
    <view class="order-list-content">
      <order-item :orderItem="orderItem"></order-item>
      <view class="null-box">
        <null v-if="orderItem.length === 0 || orderItem === null"
              nullText="暂无未支付订单"></null>
      </view>
      <!--Loading组件-->
      <view class="loading-order-wrap" :hidden="loading">
        <loading-layer :loadingText="loadingText"></loading-layer>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  import Tab from '../tab/tab';
  import OrderItem from '../order-item/order-item';
  import LoadingLayer from '../loading/loading';
  import Null from '../null/null';
  import {orderList} from 'js/apiConfig';

  // import {ordersList} from 'js/orderList';

  export default {
    data() {
      return {
        tabTitleText: ['全部订单', '未支付', '已完成'],
        orderItem: [],
        orderType: 0, // 订单状态
        loading: false,
        loadingText: ''
      };
    },
    methods: {
      tabOrderList(index) {
        // 滚动回到顶部
        if (uni.pageScrollTo) {
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 300
          });
        }
        if (index === 2) {
          this._orderList(8);
        } else {
          this._orderList(index);
        }
      },
      _orderList(orderType) {
        this.loading = false;
        const data = {
          'pageSize': 9999,
          'page': 0,
          'hospitalId': '8754362990002',
          'orderType': orderType,
          'userId': '1',
          'deviceMarker': 'KBS888888',
          'category': 1
        }
        orderList(data).then(res => {
          this.loading = true;
          if (res.data.code === '200') {
            this.loading = true;
            this.orderItem = res.data.data;
          } else {
            this.orderItem = [];
          }
        });
      }
    },
    created() {
      this._orderList(this.orderType);
      // this.orderItem = ordersList.data;
    },
    components: {
      Tab,
      OrderItem,
      LoadingLayer,
      Null
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .list-wrap {
    .header-tab-box {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      width: 100%;
    }
    .order-list-content {
      position: relative;
      padding-bottom: 110rpx;
      margin: 112rpx 24rpx 0 24rpx;
      .null-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
      .loading-order-wrap {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%
      }
    }
  }
</style>
