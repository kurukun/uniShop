<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时秒数
        seconds: 3,
        // 定时器id
        timer: null
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 用户点击了结算按钮
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品');
        if (!this.addstr) return uni.$showMsg('请选择收货地址');
        // if (!this.token) return uni.$showMsg('请先登录！');
        if (!this.token) return this.delayNavigate();

        this.payOrder();
      },
      // 支付订单
      async payOrder() {
        // 1.创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 开发期间不要写真实价格，可以写死一个价格进行测试
          // order_price: this.checkedGoodsAmount,
          order_price: 0.01,
          consignee_addr: this.addstr,
          // 注意map方法
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！');
        // 1.3 得到服务器响应的“订单编号”,这里用的视频提供的token
        const orderNumber = res.message.order_number;
        console.log(orderNumber);

        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        });
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！');
        // 2.3 预付订单生成成功，得到支付相关的必要参数(大概是因为这个接口要身份认证，所以必定失败，只能照着写一个假数据测试)
        const payInfo = res2.message.pay;
        console.log(payInfo);
        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付');
        // 3.3 完成了支付，进一步查询支付的结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        });
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付');
        // 3.5 检测到订单支付完成
        uni.showToast({
          title: '订单支付完成',
          icon: 'success'
        })
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒后自动跳转到登录页',
          // 蒙版，防止弹窗时用户点击页面
          mask: true,
          duration: 1500
        })
      },
      // 延时导航到my页面
      delayNavigate() {
        this.seconds = 3;
        this.showTips(this.seconds);

        this.timer = setInterval(() => {
          this.seconds--;
          if (this.seconds <= 0) {
            clearInterval(this.timer);
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                });
              }
            });
            return;
          }
          this.showTips(this.seconds);
        }, 1000)
      }
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullCheck() {
        return this.total === this.checkedCount;
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    // fixed和sticky的区别要弄清楚点
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: red;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: red;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>
