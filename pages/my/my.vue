<template>
  <view class="my-container">
    <!-- 获取token后才能进入用户信息界面 -->
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import tabbar_badge from '@/mixins/tabbar-badge.js'
  import {
    mapState
  } from 'vuex'

  export default {
    mixins: [tabbar_badge],
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['token'])
    }
  }
</script>

<style lang="scss">
  page,
  .my-container {
    height: 100%;
  }
</style>
