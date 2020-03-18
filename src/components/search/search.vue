<template>
  <view class="search-wrapper">
    <van-search :value="searchVal" v-model="searchVal" use-action-slot
                class="search-box"
                placeholder="搜索你需要的商品热门关键词" @search="onSearch">
      <view v-if="searchVal !== ''" slot="action" @tap="onSearch">搜索</view>
    </van-search>
    <!--<view class="search-wrap">
<search-result :list="goodsList"></search-result>
    </view>-->
  </view>
</template>
<script type="text/ecmascript-6">
  import searchResult from '../search-result/search-result';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    data() {
      return {
        searchVal: '',
        goodsList: []
      }
    },
    methods: {},
    components: {
      searchResult
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .search-wrap {
    position: fixed;
    top: 235rpx;
    z-index: 999;
    width: 100%;
    min-height: calc(100% - 235rpx);
    background: $color-dialog-background;
  }
</style>
