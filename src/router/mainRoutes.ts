import type { RouteRecordRaw } from 'vue-router'
import { ROUTES } from './names'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: ROUTES.HOME,
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: 'categories',
    name: ROUTES.CATEGORIES,
    component: () => import('@/views/CategoriesView.vue')
  },
  {
    path: 'caret',
    name: ROUTES.CARET,
    component: () => import('@/views/CaretView.vue')
  },
  {
    path: 'orders',
    name: ROUTES.ORDERS,
    component: () => import('@/views/OrdersView.vue')
  },
  {
    path: 'offer/:offerId',
    name: ROUTES.SINGLE_OFFER,
    component: () => import('@/views/SingleOfferView.vue')
  },
  {
    path: 'filter',
    name: ROUTES.FILTER,
    component: () => import('@/views/FilterView.vue')
  },
  {
    path: 'under-construction',
    name: ROUTES.UNDER_CONSTRUCTION,
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: 'user',
    name: ROUTES.USER,
    component: () => import('@/views/UserView.vue')
  }
]

export default routes
