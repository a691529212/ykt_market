// pages/map/map.js
var viewTool = require("../../utils/viewTool.js")
var netTool = require("../../utils/netTool.js");
var md5 = require("../../utils/md5.js")
var weimaqi = require("../../utils/weimaqi.js")

var markers = [];
var marksSize = 3 + Math.floor(Math.random() * 16)

var app = getApp();
var globalData = app.globalData;
var MapTool = require("../../tool/mapTool.js")
var mapTool = new MapTool();
mapTool.prepare();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    mapTool,
    mapHight: '',
    lat: '',
    lont: '',
    controls: [],
    hidden: true,
    marker: {},
    fontOne: '',
    fontTwo: '',
    hiddenBottom: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var data = {
    //   phone : "18210399566",
    //   code : 866821
    // }
    // wx.request({
    //   url: "http://snake.dev.360yingketong.com/api/login/logins",
    //   data :data,
    //   method:"POST",
    //   success : function(e){
    //     console.log(e.data)
    //   }
    // })
    // console.log(JSON.stringify(data))

    // weimaqi.outCoin("S15522", null, 1,(res)=>{
    //   console.log(res)
    // })
    // weimaqi.deviceStatus("S15522",(res)=>{
    //   console.log(res)
    // })
    var that = this;
    var str = options.q;
    if (str) {
      that.scanedCode(str);
    }
    this.mapContext = wx.createMapContext("main_map");
    // weimaqi.outCoin("S15518",null,1,function(res){
    // })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mapHight: res.windowHeight
        })
      },
    })
  },

  // 重新定位
  postion_click: function () {
    var that = this;
    that.refreshMap();

  },

  // 个人中心
  user_click: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },

  // 扫一扫
  scan_click: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        console.log(res)
        that.scanedCode(res.result);
      }
    })
  },

  /**
   * 扫码结束
   */
  scanedCode: function (str) {
    var that = this;
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
        console.log(e)
        if (e.data.code == 10500) {
          wx.hideLoading();
          wx.showToast({
            title: '设备不在线',
          })
          return;
        } else if (e.data.code == 10400) {
          wx.hideLoading;
          wx.showToast({
            title: e.data.msg,
          })
          return;
        }
        that.turnPage(e.data.data.type, e.data.data.code)
      }
    })
  },

  turnPage: function (type, code) {
    var url = "";
    switch (type) {
      case 1:
        //按摩椅
        url = '/pages/armchair/armchair?code=' + code;
        break;
      case 2:
        // 售货机
        url = '/pages/market/market?code=' + code;
        break;
      case 3:
        // 娃娃机
        url = '/pages/crane_machine/crane_machine?code=' + code;
        break;
      default:
        return;
    };
    this.setData({
      hiddenBottom: true
    })
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 娃娃机出币(暂时不用)
   */
  outIcon: function () {
    var data = {
      action: "Payout",
      api_pw: "AB8568171522B71598C4026142721EB1",
      mch_id: "28973",
      device_name: "J66188",
      order_id: Math.ceil(Math.random() * 10000000000000),
      coin_count: 2,
    }
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
    msg = msg + "&key=46C1DA4474AFA5124F05896385180F23"
    var sign = md5.hexMD5(msg).toUpperCase();
    data.sign = sign;
    wx.request({
      url: "https://dev.360yingketong.com/weimaqi/weimaqi_device_api/Services.aspx",
      header: {
        contentType: 'application/json; charset=utf8'
      },
      method: "POST",
      data: JSON.stringify(data),
      success: function (res) {
        wx.showToast({
          title: res.data.err_msg,
        })
      }
    })
  },

  /**
   * 地图视野发生变化时
   */
  regionchange: function (e) {
    if (e.type == "end") {
      this.mapContext.getCenterLocation({
        success: function (res) {
        }
      })
    }
  },

  /**
   * marker 点击
   */
  markerClick: function (e) {
    var that = this;
    var markerId = e.markerId;

    mapTool.data.setPolylineByMarkerId(markerId, function () {
      var markers = mapTool.data.markers;
      for (let i = 0; i < markers.length; i++) {
        if (markerId == markers[i].id) {
          var str = markers[i].callout.content;
          var value = str.split("\n");
          var info = value[1].split(" ");
          console.log(info)
          console.log(markers[i].callout)
          that.setData({
            marker: markers[i],
            fontOne: value[0],
            fontTwo: info,
            hiddenBottom: false,
          })
          var str = markers[i].callout.content
        }
      }
      that.setData({
        mapTool: mapTool
      })
    });
  },
  cover_tap: function () {
    this.turnPage(this.data.marker.type, this.data.marker.mid);
  },

  /**
   * 随机标记坐标点
   * @param lat  中心纬度
   * @param lng  中心经度
   */
  randomMark: function (lat, lng) {
    var that = this;
    // for (let i = 0; i < marksSize; i++) {
    var mathFuncation = Math.floor(Math.random() * 3);
    var mark = {}
    if (mathFuncation == 0) {
      mark = {
        latitude: lat + Math.random() / 100,
        longitude: lng + Math.random() / 100,
      }
    } else if (mathFuncation == 1) {
      mark = {
        latitude: lat - Math.random() / 100,
        longitude: lng + Math.random() / 100,
      }
    } else if (mathFuncation == 2) {
      mark = {
        latitude: lat - Math.random() / 100,
        longitude: lng - Math.random() / 100,
      }
    } else if (mathFuncation == 3) {
      mark = {
        latitude: lat + Math.random() / 100,
        longitude: lng - Math.random() / 100,
      }
    }
    // this.getMark(markers.length, mark.latitude, mark.longitude, function (res) {
    //   if (markers.length < marksSize) {
    //     markers.push(res);
    //     that.randomMark(lat, lng)
    //   } else {
    //     var amyMarkers = [];
    //     var wwjMarkers = [];
    //     var gwjMarkers = [];
    //     for (let i = 0; i < markers.length; i++) {
    //       if (markers[i].type == 0) {
    //         amyMarkers.push(markers[i]);
    //       } else if (markers[i].type == 1) {
    //         gwjMarkers.push(markers[i]);
    //       } else if (markers[i].type == 2) {
    //         wwjMarkers.push(markers[i]);
    //       }
    //     }
    //     wx.setStorage({
    //       key: 'amyMarkers',
    //       data: amyMarkers,
    //     })
    //     wx.setStorage({
    //       key: 'gwjMarkers',
    //       data: gwjMarkers,
    //     })
    //     wx.setStorage({
    //       key: 'wwjMarkers',
    //       data: wwjMarkers,
    //     })
    //     wx.setStorage({
    //       key: 'markers',
    //       data: markers,
    //     })
    //     mapTool.data.setMarkers(markers);
    //     that.setData({
    //       mapTool: mapTool
    //     })
    //   }
    // })

  },

  getMark: function (index, lat, lng, callBack) {
    var markerType = Math.floor(Math.random() * 3);
    var typeList = [{
      iconPath: "/mipmap/am_location.png"
    }, {
      iconPath: "/mipmap/gw_location.png"
    }, {
      iconPath: "/mipmap/ww_location.png"
    }]
    wx.request({
      url: "https://apis.map.qq.com/ws/geocoder/v1",
      data: {
        location: lat + "," + lng,
        key: "GP6BZ-HOR3D-M4D47-HODIG-GCCV6-B2FJ3",
      }, success: function (res) {
        if (res.data.status == 120) {
          marksSize = markers.length;
          callBack();
        } else {
          callBack({
            id: index,
            latitude: lat,
            longitude: lng,
            iconPath: typeList[markerType].iconPath,
            title: res.data.result.formatted_addresses.rough,
            width: 33,
            height: 40,
            type: markerType,
            callout: {
              content: res.data.result.formatted_addresses.rough + "\n",
              color: "#404040",
              fontSize: 12,
              borderRadius: 10,
              bgColor: "#ffffff",
              padding: 8,
              display: "BYCLICK",
              textAlign: 'center'
            },
            anchor: {
              x: .5, y: 1
            }
          })
        }
      }
    })

  },

  gwj_click: function () {
    this.refreshMarkers("gwjMarkers");
  },

  wwj_click: function () {
    this.refreshMarkers("wwjMarkers");
  },

  amy_click: function () {
    this.refreshMarkers("amyMarkers");
  },

  refreshMarkers(key) {
    var that = this;
    wx.getStorage({
      key: key,
      success: function (res) {
        if (res.data.length > 0) {
          mapTool.data.setMarkers(res.data);
          var hidden = false;
          if (key == "markers") {
            hidden = true;
          }
          for (let i = 0; i < res.data.length; i++) {
            if (i == 0) {
              res.data[i].callout.display = "ALWAYS"
            }
          }
          that.setData({
            mapTool: mapTool,
            hidden: hidden
          })
        } else {
          wx.showToast({
            title: '您的附近没有此类设备哦',
          })
        }
      },
    })
  },

  /**
   * 返回键
   */
  back_click: function () {
    var that = this;
    this.refreshMarkers("markers")
  },

  /**
   *  视野更新
   */
  updated: function (e) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  refreshMap: function () {
    var that = this;
    wx.getLocation({
      altitude: true,
      type: "gcj02",
      success: function (loc) {
        var typeList = [{
          iconPath: "/mipmap/am_location.png"
        }, {
          iconPath: "/mipmap/gw_location.png"
        }, {
          iconPath: "/mipmap/ww_location.png"
        }]
        var amyMarkers = [];
        var wwjMarkers = [];
        var gwjMarkers = [];
        netTool.request("api/v1/map/machine", { lat: loc.latitude, lng: loc.longitude, }, function (res) {
          if (res == null) {
            mapTool.data.setCenterLocation(loc.longitude, loc.latitude);
            that.setData({
              mapTool: mapTool,
              lat: loc.latitude,
              lont: loc.longitude,
            })
          } else {
            var list = [];
            for (let i = 0; i < res.length; i++) {
              var item = res[i]
              var data = {
                width: 33,
                height: 40,
                dis: item.dis,
                callout: {
                  color: "#404040",
                  fontSize: 12,
                  borderRadius: 10,
                  bgColor: "#ffffff",
                  padding: 8,
                  textAlign: "center"
                },
                anchor: {
                  x: 0.5,
                  y: 1
                }
              };
              if (i == 0) {
                data.callout.display = "ALWAYS"
              } else {
                data.callout.display = "BYCLICK"
              }
              data.iconPath = typeList[item.type - 1].iconPath;
              data.id = i;
              data.latitude = item.latitude;
              data.longitude = item.longitude;
              data.machine_no = item.machine_no;
              data.mid = item.machine_id;
              data.type = item.type;
              data.callout.content = item.title + "\n";
              list.push(data);

              if (item.type == 1) {
                amyMarkers.push(data);
              } else if (item.type == 2) {
                gwjMarkers.push(data);
              } else if (item.type == 3) {
                wwjMarkers.push(data);
              }
              wx.setStorage({
                key: 'amyMarkers',
                data: amyMarkers,
              })
              wx.setStorage({
                key: 'gwjMarkers',
                data: gwjMarkers,
              })
              wx.setStorage({
                key: 'wwjMarkers',
                data: wwjMarkers,
              })
              wx.setStorage({
                key: 'markers',
                data: list,
              })
            }

            mapTool.data.setMarkers(list);
            mapTool.data.setCenterLocation(loc.longitude, loc.latitude);
            that.setData({
              mapTool: mapTool,
              lat: loc.latitude,
              lont: loc.longitude,
            })
          }

        })

      }
    })
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.refreshMap();
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