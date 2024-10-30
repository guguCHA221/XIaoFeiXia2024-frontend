import axios from '@/utils/axios'

const api = {
  getUsers(params = {}) {
    return axios.get('/users', { params })
  },
  updateUser(user) {
    return axios.put(`/users/${user.id}`, user)
  },
  addUsers(usernames) {
    return axios.post('/users/batch', { usernames })
  }
}

export default api
