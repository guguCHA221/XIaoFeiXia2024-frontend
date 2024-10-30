import axios from '@/utils/axios'

const api = {
  getSuitRentals(params = {}) {
    return axios.get('/suit_rentals', { params })
  },
  addSuitRental(rental) {
    return axios.post('/suit_rentals', rental)
  },
  updateSuitRental(rental) {
    return axios.put(`/suit_rentals/${rental.id}`, rental)
  },
  deleteSuitRental(id) {
    return axios.delete(`/suit_rentals/${id}`)
  }
}

export default api
