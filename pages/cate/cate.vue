<template>
  <view>
    <!-- 使用自定义搜索组件 -->
    <my-search @myClick="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item, index) in cateList" :key="index">
          <!-- 动态绑定类名时，可以用数组一次绑定多个类名 -->
          <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChange(index)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, index2) in cateLevel2" :key="index2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 当前二级分类下的三级分类列表 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的item项 -->
            <view class="cate-lv3-item" v-for="(item3, index3) in item2.children" :key="index3"
              @click="toGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon.replace('dev', 'web')"></image>
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import tabbar_badge from '@/mixins/tabbar-badge.js'

  export default {
    mixins: [tabbar_badge],
    data() {
      return {
        // 当前屏幕可用的高度
        wh: 0,
        cateList: [],
        active: 0,
        // 二级分类的列表
        cateLevel2: [],
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前设备的屏幕大小信息
      const sysInfo = uni.getSystemInfoSync();
      // console.log(sysInfo);
      this.wh = sysInfo.windowHeight - 50;
      this.getCateList();
    },
    methods: {
      // 获取分类列表的数据
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories');
        if (res.meta.status !== 200) return uni.$showMsg();
        this.cateList = res.message;

        // 为二级分类赋值
        this.cateLevel2 = res.message[0].children;
      },
      activeChange(index) {
        this.active = index;
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[index].children;
        this.scrollTop = this.scrollTop === 0 ? 1 : 0;
      },
      // 跳转到商品列表页面
      toGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      gotoSearch() {
        // console.log('我是cate里的事件回调');
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;
    background-color: #fff;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          position: relative;
          background-color: #fff;

          &::before {
            position: absolute;
            content: "";
            display: block;
            width: 3px;
            height: 30px;
            background-color: blue;
            top: 50%;
            left: 0%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      text-align: center;
      font-weight: bold;
      padding: 15px 0;
    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }
  }
</style>
