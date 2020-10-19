// pages/0_function/upload_signature/upload_signature.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabList: [
      {name: '1. 书写签名'},
      {name: '2. 拍照'},
      {name: '3. 预览上传'}
    ],
    TabCur: 0,
    Snap: false,
    Preview: false,
    img: '',
    sourceKey: '',
    calImg: '',
    weight:50,
  },
  onLoad: function (options) {
    this.setData({
      sourceKey: options.sourceKey || ""
    })
  },
  NumSteps() {
    this.setData({
      TabCur: this.data.TabCur == this.data.TabList.length - 1 ? 0 : this.data.TabCur + 1
    })
  },
  Navigate(e) {
    var target = e.currentTarget.dataset.index;
    if (target < this.data.TabCur){
      this.setData({
        TabCur: target
      })
    }
  },
  OpenCamera() {
    this.setData({
      Snap: true
    })
  },

  Cancel() {
    this.setData({ 
      Preview: false 
    })
  },
  SaveImg() {
    this.setData({
      Snap: false,
      Preview: false
    })
    this.RemoveBackground();
    this.NumSteps();
  },
  TakePhoto() {
    const ctx = wx.createCameraContext()
    const listener = ctx.onCameraFrame((frame) => {
      console.log(frame)
    })
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        this.setData({
          img: res.tempImagePath,
          Preview: true
        })
        listener.stop({
          success: (res) => {
            console.log(res)
          },
          fail: (err) => {
            console.log(err)
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  TextChange(e) {
    this.setData({
      sourceKey: e.detail.value
    })
  },
  WeightChange(e) {
    this.setData({
      calImg: '',
      weight: e.detail.value
    })
    this.RemoveBackground();
  },
  WeightChanging(e) {

  },
  Scan() {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        if(code[0] == "signature"){
          wx.showToast({
            title:'扫码成功',
            icon:'success',
            duration:2000
          })    
          this.setData({
            sourceKey: code[1]
          })
        }else{
          if(code[0] == "image"){
            wx.showToast({
              title:'请使用图片上传功能',
              icon:'none',
              duration:2000
            }) 
          }else{
            wx.showToast({
              title:'二维码无效',
              icon:'none',
              duration:2000
            }) 
          }
          this.setData({
            sourceKey: ""
          })
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

  RemoveBackground(){
    const ctx = wx.createCanvasContext("myCanvas");
    var that = this;
    wx.getImageInfo({ 
      src: this.data.img, 
      success: function (res) { 
        console.log(res)
        ctx.drawImage(that.data.img, 0, 0, res.width, (res.width / 1080) * 960, 0, 0, 1080, 960);
        ctx.draw(false, () => {
          wx.canvasGetImageData({
            canvasId: "myCanvas",
            x: 240,
            y: 221,
            width: 600,
            height: 600,
            success: (res) => {
              console.log(res)
              var length = 600 * 300 * 4;
              var calData = new Uint8ClampedArray(length)
              var weight = that.data.weight / 50
              for(var i = 0; i < length; i++){
                calData[i] = (i % 4 === 3 ? 255 : (255 - (res.data[i + length] - res.data[i])) * 2 - (188 * weight));
              }
              wx.canvasPutImageData({
                canvasId: "myCanvas2",
                data: calData,
                x: 0,
                y: 0,
                width: 600,
                height: 300,
                success: (res) => {
                  console.log(res)
                  wx.canvasToTempFilePath({
                    width: 600,
                    height: 300,
                    canvasId: "myCanvas2",
                    success: function(res) {
                      console.log(res)
                      that.setData({
                        calImg: res.tempFilePath,
                      })
                    }
                  });
                },
                fail: res => {
                  console.log(res)
                },
              })
            },
            fail: res => {
              console.log(res)
            },
          })
        })
      } 
    })  
  }
})