import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: '/api'
})

instance.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage({
            message: '账号或密码错误，请重新登录',
            type: 'error',
            duration: 5000
          })
          break
        case 440:
          await store.dispatch('auth/logout')
          router.push('/login')
          ElMessage({
            message: '登录信息已过期，请重新登录',
            type: 'warning',
            duration: 5000
          })
          break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
