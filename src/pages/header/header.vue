<template>
  <view class="header-box">
    <tab :tabLists="merchantName" class="header-tab-wrap"></tab>
    <search class="header-search"></search>
    <tab class="nav-tab" :tabLists="timeOfDay"></tab>
  </view>
</template>

<script>
  import Tab from 'components/tab/tab';
  import Search from 'components/search/search';
  export default {
    data() {
      return {
        merchantName: ['龙岗食堂', '坪山食堂', '龙岗食堂', '坪山食堂', '龙岗食堂', '坪山食堂'],
        merchantIdArr: [],
        timeOfDay: ['早餐', '午餐', '晚餐']
      }
    },
    methods: {},
    created() {
    },
    components: {
      Tab,
      Search
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .header-box {
    width: 100%;
  }
</style>
