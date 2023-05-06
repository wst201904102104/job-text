import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import filter from './filter/filter'

Vue.config.productionTip = false
//设置一个baseURL 方便我们切换线上线下访问地址
axios.defaults.baseURL = 'http://127.0.0.1:9000/';
// axios.defaults.port = '9000';

// 解决每次ajax请求，对应的sessionId不一致的问题
// 意思是携带cookie信息,保持session的一致性
axios.defaults.withCredentials = true;
//给vue 添加一个全局属性 可以通过$ajax 直接应用axios
Vue.prototype.$ajax = axios;

// 全局过滤器 将枚举字符进行文字意义替换
Object.keys(filter).forEach(key=>{
  Vue.filter(key,filter[key])
});

/**
 * axios拦截器 拦截每次请求 与返回值 做统一日志输出
 * 前端所有请求 都增加token属性 防止无令牌访问后端
 */
/*
axios.interceptors.request.use(function (config) {
  console.log("请求：", config);
  let token = Tool.getLoginUser().token;
  if (Tool.isNotEmpty(token)) {
    //在所有请求request header 头信息中心增加token属性
    config.headers.token = token;
    console.log("请求headers增加token:", token);
  }
  return config;
}, error => {});
*/
axios.interceptors.response.use(function (response) {
  console.log("返回结果：", response);
  return response;
}, error => {});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
