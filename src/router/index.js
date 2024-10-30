import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import LostAndFound from '@/views/LostAndFound.vue'
import SuitRental from '@/views/SuitRental.vue'
import UserManagement from '@/views/UserManagement.vue'
import UserSettings from '@/views/UserSettings.vue'
import store from '@/store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/lost-and-found',
    name: 'LostAndFound',
    component: LostAndFound,
    meta: { requiresAuth: true }
  },
  {
    path: '/suit-rental',
    name: 'SuitRental',
    component: SuitRental,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/user-settings',
    name: 'UserSettings',
    component: UserSettings,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({ name: 'Login' })
    } else {
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (store.getters['auth/isAdmin']) {
          next()
        } else {
          next({ name: 'Dashboard' })
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
