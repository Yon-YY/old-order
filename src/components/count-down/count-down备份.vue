<template>
  <view class="box">
    <text class="count-number">{{timerCount < 10 ? '0' + timerCount :
      timerCount}}
    </text>
    <!--    <text class="count-number">{{_minuteSecond}}-->
    </text>
  </view>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';
  import {minuteSecond} from 'js/util';

  export default {
    props: {
      seconds: {
        type: Number,
        detail: 0
      },
      index: {
        type: Number,
        detail: 1
      }
    },
    data() {
      return {
        timerCount: 0
      }
    },
    computed: {
      _minuteSecond() {
        // minuteSecond(this.seconds);
        return Math.round(this.seconds / 1000);
      }
    },
    mounted() {
      this.timing();
    },
    methods: {
      timing() {
        let startTime = uni.getStorageSync(`startTime${this.index}`);
        let nowTime = new Date().getTime();
        console.log(nowTime);
        console.log('1587974145');
        if (startTime) {
          let surplus = this._minuteSecond - parseInt((nowTime - startTime) / 1000, 10);
          this.timerCount = surplus <= 0 ? 0 : surplus;
        } else {
          this.timerCount = this._minuteSecond;
          uni.setStorageSync(`startTime${this.index}`, nowTime);
        }
        let timer = setInterval(() => {
          if (this.timerCount > 0 && this.timerCount <= this._minuteSecond) {
            this.setMonitor([`startTime${this.index}`, true]);
            this.timerCount--;
          } else {
            this.setMonitor([`startTime${this.index}`, false]);
            uni.removeStorageSync(`startTime${this.index}`);
            clearInterval(timer);
          }
        }, 1000);
      },
      ...mapActions([
        'setMonitor'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
