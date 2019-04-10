$(function () {

  //获取验证码，因为没有移动的接口，所以不能发送验证码给手机，只能通过ajax向后台发请求，后台会返回一个验证码

  $('#pyg_code').on('tap', function () {
    //验证手机号是否正确
    //参数的命名 ，name属性的值，要参照接口文档
    var mobile = $('[name="mobile"]').val()
    var mobileReg = /^1[3-9]\d{9}$/
    if (!mobileReg.test(mobile)) {
      mui.toast('手机号码输入错误')
      return false
    }

    $.ajax({
      type: 'post',
      url: 'users/get_reg_code',
      data: { mobile: mobile },
      dataType: 'json',
      success: function (result) {


        if (result.meta.status == 200) {
          $('[name="code"]').val(result.data)

        }
      }

    })
    //验证码回来之后，就要实现注册操作，又是收集数据发送ajax请求
    $('.btn-register').on('tap', function () {
      //验证邮箱是否正确
      var email = $('[name="email"]').val()
      var emailReg = /^\w+@\w+\.([a-zA-Z]{2,})+$/
      if (!emailReg.test(email)) {
        mui.toast('邮箱格式错误')
        return false
      }

      var pwd = $('[name="pwd"]').val()
      if (pwd.length < 6) {
        mui.toast('密码长度小于六位')
        return false
      }


      var formdata = $('form').serialize()
      console.log(formdata);
      $.ajax({
        type: 'post',
        url: 'users/reg',
        data: formdata,
        dataType: 'json',
        success: function (result) {
          // console.log(result);

          if (result.meta.status == 200) {
            $('[name="code"]').val(result.data)
            location.href = './login.html'
          } else if (result.meta.status == 400) {
            mui.toast(result.meta.msg)
          }
        }
      })


    })


  })


})