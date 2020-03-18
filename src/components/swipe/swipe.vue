<template>
  <view>
    <view class="uni-padding-wrap" v-if="eleType">
      <view class="page-section swiper">
        <view class="page-section-spacing">
          <swiper class="swiper"
                  :indicator-dots="indicatorDots">
            <swiper-item v-for="(img, index) in swipers" :key="index">
              <image :src="img" class="swiper-item"></image>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
    <view class="uni-padding-wrap" v-else="!eleType">
      <view class="page-section swiper">
        <view class="page-section-spacing">
          <swiper class="swiper" :indicator-dots="indicatorDots">
            <swiper-item v-for="(text, index) in swipers" :key="index">
              <text>{{text}}</text>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      swipers: {
        type: Array,
        default: []
      },
      eleType: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      changeIndicatorDots(e) {
        this.indicatorDots = !this.indicatorDots
      },
      changeAutoplay(e) {
        this.autoplay = !this.autoplay
      },
      intervalChange(e) {
        this.interval = e.target.value
      },
      durationChange(e) {
        this.duration = e.target.value
      }
    },
    components: {}
  };
</script>

<style>
</style>
