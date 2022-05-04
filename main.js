import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// 引入全局组件
import uView from '@/uni_modules/uview-ui'
import divider from "@/components/common/divider.vue"

Vue.use(uView)
Vue.component('divider', divider)

// 挂载全局属性
import message from './service/request/message.js'
import http from './service/request/index.js'

Vue.prototype.$message = message
Vue.prototype.$http = http
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif