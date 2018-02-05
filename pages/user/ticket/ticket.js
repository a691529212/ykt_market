// pages/user/ticket/ticket.js
import netTool from '../../../utils/netTool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usedTickets: [],
    usedPage: 1,
    lastPage: 1,
    lastTickets: [],
    selected: 0,
    ticketList: [],

  },

  currentClick: function (e) {
    var that = this;
    var ticketList = [];
    if (e.currentTarget.dataset.curr == 0) {
      ticketList = that.data.lastTickets;
    } else {
      ticketList = that.data.usedTickets;
    }
    that.setData({
      selected: e.currentTarget.dataset.curr,
      ticketList: ticketList
    })
    console.log(that.data.ticketList)
  },
  onChange:function(e){
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '优惠券',
    })
    // 未使用
    netTool.request("api/v1/coupon", { status: 0, page: 1 }, (res) => {
      console.log(res);
      that.setData({
        lastTickets: res.data,
        ticketList: res.data,
        lastPage: res.last_page
      })
    })

    // 已使用
    netTool.request("api/v1/coupon", { status: 1, page: 1 }, (res) => {
      console.log(res);
      that.setData({
        usedTickets: res.data,
        usedPage: res.last_page
      })
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