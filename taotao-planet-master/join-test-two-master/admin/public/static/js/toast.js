// 注意这个对象名称toast 大小写对外统一 如果写成Toast 外面只能用Toast引用
//约定是 JS对象都大写 
//使用toast 小写就会报 is not define 错误 这个是严格语法验证
// 依赖https://cdn.jsdelivr.net/npm/sweetalert2@9  就是sweetalert2.js 通过cnd加载
Toast = {
    success: function (message) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000
      })
    },
  
    error: function (message) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 2000
      })
    },
  
    warning: function (message) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: 2000
      })
    }
  };