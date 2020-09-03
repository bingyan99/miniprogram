//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  /**
   * 搜索事件
   */
  onSearchEvent (val) {
    console.log(val)
  },
  onBeforeBack () {
    // 后退事件
    return wx.navigateBack({ delta: 1 })
  }
})
