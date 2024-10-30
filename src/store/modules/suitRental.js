import api from '@/api/suitRental'

const state = {
  rentals: [],
  total: 0
}

const getters = {
  allRentals: state => state.rentals,
  totalRentals: state => state.total
}

const actions = {
  async fetchRentals({ commit }, params) {
    try {
      const response = await api.getSuitRentals(params)
      commit('setRentals', response.data.rentals)
      commit('setTotal', response.data.total)
      return response.data
    } catch (error) {
      console.error('Error fetching rentals:', error)
    }
  },
  async addRental({ commit }, rental) {
    try {
      const response = await api.addSuitRental(rental)
      commit('newRental', response.data)
    } catch (error) {
      console.error('Error adding rental:', error)
    }
  },
  async updateRental({ commit }, rental) {
    try {
      const response = await api.updateSuitRental(rental)
      commit('updateRental', response.data)
    } catch (error) {
      console.error('Error updating rental:', error)
    }
  },
  async deleteRental({ commit }, id) {
    try {
      await api.deleteSuitRental(id)
      commit('removeRental', id)
    } catch (error) {
      console.error('Error deleting rental:', error)
    }
  }
}

const mutations = {
  setRentals(state, rentals) {
    state.rentals = rentals
  },
  setTotal(state, total) {
    state.total = total
  },
  newRental(state, rental) {
    state.rentals.push(rental)
  },
  updateRental(state, updatedRental) {
    const index = state.rentals.findIndex(rental => rental.id === updatedRental.id)
    if (index !== -1) {
      state.rentals.splice(index, 1, updatedRental)
    }
  },
  removeRental(state, id) {
    state.rentals = state.rentals.filter(rental => rental.id !== id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
