


// 服务器域名
const baseUrl = 'https://mp.wccm365.com/';
const baseImgUrl = 'http://mp.wccm365.com/';

// 获取资讯列表
const getNewsListUrl = baseUrl + 'api/article/list';

// 获取资讯详情
const getNewsDetialUrl = baseUrl + 'api/article/detail/';

// 点赞
const likedSourceUrl = baseUrl + 'api/article/like';

//获取首页上方选项卡的数据
const getNewsListOptionsBarListUrl = baseUrl + 'api/article/columns';

module.exports = {
  baseUrl: baseUrl,
  baseImgUrl: baseImgUrl,
  getNewsListUrl: getNewsListUrl,
  getNewsDetialUrl: getNewsDetialUrl,
  likedSourceUrl: likedSourceUrl,
  getNewsListOptionsBarListUrl: getNewsListOptionsBarListUrl
};