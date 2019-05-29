import axios from '@/libs/api.request'

export const courseCategoryBigList = () => {
  return axios.request({
    url: 'course/category/big/list',
    method: 'get'
  })
}

export const courseCategorySubList = parentId => {
  return axios.request({
    url: 'course/category/sub/list',
    params: {
      parentId
    },
    method: 'get'
  })
}

export const courseListByTitle = (title) => {
  return axios.request({
    url: 'course/listByTitle',
    params: {
      'title': title
    },
    method: 'get'
  })
}

export const getCourseCategoryById = (courseCategoryId) => {
  return axios.request({
    url: 'course/category/getById',
    params: {
      'id': courseCategoryId
    },
    method: 'get'
  })
}

export const courseCategoryUpdate = (courseCategory) => {
  return axios.request({
    url: 'course/category/update',
    data: courseCategory,
    method: 'post'
  })
}

export const courseCategorySave = (courseCategory) => {
  return axios.request({
    url: 'course/category/save',
    data: courseCategory,
    method: 'post'
  })
}

export const getCourseById = (courseId) => {
  return axios.request({
    url: 'course/getById',
    params: {
      'id': courseId
    },
    method: 'get'
  })
}

export const courseUpdate = (course) => {
  return axios.request({
    url: 'course/update',
    data: course,
    method: 'post'
  })
}

export const courseSave = (course) => {
  return axios.request({
    url: 'course/save',
    data: course,
    method: 'post'
  })
}
