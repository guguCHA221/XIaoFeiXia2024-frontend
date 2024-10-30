import api from '@/api/auth'

const state = {
  user: localStorage.getItem('user') || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null
}

const getters = {
  isAuthenticated: state => !!state.token,
  isAdmin: state => state.role === 'admin'
}

const actions = {
  async login({ commit }, credentials) {
    const { user, token, role } = await (await api.login(credentials)).data
    commit('setUser', user)
    commit('setToken', token)
    commit('setRole', role)

    localStorage.setItem('user', user)
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
  },
  async logout({ commit }) {
    // await api.logout()
    commit('setUser', null)
    commit('setToken', null)
    commit('setRole', null)

    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  },
  async changePassword(_, newPassword) {
    await api.changePassword(newPassword)
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setToken(state, token) {
    state.token = token
  },
  setRole(state, role) {
    state.role = role
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
