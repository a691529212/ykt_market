// pages/user/order/order.js
var netTool = require("../../../utils/netTool.js");
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    maxPage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
    this.loadData();
  },
  loadData: function () {
    var that = this;
    netTool.request("api/v1/order", { page: page }, function (res) {
      console.log(res);
      if (page == 1) {
        that.setData({
          orderList: res.list,
          maxPage: res.max_page
        })
      } else {
        var list = that.data.orderList;
        for (let i = 0; i < res.list.length; i++) {
          list.push(res.list[i]);
        }
        that.setData({
          orderList: list,
          maxPage: res.max_page
        })
        console.log(that.data.orderList)
      }

    })
  },
  onBottom: function () {

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
    page = 0;
    console.log("unload")
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
    var that = this;
    console.log("|||||||||||||||||||||||||", that.data.maxPage)
    var that = this;
    if (page < that.data.maxPage) {
      page = page + 1
      that.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})