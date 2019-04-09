$(function () {
  //初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  //发送请求获取数据生成动态结构

  $.ajax({
    type: 'get',
    url: 'my/cart/all',
    dataType: 'json',
    success: function (result) {
      // console.log(result);
      var data = JSON.parse(result.data.cart_info)

      var html = template('orderTemp', { list: data })
      $('.order_list').html(html)

      //动态生成dom结构之后，要对数字输入框进行初始化
      mui('.pyg_userNum').numbox()
      //订单列表已经动态生成
      //接下来要生成总价钱
      calaTotalPrice()

    }
  })



  //单击编辑，显示隐藏某些页面元素

  $('.pyg-orderEdit').on('tap', function () {

    $('body').toggleClass('eleToggle')
    if ($(this).text() == '编辑') {
      $(this).text('完成')
    } else {
      $(this).text('编辑')
      //用户在编辑的状态下可以修改商品的数量，修改完成后也就是编辑的同时需要重新计算总价格并且将数据传给服务器重新渲染页面，也就是所谓的同步购物车
      console.log($('.order-singer'));

      syncCart($('.order-singer'))
      
    }

  })
  //同步购物车
  function syncCart(allList) {
    var list_obj = {}
    
    for (var i = 0; i < allList.length; i++) {
      var data = $(allList[i]).data('order')
      data.amount = $(allList[i]).find('#test').val();

      list_obj[data.goods_id] = data
    }
    $.ajax({
      type: 'post',
      url: 'my/cart/all',
      data: { 'infos': JSON.stringify(list_obj) },
      dataType: 'json',
      success: function (result) {
        // console.log(result);
      }
    })
  }

//实现删除操作
  // $('.pyg_orderDel').on('tap',function(){
  //   var allLi = $('.order_list').find('[name=checkbox]').not(':checked')
  //  .parents().parents('.order-singer')
  //   console.log(allLi);
  //   syncCart(allLi)

  // })

  //计算总价
  function calaTotalPrice() {
    var allOrders = $('.order-singer')
    var total = 0;
    allOrders.each(function (index, value) {
      // console.log(value);
      //使用each()方法，方法中的value值是dom对象，要想使用zepto中的方法，要通过$()转换成zepto对象
      var price = $(value).data('order').goods_price
      var num = $(value).find('#test').val()
      //计算总价
      total = total + (num * price);

    })
    //给元素赋值
    $('.price').text('￥ ' + total)

  }

  //点击修改数量按钮，+  -  重新计算价格
  $('.order_list').on('tap', '.pyg_userNum .mui-btn', function () {
    calaTotalPrice()
  })
})