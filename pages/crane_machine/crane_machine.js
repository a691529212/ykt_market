// pages/crane_machine/crane_machine.js
var weimaqi = require("../../utils/weimaqi.js")
var netTool = require("../../utils/netTool.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '',
    needCoin: '',
    systemInfo: '',
    hiddelMoeal: true,
    hasTiket: false,
    isUsableCoupon: '',
  },

  goBack: function (callBack) {
    setTimeout(callBack, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var show = options.showToast;
    if (show) {
      wx.showToast({
        title: '充值成功',
      })
    }
    wx.setNavigationBarTitle({
      title: '娃娃机',
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          systemInfo: res
        })
      },
    })

    var code = options.code;
    netTool.request("api/v1/wwj/" + code, null, function (res) {
      console.log("query ====>", res)
      if (res.msg == "未找到机器信息") {
        that.goBack(() => {
          wx.navigateBack()
        })
      } else if (res.code == 10501) {
        wx.showToast({
          title: res.msg,
        })
        that.goBack(() => {
          wx.navigateBack()
        })
      } else {
        that.setData({
          balance: res.balance,
          needCoin: res.needCoin,
          isUsableCoupon: res.isUsableCoupon
        })
      }
    })
    that.setData({
      code: code,
    })
  },
  play: function (e) {
    console.log(e)
    var type = e.currentTarget.dataset.info
    var that = this;
    var needCoin = that.data.needCoin;
    var balance = that.data.balance;
    console.log(needCoin)
    console.log(balance)
    // weimaqi.outCoin(that.data.code, null, 2, function (res) {
    //   console.log(res)
    // });
    if (balance - needCoin < 0) {
      that.setData({
        hiddelMoeal: false,
      })
    } else {
      netTool.request("api/v1/wwj/" + that.data.code + "/outcoin", { type: type }, function (res) {
        console.log("ssss", res);
        if (res.code == 10500) {
          wx.showToast({
            title: res.msg,
          })
        } else {
          wx.showToast({
            title: '付款成功,请稍后...',
            duration: 3000,
            complete: function () {
              that.setData({
                balance: res.coin
              })
            }
          })
        }
      })
    }

    // weimaqi.deviceStatus(this.data.code, function (result) {
    //   console.log("设备状态", result)
    //   if (result.device_status == "1") {
    //     weimaqi.outCoin(that.data.code, null, 2, function (res) {
    //       console.log(res)
    //       wx.showToast({
    //         title: res.err_msg,
    //       })
    //     })
    //   } else {
    //     wx.showToast({
    //       title: result.err_msg,
    //     })
    //   }
    // })
  },
  recharge: function () {
    wx.navigateTo({
      url: '/pages/user/recharge/recharge?code=' + this.data.code,
    })
  },
  scan: function () {
    var that = this;
    // 扫一扫
    wx.scanCode({
      success: function (res) {
        that.scanedCode(res.result);
      }
    })
  },

  cancal: function () {
    this.setData({
      hiddelMoeal: true
    })
  },
  /**
     * 扫码结束
     */
  scanedCode: function (str) {
    while (str.indexOf("%3A") == -1 ? false : true) {
      str = str.replace("%3A", ":");
      while (str.indexOf("%2F") == -1 ? false : true) {
        str = str.replace("%2F", "/")
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: str,
      success: function (e) {
        wx.hideLoading;
        console.log(e.data);
        if (e.data.code == 10501) {
          wx.showToast({
            title: '设备不在线',
          })
          return;
        }
        var type = e.data.data.type;
        switch (type) {
          case 1:
            //按摩椅
            // wx.redirectTo({
            //   url: '',
            // })
            wx.redirectTo({
              url: '/pages/armchair/armchair?code=' + e.data.data.code,
            })
            break;
          case 2:
            // 售货机
            wx.redirectTo({
              url: '/pages/market/market?code=' + e.data.data.code,
            })
            break;
          case 3:
            // 娃娃机
            wx.redirectTo({
              url: '/pages/crane_machine/crane_machine?code=' + e.data.data.code,
            })
            break;
        }
      }
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