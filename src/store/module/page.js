import {
  getPageModuleConfigById,
  pageModuleConfigUpdate,
  pageModuleConfigSave
} from '@/api/page'

export default {
  mutations: {
  },
  getters: {
  },
  actions: {
    getPageModuleConfigById ({ state, commit }, { pageModuleConfigId }) {
      return new Promise((resolve, reject) => {
        getPageModuleConfigById(pageModuleConfigId).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    pageModuleConfigUpdate ({ state, commit }, pageModuleConfig) {
      return new Promise((resolve, reject) => {
        pageModuleConfigUpdate(pageModuleConfig).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    pageModuleConfigSave ({ state, commit }, pageModuleConfig) {
      return new Promise((resolve, reject) => {
        pageModuleConfigSave(pageModuleConfig).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
