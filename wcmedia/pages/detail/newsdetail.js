// pages/detail/newsdetail.js

//获取服务器接口地址
const api = require('../../config/config.js');
//获取app应用实例
const app = getApp();
//wxParse用来解析html的
var WxParse = require('../../lib/wxParse/wxParse.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsId: "",           //详情页的id
    newsDetailInfo: {},   //详情页数据
    liked: false,         //是否已经点赞.由于没有用户体系，此处是否点赞为本地记录
    likeCount: 0,         //点赞数
    readCount: 0,         //阅读数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _pushInfo = {};
    let that = this;

    for (let key in options) {
      _pushInfo[key] = decodeURIComponent(options[key]);
    }

    var hasLiked = app.hasLiked(_pushInfo.sourcesId);

    that.setData({
      newsId: _pushInfo.sourcesId,
      liked: hasLiked,
    });
    that.loadNewsDetialRequest();
  },

  /**
   * 请求资讯详情
   */
  loadNewsDetialRequest: function () {
    
    wx.showLoading({
      title: '请稍候...',
    })
    var that = this;
    wx.request({
      url: api.getNewsDetialUrl + that.data.newsId,
      success: function(res) {
        wx.hideLoading();
        let data = res.data;
        if (data.code === 0) {
          var newdetialInfo = data.data;
          that.setData({
            newsDetailInfo: newdetialInfo,
            likeCount: newdetialInfo.likeCount,
          })
          var article = newdetialInfo.content;
          WxParse.wxParse('article_content', 'html', article, that, 5);

        } else {
          that.showInfo('获取详情失败,请稍候再试', 'none')
        }
      },
      error: function (err) {
        wx.hideLoading();
        that.showInfo(err, 'error')
      }
    })
  },

  /**
   * 点赞
   */
  likeAction: function() {
    var that = this;
    if (that.data.liked) {
      that.showInfo("已点赞",'none');
    } else {
      app.likedSourceWithId(that.data.newsId);
      that.setData({
        liked: !that.data.liked,
        likeCount: that.data.likeCount+1,
      });
    }
    
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
  onShareAppMessage: function (ops) {
    var that = this;
    var newsTitle = this.data.newsDetailInfo.title;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: newsTitle,
      path: '/pages/news/newslist?id=' + this.data.newsId,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        that.showInfo("转发成功","success");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
        // that.showInfo("转发失败:" + JSON.stringify(res), "error");
      }
    }
  },

  /**
  * showToast的封装
  */
  showInfo: function (info, icon = 'none') {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true
    });
  },
})