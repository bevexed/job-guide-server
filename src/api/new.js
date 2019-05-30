import axios from '@/libs/api.request'

// 正式环境localhost更换成47.111.12.191
//
// 1.新增资讯接口
// http://localhost:9091/information/addInformation
//   请求方式:GET
// 参数:
// type--类型(0:招考政策 1:高校动态 2:志愿指南)           必填
// title--标题                                                              必填
// source--来源                                                          必填
// articleContent--文章内容                                        必填
// isHome--是否推荐到首页（0：否，1：是）
// isTop--是否置顶（0：否，1：是）
// thumbnail--缩略图


export const addInformation = (type, title, source, articleContent, isHome, isTop, thumbnail) => {
  return axios.request({
    url: 'information/addInformation',
    data: {
      type, title, source, articleContent, isHome, isTop, thumbnail
    },
    method: 'POST'
  });
};


//
// 2.批量删除接口
// http://localhost:9091/information/deleteInformation     例子:http://localhost:9091/information/deleteInformation?id=2,3,
//   请求方式:GET
// 参数:
//   id--逗号拼接的id(2,3,)                                             必填
//
//


export const deleteInformation = id => {
  const params = {
   id
  };
  return axios.request({
    url: 'information/deleteInformation',
    params,
    method: 'get'
  })
}



// 3.删除接口
// http://localhost:9091/information/del
//   请求方式:GET
// 参数:
//   id--主键id                                                              必填

export const deleteOne = id => axios.request({
  url: 'information/del',
  params:{id},
  method:'GET'
});

//
// 4.置顶接口
// http://localhost:9091/information/updateIsTop
//   请求方式:GET
// 参数:
//   id--主键id                                                              必填
//

export const updateIsTop = id => axios.request({
  url: 'information/updateIsTop',
  params:{id},
  method:'GET'
});

//
// 5.推荐到首页
// http://localhost:9091/information/updateIsHome
//   请求方式:GET
// 参数:
//   id--主键id                                                              必填
//

export const updateIsHome = id => axios.request({
  url: 'information/updateIsHome',
  params:{id},
  method:'GET'
});

//
// 6.编辑资讯
// http://localhost:9091/information/updateInformation
//   请求方式:POST
// 参数:
// id--主键id                                                              必填
// type--类型(0:招考政策 1:高校动态 2:志愿指南)           必填
// title--标题
// isHome--是否推荐到首页（0：否，1：是）
// isTop--是否置顶（0：否，1：是）
// source--来源
// thumbnail--缩略图
// articleContent--文章内容
// status--状态(0:草稿  1:已发布)
export const updateInformation = (id, type, title, source, articleContent, isHome, isTop, thumbnail, status) => {
  return axios.request({
    url: 'information/updateInformation',
    data: {
      id, type, title, source, articleContent, isHome, isTop, thumbnail, status
    },
    method: 'POST'
  });
};


//
// 7.根据主键id显示资讯信息
// http://localhost:9091/information/findInformationById
//   请求方式:GET
// 参数:
//   id--主键id                                                              必填
//
//

export const findInformationById = id => axios.request({
  url: 'information/findInformationById',
  params:{id},
  method:'GET'
});


// 8.分页列表
// http://localhost:9091/information/listPage
//   请求方式:POST
// 参数:
// current--页码                                                        必填
// size--每页大小                                                       必填
// title--标题
// startTime--开始时间
// endTime--结束时间
//

export const listPage = (current, size, title, startTime, endTime,type) => {
  const params = {
    current, size, title, startTime, endTime,type
  };
  return axios.request({
    url: 'information/listPage',
    params,
    method: 'get'
  })
}


// 9.设置推荐视频
// http://localhost:9091/course/isRecommend
//   请求方式:GET
// 参数:
//   id--主键id                                                              必填
// isRecommend--是否为推荐视频(false:否 true:是)      必填
//
// 例子:http://localhost:9091/course/isRecommend?id=266&isRecommend=false

export const isRecommend = (id,isRecommend) => axios.request({
  url: 'course/isRecommend',
  params:{id,isRecommend},
  method:'GET'
});


// 10.新增广告
// http://47.111.12.191:9091/advertisement/addAdvertisement
//   请求方式:POST
// 参数:
//   modularConfig--模块类型                                       必填
// (首页热门视频:homehot
// 首页职业发展:homedevelop
// 首页热门岗位:homeprofession
// 首页高考资讯:homezixun
// 发展之路:develop
// 职业菜单:profession)
// imageUrl--图片地址                                                必填
// link--跳转地址
//

export const addAdvertisement = (modularConfig, imageUrl, link) => axios.request({
  url: 'advertisement/addAdvertisement',
  data: {modularConfig, imageUrl, link},
  method: 'POST'
});


// 11.删除广告
// http://47.111.12.191:9091/advertisement/del
//   请求方式:GET
// 参数:
//   id--主键id                                                              必填
//

export const del = id => axios.request({
  url: 'advertisement/del',
  params: {id},
  method: 'GET'
});

// 12.编辑广告
// http://47.111.12.191:9091/advertisement/updateAdvertisement
//   请求方式:POST
// 参数:
//   id--主键id                                                               必填
// modularConfig--模块类型                                       必填
// imageUrl--图片地址                                                必填
// link--跳转地址
//


// 13.根据主键id显示广告信息
// http://47.111.12.191:9091/advertisement/findAdvertisementById
//   请求方式:GET
// 参数:
//   id--主键id                                                               必填
//


// 14.广告分页列表
// http://47.111.12.191:9091/advertisement/listPage
//   请求方式:POST
// 参数:
//   current--页码                                                         必填
// size--每页大小    必填

export const listPages = (current, size) => axios.request({
  url: 'advertisement/listPage',
  data: {current, size},
  method: 'POST'
});



