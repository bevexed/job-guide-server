import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'managerUser/login',
    data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'managerUser/logout',
    method: 'post'
  })
}
