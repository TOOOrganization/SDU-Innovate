// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconList: [{
      icon: 'pic',
      color: 'red',
      url: '../0_function/upload_pic/upload_pic',
      name: '图片上传'
    },{
      icon: 'write',
      color: 'blue',
      url: '../0_function/upload_signature/upload_signature',
      name: '签名上传'
    }],
    gridCol: 3
  },
  onLoad: function (options, e) {
    var id = options.Id;
  },
  Navigate(e) {
    var target = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: target
    })
  }
})