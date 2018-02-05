//index.js
//获取应用实例
var app = getApp();
var globalData = app.globalData;
var baseUrl = app.siteinfo.siteroot;
var uniacid = app.siteinfo.uniacid;

Page({
  data: {
    word:"",//输入的口令文字
    money:"",//输入红包总金额
    rednumber:"",//输入红包个数
    charge:"",//服务费
    mask:false,
  },
  // 获取口令文字
  getWord:function(e){
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      word: e.detail.value
    })
  },
  // 获取金额
  getMoney: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      money: e.detail.value
    })
  },    
  // 获取红包个数
  getNumber: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      rednumber: e.detail.value
    })
  },

  // 生成红包
  tapGeneration: function () {
    var that = this;
      var data = {};
      data.TextCmd = that.data.word;
      data.Amount = that.data.money;
      data.PeopleNum = that.data.rednumber;
      console.log("这里?",data)

      wx.request({
        header: { 'content-type': 'application/json' },
        method: "POST",
        url: baseUrl + "Account/CreateRedPacketsCmd?accountID=" + wx.getStorageSync("accountId") + "&uniacid=" + uniacid + "&packetsType=" + 0,
        data: JSON.stringify(data),
        success: function (res) {
          if (res.data.StatusCode == 1000) {
            console.log("完成?",data)
            if(res.data.JsonData==true){
              // TODO  这改了
              wx.setStorage({
                key: 'packetsId',
                data: '把你获取的Id传进来',
              })
              that.setData({
                mask:true,
              })
              // ↓ ↓ ↓ ↓ ↓ ↓放这
              wx.navigateBack();
            }else{
              wx.requestPayment({
                appId: res.data.JsonData.appId,
                timeStamp: res.data.JsonData.timeStamp,
                nonceStr: res.data.JsonData.nonceStr,
                package: res.data.JsonData.package,
                signType: 'MD5',
                paySign: res.data.JsonData.paySign,
                success: function (e) {
                  that.setData({
                    mask: true,
                  })
                },
                fail: function (e) {
                  console.log("失败", e)

                  wx.showToast({
                    title: '提交失败',

                  })
                }
              })
            }
        
          } else {
            wx.showToast({
              title: '创建失败',
            }),console.log("失败?",res.data)
          }
        },
         fail: function () {
          wx.showToast({
            title: '网络请求失败',
          })
        }
      })
    // } else {
    //   wx.showToast({
    //     title: '不可以有空值',
    //   })
    // }
  },

  // 分享
  onShareAppMessage:function(){
    return {
      title: '口令红包',
      path: '/pages/receive/receive?packetsI=' +"把你获取的Id传进来",
      success: function (res) {
        // 转发成功
        wx.redirectTo({
          url: '/pages/receive/receive',
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },


  // 加载
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
  }
})
