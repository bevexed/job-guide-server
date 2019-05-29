import axios from '@/libs/api.request'

export const getPageModuleConfigById = (pageModuleConfigId) => {
  return axios.request({
    url: 'page/module/config/getById',
    params: {
      'id': pageModuleConfigId
    },
    method: 'get'
  })
}

export const pageModuleConfigUpdate = (PageModuleConfig) => {
  return axios.request({
    url: 'page/module/config/update',
    data: PageModuleConfig,
    method: 'post'
  })
}

export const pageModuleConfigSave = (PageModuleConfig) => {
  return axios.request({
    url: 'page/module/config/save',
    data: PageModuleConfig,
    method: 'post'
  })
}
