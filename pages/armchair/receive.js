// pages/receive/receive.js
var app = getApp();
var globalData = app.globalData;
var baseUrl = app.siteinfo.siteroot;
var uniacid = app.siteinfo.uniacid;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var packetsId = options.packetsId
    wx.request({
      url: baseUrl +"Account/GetPacketsInfo",
      data:{
        uniacid: uniacid,
        packetsID: options.data.packetsID,
      },
      success:function(res){
        console.log("获取红包信息???",res.data)
      }
    })
  }

})