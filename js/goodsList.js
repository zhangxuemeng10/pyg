$(function () {
  // 单击搜索实现侧滑效果
  $('.mui-icon-search').on('tap', function () {
    mui('.mui-off-canvas-wrap').offCanvas('show');
  })

  // 参数
  var data = {
    cid: getParameter(location.search).cid,
    pagenum: 1,
    pagesize: 10
  }

  // renderMainData()
  // 获取数据
  // 封装函数原因是：后期下拉和上拉的时候需要重新加载数据
  function renderMainData(callback, obj) {
    // console.log(data)
    $.ajax({
      type: 'get',
      url: 'goods/search',
      // $.extend(obj1,obj2):将obj2的成员添加到obj1中，如果成员名称不一样，就累加，如果成员名称一致就覆盖
      data: $.extend(data, obj),
      dataType: 'json',
      success: function (result) {
        console.log(result)
        callback(result)
      }
    })
  }


  // 下拉刷新和上拉加载
  mui.init({
    swipeBack: false,
    pullRefresh: {
      container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      // down:说明这是下拉的初始化
      down: {
        height: 50,//可选,默认50.触发下拉刷新拖动距离,
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        // 下面这个回调函数在下拉松开手指之后会触发
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          data.pagenum = 1
          renderMainData(function (result) {
            var html = template('goodlistTemp', result.data)
            $('.goodslist').html(html)
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
            mui('#refreshContainer').pullRefresh().refresh(true)
          })
        }
      },
      // 上拉加载更多数据
      up: {
        height: 50,//可选.默认50.触发上拉加载拖动距离
        auto: false,//可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function () {
          data.pagenum++
          renderMainData(function (result) {
            if (result.data.goods.length > 0) {
              var html = template('goodlistTemp', result.data)
              $('.goodslist').append(html)
              mui('#refreshContainer').pullRefresh().endPullupToRefresh();
            } else {
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
            }
          })
        }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

  // ?cid=5&name=jack
  function getParameter(url) {
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

  $('.query_btn').on('tap', function () {
    // 展开运算符 + 对象解构
    var obj = {}
    obj.query = $('.query_txt').val()
    renderMainData(function (result) {
      console.log(result)
      var html = template('searchListTemp', result.data)
      $('.searchList').html(html)
    }, obj)
  })
})