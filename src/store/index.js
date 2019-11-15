import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 获取用户信息 token
    user: auth.getUser()
  },
  mutations: {
    // 修改用户信息
    setUser (state, user) {
      // 修改信息
      state.user = user
      // 重新存储信息
      auth.setUser(user)
    },
    // 删除用户信息
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
