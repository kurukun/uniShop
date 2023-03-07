export default {
  // 开启命名空间
  namespaced: true,

  // 数据节点
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),

  // 方法节点
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address;

      this.commit('m_user/saveAddressToStorage');
    },
    // 本地化存储 address
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address));
    }
  },

  getters: {
    addstr(state) {
      if (!state.address.provinceName) return '';

      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo;
    }
  }
}
