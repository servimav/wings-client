import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from './names'
/* Pages */
import HomeView from '@/views/HomeView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import CaretView from '@/views/CaretView.vue'
import OrdersView from '@/views/OrdersView.vue'
import SingleOfferView from '@/views/SingleOfferView.vue'
import UserView from '@/views/UserView.vue'
import TestView from '@/views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME,
      component: HomeView
    },
    {
      path: '/categories',
      name: ROUTES.CATEGORIES,
      component: CategoriesView
    },
    {
      path: '/caret',
      name: ROUTES.CARET,
      component: CaretView
    },
    {
      path: '/orders',
      name: ROUTES.ORDERS,
      component: OrdersView
    },
    {
      path: '/offer',
      name: ROUTES.SINGLE_OFFER,
      component: SingleOfferView
    },
    {
      path: '/user',
      name: ROUTES.USER,
      component: UserView
    },

    // Test View
    {
      path: '/test',
      name: ROUTES.TEST,
      component: TestView
    }
  ]
})

export default router
