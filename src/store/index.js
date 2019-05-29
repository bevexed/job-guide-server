import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import course from './module/course'
import page from './module/page'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    course,
    page,
    app
  }
})
