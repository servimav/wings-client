import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { ROUTES } from './names'
import authRoutes from './authRoutes'
import mainRoutes from './mainRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /**
     * -----------------------------------------
     *	Main Routes
     * -----------------------------------------
     */

    {
      path: '/',
      component: MainLayout,
      children: mainRoutes
    },
    {
      path: '/checkout',
      name: ROUTES.CHECKOUT,
      component: () => import('@/views/CheckoutView.vue')
    },

    /**
     * -----------------------------------------
     *	Auth Routes
     * -----------------------------------------
     */

    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: authRoutes
    }
  ]
})

export default router

export { ROUTES }
