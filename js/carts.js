$(function () {
  //初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  //发送请求获取数据生成动态结构

  function init() {
    $.ajax({
      type: 'get',
      url: 'my/cart/all',
      dataType: 'json',
      success: function (result) {
        // console.log(result);
        if (result.meta.status == 401) {
          location.href = './login.html'
        } else {
          var data = JSON.parse(result.data.cart_info)

          var html = template('orderTemp', { list: data })
          $('.order_list').html(html)

          //动态生成dom结构之后，要对数字输入框进行初始化
          mui('.pyg_userNum').numbox()
          //订单列表已经动态生成
          //接下来要生成总价钱
          calaTotalPrice()
        }


      }
    })
  }
  init()




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
        init()
      }
    })
  }

  //实现删除操作
  $('.pyg_orderDel').on('tap', function () {
    //perent()方法只能向上找一层，parents（）方法可以向上找n层
    var allLi = $('.order_list').find('[name=checkbox]').not(':checked').parents('.order-singer')
    console.log(allLi);
    syncCart(allLi)
    init()
  })
  //总价，定义为全局变量，因为后面生成订单的时候需要传入这个值给后台
  var total
  //计算总价
  function calaTotalPrice() {
    var allOrders = $('.order-singer')
    total = 0;
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




  //点击选择地址按钮出现地图选择器，并初始化地图选择器
  $('.selectAddress').on('tap', function () {
    //创建一个选择器对象，设置为三级联动
    var picker = new mui.PopPicker({
      layer: 3
    });
    //给选择器对象添加数据，数据只能是数组
    picker.setData(data)
    //显示picker选择器
    picker.show(function (items) {
      console.log(items);
      $('.userAddress').text(items[0].text + "-" + items[1].text + "-" + items[2].text)
    })
  })

  //生成订单
  $('.pyg_createOrder').on('tap', function () {
    //生成订单，我们需要将数据传给后台，重中之重是收集后台所需要的数据格式

    var order = {
      "order_price": total,
      "consignee_addr": $('.userAddress').text(),
      "goods": []
    }
    //   "goods_id": 5,
    //   "goods_number": 3,
    //   "goods_price": 15
    //准备goods所需要的数据  goods_number是用户选择的商品的数量amount，不是商品的总数量goods_number
    var allOrders = $('.order-singer')
    allOrders.each(function (index, value) {
      var singer = {};
      var temp = $(value).data('order')
      singer.goods_id = temp.goods_id
      singer.goods_number = temp.amount
      singer.goods_price = temp.goods_price
      order.goods.push(singer)
    })

    //准备好数据，发送请求
    $.ajax({
      type: 'post',
      url: 'my/orders/create',
      data: order,
      dataType: 'json',
      success: function (result) {
        console.log(result);
        location.href = './orderList.html'
      }
    })



  })

})