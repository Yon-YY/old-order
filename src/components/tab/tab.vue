<template>
  <view class="tab-main">
    <view class="tab-list">
      <text v-for="(item, i) in tabLists" @tap="tabIndex(i)"
            class="tab-item" :class="[index === i ? 'active' : '']" :key="i">
        {{item}}
      </text>
    </view>
  </view>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      tabLists: {
        type: Array,
        default: []
      },
      active: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        index: 0
      };
    },
    watch: {
      active(index) {
        this.index = index;
      }
    },
    methods: {
      tabIndex(i) {
        this.index = i;
        this.$emit('tabIndex', this.index);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .tab-list {
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: $font-size28;
    color: $color-theme;
    font-weight: 400;
    border-bottom: 1px solid $color-background;
    background: $color-button-text;
    .tab-item {
      position: relative;
      margin: 0 20rpx;
      width: 176rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      overflow: hidden;
      &.active {
        color: $color-text;
      }
      &.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        z-index: 999;
        width: 100rpx;
        height: 8rpx;
        border-radius: 3px;
        background: #456eff;
        animation: tabAn .3s ease 0s both;
      }
    }
  }
  @-webkit-keyframes tabAn {
    from {
      transform: translate3d(-50%, 150%, 0);
      opacity: .5;
    }
    to {
      transform: translate3d(-50%, 0, 0);
      opacity: 1;
    }
  }
</style>
