import type { RouteRecordRaw } from 'vue-router'
import { ROUTES } from './names'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: ROUTES.LOGIN,
    component: () => import('@/views/auth/LoginView.vue')
  },
  {
    path: 'register',
    name: ROUTES.REGISTER,
    component: () => import('@/views/auth/RegisterView.vue')
  }
]

export default routes
