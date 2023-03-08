<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState,
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      getUserProfile() {
        uni.getUserProfile({
          desc: '你的授权信息',
          success: (res) => {
            // 将信息存到 vuex 中
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg('您取消了登录授权')
          }
        })
      },
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      async getToken(info) {
        // 获取code值
        const [err, res] = await uni.login().catch(err => err)
        // console.log(res);
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败');
        // 准备参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // console.log(query);
        // 视频提供的接口无法使用，会登录失败，所以写一个假的token测试用
        // const {
        //   data: loginResult
        // } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败');
        // 直接把token保存到vuex中
        // uni.$showMsg('登录成功');
        const testToken =
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
        this.updateToken(testToken);
        this.navigateBack();
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null);
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 750rpx;
    background-color: #f8f8f8;
    overflow: hidden;

    &::after {
      position: absolute;
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }


    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
