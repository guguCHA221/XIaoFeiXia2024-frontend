import axios from '@/utils/axios'

export default {
  login(credentials) {
    return axios.post('/auth/login', credentials)
  },
  logout() {
    return axios.post('/auth/logout')
  },
  changePassword(newPassword) {
    return axios.post('/auth/change-password', { newPassword })
  }
}
