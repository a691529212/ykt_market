var md5 = require("/md5.js");
var baseUrl = "https://cj.360yingketong.com/"
var api_pw = "AB8568171522B71598C4026142721EB1";
var mch_id = "28973";
var key = "46C1DA4474AFA5124F05896385180F23";
var apiUrl = baseUrl + "weimaqi/weimaqi_device_api/Services.aspx"
/**
 * 脉冲式 出币
 * 
 * @param deviceName 设备码
 * @param orderId 订单号
 * @param coninNum 出币数
 * 
 */
function outCoin(deviceName, orderId, coninNum, callBack) {
  var order_id = orderId;
  if (order_id == null) {
    order_id = Math.ceil(Math.random() * 10000000000000);
  }

  var data = {
    action: "Payout",
    api_pw: api_pw,
    mch_id: mch_id,
    device_name: deviceName,
    order_id: order_id,
    coin_count: coninNum,
  }
  data = signData(data);
  wx.request({
    url: apiUrl,
    header: {
      contentType: 'application/json; charset=utf8'
    },
    method: "POST",
    data: JSON.stringify(data),
    success: function (res) {
      console.log(res)
      callBack(res.data);
      console.log(res.data.err_msg)
    }
  })
}

function sendMsg(deviceName, binData, callBack) {
  var data = {
    action: "ComSend",
    api_pw: api_pw,
    device_name: deviceName,
    bin_data: binData
  }
  data = signData(data);
  wx.request({
    url: apiUrl,
    data: JSON.stringify(data),
    header: {
      contentType: 'application/json; charset=utf8'
    },
    method: "POST",
    success: function (e) {
      callBack(e.data)
    }
  })
}

function deviceStatus(deviceName, callBack) {
  var data = {
    action: "DeviceStatus",
    api_pw: api_pw,
    mch_id: mch_id,
    device_name: deviceName
  }
  data = signData(data);
  wx.request({
    url: apiUrl,
    header: {
      contentType: 'application/json; charset=utf8'
    },
    method: "POST",
    data: JSON.stringify(data),
    success: function (res) {
      callBack(res.data)
    }
  })
}

function signData(data) {
  var msg = "";
  var sdic = Object.keys(data).sort();
  for (let i = 0; i < sdic.length; i++) {
    for (var value in data) {
      if (sdic[i] == value) {
        if (i != 0) {
          msg += "&"
        }
        msg += (value + "=" + data[value])
      }
    }
  }
  msg = msg + "&key=" + key;
  var sign = md5.hexMD5(msg).toUpperCase();
  data.sign = sign;
  return data;
}

module.exports = {
  outCoin: outCoin,
  deviceStatus: deviceStatus,
  sendMsg: sendMsg,
}