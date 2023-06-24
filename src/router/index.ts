import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from './names'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME,
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/categories',
      name: ROUTES.CATEGORIES,
      component: () => import('@/views/CategoriesView.vue')
    },
    {
      path: '/caret',
      name: ROUTES.CARET,
      component: () => import('@/views/CaretView.vue')
    },
    {
      path: '/orders',
      name: ROUTES.ORDERS,
      component: () => import('@/views/OrdersView.vue')
    },
    {
      path: '/offer/:offerId',
      name: ROUTES.SINGLE_OFFER,
      component: () => import('@/views/SingleOfferView.vue')
    },
    {
      path: '/filter',
      name: ROUTES.FILTER,
      component: () => import('@/views/FilterView.vue')
    },
    {
      path: '/user',
      name: ROUTES.USER,
      component: () => import('@/views/UserView.vue')
    },

    // Test View
    {
      path: '/test',
      name: ROUTES.TEST,
      component: () => import('@/views/TestView.vue')
    }
  ]
})

export default router

export { ROUTES }
