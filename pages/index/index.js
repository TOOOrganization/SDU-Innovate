Page({
  data: {
    PageCur: 'push'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '创新中心测试程序',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  Scan() {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        let code = res.result.split("#")
        let url = null;
        switch(code[0]){
          case "image":
            url = '../0_function/upload_pic/upload_pic?sourceKey=' + code[1];
            break;
          case "signature":
            url = '../0_function/upload_signature/upload_signature?sourceKey=' + code[1];
            break;
          default:
        }
        if(url !== null){   
          wx.navigateTo({
            url: url,
          })
          wx.showToast({
            title:'扫码成功',
            icon:'success',
            duration:2000
          })    
        }else{
          wx.showToast({
            title:'二维码无效',
            icon:'none',
            duration:2000
          })    
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  }
})