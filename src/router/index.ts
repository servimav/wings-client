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

    /**
     * -----------------------------------------
     *	Auth Routes
     * -----------------------------------------
     */

    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: authRoutes
    },

    /**
     * Default
     */
    {
      path: '/:pathMatch(.*)*',
      components: {
        default: () => import('@/views/UnderConstruction.vue'),
        bottom: () => import('@/components/layouts/BottomNavbar.vue')
      }
    }
  ]
})

export default router

export { ROUTES }
