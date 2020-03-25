<template>
  <view class="header-box">
    <tab class="nav-tab" :tabLists="timeOfDay"></tab>
  </view>
</template>

<script>
  import Tab from 'components/tab/tab';
  import {mapGetters, mapActions} from 'vuex';
  import {tabList} from 'js/tabList';

  export default {
    data() {
      return {
        timeOfDay: ['早餐', '午餐', '晚餐'],
        dishId: [],
        dishName: [],
      }
    },
    computed: {
      ...mapGetters([
        'getTimeSlotActive'
      ])
    },
    methods: {
      // 早中晚
      tabTimeOf(index) {
        let tabIndex = index + 1;
        this.setTimeSlot(tabIndex);
      },
      ...mapActions([
        'setLoadingState',
        'setTimeSlot',
        'setMerchantIdStr'
      ])
    },
    created() {
      tabList.data.forEach(item => {
        this.dishId.push(item.dishClassId);
        this.dishName.push(item.dishClassName);
      });

    },
    components: {
      Tab
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
</style>
