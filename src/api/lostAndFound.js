import axios from '@/utils/axios'

const api = {
  getLostItems(params = {}) {
    return axios.get('/lost_items', { params })
  },
  addLostItem(item) {
    return axios.post('/lost_items', item)
  },
  updateLostItem(item) {
    return axios.put(`/lost_items/${item.id}`, item)
  },
  deleteLostItem(id) {
    return axios.delete(`/lost_items/${id}`)
  }
}

export default api
