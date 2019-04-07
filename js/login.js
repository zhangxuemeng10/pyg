$(function () {
  $('.mui-btn-primary').on('tap', function () {

    // 1.收集用户数据
    var obj = {
      username: "",
      password: ""
    }
    obj.username = $('.username').val()
    obj.password = $('.password').val()
    // 2.进行相应的验证
    if (!/^1[3-9]\d{9}$/.test(obj.username)) {
      mui.toast('手机号码输入不正确')
      return false;
    }
    if (obj.password.length < 6) {
      mui.toast('密码长度小于6位')
      return false;
    }
    // 3.发送ajax请求
    $.ajax({
      type: 'post',
      url: 'login',
      data: obj,
      dataType: 'json',
      success: function (result) {
        console.log(result)
        if (result.meta.status == 200) {
          // 登陆成功
          // 1.将当前token值存储到本地存储
          sessionStorage.setItem('pyg_token', result.data.token)
          // 2.进行页面的跳转
          // var re = sessionStorage.getItem('redirectUrl')
          var re = $.getParameter(location.search).redirectUrl
          if (re) {
            location.href = unescape(re)
          } else {
            location.href = '/index.html'
          }
        } else {
          mui.toast(result.meta.msg)
        }
      }
    })
  })
})