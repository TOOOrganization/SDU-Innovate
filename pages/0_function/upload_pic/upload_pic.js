// pages/0_function/upload_pic/upload_pic.js

const app = getApp();
Page({
  data: {
    sourceKey: "",
    imgList: [],
    loadModal: false
  },
  onLoad: function (options) {
    this.setData({
      sourceKey: options.sourceKey || ""
    })
  },
  TextChange(e) {
    this.setData({
      sourceKey: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除图片吗？',
      cancelText: '我再想想',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  Scan() {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        let code = res.result.split("#")
        if(code[0] == "image"){
          wx.showToast({
            title:'扫码成功',
            icon:'success',
            duration:2000
          })    
          this.setData({
            sourceKey: code[1]
          })
        }else{
          if(code[0] == "signature"){
            wx.showToast({
              title:'请使用签名上传功能',
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

  Submit(){
    if(this.data.sourceKey == "" || this.data.imgList.length === 0){
      wx.showToast({
        title: '请补全未填写的参数',
        icon:'none',
        duration:2000
      })
      return;
    }
    this.setData({
      loadModal: true
    })
    let that = this;
    let base64 = wx.getFileSystemManager().readFileSync(this.data.imgList[0], "base64");
    let format = "png";
    let img = `data:image/${format};base64,${base64}`
    wx.request({
      url:'http://211.87.232.163:18888/photo',
      data:{
        file: img,
        photo_id: this.data.sourceKey
      },
      method:'POST',
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        console.log(res);
        let error = null;
        switch(res.data.status){
          case 200:
            break;
          case 601:
            error = "验证码失效 请刷新"
            break;
          case 701:
            error = "验证码已被使用 请刷新"
            break;
          case 500: 
          default:
            error = "系统错误 请稍后尝试"
            break;
        }
        if(error !== null){
          wx.showToast({
            title: error,
            icon:'none',
            duration:2000
          })
          that.setData({
            sourceKey: ""
          })
        }else{
          wx.navigateBack({
            delta: 0,
          })
          wx.showToast({
            title:'上传成功',
            icon:'success',
            duration:2000
          })    
        }
        that.setData({
          loadModal: false
        })
      },
      fail:function(res){
        console.log(res);
        that.setData({
          loadModal: false
        })
      }
    })
  }
})

/*
    wx.getFileSystemManager().readFile({
      filePath:this.data.imgList[0],
      encoding:"base64",
      success:function(res){
        let temp = that.data.sourceKey.split(".")
        let format = temp[temp.length - 1];
        let img = `data:image/${format};base64,${res.data}`
        wx.request({
          url:'http://211.87.232.163:18888/photo',
          data:{
            file: img,
            photo_id: that.data.sourceKey
          },
          method:'POST',
          header:{
            'content-type':'application/json'
          },
          success:function(res){
            console.log(res);
            let error = null;
            switch(res.data.status){
              case 200:
                break;
              case 601:
                error = "验证码失效 请刷新"
                break;
              case 701:
                error = "验证码已被使用 请刷新"
                break;
              case 500: 
              default:
                error = "系统错误 请稍后尝试"
                break;
            }
            if(error !== null){
              wx.showToast({
                title: error,
                icon:'none',
                duration:2000
              })
              that.setData({
                sourceKey: ""
              })
            }else{
              wx.navigateBack({
                delta: 0,
              })
              wx.showToast({
                title:'上传成功',
                icon:'success',
                duration:2000
              })    
            }
          },
          fail:function(res){
            console.log(res);
          }
        })
      }
    })
*/