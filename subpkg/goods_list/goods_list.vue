<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表数据
        goodsList: [],
        total: 0,
        isloading: false

      };
    },
    onLoad(options) {
      // console.log(options);
      this.queryObj.query = options.query || '';
      this.queryObj.cid = options.cid || '';
      // console.log(this.queryObj);
      this.getGoodsList();
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        this.isloading = true;
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
        this.isloading = false;
        cb && cb();
        if (res.meta.status !== 200) return uni.$showMsg();
        this.goodsList = [...this.goodsList, ...res.message.goods];
        this.total = res.message.total;
      },
      // 跳转到详情页
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    onReachBottom() {
      if (this.isloading) return;
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕');
      // 让页码自增加1
      this.queryObj.pagenum++;
      this.getGoodsList();
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1;
      this.total = 0;
      this.isloading = false;
      this.goodsList = [];
      // 重新发起网络请求
      this.getGoodsList(() => {
        uni.stopPullDownRefresh()
      });
    }
  }
</script>

<style lang="scss">

</style>
