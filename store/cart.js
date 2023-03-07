export default {
  namespaced: true,

  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  mutations: {
    addToCart(state, goods) {
      // 返回值为undefined或或者符合条件项的本身（指向同一个对象）
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id);
      // console.log(findResult);
      if (!findResult) {
        state.cart.push(goods);
      } else {
        findResult.goods_count++;
      }
      // console.log(state.cart);
      this.commit('m_cart/saveToStorage');
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart));
    },
    // 更新购物车中商品的勾选状态（state默认占第一位参数）
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id);
      if (findResult) {
        findResult.goods_state = goods.goods_state;
        // 本地化存储
        this.commit('m_cart/saveToStorage');
      }
    },
    // 更新商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id);
      if (findResult) {
        findResult.goods_count = goods.goods_count;

        this.commit('m_cart/saveToStorage');
      }
    },
    // 滑动删除购物车商品
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id !== goods_id);
      this.commit('m_cart/saveToStorage');
    },
    // 全选功能，更新购物车中所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState);
      this.commit('m_cart/saveToStorage');
    }
  },

  getters: {
    // 购物车中所有商品的总数量
    total(state) {
      return state.cart.reduce((total, item) => total += item.goods_count, 0);
    },
    // 购物车中已经勾选商品的总数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0);
    },
    // 已勾选商品的总价格
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price,
          0)
        .toFixed(2);
    }
  }
}
