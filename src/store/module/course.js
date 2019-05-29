import {
  courseCategoryBigList,
  courseCategorySubList,
  courseListByTitle,
  getCourseCategoryById,
  courseCategoryUpdate,
  courseCategorySave,
  getCourseById,
  courseUpdate,
  courseSave
} from '@/api/course'

export default {
  mutations: {
  },
  getters: {
  },
  actions: {
    // 获取课程大类
    courseCategoryBigList () {
      return new Promise((resolve, reject) => {
        courseCategoryBigList().then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取课程子类
    courseCategorySubList ({ state, commit }, { parentId }) {
      return new Promise((resolve, reject) => {
        courseCategorySubList(parentId).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    courseListByTitle ({ state, commit }, { title }) {
      return new Promise((resolve, reject) => {
        courseListByTitle(title).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCourseCategoryById ({ state, commit }, { courseCategoryId }) {
      return new Promise((resolve, reject) => {
        getCourseCategoryById(courseCategoryId).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    courseCategoryUpdate ({ state, commit }, courseCategory) {
      return new Promise((resolve, reject) => {
        courseCategoryUpdate(courseCategory).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    courseCategorySave ({ state, commit }, courseCategory) {
      return new Promise((resolve, reject) => {
        courseCategorySave(courseCategory).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCourseById ({ state, commit }, { courseId }) {
      return new Promise((resolve, reject) => {
        getCourseById(courseId).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    courseUpdate ({ state, commit }, course) {
      return new Promise((resolve, reject) => {
        courseUpdate(course).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    courseSave ({ state, commit }, course) {
      return new Promise((resolve, reject) => {
        courseSave(course).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
