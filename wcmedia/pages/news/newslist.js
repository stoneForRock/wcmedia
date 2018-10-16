// pages/news/newslist.js

//获取服务器接口地址
const api = require('../../config/config.js');
//获取app应用实例
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    detialPageId: "",
    image_baseurl: api.baseImgUrl,

    //是否显示添加到我的小程序的cover
    showCover: false,

    //顶部布局的数据
    topSwiperList: [],    //顶部选项卡数据

    showLoading: false,   //是否显示正在加载
    currentTabIndex: 0,      //当前选择的选项卡Index
    topTabWidth: 0,       //顶部每个tab的宽度
    topTabScrollLeft: 0,  //上方滚动的距离
    topScrollWidth: 0,     //可滚动区域的大小

    likeCount: "28371",
    readCount: "32453",

    //下方布局的数据
    pageIndex: 0,
    pageSize:10,
    newsList: [],         //资讯列表数据
  },

  //----------页面生命周期
  onLoad: function (options) {
    this.loadTopOptionBarList();
    let _lauchInfo = {};
    let that = this;
    for (let key in options) {
      _lauchInfo[key] = decodeURIComponent(options[key]);
    }
    if (_lauchInfo.id) {
      this.setData({
        detialPageId: _lauchInfo.id,
      })
      this.turuDetailPage(this.data.detialPageId);
    }
  },

  //界面出现的时候
  onShow: function () {
    this.initDataInfo();
  },

  /**
   * 初始化初始值
   */
  initDataInfo: function () {
    this.setData({
      showCover: app.globalData.showguide,
    })
  },

  //初始化tabIndex的界面
  fromartUIData: function () {
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var signalTabWidth = windowWidth / 3;
    var topSwiperWidth = this.data.topSwiperList.length * signalTabWidth;
    this.setData({
      topTabWidth: signalTabWidth,
      topScrollWidth: topSwiperWidth,
    });
  },

  //----------页面响应相关

  //点击上方的选项卡的回调，进行切换页面
  changeview: function (e) {
    var crash_current = e.currentTarget.dataset.current;
    var distance = 0;

    var currentTapOffset = parseInt(crash_current - 1) * this.data.topTabWidth;
    if (currentTapOffset > 2 * this.data.topTabWidth) {
      distance = currentTapOffset;
    }
    this.setData({
      currentTabIndex: e.currentTarget.dataset.current,
      topTabScrollLeft: distance,
      pageIndex: 1,
    });

    this.loadTabDatasourceRequest(this.data.currentTabIndex);
  },

  //点击单个卡片，跳转详情
  goDetail: function (e) {
    let newsId = e.currentTarget.id;
    console.log('点击卡片的内容 ' + newsId);
    this.turuDetailPage(newsId);
  },

  turuDetailPage: function (newsId) {
    let navigateUrl = '../detail/newsdetail?sourcesId=' + newsId;
    wx.navigateTo({
      url: navigateUrl,
    })
  },

  /**
   * 点击跳过
   */
  skipAction: function () {
    app.globalData.showguide = false;
    this.setData({
      showCover: app.globalData.showguide,
    })
  },

  //----------数据请求相关

  //拉取顶部选项卡数据
  loadTopOptionBarList: function () {
    wx.showLoading({
      title: '请稍候...',
    })
    var that = this;
    wx.request({
      url: api.getNewsListOptionsBarListUrl,
      success: function (res) {
        wx.hideLoading();
        let data = res.data;
        var recommendArray = [{
          deleteFlag:0,
          id: '',
          title: '推荐',
        }];
        if (data.code === 0 && data.data.length > 0) {
          recommendArray = recommendArray.concat(data.data);
        }
        that.setData({
          topSwiperList: recommendArray,
          currentTabIndex: 0,
          pageIndex: 1,
        });
        that.fromartUIData();
        that.loadTabDatasourceRequest(that.data.currentTabIndex);
      },
      error: function (err) {
        wx.hideLoading();
        that.showInfo(err, 'error')
      }
    })
  },

  //获取对应tab index的页面数据
  loadTabDatasourceRequest: function (barIndex = 0) {
    wx.showNavigationBarLoading();
    var barItemInfo = this.data.topSwiperList[barIndex];
    var that = this;
    wx.request({
      url: api.getNewsListUrl,
      data: {
        args: barItemInfo.id,
        page: that.data.pageIndex,
        pageSize: that.data.pageSize,
      },
      success: function(res) {
        that.endRefreshForTabInfo();
        let resposnedata = res.data;
        if (resposnedata.code === 0) {
          var newArray = [];
          var responseList = resposnedata.data.list;
          if (responseList.length > 0) {
            if (that.data.pageIndex > 1) {
              newArray = that.data.newsList.concat(responseList);
            } else {
              newArray = responseList;
            }

            that.setData({
              newsList: newArray,
            });
          } else {
            if (that.data.pageIndex > 1) {
              that.showInfo("暂无更多数据", 'none');
            } else {
              that.setData({
                newsList: [],
              });
            }
          }
        } else {
          that.showInfo("请求失败，请稍候再试", 'none');
        }
      },
      error: function(err) {
        that.endRefreshForTabInfo();
        that.showInfo(err,'error')
      }
    })
  },

  endRefreshForTabInfo: function () {
    wx.hideNavigationBarLoading();//隐藏导航条加载动画。
    wx.stopPullDownRefresh();//停止当前页面下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉页面触底');
    let currentPageIndex = this.data.pageIndex+1;
    this.setData({
      pageIndex: currentPageIndex,
    });
    this.loadTabDatasourceRequest(this.data.currentTabIndex);
  },

  //下拉刷新的回调
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 1,
    });
    this.loadTabDatasourceRequest(this.data.currentTabIndex);
  },

  //----------通用方法
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

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {
    return {
      title: '我发现了一个不错的小程序，分享给你吧',
      path: '/pages/news/newslist',
      // imageUrl: '/images/04.jpg',
      success: function (res) {
        // 转发成功
        console.log('转发成功');
        that.showInfo("转发成功", "success");
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
})
  