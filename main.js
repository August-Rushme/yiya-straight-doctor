import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// 引入全局组件
import uView from '@/uni_modules/uview-ui'
import divider from "@/components/common/divider.vue"
import store from '@/store/index.js'

Vue.use(uView)
Vue.component('divider', divider)

// 挂载全局属性
import message from './service/request/message.js'
import http from './service/request/index.js'
import {
  timeFormat,
} from './subpackage-index/calendar/util';

Vue.prototype.$message = message
Vue.prototype.$http = http
Vue.prototype.$timeFormat = timeFormat
Vue.config.productionTip = false
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
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
