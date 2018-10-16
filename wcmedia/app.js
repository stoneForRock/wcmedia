//app.js 
const api = require('./config/config.js');

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
      this.globalData.showguide = true;
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    console.log(msg);
  },
  
  // 封装 wx.showToast 方法
  showInfo: function (info = 'error', icon = 'none') {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true
    });
  },

  // 该资源是否已点赞
  hasLiked: function (sourceId) {
    return wx.getStorageSync(sourceId);
  },

  likedSourceWithId: function (sourceId) {
    let that = this;
    wx.request({
      url: api.likedSourceUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data:{
        id: sourceId,
      },
      method: "POST",

      success: function (res) {
        wx.setStorageSync(sourceId, true);
        that.showInfo('点赞成功','success');
      },

      fail: function (error) {
        //点赞失败
        that.showInfo('点赞失败','error');
      }
    })
  },

  // app全局数据
  globalData: {
    showguide: false
  }
})
