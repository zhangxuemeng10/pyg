$(function () {

  // $.get('categories', function (result) {
  //   if (result.meta.status == 200) {
  //     console.log(result)
  //     var html = template('leftnavTemp', {
  //       'list': result.data,
  //       'time': Date.now()
  //     })
  //     $('.left ul').html(html)
  //     var myScroll = new IScroll('.left');
  //   }
  // }, 'json')


  render()
  var cateData

  function render() {
    //JSON.parse()方法转换null 依旧是null
    //拿null来做判断，会隐式转换为false，因此不用写成 JSON.parse(localStorage.getItem('pyg_cateDate')||'[]')
    cateData = JSON.parse(localStorage.getItem('pyg_cateDate'))
    if (cateData && Date.now() - cateData.time < 24 * 60 * 60 * 1000) { //如果数据在本地还未超过一小时，就用本地存储的数据，否则就重新发送ajax请求新的数据

      leftCateList()

      rightCateList(0)


    } else {
      getCateList()
    }


  }




  // 发送请求获取所有的分类数据

  function getCateList() {
    $('body').addClass('loadding')
    $.get('categories', function (result) {
      if (result.meta.status == 200) {
        // console.log(result)
        cateData = {
          'list': result.data,
          'time': Date.now()
        }
        localStorage.setItem('pyg_cateData', JSON.stringify(cateData))
        // 生成左边的结构-一级目录
        leftCateList()
        // 生成右边的二级目录
        rightCateList(0)
      }
    }, 'json')
  }

  function leftCateList() {

    var html = template('leftnavTemp', cateData)
    $('.left ul').html(html)
    var myScroll = new IScroll('.left');
    $('.left').on('tap','li',
      function () {
        $(this).addClass('active').siblings().removeClass('active')

        // 实现元素置顶操作
        myScroll.scrollToElement(this)

        // 通过当前点击的li的索引来动态生成二级目录（右边的部分）
        var index = $(this).index()
        rightCateList(index)

      })

  }

  function rightCateList(index) {
    var html = template('rightListTemp', cateData.list[index])
    $('.rightList').html(html)
    // 获取右边的二级目录的所有的图片的数量
    var imgCount = $('.right img').length

    $('.rightList img').on('load', function () {
      imgCount--
      if (imgCount == 0) {
        $('body').removeClass('.loading')
        var myScroll = new IScroll('.right');

      }
    })

  }


})