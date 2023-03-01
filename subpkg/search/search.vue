<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" placeholder="请输入内容" cancel-button="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name"> {{item.goods_name}} </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-if="searchResults.length === 0">
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in histories" :key="i" :inverted="true" @click="gotoGoodsList(item)" />
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的 timer id
        timer: null,
        // 关键词
        kw: '',
        // 搜索的结果列表
        searchResults: [],
        // 搜索历史的数据
        historyList: []
      };
    },
    methods: {
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },

      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      },

      input(e) {
        // input输入事件的回调，这里的e不是事件对象而是e的值
        // console.log(e);
        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          // console.log(e);
          this.kw = e;
          this.getSearchList();
        }, 500);
      },
      async getSearchList() {
        // 判空
        if (this.kw.length === 0) {
          this.searchResults = [];
          return;
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        });
        if (res.meta.status !== 200) return uni.$showMsg();
        this.searchResults = res.message;

        this.saveSearchHistory();
      },

      saveSearchHistory() {
        // this.historyList.push(this.kw);
        // 1.将Array数组转化为Set对象
        const set = new Set(this.historyList);
        // 2.移除对应的kw(为了更新顺序)
        set.delete(this.kw);
        // 3.追加kw
        set.add(this.kw);
        // 4.将set对象转化为数组再存储
        this.historyList = Array.from(set)


        // 对搜索历史数据进行本地化存储
        uni.setStorageSync('historyList', JSON.stringify(this.historyList));
      },

      // 清空历史数据
      clean() {
        this.historyList = [];
        uni.setStorageSync('historyList', '[]');
      }

    },

    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('historyList') || '[]');
    },

    computed: {
      histories() {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        // 不允许文字换行，单行文本
        white-space: nowrap;
        // 超出部分隐藏
        overflow: hidden;
        // 用...代表超出部分
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      // display: flex;
      // flex-wrap: wrap;

      .uni-tag {
        display: inline-block;
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
