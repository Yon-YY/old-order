<template>
  <view class="count-down-box" :endTime="endTime" :callback="callback"
        :endText="endText">
    <slot>
      {{content}}
    </slot>
  </view>
</template>
<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        content: '',
      }
    },
    props: {
      endTime: {
        type: String,
        default: ''
      },
      endText: {
        type: String,
        default: '支付状态已过期'
      }
    },
    mounted() {
      this.countdowm(this.endTime / 1000)
    },
    methods: {
      countdowm(timestamp) {
        let self = this;
        let timer = setInterval(function () {
          let nowTime = new Date();
          let endTime = new Date(timestamp * 1000);
          let t = endTime.getTime() - nowTime.getTime();
          if (t > 0) {
            let day = Math.floor(t / 86400000);
            let hour = Math.floor((t / 3600000) % 24);
            let min = Math.floor((t / 60000) % 60);
            let sec = Math.floor((t / 1000) % 60);
            hour = hour < 10 ? "0" + hour : hour;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;
            let format = '';
            if (day > 0) {
              format = `${day}天${hour}小时${min}分${sec}秒`;
            }
            if (day <= 0 && hour > 0) {
              format = `${hour}小时${min}分${sec}秒`;
            }
            if (day <= 0 && hour <= 0) {
              format = `${min}分${sec}秒`;
            }
            self.setMonitor(false);
            self.content = format;
          } else {
            clearInterval(timer);
            self.setMonitor(true);
            self.content = self.endText;
          }
        }, 1000);
      },
      ...mapActions([
        'setMonitor'
      ])
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .count-down-box {
    padding: 30rpx 0;
  }
</style>
