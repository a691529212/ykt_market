// netTool.js
const util = require('/util.js');
var md5 = require('/md5.js');
var app = getApp();
var globalData = app.globalData;

var NetTool = function () {
}

function request(param1, param2, param3, param4) {
  if (arguments.length == 4) {
    requestWithMethed(param1, param2, param3, function (res) {
      param4(res)
    })
  } else if (arguments.length == 3) {
    normalRequest(param1, param2, function (res) {
      param3(res)
    })
  }
}

function normalRequest(url, data, callBack) {
  var fullUrl = globalData.interface + url;
  var fullData = data;
  if (globalData.token) {
    wx.request({
      url: fullUrl,
      header: {
        token: globalData.token.data.token,
      },
      data: fullData,
      success: function (res) {
        var result = res.data;
        let code = result.code;
        switch (result.code) {
          case 0:
            callBack(result.data)
            break;
          case 999:
            wx.showToast({
              title: result.msg,
            })
            break;
          case 10001:
            // 	token不存在或已过期
            app.login(function () {
              normalRequest(url, data, function (res) {
                callBack(res)
              })
            })
            break;
          default:
            wx.showToast({
              title: res.data.msg,
              success: () => {
                callBack(res.data)
              }
            })
            break;
        }
        return null
      }, fail: function () {
        console.log("NetTool ERROR!")
      }, complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  } else {
    app.login(function () {
      normalRequest(url, data, callBack)
    });
  }

}

function requestApi(url, parm, callBack) {
  var signed_at = Date.parse(new Date()) / 1000;
  var url = url;
  var data = parm;
  data.auth_type = auth_type;
  data.app_key = app_key;
  data.signed_at = signed_at;
  var sign = dataToStr(data)
  data.sign = sign;
  wx.request({
    url: url,
    data: data,
    success: function (res) {
      callBack(res.data);
    }, fail: function () {
      callBack(9999);
    }, complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  })
}

function requestWithMethed(url, data, methed, callBack) {
  var fullUrl = globalData.interface + url;
  console.log(methed)
  var fullData = data;
  wx.request({
    url: fullUrl,
    header: {
      token: globalData.token.data.token,
    },
    method: methed,
    data: fullData,
    success: function (res) {
      var result = res.data;
      let code = result.code;
      console.log(code)
      switch (result.code) {
        case 0:
          callBack(result.data)
          break;
        case 999:
          wx.showToast({
            title: result.msg,
          })
          break;
        case 10001:
          // 	token不存在或已过期
          if (app.login) {
            requestWithMethed(url, data, methed, function (res) {
              callBack(res)
            })
          }
          break;
        case 10501:
          wx.showToast({
            title: '设备不在线',
          })
          break;
        default:
          wx.showToast({
            title: res.data.msg,
          })
          callBack(res.data);
          break;
      }
    }, fail: function () {
      console.log("NetTool ERROR!")
    }, complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  })
}

function getSign(param) {
  var data = param;
}
function dataToStr(data) {
  var msg = "";
  var sdic = Object.keys(data).sort();
  for (let i = 0; i < sdic.length; i++) {
    for (var value in data) {
      if (sdic[i] == value) {
        msg += (value + data[value])
      }
    }
  }
  msg = appSecret + msg + appSecret;
  console.log(msg)
  console.log(md5.hexMD5(msg))
  return md5.hexMD5(msg);
}
module.exports.request = request;
module.exports.getSign = dataToStr;

