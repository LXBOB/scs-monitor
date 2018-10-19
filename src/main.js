import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/style.css'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

// 引入 ECharts 主模块
import chart from 'chart.js'
import store from './store/index'
// 本地存储
import utils from '@/utils/index'
// 引入前端监控
import monitor from '../js/vue_monitor'
import routes from './routes'
// 页面顶部进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(monitor)
Vue.prototype.$chart = chart
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueRouter)

const router = new VueRouter(routes)

router.beforeEach((to, from, next) => {
  window.scroll(0, 0)
  NProgress.start()
  if (to.meta.verify) {
    utils.storage.get('userInfo', obj => {
      if (!obj.token) {
        Vue.prototype.$message({
          'message': '无权访问，请先登录！', 'type': 'warning'
        })
        next({ path: '/login', query: { url: to.fullPath } })// 无权访问
      } else if (to.meta.grade && to.meta.grade < obj.userInfo.user_type) {
        Vue.prototype.$message({
          'message': '无权访问此页面！', 'type': 'warning'
        })
        NProgress.done()
      } else {
        next() // 如果有token就正常转向
      }
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

new Vue({
  router,
  store,
  'render': h => h(App)
}).$mount('#app')
