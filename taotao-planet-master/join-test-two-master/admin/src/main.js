import Vue from 'vue'
import App from './app.vue'

//引入router 路由
import router from './router'
//引入axios模块
import axios from 'axios'
import filter from './filter/filter.js'





//设置一个baseURL 方便我们切换线上线下访问地址
axios.defaults.baseURL = 'http://127.0.0.1:9000/';
// axios.defaults.port = '9000';

// 解决每次ajax请求，对应的sessionId不一致的问题
// 意思是携带cookie信息,保持session的一致性
axios.defaults.withCredentials = true;
Vue.config.productionTip = false
//给vue 添加一个全局属性 可以通过$ajax 直接应用axios
Vue.prototype.$ajax = axios;

/**
 * axios拦截器 拦截每次请求 与返回值 做统一日志输出
 * 前端所有请求 都增加token属性 防止无令牌访问后端
 */
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
axios.interceptors.response.use(function (response) {
  console.log("返回结果：", response);
  return response;
}, error => {});

// 路由登录拦截
router.beforeEach((to, from, next) => {
  // 要不要对meta.loginRequire属性做监控拦截
  if (to.matched.some(function (item) {
    return item.meta.loginRequire
  })) {
    //getLoginUser 从SessionStorge中查看是否有登录用户存在
    let loginUser = Tool.getLoginUser();
    if (Tool.isEmpty(loginUser)) {
      next('/login'); //loginRequire 为false 那么就跳转到登录页面
    } else {
      next();
    }
  } else {
    next();
  }
});

// 全局过滤器
Object.keys(filter).forEach(key=>{
  Vue.filter(key,filter[key])
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

