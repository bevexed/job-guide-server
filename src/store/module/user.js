import {
  login,
  logout
} from '@/api/user'
import {setToken, getToken} from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    }
  },
  getters: {},
  actions: {
    // 登录
    handleLogin({commit}, {username, password}) {
      username = username.trim()
      return new Promise((resolve, reject) => {

        login({
          username,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })


      })
    },
    // 退出登录
    handleLogout({state, commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    }
  }
}
