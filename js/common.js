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
    $('body').addClass('loadding')

    // 在这边我们想拼接url
    // console.log(obj)
    obj.url = baseURL + obj.url

    // 在访问私有路径的时候，手动的将token值传递给服务器
    // 值如何传递：通过请求头的方式将token值传递给服务器
    if (obj.url.indexOf('/my/') != -1) {
      xhr.setRequestHeader('Authorization', sessionStorage.getItem('pyg_token'))
    }
  }
  // complete：请求完成时触发
  $.ajaxSettings.complete = function () {
    // 在这边我们想拼接url
    // console.log(456)
    $('body').removeClass('loadding')
  }
  // 动态扩展zepto中的成员
  $.extend($, {
    getParameter: function (url) {
      var obj = {}
      // location.search:url中?及?后面的内容
      url = url.substring(1) //cid=5&name=jack
      // 先按&拆分
      var arr = url.split('&') //['cid=5','name=jack']
      // 遍历进行第二次拆分
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].split('=') //['cid',5]
        obj[temp[0]] = temp[1] // obj['cid'] = 5
      }
      return obj
    }
  });
})