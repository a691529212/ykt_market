//  viewTool.js

/**
 * @param screenUsed 已经使用的高度;
 * 
 * return  剩余的高度 (px)
 */
function residueScreenHeight(screenUsed, callBack) {
  wx.getSystemInfo({
    success: function (res) {
      // 计算主体部分高度,单位为px
      // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
      var rpx2px = res.windowWidth / 750 * screenUsed;
      let residue = res.windowHeight - rpx2px;
      console.log(residue)
      callBack(residue + "px");
    }
  })
}
module.exports.residue = residueScreenHeight;
