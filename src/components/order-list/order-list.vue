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
              nullText="暂无菜品"></null>
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
  import {mapGetters} from 'vuex';
  import {orderList} from '../../common/js/apiConfig';

  export default {
    data() {
      return {
        tabTitleText: ['全部订单', '未支付', '已完成'],
        orderItem: [],
        orderState: 0, // 订单状态
        loading: false
      };
    },
    methods: {
      tabOrderList(index) {
        if (index === 2) {
          this.orderState = 8;
        } else {
          this.orderState = index;
        }
      },
      _orderList() {
        // console.log(this.orderState);
        this.loading = false;
        const data = {
          'currentPage': 0,
          'pageSize': 999,
          'data': {
            'hospitalId': '1',
            'merchantType': 1,
            'merchantId': this.getMerchantIdStr,
            'userId': '333333',
            'orderStatus': this.orderState
          }
        }
        orderList(data).then(res => {
          if (res.data.code === 200) {
            this.loading = true;
            this.orderItem = res.data.data.data;
            // console.log(this.orderItem);
          }
        });
      }
    },
    computed: {
      ...mapGetters([
        'getMerchantIdStr'
      ])
    },
    watch: {
      orderState() {
        this._orderList();
      }
    },
    created() {
      this._orderList();
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
