<template>
  <van-tabs :active="active" v-model="index" @change="onChange" class="van-tabs-list">
    <van-tab class="van-tab" v-for="(txt, index) in tabLists" :title="txt"
             :key="index"></van-tab>
  </van-tabs>
</template>
<script>
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
    methods: {
      onChange(e) {
        this.$emit('tabIndex', e.detail.index);
      }
    }
  };
</script>
<style>
</style>
