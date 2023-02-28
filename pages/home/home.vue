<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav_img"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor_list">
      <view class="floor_item" v-for="(item,i) in floorList" :key="i">
        <!-- 楼层的标题 -->
        <image :src="item.floor_title.image_src" class="florr_title"></image>
        <!-- 楼层的图片区域 -->
        <view class="floor_img_box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left_img_box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix">
            </image>
          </navigator>
          <!-- 右侧小图片的盒子 -->
          <view class="right_img_box">
            <navigator :url="item2.url" class="right_img_item" v-for="(item2, i2) in item.product_list" :key="i2"
              v-if="i2 !== 0">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 这是轮播图的数据列表
        swiperList: [],
        // 分类导航的数据列表
        navList: [],
        floorList: []
      };
    },
    onLoad() {
      // 调用方法，获取轮播图的数据
      this.getSwiperList();
      this.getNavList();
      this.getFloorList();
    },
    methods: {
      // 获取轮播图
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata');
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg();

        this.swiperList = res.message;
      },
      // 获取导航图
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems');
        if (res.meta.status !== 200) {
          return uni.$showMsg();
        }
        this.navList = res.message;
      },
      // 跳转到分类页面，因为是tabbar页面，所以用是switchTab这个api
      navClickHandler(item) {
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层数据
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata');
        if (res.meta.status !== 200) return uni.$showMsg();
        // 对数据进行处理
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
          });
        });
        this.floorList = res.message;
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 350rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav_img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .florr_title {
    width: 100%;
    height: 60rpx;
  }

  .right_img_box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor_img_box {
    display: flex;
    padding-left: 10rpx;
  }
</style>
