// pages/armchair/armchair.js
// pages/armchair/armchair.js
var netTool = require("../../utils/netTool.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jsonData: {},
    systemInfo: '',
    hiddelMoeal: true,
    info: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var code = options.code;
    wx.setNavigationBarTitle({
      title: '按摩椅',
    })
    console.log(code)
    netTool.request("api/v1/amy/" + code, {}, function (res) {
      console.log(res)
      if (res.msg == "没有找到按摩椅套餐") {
        wx.navigateBack();
      }
      that.setData({
        jsonData: res,
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          systemInfo: res
        })
      },
    })
  },
  cancal: function () {
    this.setData({
      hiddelMoeal: true,
    })
  },
  itemClick: function (e) {
    console.log(e);
    var info = e.currentTarget.dataset.info;
    this.setData({
      info: info,
      hiddelMoeal: false
    })
  },
  pay_know: function () {
    var that = this;
    var data = {
      product_id: this.data.info.id
    }
    // netTool.request("api/v1/recharge", data, "POST", function (e) {
    //   console.log("支付", e)
    //   wx.requestPayment({
    //     timeStamp: e.timeStamp + "",
    //     nonceStr: e.nonceStr,
    //     package: e.package,
    //     signType: 'MD5',
    //     paySign: e.paySign,
    //     success: function (result) {
    //       wx.showToast({
    //         title: '支付成功',
    //       });
    //       that.setData({
    //         hiddelMoeal: true
    //       })
    //     }, fail: function (res) {
    //       wx.showToast({
    //         title: '支付失败',
    //       })
    //     }
    //   })
    // })
    netTool.request("api/v1/amy", data, "POST", function (e) {
      console.log("order_______", e)
      wx.requestPayment({
        timeStamp: e.timeStamp + "",
        nonceStr: e.nonceStr,
        package: e.package,
        signType: 'MD5',
        paySign: e.paySign,
        success: function (result) {
          console.log(result)
          wx.showToast({
            title: '支付成功',
          });
          that.setData({
            hiddelMoeal: true
          })
        }, fail: function (res) {
          wx.showToast({
            title: '支付失败',
          })
        }
      })
      that.setData({
        hiddelMoeal: true
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