
var Map = function () {
  this.scale = 17;
  this.markers = [];
  this.polyline = [];
  this.circles = [];
  this.controls = [];
  this.include_points = [];
}

var Data = function (map) {
  // 设置中心坐标
  this.setCenterLocation = function (longitude, latitude) {
    var data = {
      long: longitude,
      lat: latitude
    }
    this["centerLocation"] = data
  }

  // 设置markers
  this.setMarkers = function (markers) {
    var Markers = []
    if (markers instanceof Array) {
      Markers = markers
    } else {
      Markers.push(markers)
    }
    this["markers"] = Markers
  }

  // 添加markers
  this.addMarkers = function (markers) {
    var Markers = this["markers"];
    if (Markers) {
      if (markers instanceof Array) {
        for (var i = 0; i < markers.length; i++) {
          Markers.push(markers[i])
        }
      } else {
        Markers.push(markers)
      }
      this["markers"] = Markers
    } else {
      this.setMarkers(markers)
    }
  }

  this.setPolylineByMarkerId = function (markerId, callBack) {
    var that = this;
    var markers = this.markers;
    for (let i = 0; i < markers.length; i++) {
      try {
        markers[i].callout.display = "BYCLICK"
      } catch (thirdScriptError) {
      }
      if (markers[i].id == markerId) {
        console.log("marker : ", markers[i])
        markers[i].callout.display = "ALWAYS"
        var date = {
          fromLat: that.centerLocation.lat,
          fromLont: that.centerLocation.long,
          toLat: markers[i].latitude,
          toLont: markers[i].longitude,
        }
        that.getPolyline(date, function (distance, duration) {
          if (markers[i].callout.content.indexOf("米 步行约") == -1) {
            markers[i].callout.content += (+"\n "+ distance + "米 步行约" + duration + "min");
          }
          callBack();
        })
      }
    }

  }

  // 设置路线
  this.setPolyline = function (polyline, callBack) {
    var that = this;
    var Polyline = [];
    if (polyline instanceof Array) {
      for (var i = 0; i < polyline.length; i++) {
        getPolyline(polyline[i], function (res) {
          Polyline.push(res)
        })
      }
    } else {
      Polyline.push(polyline)
    }
    this["polyline"] = Polyline;
    callBack();
  }

  /**
 * 获取路径
 * 
 * @param data 路径数据
 *   data {
 *   fromLat :'',
 *   fromLont : '',
 *   toLat : '',
 *   toLont : '',
 * }
 */
  this.getPolyline = function (date, callBack) {
    var that = this;
    wx.request({
      url: "https://apis.map.qq.com/ws/direction/v1/walking/",
      data: {
        from: date.fromLat + "," + date.fromLont,
        to: date.toLat + "," + date.toLont,
        key: "GP6BZ-HOR3D-M4D47-HODIG-GCCV6-B2FJ3",
        output: "JSON"
      },
      success: function (res) {
        var distance = res.data.result.routes[0].distance
        var duration = res.data.result.routes[0].duration
        // console.log("-" + distance + " " + duration)
        // 坐标解密
        var coors = res.data.result.routes[0].polyline;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        var loc;
        var polyline = [];
        for (let i = 0; i < coors.length; i++) {
          if (i % 2 == 0) {
            loc = {
              latitude: coors[i]
            }
          } else {
            loc.longitude = coors[i];
            polyline.push(loc);
          }
        }
        var date = {
          // '#' + Math.floor(Math.random() * 16777215).toString(16)
          points: polyline,
          color: "#0078fe",
          width: 9,
          arrowIconPath: "/mipmap/arr_map_r.png",
          dottedLine: false,
          arrowLine: true,
        }
        that.setPolyline(date, function () {
          callBack(distance, duration);
        })
      }
    })
  }

}


module.exports = function () {
  this.scale = 16;
  this.map = null;
  this.markers = [];
  this.polyline = [];
  this.circles = [];
  this.controls = [];
  this.include_points = [];
  this.data = null;
  this.prepare = function () {
    this.map = new Map;
    this.data = new Data(this.map);
  }

  this.getData = function (key) {
    return this.data[key]
  }

}