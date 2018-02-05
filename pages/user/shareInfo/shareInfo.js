// pages/user/shareInfo/shareInfo.js
var netTool = require("../../../utils/netTool.js");
var app = getApp();
var globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    nodes: [
      {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 26rpx; color: #fff;'
        },
        children: [{
          type: 'text',
          text: '1.用户可通过每天分享,每个通过点击分享新增的用户,都可以获得优惠券'
        },]
      }, {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 26rpx; color: #fff;'
        },
        children: [{
          type: 'text',
          text: '2.用户可通过每天分享,每个通过点击分享新增的用户,都可以获得优惠券!'
        }]
      }, {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 26rpx; color: #fff;'
        },
        children: [{
          type: 'text',
          text: '3.用户可通过每天分享,每个通过点击分享新增的用户,都可以获得优惠券!'
        }]
      }
    ],
    userId: '',
    shareInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '分享中心',
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log("-------", res);
        var windowHeight = res.windowHeight;
        that.setData({
          windowHeight: windowHeight
        })
        console.log(that.data.windowHeight)

      },
    })

    netTool.request("api/v1/share", {}, function (res) {
      console.log(res);
      that.setData({
        shareInfo: res
      })
    })
  },
  shareKnow: function () {
    console.log(globalData.token);
    var that = this;
    that.setData({
      userId: globalData.token.user
    })
  },
  lookInfo: function () {
    wx.navigateTo({
      url: '/pages/user/ticket/ticket',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var userId = this.data.userId;
    return {
      imageUrl: "/mipmap/share_img.jpg",
      title: "营客通无人小程序",
      path: "/pages/map/map?userId=" + globalData.token.data.userid,
    }
  }
})