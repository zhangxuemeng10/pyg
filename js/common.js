$(function () {
  // 解决mui中a标签的clik事件失效的代码
  // 事件委托是通过冒泡来实现的
  mui('body').on('tap', 'a', function (e) {
    // 阻止向上冒泡
    e.preventDefault()

    window.top.location.href = this.href;
  });

  // const baseURL = 'http://157.122.54.189:9094/api/public/v1/'
  const baseURL = 'http://140.143.222.79:8899/api/public/v1/' 
  // 添加zepto拦截器：它的作用是可以让每个ajax请求都经过这个函数进行处理
  $.ajaxSettings.beforeSend = function (xhr, obj) {
    // 在这边我们想拼接url
    // console.log(obj)
    obj.url = baseURL + obj.url
  }

})