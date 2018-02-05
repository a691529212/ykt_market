
var md5 = require("/md5.js");
var baseUrl = "https://cj.360yingketong.com/market/";
var appId = "8d0699cb42c213baec749a17834c5c6b";
var appSecret = 'ab29b0816729225c4b3c4b6adf1ccf2d'

/**
 * @param vmcode 机器编号
 * @param callBack 成功回调
 */
function findMachine(vmcode, callBack) {
  var timestamp = formatTime(new Date);
  var data = normalData();
  data.vmcode = vmcode;
  data = getSign(data);
  wx.request({
    url: baseUrl + 'vm/findvm',
    data: data,
    success: function (res) {
      callBack(res)
    }
  })
}

/**
 * 查询设备列表
 */
function findMachineList(callBack) {
  var data = normalData();
  wx.request({
    url: baseUrl + "vm/query_vminfolist",
    data: getSign(data),
    success: function (res) {
      callBack(res)
    }
  })

}



/**
 * 查询某台机器货道当前信息
 * @param vmid 机器出厂号
 */
function queryProductInfo(vmid, callBack) {
  var data = normalData();
  data.vmid = vmid;
  wx.request({
    url: baseUrl + "vm/query_vmpalist",
    data: getSign(data),
    success: function (res) {
      callBack(res)
    }
  })
}

/**
 * @param vmid 设备出厂号
 */
function querProductList(vmid, callBack) {
  var data = normalData();
  data.vmid = vmid;
  wx.request({
    url: baseUrl + "vm/query_mcdlist_vm",
    data: getSign(data),
    success: function (res) {
      callBack(res)
    }
  })
}

/**
 * 查找设备
 */
function queryMachineInfo(vmid, callBack) {
  var data = normalData();
  data.vmid = vmid;
  wx.request({
    url: baseUrl + "vm/query_vmdeviceinfo",
    data: getSign(data),
    success: function (res) {
      callBack(res)
    }
  })
}

/**
 * 第三方支付完成后远程出货
 * @param vmid  设备出厂号
 * @param busino 订单号
 * @param money 售价
 * @param pacode 货道号
 * @param account 支付平台号(终端用户)
 */

function getProduct(vmid, busino, money, pacode, account, callBack) {
  var data = normalData();
  data.vmid = vmid;
  data.busino = busino;
  data.money = money;
  data.pacode = pacode;
  data.account = account;
  wx.request({
    url: baseUrl + "krcs/busin_thirdsell",
    data: getSign(data),
    success: function (res) {
      callBack(res)
    }
  })
}
/**
 * 获取sign
 */
function getSign(data) {
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
  var sign = md5.hexMD5(msg).toUpperCase();
  data.sign = sign
  return data;
}

function normalData() {
  return {
    appid: appId,
    timestamp: formatTime(new Date),
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  findMachine: findMachine,
  findMachineList: findMachineList,
  queryProductInfo: queryProductInfo,
  querProductList: querProductList,
  queryMachineInfo: queryMachineInfo,
  getProduct: getProduct,
}