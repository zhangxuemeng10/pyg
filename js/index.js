$(function () {
banner()
 goodsList()
})
function banner() {
    $.ajax({
      type: 'get',
       dataType: 'json',
      url: 'home/swiperdata',
      success: function (result) {
        // console.log(result)
        var html = template('index_BannerTemp', result)
        $('.pyg_indexbanner').html(html)
        var indihtml = template('index_indiTemp', result)
   
        $('.mui-slider-indicator').html(indihtml)
        //初始化轮播图
        mui('.mui-slider').slider({
          interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
      }
    })
}
function goodsList() {
  $.ajax({
    type: 'get',
    url: 'home/goodslist',
    dataType: 'json',
    success: function (result) {
      // console.log(result)
      var html = template('prolistTemp', result)
      $('.pyg_goodsList').html(html)
    }
  })
}