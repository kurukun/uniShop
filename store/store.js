// 初始化vuex
import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    'm_cart': moduleCart,
    'm_user': moduleUser,
  }
})
