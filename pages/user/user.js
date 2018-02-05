// pages/user/user.js
var app = getApp();
var globalData = app.globalData;
var userInfo = globalData.userInfo;
var viewTool = require("../../utils/viewTool.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    url: '',
    residue: '',
    itemList: [{ iconPath: "/mipmap/order.png", title: "我的订单", path: '/pages/user/order/order' }, { iconPath: "/mipmap/coin.png", title: "游戏币", path: '/pages/user/recharge/recharge' }, { iconPath: "/mipmap/yhq.png", title: "优惠券", path: "/pages/user/ticket/ticket" }, { iconPath: "/mipmap/fx.png", title: "分享中心", path: "/pages/user/shareInfo/shareInfo" }, { iconPath: "/mipmap/fk.png", title: "反馈", path: "/pages/user/report/report" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    var that = this;
    console.log(globalData.userInfo)
    this.setData({
      userInfo: globalData.userInfo,
      url: globalData.userInfo.avatarUrl
    })

    viewTool.residue(343, function (res) {
      that.setData({
        residue: res
      })
    })
  },
  itemClick: function (e) {
    console.log(e);
    var info = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: info.path,
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
  onShareAppMessage: function () {

  }
})