import api from '@/api/lostAndFound'

const state = {
  items: [],
  total: 0
}

const getters = {
  allItems: state => state.items,
  totalItems: state => state.total
}

const actions = {
  async fetchItems({ commit }, params) {
    try {
      const response = await api.getLostItems(params)
      commit('setItems', response.data.items)
      commit('setTotal', response.data.total)
      return response.data
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  },
  async addItem({ commit }, item) {
    try {
      const response = await api.addLostItem(item)
      commit('newItem', response.data)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  },
  async updateItem({ commit }, item) {
    try {
      const response = await api.updateLostItem(item)
      commit('updateItem', response.data)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  },
  async deleteItem({ commit }, id) {
    try {
      await api.deleteLostItem(id)
      commit('removeItem', id)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }
}

const mutations = {
  setItems(state, items) {
    state.items = items
  },
  setTotal(state, total) {
    state.total = total
  },
  newItem(state, item) {
    state.items.push(item)
  },
  updateItem(state, updatedItem) {
    const index = state.items.findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      state.items.splice(index, 1, updatedItem)
    }
  },
  removeItem(state, id) {
    state.items = state.items.filter(item => item.id !== id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
