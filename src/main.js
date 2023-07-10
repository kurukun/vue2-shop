import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 引入并配置axios
import axios from 'axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入NProgress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求request拦截器config===req
axios.interceptors.request.use(config => {
  // 显示进度条
  NProgress.start();
  config.headers.Authorization = sessionStorage.getItem('token');
  // console.log(config);
  // 下面是固定写法
  return config;
})

// response拦截器
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done();
  // 下面是固定写法
  return config;
})

Vue.prototype.$http = axios
Vue.config.productionTip = false

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0'); 
  const mm = (dt.getMinutes() + '').padStart(2, '0'); 
  const ss = (dt.getSeconds() + '').padStart(2, '0'); 

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
