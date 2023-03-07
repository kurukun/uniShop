import {
  mapGetters
} from 'vuex'
// mixins 用于复用配置项的设置


export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  onShow() {
    this.setBadge();
  },
  watch: {
    total() {
      this.setBadge();
    }
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.total + ''
      })
    }
  }
}
