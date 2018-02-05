var netTool = require("../../../utils/netTool.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [{ title: "投币不能使用", checked: false, id: 1 },
    { title: "购物不出货", checked: false, id: 2 },
    { title: " 按摩椅使用时间出错", checked: false, id: 3 },
    { title: "机器故障", checked: false, id: 4 }
    ],
    checkType: '',
    value: '',
    machine_no: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '反馈',
    })
  },
  checkChanged: function (e) {
    var that = this;
    console.log("---------", e.currentTarget.dataset.info)
    var info = e.currentTarget.dataset.info;
    var checked = info.checked;
    var checkType = '';
    if (!checked) {
      checkType = info.id
    } else {
      checkType = ''
    }
    var itemList = [];
    for (let i = 0; i < that.data.itemList.length; i++) {
      if (i + 1 == info.id) {
        info.checked = !info.checked
        itemList.push(info)
      } else {
        var data = that.data.itemList[i]
        data.checked = false;
        itemList.push(data);
      }
    }
    that.setData({
      itemList: itemList,
      checkType: checkType
    })
    // var itemList = 
  },
  scan: function () {
    var that = this;
    wx.scanCode({
      success(res) {
        console.log(res.result);
        wx.request({
          url: res.result,
          success: function (e) {
            console.log(e);
            that.setData({
              machine_no: e.data.data.code
            })
          }
        })
      }
    })
  },
  confirm: function () {
    var type = this.data.checkType;
    var info = this.data.value;
    var machine_no = this.data.machine_no;
    if (info != '' || type != '') {
      var data = {
        type: type,
        content: info,
        machine_no: machine_no,
      }
      netTool.request("api/v1/freedback", data, "POST", function (res) {
        console.log(res)
        wx.showToast({
          title: '反馈成功',
        })
        wx.navigateBack({})
      })
    } else {
      wx.showToast({
        title: '参数不可为空',
      })
    }

  },
  input: function (e) {
    this.setData({
      value: e.detail.value
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