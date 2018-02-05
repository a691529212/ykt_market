//index.js
var market = require("../../utils/market.js")
var WXGRID = require("../../utils/wxgrid.js")
var wxgrid = new WXGRID;
//获取应用实例
const app = getApp();
var count = 1;

Page({
  data: {
    wxgrid,
    mcId: '',
  },
  //事件处理函数
  onLoad: function (o) {
    console.log("________________", o)
    o.q
    var machineID = "4017120058"
    market.findMachine(machineID, function (res) {
      console.log("查找结果 : ", res)
    })
    market.findMachineList(function (res) {
      console.log("设备列表: ", res)
    })

    market.querProductList(machineID, function (res) {
      console.log("当前上架商品列表 : ", res)
    })
    market.queryMachineInfo(machineID, function (res) {
      console.log("设备信息 : ", res)
    })


  },
  getUserInfo: function (e) {
    var that = this;
    // wx.scanCode({
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       motto: "设备码 : " + res.result
    //     })
    //   }
    // })
    var machineID = "4017120058"
    market.queryProductInfo(machineID, function (res) {
      console.log("货道信息 : ", res)
      var busino = "28492738847" + count;
      var money = 500;
      var pacode = 110;
      var account = "18210399566"
      market.getProduct(machineID, busino, money, pacode, account, function (res) {
        console.log("购买结果", res);
        wx.showToast({
          title: "累计点击 : " + count,
        })
        count++;
      })
    })
  },

  itemClick: function (e) {
    console.log(e)
    var info = e.currentTarget.dataset.info;
    var machineID = this.data.mcId
    console.log();
    var busino = Math.ceil(Math.random() * 10000000000000);
    var money = info.mp_price;
    var pacode = info.pacode;
    var account = "18210399566"
    market.getProduct(machineID, busino, money, pacode, account, function (res) {
      console.log("购买结果", res);
      wx.showToast({
        title: "货道" + info.pacode + "出货",
      })
    })


  },
  scan: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        console.log(res)
        that.setData({
          mcId: res.result
        })
        wx.request({
          url: "https://dev.360yingketong.com/addons/ykt_market/core/public/index.php/api/v1/machinepa/" + res.result,
          success: function (res) {
            var dataList = res.data.data;
            console.log(res.data.data)
            wxgrid.init(dataList.length / 2, 2);
            wxgrid.data.add("classifies", res.data.data);
            that.setData({
              wxgrid: wxgrid,
            })
          }
        })
      }
    })

    // wx.scanCode({
    //   success: function (res) {
    //     wx.request({
    //       url: "https://dev.360yingketong.com/addons/ykt_market/core/public/index.php/api/v1/product/" + res.result,
    //       method: "POST",
    //       success: function (result) {
    //         console.log("result", result.data)
    //       }
    //     })
    //   }
    // })

  }
})
