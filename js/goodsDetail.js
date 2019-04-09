$(function () {
  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick (阻尼系数)减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  var info = {
    cat_id: '',
    goods_id: '',
    goods_name: '',
    goods_number: '',
    goods_price: '',
    goods_small_logo: '',
    goods_weight: ''
  }
  // alert($.getParameter(location.search).goods_id)
  // 发送请求，获取当前商品详细数据
  $.ajax({
    type: 'get',
    url: 'goods/detail',
    data: $.getParameter(location.search),
    dataType: 'json',
    success: function (result) {
      // 为info赋值
      info.cat_id = result.data.cat_id
      info.goods_id = result.data.goods_id
      info.goods_name = result.data.goods_name
      info.goods_number = result.data.goods_number
      info.goods_price = result.data.goods_price
      info.goods_small_logo = result.data.goods_small_logo
      info.goods_weight = result.data.goods_weight

      console.log(result)
      var html = template('gdTemp', result.data)
      $('.mui-scroll').html(html)
      mui('.mui-slider').slider({
        interval: 2000
      });
    }
  })

  // 添加商品到购物车
  $('.btn-addCart').on('tap', function () {
    // 1.判断是否有token，如果没有，则重定向到登陆页面
    // 约定使用sessionStorage存储
    var mytoken = sessionStorage.getItem('pyg_token')

    if (!mytoken) {
      // sessionStorage.setItem('redirectUrl',location.href)
      //escape()方法会将地址中的？ = ： 转换成%的形式 （也就是对地址进行编码urlencode）。 以至于我们调用getParameter()方法时，不会出错，如果不转化地址的话，调用该方法时会得不到我们想要的路径
      location.href = './login.html?redirectUrl=' + escape(location.href)
    }
    // 2.如果有token,那么就发送请求
    else {
      $.ajax({
        type: 'post',
        url: 'my/cart/add',
        //这里要看文档，文档说要字符串
        data: {info:JSON.stringify(info)},
        dataType: 'json',
        success: function (result) {
          console.log(result)
          // 3.接收返回结果，如果是token过期，则重新登陆--重定向到登陆页面
          if (result.meta.status === 401) {
            // sessionStorage.setItem('redirectUrl',location.href)
            // location.href='./login.html'

            // 通过url编码来实现href的传递
            location.href = './login.html?redirectUrl=' + escape(location.href)
          }
          // 4.如果有效，那么就弹出提示：添加成功，是否查看购物车
          else {
            // 提示
            mui.confirm('是否跳转到购物车页面?','温馨提醒',['跳转','取消'],function(e){

            if(e.index==0){
            location.href='carts.html'

            }else{

            }

            })

            // console.log('ok')
          }
        }
      })
    }
  })

})