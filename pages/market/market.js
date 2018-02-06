// pages/market/market.js
var netTool = require("../../utils/netTool.js");
var viewTool = require("../../utils/viewTool.js")
var app = getApp();
var auto = true;
var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var touchMove = 0;
var isBottom = false;
var isTop = false;
var xMove = 0;
var touchX = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortList: [],
    currentTab: 0,
    title: '',
    info: '',
    hiddelMoeal: true,
    systemInfo: '',
    st: 3,
    height: '',
    isEmpty: false,
  },
  goback: function (callBack) {
    setTimeout(callBack, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '售货机',
    })
    var code = options.code;
    netTool.request("api/v1/gwj/product/" + code, null, function (res) {
      console.log(res)
      if (res.code == 10501) {
        wx.showToast({
          title: res.msg,
        })
        that.goback(function () {
          wx.navigateBack({
          })
        })

      }
      var sortList = res.list;
      that.setData({
        sortList: sortList,
        isEmpty: (sortList.length == 0),
      })
      if (sortList.length > 0) {
        that.setData({
          title: sortList[0].title,
        })
      }
      console.log(that.data.isEmpty)
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
      },
    })
    viewTool.residue(88 + 64, function (res) {
      that.setData({
        height: res,
      })
    })
  },

  itemClick: function (e) {
    console.log("click")
    var info = e.currentTarget.dataset.info;
    var that = this;
    that.setData({
      info: info,
      hiddelMoeal: false
    })

  },
  cancal: function () {
    this.setData({
      hiddelMoeal: true,
    })
  },
  pay_know: function () {
    var that = this;
    var data = {
      product_id: this.data.info.id
    }

    var that = this;
    netTool.request("api/v1/gwj/product/" + this.data.info.id, null, "POST", function (e) {
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
          that.setData({
            hiddelMoeal: true
          })
        }, fail: function (res) {
          // wx.showToast({
          //   title: '支付失败',
          // })
        }
      })
      // if (res.ret == "1") {
      that.setData({
        hiddelMoeal: true
      })
      // }
    });
  },
  // tab
  swichNav: function (e) {
    var cur = e.currentTarget.dataset.current
    // if (this.data.currentTaB == cur) { return false; }
    // else {
    this.setData({
      currentTab: cur,
      st: 4,
    })
    // }
  },
  onTop: function (e) {
    var that = this;
    isTop = true;
  },
  onBottom: function (e) {
    isBottom = true;
  },
  onScroll: function (e) {
    if (e.detail.scrollHeight - e.detail.scrollTop - this.data.height.replace("px", "") <= 30) {
      isBottom = true;
    } else if (e.detail.scrollTop <= 30) {
      isTop = true;
    } else {
      isBottom = false;
      isTop = false;
    }
  },
  swiper_change: function (e) {
    var current = e.detail.current;
    var name = this.data.sortList[current].title;
    this.setData({
      currentTab: current,
      title: name
    })

  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  // 触摸开始事件  
  touchStart: function (e) {
    touchDot = e.touches[0].pageY; // 获取触摸时的原点  
    // TODO  do something
    touchX = e.touches[0].pageX; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 1);
  },
  // 触摸移动事件  
  touchMove: function (e) {
    var that = this;
    touchMove = e.touches[0].pageY;
    xMove = e.touches[0].pageX - touchX;

    // console.log("start x =>",e.touches[0].pageX);
  },
  // 触摸结束事件  
  touchEnd: function (e) {
    var that = this;
    console.log("Y-move =>", touchMove - touchDot)
    console.log("X-move =>", xMove);
    console.log("time =>", time)


    // 向上滑动    
    if (touchMove - touchDot <= -40 && time < 50 && time < 500) {
      // console.log("上滑-=-=")
      if (xMove > 30) {
        // console.log("return");
        touchX = 0;
        xMove = 0;
        clearInterval(interval); // 清除setInterval  
        time = 0;
        return;
      }
      if (that.data.sortList[that.data.currentTab].products.length > 9) {
        // console.log("----------- if")
        if (isBottom) {
          var cur = that.data.currentTab + 1;
          if (cur == that.data.sortList.length) {
            cur = 0
          }
          that.swichNav({ currentTarget: { dataset: { current: cur } } })
        }
      } else {
        // console.log("else======")
        var cur = that.data.currentTab + 1;
        if (cur == that.data.sortList.length) {
          cur = 0
        }
        that.swichNav({ currentTarget: { dataset: { current: cur } } })
      }
    }
    // 向下滑动  
    if (touchMove - touchDot >= 40 && 50 < time < 500) {
      if (xMove < -20) {
        console.log("return");
        touchX = 0;
        xMove = 0;
        clearInterval(interval); // 清除setInterval  
        time = 0;
        return;
      }
      if (that.data.sortList[that.data.currentTab].products.length > 9) {
        if (isTop) {
          var cur = that.data.currentTab - 1;
          if (cur == -1) {
            cur = that.data.sortList.length - 1
          }
          that.swichNav({ currentTarget: { dataset: { current: cur } } })
        }
      } else {
        var cur = that.data.currentTab - 1;
        if (cur == -1) {
          cur = that.data.sortList.length - 1
        }
        that.swichNav({ currentTarget: { dataset: { current: cur } } })
      }

    }
    clearInterval(interval); // 清除setInterval  
    time = 0;
    touchX = 0;
    xMove = 0;
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
    console.log("onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})