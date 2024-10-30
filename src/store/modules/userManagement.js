import api from '@/api/userManagement'

const state = {
  users: [],
}

const getters = {
  allUsers: state => state.users,
}

const actions = {
  async fetchUsers({ commit }) {
    try {
      const response = await api.getUsers()
      commit('setUsers', response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  },
  async updateUser({ commit }, user) {
    try {
      const response = await api.updateUser(user)
      commit('updateUser', response.data)
      return response
    } catch (error) {
      console.error('Error updating user:', error)
    }
  },
  async addBatchUsers({ commit }, usernames) {
    try {
      const response = await api.addUsers(usernames)
      commit('addUsers', response.data.users)
    } catch (error) {
      console.error('Error adding users:', error)
      throw error
    }
  }
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  updateUser(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  addUsers(state, newUsers) {
    state.users.push(...newUsers)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
