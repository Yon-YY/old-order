<template>
  <view class="header-box">
    <tab :active="getTimeSlotActive" :tabLists="timeSlot"
         @tabIndex="tabTimeOf"></tab>
  </view>
</template>

<script>
  import Tab from 'components/tab/tab';
  import {mapGetters, mapActions} from 'vuex';
  // import {tabList} from 'js/tabList';

  export default {
    computed: {
      timeSlot() {
        let dishName = [];
        this.getTimeSlotData.forEach(item => {
          dishName.push(item.dishClassName);
        });
        return dishName;
      },
      ...mapGetters([
        'getTimeSlotData',
        'getTimeSlotActive'
      ])
    },
    methods: {
      // 点击早中晚
      tabTimeOf(index) {
        let tabIndex = index;
        this.setTimeSlot(tabIndex + 1);
      },
      ...mapActions([
        'setLoadingState',
        'setTimeSlot',
        'setMerchantIdStr'
      ])
    },
    components: {
      Tab
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus"></style>
