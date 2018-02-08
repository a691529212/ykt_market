//app.js
var timeUtil = require("/utils/util.js");
var market = require("/utils/market.js")

App({
  onLaunch: function (o) {
    console.log("-------------SHARE_USER_ID", o.query.userId);
    var that = this;
    if (o.query.userId) {
      var shareUserId = o.query.userId;
      that.globalData.shareUserId = shareUserId;
      var shareUserId = o.query.userId;
      that.globalData.shareUserId = shareUserId;
    }
    var that = this;
    // mapTool.prepare(),
    // this.praseUrl();
    this.login(function () {

    });
   
  },
  globalData: {
    userInfo: null,
    code: null,
    // interface: "https://cj.360yingketong.com/",
    interface: "https://xcx.lesaosao.cn/",
    token: null,
    shareUserId: null,
  }
  // ,
  // praseUrl: function () {
  //   var that = this;
  //   var durl = /https:\/\/([^\/]+)\//i;
  //   var newurl = that.siteInfo.siteroot.match(durl)[0];
  //   that.globalData.interface = newurl + '';
  // }
  , login: function (callBack) {
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        wx.setStorage({
          key: 'code',
          data: code,
        })
        var date = {};
        date.code = code;
        wx.getSetting({
          success: res => {
            wx.getUserInfo({
              success: res => {
                var iv = res.iv;
                var encryptedData = res.encryptedData;
                date.iv = iv;
                date.encryptedData = encryptedData;
                that.globalData.userInfo = res.userInfo;
                wx.setStorage({
                  key: 'userInfo',
                  data: res.userInfo,
                })
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              },
              complete: function () {
                wx.request({
                  url: that.globalData.interface + "api/v1/token",
                  data: date,
                  method: "GET",
                  dateType: "json",
                  header: {
                    // uniacid: that.siteInfo.uniacid
                    shareUserId: that.globalData.shareUserId
                  },
                  success: function (res) {
                    var result = res.data;
                    let code = result.code;
                    switch (result.code) {
                      case 0:
                        that.globalData.token = res.data;
                        callBack();
                      case 999:
                        wx.showToast({
                          title: result.msg,
                        })
                        break;
                      case 10001:
                        // 	token不存在或已过期
                        break;
                    }
                    return false;
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  // MapTool = require("../../tool/mapTool.js"),
  // mapTool = new MapTool(),
})
