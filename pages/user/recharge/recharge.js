// pages/user/recharge/recharge.js
var netTool = require("../../../utils/netTool.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payList: '',
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '游戏币',
    })
    var code = options.code;
    that.setData({
      code: code
    })
    netTool.request("api/v1/coin", null, function (res) {
      console.log("_____", res)
      that.setData({
        payList: res
      })
    })
  },
  itemClick: function (e) {
    var that = this;
    console.log(e)
    var info = e.currentTarget.dataset.info;
    console.log(info)
    netTool.request("api/v1/recharge", { product_id: info.id }, "POST", function (e) {
      console.log("order_______", e)
      wx.requestPayment({
        timeStamp: e.timeStamp + "",
        nonceStr: e.nonceStr,
        package: e.package,
        signType: 'MD5',
        paySign: e.paySign,
        success: function (result) {
          wx.showToast({
            title: '支付成功',
          });
          var param = ""
          if (that.data.code) {
            wx.redirectTo({
              url: '/pages/crane_machine/crane_machine?showToast=1&code=' + that.data.code,
            })
          } else {
            netTool.request("api/v1/coin", null, function (res) {
              console.log("_____", res)
              that.setData({
                payList: res
              })
            })
          }

        }, fail: function (res) {
          wx.showToast({
            title: '支付失败',
          })
        }
      })
    })
    console.log(e)
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