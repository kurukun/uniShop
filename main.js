// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  });
  // console.log(options);
  // 判断当前请求的是否为有权限的接口，通过判断路径是否含有my
  if (options.url.indexOf('/my') !== -1) {
    // 若是，则在请求头内添加身份认证的字段，值为token
    options.header = {
      Authorization: store.state.m_user.token
    }
  }
}
// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}
// 配置请求的根路径
$http.baseUrl = 'https://www.uinav.com/'
Vue.config.productionTip = false

// 封装弹框的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  });
}
App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
